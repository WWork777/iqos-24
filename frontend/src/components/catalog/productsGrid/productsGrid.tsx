"use client";

import styles from "./productsGrid.module.scss";
import ProductCard from "@/components/ui/productCard/productCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ProductType = "terea" | "iqos" | "devices";

interface ProductsGridProps {
  category: ProductType;
  paginationMode?: "showMore" | "pages";
  perPage?: number;
  filters: any;
}

export default function ProductsGrid({
  category,
  paginationMode = "showMore",
  perPage = 9,
  filters = {},
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevPageRef = useRef<number>(1);
  const isScrollingRef = useRef<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // 🟢 Добавляем динамическое количество карточек
  const [currentPerPage, setCurrentPerPage] = useState(perPage);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentPerPage(10); // 📱 телефоны — 10 карточек
      } else {
        setCurrentPerPage(perPage); // 💻 остальные — 9 карточек
      }
    };

    handleResize(); // Запускаем при первом рендере
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [perPage]);

  const safeFilters = {
    ...filters,
    price:
      filters.price && typeof filters.price === "object"
        ? {
            min:
              typeof filters.price.min === "number" && !isNaN(filters.price.min)
                ? filters.price.min
                : 0,
            max:
              typeof filters.price.max === "number" && !isNaN(filters.price.max)
                ? filters.price.max
                : 35000,
          }
        : undefined,
  };

  const { products, total, totalPages, hasMore, loading, error, refetch } =
    useProducts({
      category,
      filters: safeFilters,
      perPage: currentPerPage, // 🟢 используем динамическое значение
      enabled: true,
    });

  const page = safeFilters.page ? Number(safeFilters.page) : 1;

  // 🔹 Плавный скролл
  useEffect(() => {
    if (!loading && prevPageRef.current !== page) {
      const scrollTimeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 200);

      prevPageRef.current = page;
      return () => clearTimeout(scrollTimeout);
    }
  }, [page, loading]);
  // 🔹 Скелетон
  useEffect(() => {
    if (loading) setShowSkeleton(true);
    else {
      const timer = setTimeout(() => setShowSkeleton(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) params.set("page", newPage.toString());
    else params.delete("page");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (error) {
    return (
      <div className={styles.empty}>
        <p>{error}</p>
        <button
          onClick={refetch}
          className={styles.retryBtn}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Попробовать снова"}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {loading && products.length > 0 && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {Array.from({ length: currentPerPage }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-80 animate-pulse"
              ></div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`${styles.grid}`}
          >
            {products.map((p) => {
              const productId = p.id ?? p.ref ?? Math.random().toString();
              const productRef = p.ref ?? productId;
              const variants = p.variants || [
                {
                  type: "pack" as const,
                  imageUrl: p.image ?? "/placeholder-image.jpg",
                  price: typeof p.priceValue === "number" ? p.priceValue : 0,
                  name: p.name ?? "Товар",
                  nalichie: Boolean(p.nalichie),
                },
              ];
              return (
                <ProductCard
                  key={productId}
                  id={p.ref || p.id?.toString()}
                  variants={variants}
                  url={`/product/${productRef}`}
                  description={p.description ?? ""}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {paginationMode === "showMore" ? (
        hasMore && (
          <div className={styles.pagination}>
            <button
              onClick={() => updatePage(page + 1)}
              className={styles.loadMoreBtn}
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Показать ещё"}
            </button>
          </div>
        )
      ) : (
        <div className={styles.pagination}>
          {page > 1 && (
            <button
              onClick={() => updatePage(page - 1)}
              className={styles.navBtn}
              disabled={loading}
            >
              Назад
            </button>
          )}
          <span className={styles.pageInfo}>
            Страница {page} из {totalPages}
          </span>
          {page < totalPages && (
            <button
              onClick={() => updatePage(page + 1)}
              className={styles.navBtn}
              disabled={loading}
            >
              Вперёд
            </button>
          )}
        </div>
      )}
    </div>
  );
}

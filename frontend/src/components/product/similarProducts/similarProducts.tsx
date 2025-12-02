"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ui/productCard/productCard";
import styles from "./similarProducts.module.scss";
import { getStableProductBaseId } from "@/utils/productUtils";

interface SimilarProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  url: string;
  description: string;
  variants: any[];
  type?: string; // 🔥 Добавляем опциональный тип
}

interface SimilarProductsProps {
  currentProductId: string;
  category: string;
  limit?: number;
}

export default function SimilarProducts({
  currentProductId,
  category,
  limit = 4,
}: SimilarProductsProps) {
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    async function fetchSimilarProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/product/similar?productId=${currentProductId}&category=${category}&limit=${limit}`
        );

        if (!response.ok) throw new Error("Failed to fetch similar products");

        const data = await response.json();

        // 🔥 ИСПРАВЛЕНИЕ: Нормализуем данные перед установкой
        const normalizedProducts = data.map((product: any) => ({
          id: product.id?.toString() || Math.random().toString(),
          name: product.name || "Без названия",
          price: product.price || 0,
          imageUrl: product.imageUrl || "/placeholder.jpg",
          url: product.url || "#",
          description: product.description || "",
          variants:
            Array.isArray(product.variants) && product.variants.length > 0
              ? product.variants
              : [
                  {
                    type: "pack" as const,
                    imageUrl: product.imageUrl || "/placeholder.jpg",
                    price: product.price || 0,
                    name: product.name || "Товар",
                    nalichie: product.nalichie ?? false,
                  },
                ],
          nalichie:
            product.nalichie === true ||
            product.nalichie === 1 ||
            product.nalichie === "1",
          type: product.type || "devices", // 🔥 Гарантируем наличие типа
        }));

        const availableProducts = normalizedProducts.filter(
          (p: any) => p.nalichie
        );

        setSimilarProducts(availableProducts);
      } catch (err) {
        console.error("❌ [SimilarProducts] Error:", err);
        setError("Не удалось загрузить похожие товары");
      } finally {
        setLoading(false);
      }
    }

    fetchSimilarProducts();
    hasFetched.current = true;
  }, [currentProductId, category, limit]);

  if (loading) {
    return (
      <section className={styles.similarProducts}>
        <h2 className={styles.title}>Также покупают</h2>
        <div className={styles.loading}>Загрузка похожих товаров...</div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section className={styles.similarProducts}>
      <h2 className={styles.title}>Также покупают</h2>
      <div className={styles.productsGrid}>
        {similarProducts.map((product) => {
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              variants={product.variants}
              url={product.url}
              description={product.description}
            />
          );
        })}
      </div>
    </section>
  );
}

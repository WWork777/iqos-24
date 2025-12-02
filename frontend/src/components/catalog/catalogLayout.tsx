// components/catalog/catalogLayout.tsx
"use client";

import BreadCrumbs from "../common/breadcrums";
import FiltersSidebar from "./filtersSideBar";
import { useState, useCallback, useEffect, useRef } from "react";
import Toolbar from "./toolbar";
import styles from "./catalogLayout.module.scss";
import { useURLFilters } from "@/hooks/useURLFilters";
import { useRouter } from "next/navigation";

interface CatalogLayoutProps {
  category: "terea" | "iqos" | "devices";
  initialSub?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
  children?: React.ReactNode;
}

// 🔹 Функция для форматирования заголовков
const formatCategoryTitle = (category: string, sub?: string) => {
  const decodedSub = sub ? decodeURIComponent(sub) : "";

  const categoryNames = {
    iqos: "IQOS Iluma",
    terea: "TEREA",
    devices: "Аксессуары",
  };

  const subNames: Record<string, Record<string, string>> = {
    terea: {
      япония: "Япония",
      польша: "Польша",
      швейцария: "Швейцария",
      италия: "Италия",
      казахстан: "Казахстан",
      узбекистан: "Узбекистан",
      армения: "Армения",
      индонезия: "Индонезия",
      европа: "Европа",
    },
    iqos: {
      one: "I One",
      standart: "I Standart",
      prime: "I Prime",
      onei: "I One",
      standarti: "I Standart",
      primei: "I Prime",
      iluma: "Iluma",
    },
    devices: {
      ringsiluma: "Кольца Iluma",
      capsilumaprime: "Крышки Iluma Prime",
      capsilumastandart: "Крышки Iluma Standart",
      holderiqosiluma: "Держатели Iluma",
    },
  };

  const baseTitle =
    categoryNames[category as keyof typeof categoryNames] ||
    category.toUpperCase();

  if (decodedSub) {
    const formattedSub =
      subNames[category]?.[decodedSub.toLowerCase()] || decodedSub;
    return `${baseTitle} ${formattedSub}`;
  }

  return baseTitle;
};

export default function CatalogLayout({
  category,
  initialSub,
  searchParams,
  children,
}: CatalogLayoutProps) {
  const router = useRouter();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // 🔹 Форматируем заголовок
  const pageTitle = formatCategoryTitle(category, initialSub);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setScrollState({
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
    });
  }, []);

  // 🔹 Функции для drag-scroll на десктопе
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    isDraggingRef.current = true;
    dragDistanceRef.current = 0; // сбрасываем дельту
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;

    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    if (scrollContainerRef.current)
      scrollContainerRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2; // скорость прокрутки
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;

    dragDistanceRef.current = Math.abs(x - startXRef.current); // считаем пройденное расстояние
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    checkScroll();

    // Проверяем при изменении размера окна
    window.addEventListener("resize", checkScroll);
    scrollContainer.addEventListener("scroll", checkScroll);

    return () => {
      window.removeEventListener("resize", checkScroll);
      scrollContainer.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll]);

  // 🔹 Инициализируем начальные фильтры для sub-страниц
  const getInitialFilters = useCallback(() => {
    const initialFilters: any = {};
    if (initialSub) {
      const filterKey = category === "terea" ? "country" : "brand";
      initialFilters[filterKey] = decodeURIComponent(initialSub).toLowerCase();
    }
    return initialFilters;
  }, [initialSub, category]);

  const { filters, updateFilters, clearFilters, updateSearch, updateSort } =
    useURLFilters(getInitialFilters());

  // 🔹 Обработчики
  const handleFiltersChange = useCallback(
    (newFilters: any) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  const handleSearchChange = useCallback(
    (query: string) => updateSearch(query),
    [updateSearch]
  );

  const handleSortChange = useCallback(
    (sort: string) => updateSort(sort),
    [updateSort]
  );

  const handleClearFilters = useCallback(() => {
    ("🗑️ Clearing filters from layout");

    if (initialSub) {
      const filterKey = category === "terea" ? "country" : "brand";
      const clearedFilters: any = {};
      clearedFilters[filterKey] = decodeURIComponent(initialSub).toLowerCase();

      if (filters.search) clearedFilters.search = filters.search;
      if (filters.sort) clearedFilters.sort = filters.sort;

      updateFilters(clearedFilters);
    } else {
      clearFilters();
    }
  }, [clearFilters, updateFilters, initialSub, category, filters]);

  // 🔹 Быстрые фильтры
  const getQuickFilterOptions = () => {
    switch (category) {
      case "terea":
        return [
          { value: "казахстан", label: "Казахстан" },
          { value: "польша", label: "Польша" },
          { value: "узбекистан", label: "Узбекистан" },
          { value: "армения", label: "Армения" },
          { value: "индонезия", label: "Иноднезия" },
          { value: "япония", label: "Япония" },
          { value: "швейцария", label: "Швейцария" },
          { value: "европа", label: "Европа" },
        ];
      case "iqos":
        return [
          { value: "one", label: "One" },
          { value: "standart", label: "Standart" },
          { value: "prime", label: "Prime" },
          { value: "onei", label: "I One" },
          { value: "standarti", label: "I Standart" },
          { value: "primei", label: "I Prime" },
        ];
      case "devices":
        return [
          { value: "ringsiluma", label: "Кольца Iluma" },
          { value: "capsilumaprime", label: "Крышки Iluma Prime" },
          { value: "capsilumastandart", label: "Крышки Iluma Standart" },
          { value: "holderiqosiluma", label: "Держатель Iqos Iluma" },
        ];
      default:
        return [];
    }
  };

  const quickFilterOptions = getQuickFilterOptions();
  const quickFilterKey = category === "terea" ? "country" : "brand";

  const isQuickFilterActive = (value: string) => {
    const normalizedValue = value.toLowerCase();
    const currentFilter = filters[quickFilterKey];

    if (!currentFilter) return false;

    if (Array.isArray(currentFilter)) {
      return currentFilter.some(
        (v: string) => v.toLowerCase() === normalizedValue
      );
    }
    return currentFilter.toLowerCase() === normalizedValue;
  };

  const handleQuickFilter = useCallback(
    (value: string) => {
      const normalizedValue = value.toLowerCase();

      if (isQuickFilterActive(value)) {
        if (initialSub) {
          router.push(`/catalog/${category}`);
        } else {
          const newFilters = { ...filters };
          delete newFilters[quickFilterKey];
          delete newFilters.page;
          updateFilters(newFilters);
        }
      } else {
        if (initialSub) {
          router.push(`/catalog/${category}/${encodeURIComponent(value)}`);
        } else {
          const newFilters = { ...filters };
          newFilters[quickFilterKey] = normalizedValue;
          delete newFilters.page;
          updateFilters(newFilters);
        }
      }
    },
    [filters, updateFilters, quickFilterKey, initialSub, category, router]
  );

  useEffect(() => {
    setTimeout(checkScroll, 100);
  }, [filters, checkScroll]);

  const activeFiltersCount = Object.keys(filters).filter(
    (k) =>
      !["search", "sort", "page"].includes(k) &&
      k !== quickFilterKey &&
      (!initialSub || filters[k] !== getInitialFilters()[k])
  ).length;

  const handleQuickFilterClick = (value: string) => {
    // отменяем клик если пройдено больше 5px
    if (dragDistanceRef.current > 5) return;
    handleQuickFilter(value);
  };

  return (
    <section className="hero-container">
      <div className="second_page_header">
        <h1>{pageTitle}</h1>
        <BreadCrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog" },
            { label: category, href: `/catalog/${category}` },
            ...(initialSub
              ? [
                  {
                    label: decodeURIComponent(initialSub),
                    href: `/catalog/${category}/${initialSub}`,
                  },
                ]
              : []),
          ]}
        />
      </div>

      <div className={styles.catalogLayout}>
        <div className={styles.catalogContainer}>
          <div
            className={`${styles.sidebar} ${
              isMobileFiltersOpen ? styles.mobileOpen : ""
            }`}
          >
            <div className={styles.sidebarHeader}>
              <span>Фильтры</span>
              <button
                className={styles.closeMobileFilters}
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                ✕
              </button>
            </div>
            <FiltersSidebar
              category={category}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          <div className={styles.content}>
            <Toolbar
              onMobileFiltersToggle={() =>
                setIsMobileFiltersOpen(!isMobileFiltersOpen)
              }
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
              searchQuery={filters.search || ""}
              onSearchChange={handleSearchChange}
              sortBy={filters.sort || "default"}
              onSortChange={handleSortChange}
            />

            {quickFilterOptions.length > 0 && (
              <div className={styles.quickFilters}>
                <div
                  ref={scrollContainerRef}
                  className={`${styles.quickFiltersScrollContainer} ${
                    scrollState.canScrollLeft ? styles.canScrollLeft : ""
                  } ${scrollState.canScrollRight ? styles.canScrollRight : ""}`}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onMouseMove={handleMouseMove}
                >
                  <div className={styles.filterSlider}>
                    {quickFilterOptions.map((item) => (
                      <button
                        key={item.value}
                        className={`${styles.filterChip} ${
                          isQuickFilterActive(item.value) ? styles.active : ""
                        }`}
                        onClick={() => handleQuickFilterClick(item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

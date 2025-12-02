// hooks/useURLFilters.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface PriceFilterValue {
  min?: number;
  max?: number;
}

interface Filters {
  [key: string]: any;
  price?: PriceFilterValue;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
}

export function useURLFilters(initialFilters: Filters = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    const params: Filters = {};

    searchParams.forEach((value, key) => {
      try {
        if (key === "search") {
          if (value.trim() !== "") {
            params[key] = value;
          }
          return;
        }

        if (key === "price") {
          // 🔹 Парсинг для price объекта
          try {
            const parsedValue = JSON.parse(value);
            if (parsedValue && typeof parsedValue === "object") {
              params[key] = {
                min:
                  parsedValue.min !== undefined ? Number(parsedValue.min) : 0,
                max:
                  parsedValue.max !== undefined
                    ? Number(parsedValue.max)
                    : 10000,
              };
            }
          } catch (parseError) {
            console.warn("Failed to parse price filter:", value);
          }
        } else if (key === "minPrice" || key === "maxPrice") {
          // 🔹 Обработка отдельных параметров цены
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            params[key] = numValue;
          }
        } else if (value.includes(",")) {
          params[key] = value.split(",").map((v: string) => v.trim());
        } else if (key === "page" || key === "perPage") {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            params[key] = numValue;
          }
        } else {
          // Для остальных параметров пробуем парсить как JSON, иначе оставляем строкой
          try {
            const parsedValue = JSON.parse(value);
            if (parsedValue !== null && parsedValue !== undefined) {
              params[key] = parsedValue;
            }
          } catch {
            if (value.trim() !== "") {
              params[key] = value;
            }
          }
        }
      } catch {
        if (value.trim() !== "") {
          params[key] = value;
        }
      }
    });

    const mergedFilters = { ...initialFilters, ...params };
    setFilters(mergedFilters);
  }, [searchParams, JSON.stringify(initialFilters)]);

  // 🔹 ИСПРАВЛЕННАЯ обработка price фильтра
  const updateFilters = useCallback(
    (newFilters: Filters) => {
      const cleanedFilters: Filters = {};

      Object.entries(newFilters).forEach(([key, value]) => {
        if (
          value == null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return;
        }

        if (key === "price") {
          // 🔹 ВАЖНО: Сохраняем price объект даже если min=0 или max=10000
          const priceValue = value as PriceFilterValue;
          if (
            priceValue &&
            typeof priceValue === "object" &&
            (priceValue.min !== undefined || priceValue.max !== undefined)
          ) {
            const min =
              priceValue.min !== undefined ? Number(priceValue.min) : 0;
            const max =
              priceValue.max !== undefined ? Number(priceValue.max) : 10000;

            // 🔹 УБИРАЕМ строгую проверку - сохраняем всегда когда есть значения
            if (!isNaN(min) && !isNaN(max)) {
              cleanedFilters[key] = { min, max };
            }
          }
        } else if (Array.isArray(value)) {
          const unique = Array.from(
            new Set(value.filter((v) => v != null && v !== ""))
          );
          if (unique.length > 0) {
            cleanedFilters[key] = unique;
          }
        } else if (typeof value === "string" && value.trim() !== "") {
          cleanedFilters[key] = value;
        } else if (typeof value === "number" && !isNaN(value)) {
          cleanedFilters[key] = value;
        } else if (typeof value === "object" && Object.keys(value).length > 0) {
          cleanedFilters[key] = value;
        }
      });

      setFilters(cleanedFilters);

      const params = new URLSearchParams();
      Object.entries(cleanedFilters).forEach(([key, value]) => {
        if (key === "price") {
          // 🔹 Сохраняем price как JSON строку
          params.set(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else if (typeof value === "object") {
          params.set(key, JSON.stringify(value));
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      router.replace(queryString ? `?${queryString}` : "?", { scroll: false });
    },
    [router]
  );

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    const params = new URLSearchParams();
    Object.entries(initialFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else if (typeof value === "object") {
        params.set(key, JSON.stringify(value));
      } else if (value != null && value !== "") {
        params.set(key, String(value));
      }
    });
    const queryString = params.toString();
    router.replace(queryString ? `?${queryString}` : "?", { scroll: false });
  }, [initialFilters, router]);

  const updateSearch = useCallback(
    (searchQuery: string) => {
      const newFilters = { ...filters };
      if (searchQuery.trim()) {
        newFilters.search = searchQuery;
      } else {
        delete newFilters.search;
      }
      delete newFilters.page;
      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  const updateSort = useCallback(
    (sortBy: string) => {
      const newFilters = { ...filters };
      if (sortBy && sortBy !== "default") {
        newFilters.sort = sortBy;
      } else {
        delete newFilters.sort;
      }
      delete newFilters.page;
      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  const updatePage = useCallback(
    (page: number) => {
      const newFilters = { ...filters };
      if (page > 1) {
        newFilters.page = page;
      } else {
        delete newFilters.page;
      }
      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  const removeFilter = useCallback(
    (filterKey: string) => {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      delete newFilters.page;
      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  return {
    filters,
    updateFilters,
    clearFilters,
    updateSearch,
    updateSort,
    updatePage,
    removeFilter,
  };
}

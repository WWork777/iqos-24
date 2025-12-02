// hooks/useProducts.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type ProductType = "terea" | "iqos" | "devices";

interface Product {
  id?: number;
  ref?: string;
  name?: string;
  description?: string;
  image?: string;
  imagePack?: string;
  price?: string;
  pricePack?: string;
  type: ProductType;
  model?: string;
  color?: string;
  country?: string;
  brend?: string;
  strength?: string;
  flavor?: string[];
  category?: {
    id: number;
    category_name: string;
  };
  priceValue?: number;
  pricePackValue?: number;
  nalichie?: boolean;
  variants?: any[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Кэш для запросов на клиенте
const clientCache = new Map();

function generateCacheKey(
  category: string,
  filters: any,
  page: number,
  perPage: number
): string {
  return `${category}:${JSON.stringify(filters)}:${page}:${perPage}`;
}

// Функция для создания таймаута с AbortController
function createTimeout(ms: number): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  // Очищаем таймаут при отмене
  controller.signal.addEventListener("abort", () => clearTimeout(timeoutId));

  return controller.signal;
}

async function fetchFilteredProducts(
  category: string,
  filters: any,
  page: number = 1,
  perPage: number = 12
): Promise<ProductsResponse> {
  const cacheKey = generateCacheKey(category, filters, page, perPage);

  // Проверяем кэш
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  try {
    const url = new URL(`/api/product/${category}`, window.location.origin);

    // 🔹 УПРОЩЕННАЯ обработка фильтров - отправляем как есть
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        key !== "page"
      ) {
        // 🔹 Отправляем price как JSON строку, остальные как есть
        const serializedValue =
          typeof value === "object" ? JSON.stringify(value) : String(value);
        url.searchParams.set(key, serializedValue);
      }
    });

    // Добавляем пагинацию
    url.searchParams.set("page", page.toString());
    url.searchParams.set("perPage", perPage.toString());

    // Создаем таймаут сигнал
    const timeoutSignal = createTimeout(10000); // 10 секунд таймаут

    const res = await fetch(url.toString(), {
      signal: timeoutSignal,
      cache: "force-cache", // Используем кэш браузера
    });

    if (!res.ok) {
      throw new Error(`Ошибка загрузки: ${res.status}`);
    }

    const data = await res.json();

    // Сохраняем в кэш на 1 минуту
    clientCache.set(cacheKey, data);
    setTimeout(() => {
      clientCache.delete(cacheKey);
    }, 60000);

    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Превышено время ожидания запроса");
    }
    throw error;
  }
}

interface UseProductsOptions {
  category: ProductType;
  filters: any;
  perPage?: number;
  enabled?: boolean;
}

export function useProducts({
  category,
  filters,
  perPage = 12,
  enabled = true,
}: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = filters.page ? Number(filters.page) : 1;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 🔹 ДОБАВИМ ОТЛАДОЧНЫЙ ВЫВОД ДЛЯ ФИЛЬТРОВ
  useEffect(() => {}, [category, filters, page, perPage]);

  const loadProducts = useCallback(async () => {
    if (!enabled) return;

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const data = await fetchFilteredProducts(
        category,
        filters,
        page,
        perPage
      );

      if (!abortControllerRef.current.signal.aborted) {
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setHasMore(data.hasMore);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }

      if (!abortControllerRef.current.signal.aborted) {
        console.error("❌ Error loading products:", err);
        setError(err.message || "Ошибка при загрузке товаров");
        setProducts([]);
        setTotal(0);
        setTotalPages(0);
        setHasMore(false);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [category, filters, page, perPage, enabled]);

  // 🔹 УМНЫЙ ДЕБАУНС: для price фильтра - без дебаунса, для других - с дебаунсом
  const shouldUseDebounce = useCallback(() => {
    // 🔹 Для price фильтра НЕ используем дебаунс (слайдер должен работать плавно)
    if (filters.price) {
      return false;
    }
    // 🔹 Для поиска и других фильтров используем дебаунс
    return true;
  }, [filters.price]);

  // Загрузка продуктов
  useEffect(() => {
    if (!enabled) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (shouldUseDebounce()) {
      // 🔹 Дебаунс для поиска и других фильтров
      debounceRef.current = setTimeout(() => {
        loadProducts();
      }, 200);
    } else {
      // 🔹 БЕЗ дебаунса для price фильтра - мгновенная загрузка
      loadProducts();
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadProducts, enabled, shouldUseDebounce]);

  return {
    products,
    total,
    totalPages,
    hasMore,
    loading,
    error,
    refetch: loadProducts,
  };
}

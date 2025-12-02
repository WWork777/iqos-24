// components/catalog/filtersSideBar/index.tsx
"use client";

import { filterConfigs } from "@/libs/catalog/filters-config";
import FilterGroup from "./filters/filterGroup/filterGroup";
import styles from "./index.module.scss";
import { useCallback } from "react";

interface FiltersSidebarProps {
  category: string;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function FiltersSidebar({
  category,
  filters,
  onFiltersChange,
}: FiltersSidebarProps) {
  const config = filterConfigs[category as keyof typeof filterConfigs];

  if (!config) {
    return null;
  }

  const handleFilterChange = useCallback(
    (id: string, value: any) => {
      const newFilters = { ...filters };

      // 🔹 ОСОБАЯ ОБРАБОТКА ДЛЯ PRICE ФИЛЬТРА - УПРОЩЕННАЯ
      if (id === "price") {
        if (value === null || value === undefined) {
          // Если пришел null или undefined - удаляем фильтр
          delete newFilters[id];
        } else if (value && typeof value === "object") {
          // 🔹 ВАЖНО: Сохраняем price объект ВСЕГДА, даже если значения дефолтные
          // Это нужно для корректной работы фильтрации
          newFilters[id] = value;
        }
      }
      // 🔹 ОБЫЧНАЯ ОБРАБОТКА ДЛЯ ДРУГИХ ФИЛЬТРОВ
      else if (
        value == null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "") ||
        (typeof value === "object" && Object.keys(value).length === 0)
      ) {
        delete newFilters[id];
      } else {
        newFilters[id] = value;
      }

      // 🔹 Всегда сбрасываем страницу при изменении фильтров
      delete newFilters.page;

      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const handleClearAll = useCallback(() => {
    // При очистке оставляем только служебные фильтры (search, sort)
    const clearedFilters: any = {};
    if (filters.search) clearedFilters.search = filters.search;
    if (filters.sort) clearedFilters.sort = filters.sort;

    onFiltersChange(clearedFilters);
  }, [filters, onFiltersChange]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.clear}>
        <span>Фильтры:</span>
        <button onClick={handleClearAll} className={styles.clear_button}>
          Сбросить все
        </button>
      </div>

      {config.filters.map((filter, index) => (
        <FilterGroup
          key={filter.id}
          filter={filter}
          value={filters[filter.id]}
          onChange={(value) => handleFilterChange(filter.id, value)}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
}

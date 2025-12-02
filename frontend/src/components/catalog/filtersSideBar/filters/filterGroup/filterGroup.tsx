// components/catalog/filters/filterGroup/filterGroup.tsx
"use client";

import { Filter, RangeFilter as RangeFilterType } from "@/types/catalog/types";
import CheckboxFilter from "../CheckboxFilter/CheckboxFilter";
import RangeFilter from "../RangeFilter/RangeFilter";
import MultiSelectFilter from "../MultiSelectFilter/MultiSelectFilter";
import ColorFilter from "../ColorFilter/ColorFilter";
import styles from "./filterGroup.module.scss";
import Image from "next/image";
import { useState, useMemo } from "react";

interface FilterGroupProps {
  filter: Filter;
  value: any;
  onChange: (value: any) => void;
  isFirst?: boolean;
}

export default function FilterGroup({
  filter,
  value,
  onChange,
  isFirst = false,
}: FilterGroupProps) {
  // 🔹 ИЗМЕНЕНИЕ: Всегда открываем фильтры по умолчанию
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // 🔹 Нормализуем значение для разных типов фильтров
  const normalizedValue = useMemo(() => {
    if (value == null) {
      if (filter.type === "range") {
        const rangeFilter = filter as RangeFilterType;
        return { min: rangeFilter.min, max: rangeFilter.max };
      }
      if (
        filter.type === "checkbox" ||
        filter.type === "multiselect" ||
        filter.type === "color"
      ) {
        return [];
      }
      return value;
    }

    if (
      filter.type === "checkbox" ||
      filter.type === "multiselect" ||
      filter.type === "color"
    ) {
      return Array.isArray(value) ? value : [value];
    }

    return value;
  }, [value, filter]);

  // 🔹 Обработчик для price range
  const handlePriceChange = (
    priceValue: { min: number; max: number } | null
  ) => {
    if (priceValue) {
      onChange(priceValue);
    } else {
      // Если null, передаем undefined чтобы удалить фильтр
      onChange(undefined);
    }
  };

  const renderFilter = () => {
    switch (filter.type) {
      case "checkbox":
        return (
          <CheckboxFilter
            filter={filter}
            value={normalizedValue}
            onChange={onChange}
            singleSelect={true} // 🔹 ВКЛЮЧАЕМ SINGLE SELECT ДЛЯ CHECKBOX
          />
        );

      case "range":
        return (
          <RangeFilter
            filter={filter}
            value={normalizedValue}
            onChange={handlePriceChange}
          />
        );

      case "multiselect":
        return (
          <MultiSelectFilter
            filter={filter}
            value={normalizedValue}
            onChange={onChange}
            singleSelect={true} // 🔹 ВКЛЮЧАЕМ SINGLE SELECT ДЛЯ MULTISELECT
          />
        );

      case "color":
        return (
          <ColorFilter
            filter={filter}
            value={normalizedValue}
            onChange={onChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.filterGroup} ${isExpanded ? styles.expanded : ""}`}
    >
      <div className={styles.filterGroupHeader} onClick={toggleExpanded}>
        <h3>{filter.label}</h3>
        <Image
          src="/header/arrow.svg"
          alt="arrow"
          width={15}
          height={15}
          className={`${styles.arrow} ${isExpanded ? styles.expanded : ""}`}
        />
      </div>

      <div
        className={`${styles.filterContent} ${
          isExpanded ? styles.expanded : ""
        }`}
      >
        {renderFilter()}
      </div>
    </div>
  );
}

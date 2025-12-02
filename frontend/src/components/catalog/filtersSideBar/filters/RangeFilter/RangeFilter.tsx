// components/catalog/filters/RangeFilter/RangeFilter.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RangeFilter as RangeFilterType } from "@/types/catalog/types";
import styles from "./RangeFilter.module.scss";

interface RangeFilterProps {
  filter: RangeFilterType;
  value: { min: number; max: number } | undefined;
  onChange: (value: { min: number; max: number } | null) => void;
}

export default function RangeFilter({
  filter,
  value,
  onChange,
}: RangeFilterProps) {
  // 🔹 Используем ref для отслеживания предыдущего значения
  const prevValueRef = useRef<{ min: number; max: number } | undefined>(
    undefined
  );

  // 🔹 Инициализируем с дефолтными значениями
  const [localValue, setLocalValue] = useState(() => ({
    min: filter.min,
    max: filter.max,
  }));

  // 🔹 Функция для безопасного получения значения
  const getSafeValue = useCallback(
    (val: any): { min: number; max: number } => {
      if (!val || typeof val.min !== "number" || typeof val.max !== "number") {
        return { min: filter.min, max: filter.max };
      }
      return {
        min: Math.max(filter.min, Math.min(val.min, filter.max)),
        max: Math.min(filter.max, Math.max(val.max, filter.min)),
      };
    },
    [filter.min, filter.max]
  );

  // 🔹 Обновляем локальное состояние ТОЛЬКО при реальном изменении внешнего значения
  useEffect(() => {
    const currentValue = getSafeValue(value);
    const prevValue = prevValueRef.current;

    // 🔹 Сравниваем с предыдущим значением, чтобы избежать циклов
    if (
      !prevValue ||
      currentValue.min !== prevValue.min ||
      currentValue.max !== prevValue.max
    ) {
      setLocalValue(currentValue);
      prevValueRef.current = currentValue;
    }
  }, [value, getSafeValue]);

  const handleChange = useCallback(
    (newValue: { min: number; max: number }) => {
      const safeValue = getSafeValue(newValue);

      setLocalValue(safeValue);

      // 🔹 Проверяем, отличается ли значение от дефолтного
      const isDefaultValue =
        safeValue.min === filter.min && safeValue.max === filter.max;

      if (isDefaultValue) {
        onChange(null);
      } else {
        onChange(safeValue);
      }
    },
    [onChange, getSafeValue, filter.min, filter.max]
  );

  // 🔹 Обработчики для ползунков
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue.max);
    handleChange({ ...localValue, min: newMin });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue.min);
    handleChange({ ...localValue, max: newMax });
  };

  const formatValue = (val: number | undefined) => {
    if (typeof val !== "number" || isNaN(val)) {
      return `0 ${filter.unit || ""}`;
    }
    return `${val.toLocaleString("ru-RU")}${
      filter.unit ? ` ${filter.unit}` : ""
    }`;
  };

  // 🔹 Безопасный расчет позиций для слайдера
  const rangeLeft = Math.max(
    0,
    ((localValue.min - filter.min) / (filter.max - filter.min)) * 100
  );
  const rangeRight = Math.min(
    100,
    ((localValue.max - filter.min) / (filter.max - filter.min)) * 100
  );

  return (
    <div className={styles.filter}>
      <div className={styles.valuesDisplay}>
        <span className={styles.value}>{formatValue(localValue.min)}</span>
        <span className={styles.value}>{formatValue(localValue.max)}</span>
      </div>

      <div className={styles.slidersContainer}>
        <div className={styles.sliderTrack} />
        <div
          className={styles.sliderRange}
          style={{
            left: `${rangeLeft}%`,
            right: `${100 - rangeRight}%`,
          }}
        />
        <input
          type="range"
          className={styles.slider}
          min={filter.min}
          max={filter.max}
          step={filter.step}
          value={localValue.min}
          onChange={handleMinChange}
        />
        <input
          type="range"
          className={styles.slider}
          min={filter.min}
          max={filter.max}
          step={filter.step}
          value={localValue.max}
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
}

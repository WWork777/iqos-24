// components/catalog/filters/MultiSelectFilter/MultiSelectFilter.tsx
"use client";

import { MultiSelectFilter as MultiSelectFilterType } from "@/types/catalog/types";
import styles from "./MultiSelectFilter.module.scss";

interface MultiSelectFilterProps {
  filter: MultiSelectFilterType;
  value: string[] | undefined;
  onChange: (value: string[] | null) => void;
  singleSelect?: boolean;
}

export default function MultiSelectFilter({
  filter,
  value = [],
  onChange,
  singleSelect = false,
}: MultiSelectFilterProps) {
  const handleOptionChange = (optionValue: string) => {
    let newValue: string[];

    if (singleSelect) {
      // 🔹 РЕЖИМ SINGLE SELECT: выбираем только один вариант
      if (value.includes(optionValue)) {
        // Если уже выбран - снимаем выбор (убираем галочку)
        newValue = [];
      } else {
        // Выбираем новый вариант (снимаем предыдущий)
        newValue = [optionValue];
      }
    } else {
      // 🔹 РЕЖИМ MULTI SELECT: стандартное поведение
      if (value.includes(optionValue)) {
        newValue = value.filter((v) => v !== optionValue);
      } else {
        newValue = [...value, optionValue];
      }
    }

    // 🔹 ВАЖНО: Всегда передаем новое значение, даже если пустой массив
    onChange(newValue.length === 0 ? null : newValue);
  };

  return (
    <div className={styles.filter}>
      {filter.options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type={singleSelect ? "radio" : "checkbox"}
            checked={value.includes(option.value)}
            onChange={() => handleOptionChange(option.value)}
            className={styles.input}
          />
          <span className={styles.checkmark}></span>
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

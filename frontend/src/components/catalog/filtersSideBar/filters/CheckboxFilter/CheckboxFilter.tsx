// components/catalog/filters/CheckboxFilter/CheckboxFilter.tsx
"use client";

import { CheckboxFilter as CheckboxFilterType } from "@/types/catalog/types";
import styles from "./CheckboxFilter.module.scss";

interface CheckboxFilterProps {
  filter: CheckboxFilterType;
  value: string[] | undefined;
  onChange: (value: string[] | null) => void;
  singleSelect?: boolean;
}

export default function CheckboxFilter({
  filter,
  value = [],
  onChange,
  singleSelect = false,
}: CheckboxFilterProps) {
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

import { ColorFilter as ColorFilterType } from "@/types/catalog/types";
import styles from "./ColorFilter.module.scss";

interface ColorFilterProps {
  filter: ColorFilterType;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function ColorFilter({
  filter,
  value,
  onChange,
}: ColorFilterProps) {
  const handleChange = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Функция для определения цвета галочки
  const getCheckColor = (backgroundColor: string) => {
    // Простая проверка яркости цвета для выбора контрастного цвета галочки
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  return (
    <div className={styles.filter}>
      <div className={styles.filterHeader}></div>

      <div className={styles.filterOptions}>
        {filter.options.map((option) => {
          const isSelected = value.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              className={`${styles.colorButton} ${styles.colorTooltip} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => handleChange(option.value)}
              style={{ backgroundColor: option.color }}
              title={option.label}
            >
              {isSelected && (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ color: getCheckColor(option.color) }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

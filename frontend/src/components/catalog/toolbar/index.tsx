import styles from "./index.module.scss";
import { useCallback, useEffect, useState } from "react";

interface ToolbarProps {
  onMobileFiltersToggle?: () => void;
  onClearFilters?: () => void;
  activeFiltersCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export default function Toolbar({
  onMobileFiltersToggle,
  onClearFilters,
  activeFiltersCount,
  searchQuery = "",
  onSearchChange,
  sortBy = "default",
  onSortChange,
}: ToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, onSearchChange]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
    },
    []
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange?.(e.target.value);
    },
    [onSortChange]
  );

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarMain}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            className={styles.searchInput}
            value={localSearch}
            onChange={handleSearchChange}
          />
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={styles.controls}>
          <select
            className={styles.select}
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">По возрастанию цены</option>
            <option value="price-desc">По убывыанию цены</option>
          </select>

          {onMobileFiltersToggle && (
            <button
              className={styles.mobileFilterBtn}
              onClick={onMobileFiltersToggle}
            >
              <span>Фильтры</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

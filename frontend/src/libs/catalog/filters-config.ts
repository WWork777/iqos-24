// В файле filters-config.ts обновите конфигурацию для terea
export const filterConfigs = {
  iqos: {
    title: "Iqos Iluma",
    filters: [
      {
        id: "price",
        type: "range",
        label: "Цена",
        min: 0,
        max: 35000,
        step: 1000,
      },
      {
        id: "color",
        type: "multiselect",
        label: "Цвет",
        options: [
          { value: "Серый", label: "Серый" },
          { value: "Зеленый", label: "Зеленый" },
          { value: "Синий", label: "Синий" },
          { value: "Бежевый", label: "Бежевый" },
          { value: "Красный", label: "Красный" },
          { value: "Черный", label: "Черный" },
          { value: "Оранжевый", label: "Оранжевый" },
          { value: "Фиолетовый", label: "Фиолетовый" },
          { value: "Желтый", label: "Желтый" },
        ],
      },
    ],
  },
  terea: {
    title: "Стики Terea",
    filters: [
      {
        id: "price",
        type: "range",
        label: "Цена",
        min: 0,
        max: 12000,
        step: 1000,
      },
      {
        id: "flavor",
        type: "multiselect",
        label: "Вкус",
        options: [
          { value: "Табачный вкус", label: "Табачный вкус" },
          { value: "Фруктовый вкус", label: "Фруктовый вкус" },
          { value: "Ментол", label: "Ментол" },
          { value: "Экзотические", label: "Экзотические" },
        ],
      },
    ],
  },
  devices: {
    title: "Аксессуары",
    filters: [
      {
        id: "price",
        type: "range",
        label: "Цена",
        min: 0,
        max: 10000,
        step: 1000,
      },
      {
        id: "color",
        type: "multiselect",
        label: "Цвет",
        options: [
          { value: "Красный", label: "Красный" },
          { value: "Черный", label: "Черный" },
          { value: "Бежевый", label: "Бежевый" },
          { value: "Синий", label: "Синий" },
          { value: "Оранжевый", label: "Оранжевый" },
          { value: "Зеленый", label: "Зеленый" },
          { value: "Фиолетовый", label: "Фиолетовый" },
          { value: "Желтый", label: "Желтый" },
          { value: "Серый", label: "Серый" },
        ],
      },
    ],
  },
} as const;

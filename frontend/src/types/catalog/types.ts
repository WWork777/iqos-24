export interface BaseFilter {
  id: string;
  type: "checkbox" | "range" | "multiselect" | "color";
  label: string;
}

export interface CheckboxFilter extends BaseFilter {
  type: "checkbox";
  options: readonly FilterOption[];
}

export interface RangeFilter extends BaseFilter {
  type: "range";
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface MultiSelectFilter extends BaseFilter {
  type: "multiselect";
  options: readonly FilterOption[];
}

export interface ColorFilter extends BaseFilter {
  type: "color";
  options: readonly ColorOption[];
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface ColorOption extends FilterOption {
  color: string;
}

export type Filter =
  | CheckboxFilter
  | RangeFilter
  | MultiSelectFilter
  | ColorFilter;

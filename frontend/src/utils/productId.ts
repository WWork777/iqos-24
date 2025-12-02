// utils/productId.ts
export const generateProductId = (
  productId: string | number,
  variantType?: "pack" | "block"
): string => {
  const baseId = productId.toString();

  // Всегда добавляем вариант, если он указан
  if (variantType) {
    return `${baseId}-${variantType}`;
  }

  return baseId;
};

export const generateCartItemId = (
  productId: string | number,
  variantType?: "pack" | "block"
): string => {
  return generateProductId(productId, variantType);
};

export const generateFavoriteItemId = (
  productId: string | number,
  variantType?: "pack" | "block"
): string => {
  return generateProductId(productId, variantType);
};

export function isProductInStock(stock: any): boolean {
  if (stock === undefined || stock === null) return false;
  if (typeof stock === "boolean") return stock;
  if (typeof stock === "number") return stock === 1;
  if (typeof stock === "string") {
    const num = Number(stock);
    if (!isNaN(num)) return num === 1;
    return ["да", "есть", "true", "1", "available", "in stock", "yes"].includes(
      stock.toLowerCase().trim()
    );
  }
  return false;
}

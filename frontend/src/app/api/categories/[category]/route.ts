// app/api/categories/[category]/route.ts
import { NextRequest, NextResponse } from "next/server";

const validCategories = ["terea", "iqos", "devices"] as const;

// 🔥 Копируем функции из вашего основного API
function getStockStatus(product: any): boolean {
  const stock = product.nalichie;
  if (stock === undefined || stock === null) return false;
  if (typeof stock === "number") return stock === 1;
  if (typeof stock === "boolean") return stock;
  if (typeof stock === "string") {
    const num = Number(stock);
    if (!isNaN(num)) return num === 1;
    return ["да", "есть", "true", "1", "available", "in stock", "yes"].includes(
      stock.toLowerCase().trim()
    );
  }
  return false;
}

function formatProduct(product: any) {
  const inStock = getStockStatus(product);

  let variants = [];

  if (product.type === "terea" && product.imagePack) {
    variants = [
      {
        type: "pack" as const,
        imageUrl: product.imagePack,
        price: Number(product.pricePack ?? product.price) || 0,
        name: `${product.name} (пачка)`,
        nalichie: inStock,
      },
      {
        type: "block" as const,
        imageUrl: product.image,
        price: Number(product.price) || 0,
        name: `${product.name} (блок)`,
        nalichie: inStock,
      },
    ];
  } else {
    variants = [
      {
        type: "pack" as const,
        imageUrl: product.image,
        price: Number(product.price) || 0,
        name: product.name,
        nalichie: inStock,
      },
    ];
  }

  return {
    ...product,
    variants,
    nalichie: inStock,
    priceValue: Number(product.price) || 0,
    pricePackValue: Number(product.pricePack) || 0,
  };
}

async function getProductsByCategory(category: string) {
  if (!validCategories.includes(category as any)) {
    category = "terea";
  }

  try {
    const allProducts = [];
    let skip = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const apiUrl = `http://217.198.9.128:8000/products/${category}?skip=${skip}&limit=${limit}`;
      `📦 [CATEGORIES API] Fetching from external API: ${apiUrl}`;

      const res = await fetch(apiUrl.trim());

      if (!res.ok) throw new Error(`External API error: ${res.status}`);
      const data = await res.json();

      const products = (data[category] || data.products || []) as any[];
      `✅ [CATEGORIES API] Fetched ${products.length} products for ${category}`;

      allProducts.push(...products.map(formatProduct));

      if (products.length < limit) {
        hasMore = false;
      } else {
        skip += limit;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return allProducts;
  } catch (err) {
    console.error(
      `❌ [CATEGORIES API] Error fetching category ${category}:`,
      err
    );
    throw new Error("Не удалось получить данные");
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  try {
    const products = await getProductsByCategory(category);

    `✅ [CATEGORIES API] Returning ${products.length} products for category ${category}`;

    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ [CATEGORIES API] Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

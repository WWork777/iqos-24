// app/api/product/similar/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "4", 10);

  if (!productId || !category) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const baseUrl = "http://217.198.9.128:8000";
    const fastApiUrl = `${baseUrl}/products/${category}?limit=1000`;

    const response = await fetch(fastApiUrl);

    if (!response.ok) {
      throw new Error(
        `FastAPI returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    // 🔥 ИСПРАВЛЕНИЕ: Правильно извлекаем массив продуктов
    let allProducts = [];

    // Пробуем разные варианты структуры ответа
    if (Array.isArray(data)) {
      allProducts = data;
    } else if (data[category] && Array.isArray(data[category])) {
      allProducts = data[category];
    } else if (data.products && Array.isArray(data.products)) {
      allProducts = data.products;
    } else if (typeof data === "object") {
      // Ищем любой массив в объекте
      const arrayKeys = Object.keys(data).filter((key) =>
        Array.isArray(data[key])
      );
      if (arrayKeys.length > 0) {
        allProducts = data[arrayKeys[0]];
      }
    }

    // Проверяем что мы получили массив
    if (!Array.isArray(allProducts)) {
      console.error(
        "❌ [SIMILAR API] allProducts is not an array:",
        typeof allProducts,
        allProducts
      );
      throw new Error("Invalid response format from FastAPI");
    }

    if (allProducts.length === 0) {
      console.warn("⚠️ [SIMILAR API] No products found");
      return NextResponse.json([]);
    }

    // 🔹 Фильтруем товары по наличию и исключаем текущий
    const availableProducts = allProducts.filter((product: any) => {
      if (!product || !product.id) return false;

      const isDifferentProduct = product.id.toString() !== productId.toString();
      const isAvailable =
        product.nalichie === true ||
        product.nalichie === 1 ||
        product.nalichie === "1";

      return isDifferentProduct && isAvailable;
    });

    // Если нет доступных товаров, возвращаем пустой массив
    if (availableProducts.length === 0) {
      return NextResponse.json([]);
    }

    // Случайная сортировка и лимит
    const similarProducts = availableProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map((product: any) => ({
        id: product.id?.toString(),
        name: product.name || "Без названия",
        price:
          product.variants?.[0]?.price ||
          product.priceValue ||
          product.price ||
          0,
        imageUrl:
          product.variants?.[0]?.imageUrl ||
          product.image ||
          "/placeholder.jpg",
        url: `/product/${product.ref || product.id}`,
        description: product.description || "",
        variants: product.variants || [],
        nalichie: product.nalichie || false,
      }));

    return NextResponse.json(similarProducts);
  } catch (error) {
    console.error("❌ [SIMILAR API] Error fetching similar products:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

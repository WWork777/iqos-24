// app/api/best-sellers/route.ts
import { NextResponse } from "next/server";

// 🔥 ДОБАВЛЯЕМ КЭШ ДЛЯ ПРЕДОТВРАЩЕНИЯ ПОВТОРНЫХ ЗАПРОСОВ
const cache = new Map();
const CACHE_DURATION = 60 * 1000; // 1 минута

export async function GET() {
  const cacheKey = "best-sellers";

  // Проверяем кэш
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("📦 [CACHE HIT] best-sellers");
      return NextResponse.json(cached.data);
    }
  }

  try {
    console.log("🔄 [FETCH] Loading best sellers...");

    const categories = ["terea", "iqos"];
    const allData = [];

    for (const category of categories) {
      try {
        const apiUrl = `http://217.198.9.128:3001/api/product/${category}`;

        // 🔥 ДОБАВЛЯЕМ ТАЙМАУТ ДЛЯ ЗАПРОСА
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 секунд таймаут

        const res = await fetch(apiUrl, {
          signal: controller.signal,
          next: { revalidate: 60 },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          console.warn(`⚠️ Ошибка HTTP для ${category}:`, res.status);
          continue;
        }

        const response = await res.json();

        // Обрабатываем разные форматы ответа
        let data = [];

        if (Array.isArray(response)) {
          data = response;
        } else if (response.products && Array.isArray(response.products)) {
          data = response.products;
        } else if (response.data && Array.isArray(response.data)) {
          data = response.data;
        } else {
          console.warn(`❌ Неизвестный формат данных для ${category}`);
          continue;
        }

        // Фильтруем товары с hit=1 и проверяем наличие
        let hitItems = data.filter((item: any) => {
          const isHit = Number(item.hit) === 1;
          const isAvailable = item.nalichie === true;
          return isHit && isAvailable;
        });

        // Если нет хитов, берем первые доступные товары
        if (hitItems.length === 0) {
          hitItems = data
            .filter((item: any) => item.nalichie === true)
            .slice(0, 6);
        }

        console.log(`✅ [${category}] Found ${hitItems.length} hit products`);
        allData.push(...hitItems);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.warn(`⏰ Таймаут запроса для ${category}`);
        } else {
          console.error(
            `❌ Ошибка при загрузке категории ${category}:`,
            error.message
          );
        }
      }
    }

    // Сортировка по названию
    allData.sort((a: any, b: any) =>
      (a.name || "").localeCompare(b.name || "")
    );

    const result = {
      success: true,
      products: allData,
      count: allData.length,
      timestamp: Date.now(),
    };

    // Сохраняем в кэш
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    console.log(`✅ [SUCCESS] Loaded ${allData.length} best sellers`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Критическая ошибка в API best-sellers:", error);

    // Возвращаем кэш даже если устарел при ошибке
    if (cache.has(cacheKey)) {
      console.log("🔄 [FALLBACK] Using cached data due to error");
      return NextResponse.json(cache.get(cacheKey).data);
    }

    return NextResponse.json(
      {
        success: false,
        products: [],
        count: 0,
        error: "Failed to fetch best sellers",
      },
      { status: 500 }
    );
  }
}

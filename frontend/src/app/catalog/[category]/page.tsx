// app/catalog/[category]/page.tsx
import { Suspense } from "react";
import CatalogLayout from "@/components/catalog/catalogLayout";
import ProductsGrid from "@/components/catalog/productsGrid/productsGrid";
import type { Metadata } from "next";
import ProductsGridSkeleton from "@/components/catalog/productsGrid/productsGridWrapper";

interface CatalogPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: CatalogPageProps): Promise<Metadata> {
  const { category } = await params;

  const categoryConfig = {
    iqos: {
      name: "IQOS Iluma",
      title: "IQOS Iluma Купить в Москве | Iqos-24",
      description:
        "Купить оригинальные устройства IQOS Iluma. Полный каталог моделей, аксессуаров и комплектующих. Гарантия качества, доставка по России.",
      keywords:
        "купить iqos iluma, устройства нагрева табака, iqos iluma цена, оригинальный iqos, нагревательные устройства",
    },
    terea: {
      name: "Стики TEREA",
      title: "Стики TEREA Купить в Москве | Iqos-24",
      description:
        "Оригинальные стики TEREA для IQOS Iluma. Все вкусы и крепости в наличии. Доставка по Москве и России. Гарантия свежести.",
      keywords:
        "стики terea купить, terea для iqos iluma, вкусы terea, табачные стики, оригинальные стики terea",
    },
    devices: {
      name: "Аксессуары IQOS",
      title: "Аксессуары для IQOS Чехлы, зарядные устройства | Iqos-24",
      description:
        "Аксессуары для IQOS Iluma: чехлы, зарядные устройства, очистители. Оригинальные и совместимые аксессуары с доставкой.",
      keywords:
        "аксессуары для iqos, чехлы iqos iluma, зарядные устройства, очистители iqos, комплектующие",
    },
  };

  const config = categoryConfig[category as keyof typeof categoryConfig] || {
    name: "Товары",
    title: "Каталог товаров | Iqos-24",
    description:
      "Каталог товаров для нагрева табака. Оригинальная продукция с доставкой.",
  };

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      type: "website",
      url: `https://iqos-24.ru/catalog/${category}`,
      images: [
        {
          url: `/og-${category}-image.jpg`,
          width: 1200,
          height: 630,
          alt: config.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`/twitter-${category}-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://iqos-24.ru/catalog/${category}`,
    },
  };
}

// 🔹 Функция для нормализации searchParams
function normalizeSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const normalized: any = {};

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    try {
      // 🔹 Обработка range фильтра цены - УЛУЧШЕННАЯ
      if (key === "price" && typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === "object") {
            // Проверяем, что это объект с min/max и нормализуем значения
            normalized[key] = {
              min:
                parsed.min !== undefined && !isNaN(Number(parsed.min))
                  ? Number(parsed.min)
                  : 0,
              max:
                parsed.max !== undefined && !isNaN(Number(parsed.max))
                  ? Number(parsed.max)
                  : 10000,
            };
          }
        } catch {
          console.warn("Failed to parse price filter:", value);
        }
      }
      // 🔹 Обработка параметров с запятыми (массивы)
      else if (typeof value === "string" && value.includes(",")) {
        normalized[key] = value.split(",").map((v) => v.trim());
      }
      // 🔹 Обработка page и perPage (числа)
      else if (key === "page" || key === "perPage") {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          normalized[key] = numValue;
        }
      }
      // 🔹 Обработка одиночных строк
      else {
        normalized[key] = value;
      }
    } catch (error) {
      console.error(`❌ Error normalizing param ${key}:`, error);
      normalized[key] = value;
    }
  });

  return normalized;
}

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { category } = await params;
  const searchParamsObj = await searchParams;

  const validCategories = ["terea", "iqos", "devices"];
  if (!validCategories.includes(category)) {
    return <div>Категория не найдена</div>;
  }

  // 🔹 Нормализуем параметры перед передачей
  const normalizedFilters = normalizeSearchParams(searchParamsObj);

  return (
    <CatalogLayout
      category={category as "terea" | "iqos" | "devices"}
      searchParams={searchParamsObj}
    >
      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsGrid
          category={category as "terea" | "iqos" | "devices"}
          filters={normalizedFilters} // 🔹 Передаем нормализованные фильтры
          paginationMode="pages"
          perPage={9}
        />
      </Suspense>
    </CatalogLayout>
  );
}

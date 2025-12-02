// app/product/[slug]/page.tsx
import { Metadata } from "next";
import ProductPage from "@/components/product/productPage/productPage";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// 🔥 Функция для определения типа продукта
function determineProductType(product: any): "iqos" | "terea" | "devices" {
  const name = (product.name || "").toLowerCase();
  const description = (product.description || "").toLowerCase();

  if (name.includes("terea") || description.includes("terea")) {
    return "terea";
  } else if (
    name.includes("iqos") ||
    description.includes("iqos") ||
    name.includes("iluma")
  ) {
    return "iqos";
  } else {
    return "devices";
  }
}

// 🔥 Функция для нормализации продукта
function normalizeProduct(product: any) {
  if (!product) return null;

  // Определяем тип продукта
  const productType = determineProductType(product);

  // Нормализуем варианты
  let variants = product.variants || [];

  // Если нет вариантов, создаем базовый вариант
  if (variants.length === 0) {
    variants = [
      {
        type: "pack" as const,
        imageUrl: product.image || product.imageUrl || "/placeholder.jpg",
        price: product.price || product.priceValue || 0,
        name: product.name || "Товар",
        nalichie: product.nalichie || false,
      },
    ];
  }

  return {
    ...product,
    type: productType,
    variants,
    // Обеспечиваем обратную совместимость
    id:
      product.id?.toString() ||
      product.ref?.toString() ||
      Math.random().toString(),
    name: product.name || "Без названия",
    description: product.description || "",
  };
}

async function getProductData(slug: string) {
  try {
    const baseUrl = "http://217.198.9.128:3001";
    const apiUrl = `${baseUrl}/api/product/${encodeURIComponent(slug)}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const product = await response.json();

    // Проверяем, не вернул ли API ошибку в JSON
    if (product.error) {
      return null;
    }

    // 🔥 ДОБАВЛЕНО: Проверяем, что продукт действительно найден
    if (!product || !product.id) {
      return null;
    }

    // 🔥 Нормализуем продукт перед возвратом
    const normalizedProduct = normalizeProduct(product);

    return normalizedProduct;
  } catch (error) {
    console.error("❌ Error in getProductData:", error);
    return null;
  }
}

// 🔥 ИСПРАВЛЕНИЕ: Безопасная деструктуризация params
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const product = await getProductData(slug);

    if (!product) {
      return {
        title: "Товар не найден | Iqos-24",
        description: "Запрашиваемый товар не найден в каталоге Iqos-24",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    // Определяем категорию продукта для ключевых слов
    const getProductCategory = (productName: string) => {
      const name = productName.toLowerCase();
      if (name.includes("terea") || name.includes("стик")) return "стики TEREA";
      if (name.includes("iluma") || name.includes("iqos"))
        return "устройства IQOS Iluma";
      if (
        name.includes("чехол") ||
        name.includes("заряд") ||
        name.includes("очиститель")
      )
        return "аксессуары для IQOS";
      return "товары для нагрева табака";
    };

    const productCategory = getProductCategory(product.name);
    const priceText = product.variants?.[0]?.price
      ? ` по цене ${product.variants[0].price.toLocaleString("ru-RU")} руб.`
      : "";

    return {
      title: `${product.name} - купить в Москве${priceText} | Iqos-24`,
      description: `${product.name} - ${
        product.description ||
        `Оригинальные ${productCategory}. Доставка по Москве и России. Гарантия качества.`
      }`,
      keywords: `купить ${product.name}, ${productCategory}, ${
        product.name
      } цена, оригинальные ${productCategory.toLowerCase()}, доставка ${
        product.name
      }`,
      openGraph: {
        title: `${product.name} | Iqos-24`,
        description: `${product.name} - ${
          product.description ||
          `Оригинальные ${productCategory}. Доставка по Москве и России.`
        }`,
        type: "website",
        url: `https://iqos-24.ru/product/${slug}`,
        siteName: "Iqos-24",
        images: [
          {
            url:
              product.image ||
              product.imageUrl ||
              product.variants?.[0]?.imageUrl ||
              "/og-product-image.jpg",
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Iqos-24`,
        description: `${product.name} - ${
          product.description || `Оригинальные ${productCategory}`
        }`,
        images: [
          product.image ||
            product.imageUrl ||
            product.variants?.[0]?.imageUrl ||
            "/twitter-product-image.jpg",
        ],
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `https://iqos-24.ru/product/${slug}`,
      },
    };
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
    return {
      title: "Ошибка | Iqos-24",
      description: "Произошла ошибка при загрузке страницы",
    };
  }
}

// 🔥 ИСПРАВЛЕНИЕ: Безопасная деструктуризация params
// 🔥 ИСПРАВЛЕНИЕ: Безопасная деструктуризация params
export default async function ProductDetailPage({ params }: ProductPageProps) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const product = await getProductData(slug);

    if (!product) {
      notFound();
    }

    // 🔥 Дополнительная проверка перед рендерингом
    if (!product.variants || product.variants.length === 0) {
      console.error("❌ Product has no variants:", product);
      notFound();
    }

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Проверяем что product не undefined
    if (!product) {
      console.error("❌ Product is undefined before rendering");
      notFound();
    }

    // 🔥 Принудительно устанавливаем тип если его нет
    if (!product.type) {
      product.type = determineProductType(product);
    }

    // 🔥 Проверяем все критически важные свойства
    if (!product.name || !product.id || !product.variants) {
      console.error("❌ Product missing required properties:", {
        name: product.name,
        id: product.id,
        variants: product.variants,
      });
      notFound();
    }

    // 🔥 Передаем гарантированно нормализованный продукт
    return <ProductPage product={product} />;
  } catch (error) {
    console.error("❌ Error in ProductDetailPage:", error);
    notFound();
  }
}

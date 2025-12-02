import ProductCard from "@/components/ui/productCard/productCard";
import styles from "./newProducts.module.scss";
import Script from "next/script";

interface PageProps {
  title?: string;
  limit?: number;
}

interface Variant {
  type: "pack" | "block";
  imageUrl: string;
  price: number;
  name: string;
  nalichie?: boolean;
}

interface Product {
  id: number;
  name: string;
  ref: string;
  description: string;
  type: "iqos" | "terea" | "devices";
  price: number;
  nalichie: boolean;
  hit: number;
  variants: Variant[];
  url?: string;
}

// Асинхронный компонент серверного рендера
export default async function NewProducts({ title, limit }: PageProps) {
  // Исключаем devices
  const categories = ["terea", "iqos"];
  let allData: Product[] = [];

  for (const category of categories) {
    try {
      const res = await fetch(
        `http://217.198.9.128:3001/api/product/${category}`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!res.ok) continue;

      const response = await res.json();
      const data: Product[] = Array.isArray(response)
        ? response
        : response.products || [];

      if (!Array.isArray(data)) continue;

      // Берём только новинки с nalichie=true
      let newItems = data.filter(
        (item) => Number(item.hit) === 1 && item.nalichie
      );

      // Если нет новинок, можно брать все доступные товары
      if (newItems.length === 0) {
        newItems = data.filter((item) => item.nalichie);
      }

      allData.push(...newItems);
    } catch (error) {
      console.error(`Ошибка при загрузке категории ${category}:`, error);
    }
  }

  // Сортировка по названию
  allData.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const displayedProducts = limit ? allData.slice(0, limit) : allData;

  return (
    <section className="container" aria-label="Новинки IQOS ILUMA и TEREA">
      <div className={styles.header}>
        <h2>{title}</h2>
      </div>

      {displayedProducts.length > 0 ? (
        <div className={styles.grid}>
          {displayedProducts.map((product) => (
            <article key={product.id} className={styles.product_wrapper}>
              <ProductCard
                key={product.id}
                id={String(product.id)}
                variants={product.variants}
                url={`/product/${product.ref}`}
                description={product.description}
              />

              <Script
                id={`product-jsonld-${product.id}`}
                type="application/ld+json"
              >
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Product",
                  name: product.name,
                  image: product.variants.map((v) => v.imageUrl),
                  description: product.description,
                  brand: {
                    "@type": "Brand",
                    name: product.type === "iqos" ? "IQOS" : "TEREA",
                  },
                  offers: product.variants.map((v) => ({
                    "@type": "Offer",
                    price: v.price,
                    priceCurrency: "RUB",
                    availability: v.nalichie
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                    url: `/product/${product.ref}`,
                  })),
                })}
              </Script>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Пока нет новинок</p>
      )}
    </section>
  );
}

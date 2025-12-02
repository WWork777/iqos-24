import BreadCrumbs from "@/components/common/breadcrums";
import styles from "./catalog.module.scss";
import BrowseCategory from "@/components/main-page/browseCategory/browseCategory";
import BrowseCountry from "@/components/main-page/browseCountry/browseCountry";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог IQOS Iluma и стиков Terea | Официальный магазин Iqos-24",
  description:
    "Официальный каталог IQOS Iluma и стиков Terea. Устройства нагрева табака, стики, аксессуары и комплектующие. Гарантия качества, доставка по Москве и России.",
  keywords:
    "IQOS Iluma купить, Terea стики, устройства нагрева табака, каталог IQOS, Iluma Prime, стики для IQOS, аксессуары IQOS",
  openGraph: {
    title: "Каталог IQOS Iluma и стиков Terea | Iqos-24",
    description:
      "Полный каталог устройств IQOS Iluma и стиков Terea. Официальная продукция с гарантией качества.",
    url: "https://iqos-24.ru/catalog",
    siteName: "Iqos-24",
    images: [
      {
        url: "/og-catalog-image.jpg",
        width: 1200,
        height: 630,
        alt: "Каталог IQOS Iluma и стиков Terea",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог IQOS Iluma и стиков Terea | Iqos-24",
    description: "Официальный каталог устройств IQOS Iluma и стиков Terea",
    images: ["/twitter-catalog-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://iqos-24.ru/catalog",
  },
};

export default function Catalog() {
  return (
    <section className="hero-container">
      <div className={"second_page_header"}>
        <h1>Каталог</h1>
        <BreadCrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Каталог" }]}
        />
      </div>

      <div className={styles.catalog_content}>
        <Link href="/catalog/iqos" className={styles.iqos}>
          <div className={styles.categoryContent}>
            <h2>IQOS ILUMA</h2>
            <p>Устройства для нагрева табака</p>
            <span className={styles.ctaButton}>Смотреть товары</span>
          </div>
        </Link>

        <div>
          <Link href="/catalog/terea" className={styles.terea}>
            <div className={styles.categoryContent}>
              <h2>Terea</h2>
              <p>Стики для устройств нагрева</p>
              <span className={styles.ctaButton}>Смотреть товары</span>
            </div>
          </Link>

          <Link href="/catalog/devices" className={styles.devices}>
            <div className={styles.categoryContent}>
              <h2>Устройства</h2>
              <p>Аксессуары и комплектующие</p>
              <span className={styles.ctaButton}>Смотреть товары</span>
            </div>
          </Link>
        </div>
      </div>

      <BrowseCategory />
      <BrowseCountry />
    </section>
  );
}

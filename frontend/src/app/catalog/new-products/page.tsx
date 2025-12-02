import BreadCrumbs from "@/components/common/breadcrums";
import NewProducts from "@/components/main-page/newProducts/newProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новинки IQOS Iluma и Terea | Последние поступления | Iqos-24",
  description:
    "Новые поступления устройств IQOS Iluma и стиков Terea. Свежие модели, ограниченные серии и новейшие аксессуары. Будьте в курсе последних новинок нагрева табака.",
  keywords:
    "новинки IQOS, новые поступления Iluma, последние модели Terea, новейшие устройства нагрева, ограниченные серии IQOS, новые стики Terea",
  openGraph: {
    title: "Новинки IQOS Iluma и Terea | Iqos-24",
    description:
      "Самые свежие поступления устройств IQOS Iluma и стиков Terea. Новые модели и ограниченные серии.",
    url: "https://iqos-24.ru/new-products",
    siteName: "Iqos-24",
    images: [
      {
        url: "/og-new-products-image.jpg",
        width: 1200,
        height: 630,
        alt: "Новинки IQOS Iluma и Terea",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Новинки IQOS Iluma и Terea | Iqos-24",
    description:
      "Самые свежие поступления устройств и стиков для нагрева табака",
    images: ["/twitter-new-products-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://iqos-24.ru/new-products",
  },
};

export default function NewProductsPage() {
  return (
    <section className="hero-container">
      <div className={"second_page_header"}>
        <h1>Новинки</h1>
        <BreadCrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Новинки" }]}
        />
      </div>
      <NewProducts />
    </section>
  );
}

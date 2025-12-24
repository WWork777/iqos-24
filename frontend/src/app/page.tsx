import BestSellers from "@/components/main-page/bestSellers/bestSellers";
import BrowseCategory from "@/components/main-page/browseCategory/browseCategory";
import BrowseCountry from "@/components/main-page/browseCountry/browseCountry";
import Exclusive from "@/components/main-page/exclusive/exclusive";
import Hero from "@/components/main-page/hero-block/Hero";
import NewProducts from "@/components/main-page/newProducts/newProducts";
import Reviews from "@/components/main-page/reviews/reviews";
import Sales from "@/components/main-page/sales/sales";
import PromotionalModal from "@/components/PromotionModal/PromotionModal";
import BlockModal from "@/components/BlockModal/BlockModal";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Купить IQOS ILUMA и стики TEREA в Москве — доставка по России | Iqos-24",
  description:
    "Интернет-магазин Iqos-24: IQOS ILUMA, стики TEREA и аксессуары. Быстрая доставка по Москве и всей России. Только оригинальная продукция.",
  keywords: [
    "iqos iluma купить",
    "стики terea москва",
    "iqos доставка",
    "терея оригинал",
    "айкос илума магазин",
    "купить iqos онлайн",
  ],
  openGraph: {
    title: "Iqos-24 — IQOS ILUMA и стики TEREA с доставкой по России",
    description:
      "Купить IQOS ILUMA и TEREA по выгодным ценам. Доставка по Москве и всей России. Оригинальная продукция от Philip Morris.",
    url: "https://iqos-24.ru",
    siteName: "Iqos-24",
    images: [
      {
        url: "https://iqos-24.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Iqos-24 — IQOS ILUMA и TEREA",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "https://iqos-24.ru/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
      <Script id="ld-json" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "SmokeStore",
          image: "https://iqos-24.ru/logo.png",
          description:
            "Интернет-магазин IQOS ILUMA и стиков TEREA с доставкой по Москве и всей России.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Москва",
            addressCountry: "Россия",
          },
          url: "https://iqos-24.ru",
          telephone: "+7 (900) 123-45-67",
        })}
      </Script>
      <Hero />
      <BrowseCategory />
      <BrowseCountry />
      <NewProducts title="Новинки IQOS ILUMA и стиков TEREA" limit={8} />
      <Sales />
      <BestSellers title="Хиты продаж IQOS ILUMA и TEREA" limit={8} />
      <Exclusive />
      <Reviews />
      <PromotionalModal allowClose={true} />
      {/* <BlockModal allowClose={true}/> */}
    </>
  );
}

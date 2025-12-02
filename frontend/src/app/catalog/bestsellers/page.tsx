import BreadCrumbs from "@/components/common/breadcrums";
import BestSellers from "@/components/main-page/bestSellers/bestSellers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Хиты продаж IQOS Iluma и Terea | Популярные устройства и стики | Iqos-24",
  description:
    "Самые популярные устройства IQOS Iluma и стики Terea. Топ продаж среди нагревательных устройств и табачных стиков. Проверенное качество и лучшие отзывы.",
  keywords:
    "хиты продаж IQOS, популярные устройства Iluma, лучшие стики Terea, топ продаж нагревателей, бестселлеры IQOS, самые покупаемые устройства",
  openGraph: {
    title: "Хиты продаж IQOS Iluma и Terea | Iqos-24",
    description:
      "Самые популярные и проверенные устройства IQOS Iluma и стики Terea. Топ продаж с лучшими отзывами.",
    url: "https://iqos-24.ru/bestsellers",
    siteName: "Iqos-24",
    images: [
      {
        url: "/og-bestsellers-image.jpg",
        width: 1200,
        height: 630,
        alt: "Хиты продаж IQOS Iluma и Terea",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Хиты продаж IQOS Iluma и Terea | Iqos-24",
    description: "Самые популярные устройства и стики для нагрева табака",
    images: ["/twitter-bestsellers-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://iqos-24.ru/bestsellers",
  },
};

export default function BestSellersPage() {
  return (
    <>
      <section className="hero-container">
        <div className={"second_page_header"}>
          <h1>Хит продаж</h1>
          <BreadCrumbs
            items={[{ label: "Главная", href: "/" }, { label: "Хит продаж" }]}
          />
        </div>
        <BestSellers />
      </section>
    </>
  );
}

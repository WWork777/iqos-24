"use client";

import Link from "next/link";
import styles from "./browseCategory.module.scss";
import Image from "next/image";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Script from "next/script";

interface BrowseCategoryItemProps {
  title: string;
  imageUrl: string;
  url: string;
}

const BrowseCategoryItem: FC<BrowseCategoryItemProps> = ({
  title,
  imageUrl,
  url,
}) => {
  return (
    <article className={styles.category_item}>
      <Link href={url} aria-label={`Купить ${title} в Москве`}>
        <Image
          src={imageUrl}
          alt={`${title} — купить IQOS в Москве`}
          width={200}
          height={200}
        />
        <h3>{title}</h3>
      </Link>
    </article>
  );
};

export default function BrowseCategory() {
  const categories: BrowseCategoryItemProps[] = [
    {
      title: "Iqos Iluma One",
      imageUrl: "/browseCategory/ilumaone.webp",
      url: "/catalog/iqos/one",
    },
    {
      title: "Iqos Iluma One I",
      imageUrl: "/browseCategory/ilumaione.webp",
      url: "/catalog/iqos/onei",
    },
    {
      title: "Iqos Iluma Standart",
      imageUrl: "/browseCategory/ilumastandart.webp",
      url: "/catalog/iqos/standart",
    },
    {
      title: "Iqos Iluma Standart I",
      imageUrl: "/browseCategory/ilumaistandart.png",
      url: "/catalog/iqos/standarti",
    },
    {
      title: "Iqos Iluma Prime",
      imageUrl: "/browseCategory/ilumaprime.webp",
      url: "/catalog/iqos/prime",
    },
    {
      title: "Iqos Iluma Prime I",
      imageUrl: "/browseCategory/ilumaiprime.webp",
      url: "/catalog/iqos/primei",
    },
  ];

  return (
    <section className="container">
      <div className={styles.browse_header}>
        <h2>Iqos Iluma по категориям</h2>
        <div className="swiper-navigation">
          <div className="category-swiper-button-prev"></div>
          <div className="category-swiper-button-next"></div>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        navigation={{
          prevEl: ".category-swiper-button-prev",
          nextEl: ".category-swiper-button-next",
        }}
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          580: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        className={styles.browse_category_swiper}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <BrowseCategoryItem {...category} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Script id="category-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Категории IQOS ILUMA",
          itemListElement: categories.map((cat, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: cat.title,
            url: `https://iqos-24.ru${cat.url}`,
          })),
        })}
      </Script>
    </section>
  );
}

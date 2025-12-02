"use client";

import Link from "next/link";
import styles from "./browseCountry.module.scss";
import Image from "next/image";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface BrowseCountryItemProps {
  title: string;
  imageUrl: string;
  url: string;
}

const BrowseCountryItem: FC<BrowseCountryItemProps> = ({
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

export default function BrowseCountry() {
  const categories: BrowseCountryItemProps[] = [
    {
      title: "Terea Казахстан",
      imageUrl: "/terea/kz.webp",
      url: "/catalog/terea/казахстан",
    },
    {
      title: "Terea Польша",
      imageUrl: "/images/terea/poland/Terea Turquoise PL.png.webp",
      url: "/catalog/terea/польша",
    },
    {
      title: "Terea Узбекистан",
      imageUrl: "/terea/uzb.webp",
      url: "/catalog/terea/узбекистан",
    },
    {
      title: "Terea Армения",
      imageUrl: "/terea/armenia.webp",
      url: "/catalog/terea/армения",
    },
    {
      title: "Terea Индонезия",
      imageUrl: "/terea/ind.webp",
      url: "/catalog/terea/индонезия",
    },
    {
      title: "Terea Япония",
      imageUrl: "/terea/jap.webp",
      url: "/catalog/terea/япония",
    },
    {
      title: "Terea Швейцария",
      imageUrl: "/terea/swiz.webp",
      url: "/catalog/terea/швейцария",
    },
    {
      title: "Terea Европа",
      imageUrl: "/terea/europe.webp",
      url: "/catalog/terea/европа",
    },
  ];

  return (
    <section className="container">
      <div className={styles.browse_header}>
        <h2>Стики Terea по странам</h2>
        <div className="swiper-navigation">
          <div className="country-swiper-button-prev"></div>
          <div className="country-swiper-button-next"></div>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        navigation={{
          prevEl: ".country-swiper-button-prev",
          nextEl: ".country-swiper-button-next",
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
            <BrowseCountryItem {...category} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.bottom_line}></div>
    </section>
  );
}

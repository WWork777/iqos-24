"use client";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";

import styles from "./Hero.module.scss";
import Script from "next/script";

interface Slide {
  title: string;
  name: string;
  text: string;
  imageUrl: string;
  link: string;
}

const Hero: FC = () => {
  const slides: Slide[] = [
    {
      title: "EXCLUSIVE",
      name: "Iqos Iluma i Minera",
      text: "Премиальная новинка от IQOS в более консервативном, пластиковом корпусе и бесконтактной системой нагрева табака",
      imageUrl: "/hero_slider/slider1.png",
      link: "/product/I-Standart-Minera",
    },
    {
      title: "LIMITED",
      name: "Iqos Iluma Prime Oasis",
      text: "Премиальная новинка от IQOS с алюминиевым корпусом и бесконтактной системой нагрева табака",
      imageUrl: "/hero_slider/slider2.png",
      link: "/product/Prime-Oasis-Limited-Edition",
    },
    {
      title: "LIMITED",
      name: "Iqos Iluma i Prime Anniversary Model",
      text: "Новинка в ограниченном количестве к 10-летию IQOS!",
      imageUrl: "/hero_slider/slider3.png",
      link: "/product/i-Prime-Anniversary-Model",
    },
  ];

  return (
    <section className="hero-container">
      <Script id="hero-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "IQOS ILUMA Prime Oasis",
          image: "https://iqos-24.ru/hero_slider/slider2.png",
          description:
            "Ограниченная серия IQOS ILUMA Prime Oasis с доставкой по Москве.",
          brand: {
            "@type": "Brand",
            name: "IQOS",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            price: "8990",
            availability: "https://schema.org/InStock",
            url: "https://iqos-24.ru/product/iqos-iluma-prime-oasis",
          },
        })}
      </Script>
      <Script id="hero-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "IQOS ILUMA Prime Oasis",
          image: "https://iqos-24.ru/hero_slider/slider2.png",
          description:
            "Ограниченная серия IQOS ILUMA Prime Oasis с доставкой по Москве.",
          brand: {
            "@type": "Brand",
            name: "IQOS",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            price: "8990",
            availability: "https://schema.org/InStock",
            url: "https://iqos-24.ru/product/iqos-iluma-prime-oasis",
          },
        })}
      </Script>
      <Script id="hero-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "IQOS ILUMA Prime Oasis",
          image: "https://iqos-24.ru/hero_slider/slider2.png",
          description:
            "Ограниченная серия IQOS ILUMA Prime Oasis с доставкой по Москве.",
          brand: {
            "@type": "Brand",
            name: "IQOS",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            price: "8990",
            availability: "https://schema.org/InStock",
            url: "https://iqos-24.ru/product/iqos-iluma-prime-oasis",
          },
        })}
      </Script>
      <h1 className="visually-hidden">
        Купить IQOS ILUMA и стики TEREA в Москве с доставкой по всей России
      </h1>
      <div className={styles.hero_container}>
        <div className={styles.hero_slider}>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            className={styles.hero_swiper}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <article
                  className={styles.slide}
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                >
                  <div className={styles.slide_overlay}>
                    <div className={styles.slide_content}>
                      <h2 className={styles.slide_name}>{slide.name}</h2>
                      <p className={styles.slide_text}>{slide.text}</p>
                      <Link href={slide.link} className={styles.slide_button}>
                        <span>Купить</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={styles.hero_content}>
          <Link href="/catalog/terea" className={styles.hero_container__top}>
            <Image
              src="/hero_slider/terea.webp"
              alt="Стики TEREA для IQOS ILUMA — купить в Москве"
              width={250}
              height={250}
            />
            <div className={styles.hero_content_top__text}>
              <h3>Стики Terea для Iqos Iluma</h3>
              <p>Купить от 360 рублей</p>
            </div>
          </Link>
          <Link
            href="/catalog/devices"
            className={styles.hero_container__bottom}
          >
            <Image
              src="/hero_slider/device.webp"
              alt="Стики TEREA для IQOS ILUMA — купить в Москве"
              width={200}
              height={200}
            />
            <div className={styles.hero_bottom__text}>
              <h3>Аксессуары для Iqos Iluma</h3>
              <p>Купить от 1490 рублей</p>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.hero_divider}>
        <div className={styles.hero_divider_item}>
          <Image
            src={"/hero_slider/delivery.svg"}
            alt="Стики TEREA для IQOS ILUMA — купить в Москве"
            width={40}
            height={40}
          />
          <div>
            <p>Заказ от 1 блока</p>
            <span>2 пачки не продаем</span>
          </div>
        </div>
        <div className={styles.hero_divider_item}>
          <Image
            src={"/hero_slider/icon1.svg"}
            alt="Стики TEREA для IQOS ILUMA — купить в Москве"
            width={40}
            height={40}
          />
          <div>
            <p>Быстрая доставка</p>
            <span>Отправка в день заказа</span>
          </div>
        </div>
        <div className={styles.hero_divider_item}>
          <Image
            src={"/hero_slider/icon-03.svg"}
            alt="Стики TEREA для IQOS ILUMA — купить в Москве"
            width={40}
            height={40}
          />
          <div>
            <p>Гарантия качества</p>
            <span>Только оригинальная продукция</span>
          </div>
        </div>
        <div className={styles.hero_divider_item}>
          <Image
            src={"/hero_slider/icon-02.svg"}
            alt="Стики TEREA для IQOS ILUMA — купить в Москве"
            width={40}
            height={40}
          />
          <div>
            <p>Богатый выбор IQOS и стиков</p>
            <span>Все модели систем нагрева IQOS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

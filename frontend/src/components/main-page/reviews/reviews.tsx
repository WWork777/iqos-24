"use client";

import Link from "next/link";
import styles from "./reviews.module.scss";
import Image from "next/image";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface BrowseCategoryItemProps {
  text: string;
  name: string;
  date: string;
  avatarUrl?: string;
}

const BrowseCategoryItem: FC<BrowseCategoryItemProps> = ({
  text,
  name,
  date,
  avatarUrl = "/rewievs/user-01.webp",
}) => {
  return (
    <div className={styles.reviews_item}>
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <Image
            key={i}
            src={"/rewievs/icon-star.svg"}
            alt="star"
            width={18}
            height={18}
          />
        ))}
      </div>
      <p>{text}</p>
      <div className={styles.user_info}>
        <div className={styles.user_details}>
          <span className={styles.user_name}>{name}</span>
          <span className={styles.review_date}>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default function Reviews() {
  const reviews: BrowseCategoryItemProps[] = [
    {
      text: "Отличный продукт! Качество на высшем уровне. Пользуюсь уже месяц - никаких нареканий. Очень доволен покупкой и рекомендую всем!",
      name: "Александр Петров",
      date: "15 января 2024",
      avatarUrl: "/rewievs/user-01.webp",
    },
    {
      text: "Прекрасное обслуживание и быстрая доставка. Товар соответствует описанию, работает идеально. Обязательно буду покупать еще!",
      name: "Мария Иванова",
      date: "12 января 2024",
      avatarUrl: "/rewievs/user-02.webp",
    },
    {
      text: "Прекрасное обслуживание и быстрая доставка. Товар соответствует описанию, работает идеально. Обязательно буду покупать еще!",
      name: "Мария Иванова",
      date: "12 января 2024",
      avatarUrl: "/rewievs/user-02.webp",
    },
    {
      text: "Прекрасное обслуживание и быстрая доставка. Товар соответствует описанию, работает идеально. Обязательно буду покупать еще!",
      name: "Мария Иванова",
      date: "12 января 2024",
      avatarUrl: "/rewievs/user-02.webp",
    },
    {
      text: "Прекрасное обслуживание и быстрая доставка. Товар соответствует описанию, работает идеально. Обязательно буду покупать еще!",
      name: "Мария Иванова",
      date: "12 января 2024",
      avatarUrl: "/rewievs/user-02.webp",
    },
    {
      text: "Прекрасное обслуживание и быстрая доставка. Товар соответствует описанию, работает идеально. Обязательно буду покупать еще!",
      name: "Мария Иванова",
      date: "12 января 2024",
      avatarUrl: "/rewievs/user-02.webp",
    },
  ];

  return (
    <section className="container">
      <div className={styles.reviews_header}>
        <h2>Отвызы</h2>
        <div className="swiper-navigation">
          <div className="reviews-swiper-button-prev"></div>
          <div className="reviews-swiper-button-next"></div>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        navigation={{
          prevEl: ".reviews-swiper-button-prev",
          nextEl: ".reviews-swiper-button-next",
        }}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
        }}
        className={styles.reviews_category_swiper}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <BrowseCategoryItem {...review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

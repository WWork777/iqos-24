"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import styles from "./order-success.module.scss";

export default function OrderSuccessPage() {
  // Добавляем noindex метатег
  useEffect(() => {
    // Создаем meta тег для noindex
    const metaNoindex = document.createElement("meta");
    metaNoindex.name = "robots";
    metaNoindex.content = "noindex, nofollow";
    document.head.appendChild(metaNoindex);

    // Очистка при размонтировании компонента
    return () => {
      document.head.removeChild(metaNoindex);
    };
  }, []);

  return (
    <div className={styles.success}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Заказ успешно оформлен!</h1>
          <p className={styles.message}>
            Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для
            подтверждения.
          </p>
          <div className={styles.actions}>
            <Link href="/catalog" className={styles.continueShopping}>
              Продолжить покупки
            </Link>
            <Link href="/" className={styles.homeLink}>
              На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

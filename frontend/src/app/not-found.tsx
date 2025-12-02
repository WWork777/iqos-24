// app/not-found.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import styles from "./not-found.module.scss"; // или используйте ваши глобальные стили

export const metadata: Metadata = {
  title: "Страница не найдена - 404 | IlumaPrime",
  description:
    "Запрашиваемая страница не существует. Вернитесь на главную страницу IlumaPrime.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section className="hero-container">
      <div className={styles.notFoundPage}>
        <div className={styles.notFoundContent}>
          <div className={styles.notFoundImage}>
            <Image
              src="/404/error-404.svg"
              alt="Страница не найдена"
              width={280}
              height={280}
              priority
            />
          </div>

          <div className={styles.notFoundText}>
            <h1>404 - Страница не найдена</h1>
            <p>
              К сожалению, мы не можем найти то, что вы ищете. Возможно,
              страница была перемещена или удалена.
            </p>

            <div className={styles.notFoundActions}>
              <Link
                href="/"
                className={`${styles.notFoundButton} ${styles.primary}`}
              >
                Вернуться на главную
              </Link>
              <Link href="/catalog" className={styles.notFoundButton}>
                Перейти в каталог
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

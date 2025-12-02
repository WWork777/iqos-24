import BreadCrumbs from "@/components/common/breadcrums";
import styles from "./contacts.module.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты магазина IQOS Iluma | Iqos-24",
  description:
    "Свяжитесь с нами для покупки IQOS Iluma в Москве. Адрес: ул. Римского-Корсакова, 11. Работаем с 10:00 до 23:00. Телефон: +7 (995) 153-80-19. Пишите в Telegram/WhatsApp @IlumaPrime. Доставка по России.",
  keywords:
    "IQOS Iluma контакты, магазин IQOS Москва, адрес Iluma Prime, телефон, доставка IQOS, купить Iluma",
  alternates: {
    canonical: "https://iqos-24.ru/contacts",
  },
  openGraph: {
    title: "Контакты магазина IQOS Iluma | Iqos-24",
    description:
      "Свяжитесь с нами для покупки IQOS Iluma в Москве. Телефон, адрес, мессенджеры. Работаем без выходных.",
    url: "https://iqos-24.ru/contacts",
    siteName: "Iqos-24",
    images: [
      {
        url: "/og-contacts-image.jpg",
        width: 1200,
        height: 630,
        alt: "Магазин IQOS Iluma - Контакты",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Контакты магазина IQOS Iluma | Iqos-24",
    description: "Свяжитесь с нами для покупки IQOS Iluma в Москве",
    images: ["/twitter-contacts-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Contacts() {
  const contacts = {
    address: "г. Москва, ул. Примерная, д. 123, офис 45",
    phone: "+7 (495) 123-45-67",
    telegram: "https://t.me/iqos_support",
    workingHours: "10:00 – 23:00",
    socialLinks: {
      vk: "https://vk.com/iqos",
      telegram: "https://t.me/iqos",
      whatsapp: "https://wa.me/74951234567",
    },
  };

  return (
    <section className="hero-container">
      <div className="second_page_header">
        <h1>Контакты</h1>
        <BreadCrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]}
        />
      </div>

      <div className={styles.mapWrapper}>
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A40f20bb686b28b0a664f793b7ec0f8183f3f7fa670ece8d9edfd23ee01811c95&amp;source=constructor"
          width="100%"
          height="500"
          frameBorder="0"
        ></iframe>
      </div>

      <div className={styles.info_section}>
        <div className={styles.info_card}>
          <h3>Адрес</h3>
          <p>
            г.Москва - ул. Римского-Корсакова, 11, корп 8 Ориентир: Пункт "OZON"
          </p>
        </div>
        <div className={styles.info_card}>
          <h3>Телефон</h3>
          <p>+7 (995) 153-80-19</p>
        </div>
        <div className={styles.info_card}>
          <h3>Время работы</h3>
          <p>с 10:00 до 23:00, без выходных</p>
        </div>
      </div>

      <div className={styles.socials}>
        <div className={styles.social_card}>
          <h3>Telegram</h3>
          <p>@IlumaPrimeRU</p>
        </div>
        <div className={styles.social_card}>
          <h3>Whatsapp</h3>
          <p>@IlumaPrime</p>
        </div>
      </div>
    </section>
  );
}

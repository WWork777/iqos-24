import styles from "./footer.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <section className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_section}>
          <div className={styles.logo_container}>
            <Image
              src="/logo/ilumastorelogo.svg"
              alt="iluma"
              height={70}
              width={70}
            />
            <h2 className={styles.logo_text}>Iqos-24</h2>
          </div>
          <p className={styles.description}>
            Интернет-магазин современных технологичных устройств. Мы предлагаем
            качественную продукцию с доставкой по всей России.
          </p>
        </div>

        <div className={styles.footer_section}>
          <h3 className={styles.section_title}>Каталог</h3>
          <div className={styles.links_container}>
            <Link href={"/catalog/iqos"}>Iqos ILuma</Link>
            <Link href={"/catalog/terea"}>Стики Terea</Link>
            <Link href={"/catalog/devices"}>Аксессуары</Link>
            <Link href={"/catalog/bestsellers"}>Хит продаж</Link>
            <Link href={"/catalog/new-products"}>Новинки</Link>
          </div>
        </div>

        <div className={styles.footer_section}>
          <h3 className={styles.section_title}>Информация</h3>
          <div className={styles.links_container}>
            <Link href={"/contacts"}>Контакты</Link>
            <Link href={"/blog"}>Блог</Link>
          </div>
        </div>

        <div className={styles.footer_section}>
          <h3 className={styles.section_title}>Контакты</h3>
          <div className={styles.contacts_container}>
            <Link href="tel:+7 (995) 153-80-19" className={styles.phone}>
              +7 (995) 153-80-19
            </Link>
            <p className={styles.work_hours}>Ежедневно с 9:00 до 21:00</p>
            <div className={styles.social_links}>
              <Link
                href="https://api.whatsapp.com/send/?phone=79951538019&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21+%D0%A5%D0%BE%D1%87%D1%83+%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%B8%D1%82%D1%8C+%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7&type=phone_number&app_absent=0"
                className={styles.social_link}
              >
                <Image
                  src="/header/wa.svg"
                  alt="WhatsApp"
                  height={30}
                  width={30}
                />
              </Link>
              <Link
                href="https://t.me/Ilumastore2025"
                className={styles.social_link}
              >
                <Image
                  src="/header/tg.svg"
                  alt="Telegram"
                  height={30}
                  width={30}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer_bottom}>
        <div className={styles.copyright}>
          © 2025 IQOS-24. Все права защищены.
        </div>
        <div className={styles.legal_links}>
          <Link href={"/privacy-policy"}>Политика конфиденциальности</Link>
          <Link href={"/terms"}>Пользовательское соглашение</Link>
        </div>
      </div>
    </section>
  );
}

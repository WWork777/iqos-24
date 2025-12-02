"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Cart from "@/components/ui/cart/cart";
import { useFavorites } from "@/context/FavoritesContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const { totalItems } = useCart();
  const { totalItems: favoriteItems } = useFavorites();

  const categories = [
    { label: "Iqos", href: "iqos" },
    { label: "Terea", href: "terea" },
    { label: "Devices", href: "devices" },
    { label: "Хит продаж", href: "bestsellers" },
    { label: "Новинки", href: "new-products" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => {
    setIsCategoriesOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.hero_container}>
          <div
            className={`${styles.hero_top} ${
              isScrolled ? styles.scrolled : ""
            }`}
          >
            <div className={styles.hero_top__left}>
              <Link href={"/"} className={styles.logo_container}>
                <Image
                  src={"/logo/ilumastorelogo.svg"}
                  alt="iluma"
                  height={55}
                  width={55}
                />
                <h2>Iqos-24</h2>
              </Link>

              {/* Бургер меню для мобилки */}
              <button
                className={`${styles.burger_button} ${
                  isMenuOpen ? styles.burger_active : ""
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span></span>
              </button>

              {/* Кнопка для десктопа */}
              <div className={styles.categories_dropdown}>
                <span onClick={toggleDropdown}>
                  <Image
                    src="/header/dropdown.svg"
                    alt="dropdown"
                    height={20}
                    width={20}
                  />
                  Все категории
                  <Image
                    src="/header/arrow.svg"
                    alt="arrow"
                    height={20}
                    width={20}
                    className={isCategoriesOpen ? styles.rotated : ""}
                  />
                </span>

                {isCategoriesOpen && (
                  <div className={styles.dropdown_menu}>
                    <div className={styles.dropdown_content}>
                      {categories.map((category, index) => (
                        <Link
                          key={index}
                          href={`/catalog/${category.href}`}
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.hero_top__right}>
              <div className={styles.cart_container}>
                <Image
                  src={"/header/backet.svg"}
                  alt="backet"
                  width={25}
                  height={25}
                  className={styles.backet}
                  onClick={() => setIsCartOpen(true)}
                />
                {totalItems > 0 && (
                  <span className={styles.cart_badge}>{totalItems}</span>
                )}
                <Link href="/wishlist">
                  <Image
                    src={"/header/like.svg"}
                    alt="like"
                    width={25}
                    height={25}
                    className={styles.backet}
                  />
                  {favoriteItems > 0 && (
                    <span className={styles.like_badge}>{favoriteItems}</span>
                  )}
                </Link>
              </div>
              <div className={styles.socials}>
                <Link href="https://api.whatsapp.com/send/?phone=79951538019&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21+%D0%A5%D0%BE%D1%87%D1%83+%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%B8%D1%82%D1%8C+%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7&type=phone_number&app_absent=0">
                  <Image src="/header/wa.svg" alt="wa" width={30} height={30} />
                </Link>
                <Link href="https://t.me/Ilumastore2025">
                  <Image src="/header/tg.svg" alt="tg" width={30} height={30} />
                </Link>

                <Link href="tel:+7 (995) 153-80-19" className={styles.phone}>
                  +7 (995) 153-80-19
                </Link>
              </div>
            </div>
          </div>

          {/* Навигация десктоп */}
          <div
            className={`${styles.hero_bottom} ${
              isScrolled ? styles.scrolled : ""
            }`}
          >
            <div className={styles.hero_bottom_left}>
              <nav className={styles.hero_bottom_left_nav}>
                <Link href="/catalog/new-products">Новинки</Link>
                <Link href="/catalog">Каталог</Link>
                <Link href="/blog">Блог</Link>
                <Link href="/contacts">Контакты</Link>
              </nav>
            </div>
            <div className={styles.hero_bottom_right}>
              <div className={styles.hero_bottom_right_nav}>
                <Link href="/catalog/bestsellers">Хит продаж</Link>
                <span>SALE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 Мобильное меню */}
      <div className={`${styles.mobile_menu} ${isMenuOpen ? styles.open : ""}`}>
        <Link href={"/"} className={styles.logo_container}>
          <Image
            src={"/logo/ilumastorelogo.svg"}
            alt="iluma"
            height={45}
            width={45}
          />
          <h2>Iqos-24</h2>
        </Link>

        <nav>
          <Link href="/catalog" onClick={closeMobileMenu}>
            Каталог
          </Link>
          {categories.map((item, i) => (
            <Link
              key={i}
              href={`/catalog/${item.href}`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/blog" onClick={closeMobileMenu}>
            Блог
          </Link>
          <Link href="/contacts" onClick={closeMobileMenu}>
            Контакты
          </Link>
        </nav>
      </div>

      {/* Затемнение фона */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu}></div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

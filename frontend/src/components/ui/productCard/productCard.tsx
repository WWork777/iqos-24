"use client";

import { FC, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useNotification } from "@/context/NotificationContext";
import ProductModal from "../productModal/productModal";
import styles from "./productCard.module.scss";
import { generateCartItemId, generateProductId } from "@/utils/productId";
import { CartItem } from "@/types/cart/cart";
import { getStableProductBaseId } from "@/utils/productUtils";

export interface ProductVariant {
  type: "pack" | "block";
  imageUrl: string;
  price: number;
  name: string;
  nalichie?: boolean;
}

export interface ProductCardProps {
  id?: string;
  variants: ProductVariant[];
  url?: string;
  className?: string;
  description?: string;
}

// 🔥 УЛУЧШЕННАЯ Функция для кодирования URL с русскими символами
function encodeImageUrl(url: string): string {
  if (!url) return "https://placehold.net/600x600.png";

  try {
    // Если это абсолютный URL
    if (url.startsWith("http")) {
      const urlObj = new URL(url);
      urlObj.pathname = encodeURI(urlObj.pathname);
      return urlObj.toString();
    }

    // Если это относительный путь
    const parts = url.split("/");
    const encodedParts = parts.map((part) =>
      part.includes("%") || part === "" ? part : encodeURIComponent(part)
    );
    return encodedParts.join("/");
  } catch (error) {
    console.warn("Error encoding image URL:", url, error);
    return "https://placehold.net/600x600.png"; // 🔥 Всегда возвращаем fallback при ошибке
  }
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  variants,
  url,
  className = "",
  description,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false); // 🔥 ДОБАВЛЕНО: состояние ошибки изображения
  const [imageLoading, setImageLoading] = useState(true); // 🔥 ДОБАВЛЕНО: состояние загрузки
  const imageRef = useRef<HTMLImageElement>(null);

  const safeVariants =
    Array.isArray(variants) && variants.length > 0
      ? variants
      : [
          {
            type: "pack",
            imageUrl: "https://placehold.net/600x600.png",
            price: 0,
            name: "Без названия",
            nalichie: false,
          },
        ];
  const [activeVariant, setActiveVariant] = useState<"pack" | "block">(
    safeVariants[0].type as "pack" | "block"
  );

  const currentVariant =
    safeVariants.find((v) => v.type === activeVariant) || safeVariants[0];
  const hasMultipleVariants = safeVariants.length > 1;

  // 🔥 УЛУЧШЕННАЯ логика получения URL изображения
  const getSafeImageUrl = () => {
    // Если уже была ошибка, возвращаем placeholder
    if (imageError) return "https://placehold.net/600x600.png";

    // Если нет URL у текущего варианта, возвращаем placeholder
    if (!currentVariant.imageUrl) return "https://placehold.net/600x600.png";

    // Кодируем URL для отображения
    return encodeImageUrl(currentVariant.imageUrl);
  };

  const safeImageUrl = getSafeImageUrl();

  const { addItem } = useCart();
  const {
    addItem: addToFavorites,
    removeItem: removeFromFavorites,
    isFavorite,
  } = useFavorites();
  const { addNotification } = useNotification();

  // 🔥 ИСПРАВЛЕНИЕ: Безопасное формирование itemId
  const baseId = getStableProductBaseId(id, undefined, currentVariant.name);
  const variantType = currentVariant.type as "pack" | "block" | undefined;
  const itemId = generateProductId(baseId, variantType);
  const cartItemId = generateCartItemId(baseId, variantType);

  const isItemFavorite = isFavorite(itemId);

  // 🔥 ДОБАВЛЕНО: Проверка наличия товара
  const isInStock = currentVariant.nalichie !== false;

  // 🔥 ДОБАВЛЕНО: Обработчик ошибки загрузки изображения
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.warn("Image failed to load:", safeImageUrl);
    setImageError(true);
    setImageLoading(false);

    // Принудительно устанавливаем placeholder
    const target = e.target as HTMLImageElement;
    target.src = "https://placehold.net/600x600.png";
  };

  // 🔥 ДОБАВЛЕНО: Обработчик успешной загрузки изображения
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      addNotification({
        type: "error",
        title: "Товар недоступен",
        message: "К сожалению, этот товар закончился",
        duration: 3000,
      });
      return;
    }

    const cartItem: CartItem = {
      id: cartItemId,
      ref: id || currentVariant.name,
      name: currentVariant.name,
      price: currentVariant.price,
      quantity: 1,
      imageUrl: currentVariant.imageUrl,
      variant: hasMultipleVariants
        ? {
            type: currentVariant.type as "pack" | "block",
            name: currentVariant.type === "pack" ? "Пачка" : "Блок",
          }
        : undefined,
    };

    addItem(cartItem);

    addNotification({
      type: "success",
      title: "Товар добавлен в корзину",
      message: currentVariant.name,
      duration: 2000,
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isItemFavorite) {
      removeFromFavorites(itemId);
      addNotification({
        type: "info",
        title: "Товар удален из избранного",
        message: currentVariant.name,
        duration: 2000,
      });
    } else {
      addToFavorites({
        id: itemId,
        name: currentVariant.name,
        price: currentVariant.price,
        imageUrl: currentVariant.imageUrl,
        variant: hasMultipleVariants
          ? {
              type: currentVariant.type as "pack" | "block",
              name: currentVariant.type === "pack" ? "Пачка" : "Блок",
            }
          : undefined,
      });
      addNotification({
        type: "success",
        title: "Товар добавлен в избранное",
        message: currentVariant.name,
        duration: 2000,
      });
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <article className={`${styles.productCard} ${className}`.trim()}>
        <Link
          href={url || "#"}
          aria-label={`Купить ${currentVariant.name} — доставка по Москве`}
        >
          <div className={styles.productCard__image}>
            {/* 🔥 ДОБАВЛЕНО: Бейдж наличия */}
            {!isInStock && (
              <div className={styles.productCard__outOfStock}>
                Нет в наличии
              </div>
            )}

            {hasMultipleVariants && (
              <div className={styles.productCard__variants}>
                {["pack", "block"].map((type) => (
                  <button
                    key={type}
                    className={`${styles.productCard__variant} ${
                      activeVariant === type
                        ? styles.productCard__variant_active
                        : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveVariant(type as "pack" | "block");
                      // 🔥 СБРАСЫВАЕМ состояние ошибки при смене варианта
                      setImageError(false);
                      setImageLoading(true);
                    }}
                  >
                    {type === "pack" ? "Пачка" : "Блок"}
                  </button>
                ))}
              </div>
            )}

            {/* 🔥 УЛУЧШЕННЫЙ компонент Image с обработкой ошибок */}
            <div className={styles.productCard__imageWrapper}>
              <Image
                ref={imageRef}
                src={safeImageUrl}
                alt={`${currentVariant.name} — купить в Москве с доставкой`}
                width={400}
                height={400}
                className={`${styles.productCard__img} ${
                  imageLoading ? styles.productCard__imgLoading : ""
                } ${imageError ? styles.productCard__imgError : ""}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </div>

            <div className={styles.productCard__action}>
              <Image
                src={"/productCard/modal.svg"}
                alt="Быстрый просмотр"
                width={20}
                height={20}
                onClick={handleModalClick}
              />
              <span
                onClick={handleAddToCart}
                className={!isInStock ? styles.productCard__actionDisabled : ""}
              >
                {isInStock ? "В корзину" : "Нет в наличии"}
              </span>
              <div
                className={`${styles.productCard__favoriteBtn} ${
                  isItemFavorite ? styles.productCard__favoriteBtn_active : ""
                }`}
                onClick={handleFavoriteClick}
              >
                <Image
                  src={
                    isItemFavorite
                      ? "/productCard/fill-like.svg"
                      : "/productCard/like.svg"
                  }
                  alt="В избранное"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          <div className={styles.productCard__info}>
            <h3 className={styles.productCard__name}>{currentVariant.name}</h3>
            <span className={styles.productCard__price}>
              {currentVariant.price.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </Link>

        {/* JSON-LD для SEO */}
        {id && (
          <Script id={`product-jsonld-${id}`} type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: currentVariant.name,
              image: currentVariant.imageUrl,
              description,
              brand: { "@type": "Brand", name: "IQOS / TEREA" },
              offers: {
                "@type": "Offer",
                price: currentVariant.price,
                priceCurrency: "RUB",
                availability: isInStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                url: url,
              },
            })}
          </Script>
        )}
      </article>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variants={variants}
        productName={currentVariant.name}
        description={description}
        id={id}
      />
    </>
  );
};

export default ProductCard;

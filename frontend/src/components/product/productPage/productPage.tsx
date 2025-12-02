// components/product/productPage/productPage.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useNotification } from "@/context/NotificationContext";
import styles from "./productPage.module.scss";
import BreadCrumbs from "@/components/common/breadcrums";
import { isProductInStock } from "@/utils/stock";
import SimilarProducts from "../similarProducts/similarProducts";
import { generateCartItemId, generateProductId } from "@/utils/productId";
import { CartItem } from "@/types/cart/cart";

export interface ProductVariant {
  type: "pack" | "block";
  imageUrl: string;
  price: number;
  name: string;
  nalichie: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price?: number;
  imageUrl?: string;
  variants: ProductVariant[];
  features?: string[];
  specifications?: ProductSpecification[];
  type: "iqos" | "terea" | "devices";
  ref?: string;
  image?: string;
  model?: string;
  color?: string;
  nalichie?: boolean;
}

interface ProductPageProps {
  product: Product;
}

// 🔥 Функция для определения типа продукта (дублируем для клиентской части)
const determineProductType = (product: any): "iqos" | "terea" | "devices" => {
  const name = (product.name || "").toLowerCase();
  const description = (product.description || "").toLowerCase();

  if (name.includes("terea") || description.includes("terea")) {
    return "terea";
  } else if (
    name.includes("iqos") ||
    description.includes("iqos") ||
    name.includes("iluma")
  ) {
    return "iqos";
  } else {
    return "devices";
  }
};

// 🔥 Функция для нормализации продукта на клиенте
const normalizeProductOnClient = (product: any): Product => {
  if (!product) throw new Error("Product is undefined");

  // Определяем тип продукта
  const productType = product.type || determineProductType(product);

  // Нормализуем варианты
  let variants = product.variants || [];

  // Если нет вариантов, создаем базовый вариант
  if (variants.length === 0) {
    variants = [
      {
        type: "pack" as const,
        imageUrl: product.image || product.imageUrl || "/placeholder.jpg",
        price: product.price || product.priceValue || 0,
        name: product.name || "Товар",
        nalichie: product.nalichie || false,
      },
    ];
  }

  return {
    ...product,
    type: productType,
    variants,
    // Обеспечиваем обратную совместимость
    id:
      product.id?.toString() ||
      product.ref?.toString() ||
      Math.random().toString(),
    name: product.name || "Без названия",
    description: product.description || "",
  };
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
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
  // 🔥 Нормализуем продукт на клиенте
  const normalizedProduct = normalizeProductOnClient(product);

  // 🔥 ИСПРАВЛЕНИЕ: Используем нормализованный продукт
  const mainImageUrl =
    normalizedProduct.imageUrl ||
    normalizedProduct.image ||
    normalizedProduct.variants?.[0]?.imageUrl;

  const mainPrice =
    normalizedProduct.price || normalizedProduct.variants?.[0]?.price || 0;
  const productName = normalizedProduct.name || "Товар";

  const [activeVariant, setActiveVariant] = useState<"pack" | "block">(
    normalizedProduct.variants[0]?.type || "pack"
  );
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { addItem: addToFavorites, removeItem, isFavorite } = useFavorites();
  const { addNotification } = useNotification();

  const currentVariant =
    normalizedProduct.variants.find((v) => v.type === activeVariant) ||
    normalizedProduct.variants[0];

  const hasMultipleVariants = normalizedProduct.variants.length > 1;
  const isTereaProduct = normalizedProduct.type === "terea";

  // 🔥 ИСПРАВЛЕНИЕ: Правильное формирование itemId
  const baseId = normalizedProduct.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const itemId = generateProductId(baseId, currentVariant.type);
  const cartItemId = generateCartItemId(baseId, currentVariant.type);

  const isItemFavorite = isFavorite(itemId);
  const isInStock = isProductInStock(currentVariant.nalichie);

  const getProductCategory = () => {
    if (
      normalizedProduct.name.toLowerCase().includes("iqos") ||
      normalizedProduct.type === "iqos"
    ) {
      return "iqos";
    } else if (
      normalizedProduct.name.toLowerCase().includes("terea") ||
      normalizedProduct.type === "terea"
    ) {
      return "terea";
    } else {
      return "devices";
    }
  };

  useEffect(() => {
    setQuantity(1);
  }, [currentVariant]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // 🔥 ИСПРАВЛЕНИЕ: Убираем "Пачка"/"Блок" для не-TEREA товаров
  const getVariantDisplayName = () => {
    if (!isTereaProduct) return "";
    return currentVariant.type === "pack" ? "Пачка" : "Блок";
  };

  const handleAddToCart = () => {
    if (!isInStock) return;

    const cartItem: CartItem = {
      id: cartItemId,
      ref: normalizedProduct.id.toString(),
      name: currentVariant.name,
      price: currentVariant.price,
      quantity,
      imageUrl: currentVariant.imageUrl,
      // Всегда добавляем вариант, если есть multiple variants
      ...(hasMultipleVariants && {
        variant: {
          type: currentVariant.type,
          name: currentVariant.type === "pack" ? "Пачка" : "Блок",
        },
      }),
    };

    addItem(cartItem);

    addNotification({
      type: "success",
      title: "Товар добавлен в корзину",
      message: currentVariant.name,
      duration: 2000,
    });
  };

  const handleFavoriteClick = () => {
    if (isItemFavorite) {
      removeItem(itemId);
      addNotification({
        type: "info",
        title: "Товар удален из избранного",
        message: currentVariant.name,
        duration: 2000,
      });
    } else {
      // 🔥 ИСПРАВЛЕНИЕ: Всегда добавляем вариант, если есть multiple variants
      addToFavorites({
        id: itemId,
        name: currentVariant.name,
        price: currentVariant.price,
        imageUrl: currentVariant.imageUrl,
        variant: hasMultipleVariants
          ? {
              type: currentVariant.type,
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

  // 🔥 ИСПРАВЛЕНИЕ: Используем нормализованный продукт для проверок
  if (
    !normalizedProduct ||
    !normalizedProduct.variants ||
    normalizedProduct.variants.length === 0
  ) {
    console.error("❌ Invalid product data:", normalizedProduct);
    return (
      <div className="hero-container">
        <div className={styles.error}>
          <h1>Ошибка загрузки товара</h1>
          <p>
            Не удалось загрузить данные товара. Попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-container">
      <BreadCrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Каталог", href: "/catalog" },
          {
            label: normalizedProduct.type,
            href: `/catalog/${normalizedProduct.type}`,
          },
          { label: productName },
        ]}
      />

      <div className={styles.productContent}>
        <div className={styles.productImage}>
          <div className={styles.productImage__container}>
            <div
              className={`${styles.stockBadge} ${
                isInStock
                  ? styles.stockBadge_inStock
                  : styles.stockBadge_outOfStock
              }`}
            >
              {isInStock ? "В наличии" : "Нет в наличии"}
            </div>

            <Image
              src={encodeImageUrl(currentVariant.imageUrl)}
              alt={productName}
              width={1920}
              height={1080}
              className={styles.productImage__main}
              priority
            />
          </div>
        </div>

        <div className={styles.productInfo}>
          <h1 className={styles.productInfo__title}>{productName}</h1>

          {/* 🔥 ИСПРАВЛЕНИЕ: Показываем варианты только для TEREA товаров */}
          {isTereaProduct && hasMultipleVariants && (
            <div className={styles.productInfo__variants}>
              <h3 className={styles.productInfo__subtitle}>Вариант:</h3>
              <div className={styles.variants}>
                {normalizedProduct.variants.map((variant) => (
                  <button
                    key={variant.type}
                    className={`${styles.variant} ${
                      activeVariant === variant.type
                        ? styles.variant_active
                        : ""
                    }`}
                    onClick={() => setActiveVariant(variant.type)}
                  >
                    {variant.type === "pack" ? "Пачка" : "Блок"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.productInfo__price}>
            <span className={styles.price}>
              {currentVariant.price.toLocaleString("ru-RU")} ₽
            </span>
          </div>

          <div className={styles.productInfo__description}>
            <p>{normalizedProduct.description}</p>
          </div>

          <div className={styles.purchaseBlock}>
            <div className={styles.quantity}>
              <span className={styles.quantity__label}>Количество:</span>
              <div className={styles.quantity__controls}>
                <button
                  className={styles.quantity__btn}
                  onClick={decreaseQuantity}
                  disabled={!isInStock}
                >
                  -
                </button>
                <span className={styles.quantity__value}>{quantity}</span>
                <button
                  className={styles.quantity__btn}
                  onClick={increaseQuantity}
                  disabled={!isInStock}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.addToCart} ${
                  !isInStock ? styles.addToCart_disabled : ""
                }`}
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                {isInStock ? "В корзину" : "Нет в наличии"}
              </button>

              <button
                className={`${styles.addToFavorites} ${
                  isItemFavorite ? styles.addToFavorites_active : ""
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
                <span>{isItemFavorite ? "В избранном" : "В избранное"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <SimilarProducts
        currentProductId={normalizedProduct.id.toString()}
        category={getProductCategory()}
        limit={4}
      />
    </div>
  );
};

export default ProductPage;

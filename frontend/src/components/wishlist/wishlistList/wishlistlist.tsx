"use client";

import { useState, useEffect } from "react";
import styles from "./wishlistlist.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";

export default function WishlistList() {
  const { items: favoriteItems, removeItem, clearFavorites } = useFavorites();
  const { addItem: addToCart } = useCart();
  const { addNotification } = useNotification();

  const [stockStatuses, setStockStatuses] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const checkStockStatus = async () => {
    if (favoriteItems.length === 0) {
      setStockStatuses({});
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const results = await Promise.all(
        favoriteItems.map(async (item) => {
          const parts = item.id.split("-");
          const ref = parts.slice(0, -1).join("-");
          const variantType = parts.slice(-1)[0];

          try {
            // Используем тот же endpoint, но передаем ref вместо категории
            const res = await fetch(`/api/product/${ref}`);
            if (!res.ok) throw new Error("Product not found");
            const productData = await res.json();

            const matchingVariant = productData.variants?.find(
              (v: any) => v.type === variantType
            );

            return { itemId: item.id, inStock: !!matchingVariant?.nalichie };
          } catch (error) {
            return { itemId: item.id, inStock: false };
          }
        })
      );

      const stockMap: Record<string, boolean> = {};
      results.forEach((r) => (stockMap[r.itemId] = r.inStock));
      setStockStatuses(stockMap);
    } catch (error) {
      const fallback: Record<string, boolean> = {};
      favoriteItems.forEach((item) => (fallback[item.id] = false));
      setStockStatuses(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStockStatus();
  }, [favoriteItems]);

  useEffect(() => {
    const interval = setInterval(checkStockStatus, 60000);
    return () => clearInterval(interval);
  }, [favoriteItems]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkStockStatus();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [favoriteItems]);

  const handleAddToCart = async (item: any) => {
    const parts = item.id.split("-");
    const ref = parts.slice(0, -1).join("-");
    const variantType = parts.slice(-1)[0];

    try {
      // Используем тот же endpoint
      const res = await fetch(`/api/product/${ref}`);
      if (!res.ok) throw new Error("Product not found");
      const productData = await res.json();

      const matchingVariant = productData.variants?.find(
        (v: any) => v.type === variantType
      );

      if (!matchingVariant?.nalichie) {
        addNotification({
          type: "error",
          title: "Товар недоступен",
          message: "К сожалению, этот товар закончился",
          duration: 3000,
        });
        return;
      }

      addToCart({
        id: item.id,
        ref: ref,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
        variant: item.variant,
      });

      addNotification({
        type: "success",
        title: "Товар добавлен в корзину",
        message: item.name,
        duration: 2000,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Ошибка проверки товара",
        message: "Не удалось проверить наличие товара. Попробуйте позже.",
        duration: 3000,
      });
    }
  };

  const handleRemoveFromFavorites = (id: string, itemName: string) => {
    removeItem(id);
    addNotification({
      type: "info",
      title: "Удалено из избранного",
      message: itemName,
      duration: 2000,
    });
  };

  if (favoriteItems.length === 0) {
    return (
      <section className={styles.wishlist}>
        <div className={styles.wishlist__empty}>
          <Image
            src="/wishlist/wishlist.svg"
            alt="Избранное пусто"
            width={100}
            height={100}
            className={styles.wishlist__emptyIcon}
          />
          <h2 className={styles.wishlist__emptyTitle}>
            В избранном пока пусто
          </h2>
          <p className={styles.wishlist__emptyText}>
            Добавляйте товары в избранное, чтобы не потерять их
          </p>
          <Link
            href="/catalog/iqos"
            className={styles.wishlist__continueShopping}
          >
            Продолжить покупки
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wishlist}>
      <div className={styles.wishlist__header}>
        <div className={styles.wishlist__headerActions}>
          <button className={styles.wishlist__clear} onClick={clearFavorites}>
            Очистить избранное
          </button>
        </div>
      </div>

      <div className={styles.wishlistTable}>
        <div className={styles.wishlistTable__header}>
          <div className={styles.wishlistTable__col}>Товар</div>
          <div className={styles.wishlistTable__col}>Цена</div>
          <div className={styles.wishlistTable__col}>Наличие</div>
          <div className={styles.wishlistTable__col}>Действия</div>
        </div>

        <div className={styles.wishlistTable__body}>
          {favoriteItems.map((item) => (
            <div key={item.id} className={styles.wishlistTable__row}>
              <div className={styles.wishlistTable__col}>
                <div className={styles.productInfo}>
                  <div className={styles.productInfo__image}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={60}
                      height={60}
                      className={styles.productInfo__img}
                    />
                  </div>
                  <div className={styles.productInfo__details}>
                    <h3 className={styles.productInfo__name}>{item.name}</h3>
                    {item.variant && (
                      <p className={styles.productInfo__variant}>
                        {item.variant.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.wishlistTable__col}>
                <div className={styles.productPrice}>
                  {item.price.toLocaleString("ru-RU")} ₽
                </div>
              </div>

              <div className={styles.wishlistTable__col}>
                <div
                  className={`${styles.stockStatus} ${
                    stockStatuses[item.id]
                      ? styles.stockStatus_inStock
                      : styles.stockStatus_outOfStock
                  } ${loading ? styles.stockStatus_loading : ""}`}
                >
                  {loading
                    ? "Проверка..."
                    : stockStatuses[item.id]
                    ? "В наличии"
                    : "Нет в наличии"}
                </div>
              </div>

              <div className={styles.wishlistTable__col}>
                <div className={styles.productActions}>
                  <button
                    className={styles.productActions__addToCart}
                    onClick={() => handleAddToCart(item)}
                    disabled={!stockStatuses[item.id] || loading}
                  >
                    {loading ? "..." : "В корзину"}
                  </button>
                  <button
                    className={styles.productActions__remove}
                    onClick={() =>
                      handleRemoveFromFavorites(item.id, item.name)
                    }
                    title="Удалить"
                  >
                    <Image
                      src="/cart/delete.svg"
                      alt="Удалить"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.wishlistCards}>
        {favoriteItems.map((item) => (
          <div key={item.id} className={styles.wishlistCard}>
            <div className={styles.wishlistCard__header}>
              <div className={styles.wishlistCard__image}>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className={styles.wishlistCard__img}
                />
              </div>
              <div className={styles.wishlistCard__info}>
                <h3 className={styles.wishlistCard__name}>{item.name}</h3>
                {item.variant && (
                  <p className={styles.wishlistCard__variant}>
                    {item.variant.name}
                  </p>
                )}
                <div className={styles.wishlistCard__price}>
                  {item.price.toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <button
                className={styles.wishlistCard__remove}
                onClick={() => handleRemoveFromFavorites(item.id, item.name)}
              >
                <Image
                  src="/cart/delete.svg"
                  alt="Удалить"
                  width={18}
                  height={18}
                />
              </button>
            </div>

            <div className={styles.wishlistCard__footer}>
              <div
                className={`${styles.wishlistCard__stock} ${
                  stockStatuses[item.id]
                    ? styles.wishlistCard__stock_inStock
                    : styles.wishlistCard__stock_outOfStock
                } ${loading ? styles.wishlistCard__stock_loading : ""}`}
              >
                {loading
                  ? "Проверка..."
                  : stockStatuses[item.id]
                  ? "В наличии"
                  : "Нет в наличии"}
              </div>
              <button
                className={styles.wishlistCard__addToCart}
                onClick={() => handleAddToCart(item)}
                disabled={!stockStatuses[item.id] || loading}
              >
                {loading ? "..." : "В корзину"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.wishlist__footer}>
        <Link
          href="/catalog/iqos"
          className={styles.wishlist__continueShopping}
        >
          Продолжить покупки
        </Link>
      </div>
    </section>
  );
}

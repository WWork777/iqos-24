"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import styles from "./cart.module.scss";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

// Минимальные требования для заказа
const MIN_PACKS_FOR_DELIVERY = 10;
const MIN_BLOCKS_FOR_DELIVERY = 1;
const MIN_ORDER_AMOUNT = 3500;

const Cart: FC<CartProps> = ({ isOpen, onClose }) => {
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

  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCart();
  const [isOrdering, setIsOrdering] = useState(false);
  const router = useRouter();

  // Функция для проверки минимального количества товаров и суммы
  const canOrderDelivery = () => {
    const totalPacks = items.reduce((sum, item) => {
      const isPack =
        item.name.toLowerCase().includes("пачка") ||
        item.name.toLowerCase().includes("sticks");
      return isPack ? sum + item.quantity : sum;
    }, 0);

    const totalBlocks = items.reduce((sum, item) => {
      const isBlock =
        item.name.toLowerCase().includes("блок") ||
        item.name.toLowerCase().includes("block");
      return isBlock ? sum + item.quantity : sum;
    }, 0);

    return (
      totalPacks >= MIN_PACKS_FOR_DELIVERY ||
      totalBlocks >= MIN_BLOCKS_FOR_DELIVERY ||
      totalPrice >= MIN_ORDER_AMOUNT
    );
  };

  // Функция для подсчета текущего количества пачек и блоков
  const getProductCounts = () => {
    const packs = items.reduce((sum, item) => {
      const isPack =
        item.name.toLowerCase().includes("пачка") ||
        item.name.toLowerCase().includes("sticks");
      return isPack ? sum + item.quantity : sum;
    }, 0);

    const blocks = items.reduce((sum, item) => {
      const isBlock =
        item.name.toLowerCase().includes("блок") ||
        item.name.toLowerCase().includes("block");
      return isBlock ? sum + item.quantity : sum;
    }, 0);

    return { packs, blocks };
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleOrder = () => {
    // if (!canOrderDelivery()) {
    //   alert("Для заказа доставки необходимо минимум 10 пачек или 1 блок");
    //   return;
    // }

    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      onClose();
      router.push("/checkout");
    }, 1000);
  };

  const { packs, blocks } = getProductCounts();
  const canDeliver = canOrderDelivery();

  return (
    <div
      className={`${styles.cartOverlay} ${isOpen ? styles.open : ""}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.cart}>
        <div className={styles.cart__header}>
          <h2 className={styles.cart__title}>Корзина</h2>
          <button className={styles.cart__close} onClick={onClose}>
            <Image
              src="/productCard/close.svg"
              alt="Закрыть"
              width={35}
              height={35}
            />
          </button>
        </div>

        <div className={styles.cart__content}>
          {items.length === 0 ? (
            <div className={styles.cart__empty}>
              <Image
                src="/cart/empty.svg"
                alt="Корзина пуста"
                width={100}
                height={100}
              />
              <p>Ваша корзина пуста!</p>
              <button
                className={styles.cart__continueShopping}
                onClick={onClose}
              >
                Продолжить покупки
              </button>
            </div>
          ) : (
            <>
              <div className={styles.cart__items}>
                {/* Сообщение о минимальном количестве для доставки */}
                {!canDeliver && (
                  <div className={styles.deliveryWarning}>
                    <div className={styles.deliveryWarningIcon}>🚫</div>
                    <div className={styles.deliveryWarningText}>
                      <p className={styles.currentCount}>
                        Доставка доступна от 1 блока или 10 пачек или 3500
                        рублей
                      </p>
                    </div>
                  </div>
                )}

                {/* Отображение количества пачек и блоков */}

                {items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItem__image}>
                      <Image
                        src={encodeImageUrl(item.imageUrl)}
                        alt={item.name}
                        width={100}
                        height={100}
                      />
                    </div>

                    <div className={styles.cartItem__info}>
                      <h4 className={styles.cartItem__name}>{item.name}</h4>
                      {item.variant && (
                        <p className={styles.cartItem__variant}>
                          {item.variant.name}
                        </p>
                      )}
                      <p className={styles.cartItem__price}>
                        {item.price.toLocaleString("ru-RU")} ₽
                      </p>
                    </div>

                    <div className={styles.cartItem__controls}>
                      <div className={styles.cartItem__quantity}>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className={styles.cartItem__quantityBtn}
                        >
                          -
                        </button>
                        <span className={styles.cartItem__quantityValue}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className={styles.cartItem__quantityBtn}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className={styles.cartItem__remove}
                      >
                        <Image
                          src="/cart/delete.svg"
                          alt="Удалить"
                          width={25}
                          height={25}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cart__footer}>
                <div className={styles.cart__total}>
                  <span>Итого:</span>
                  <span className={styles.cart__totalPrice}>
                    {totalPrice.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <div className={styles.cart__actions}>
                  <button className={styles.cart__clear} onClick={clearCart}>
                    Очистить корзину
                  </button>
                  <button
                    className={`${styles.cart__order}`}
                    onClick={handleOrder}
                    disabled={isOrdering }
                  >
                    {isOrdering
                      ? "Оформляем..."
                      : "Оформить заказ"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

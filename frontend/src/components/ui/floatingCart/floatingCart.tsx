"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Cart from "../cart/cart";
import styles from "./floatingCart.module.scss";

const FloatingCart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <>
      <div className={styles.floatingCart} onClick={() => setIsCartOpen(true)}>
        <div className={styles.floatingCart__icon}>
          <Image
            src="/header/backet.svg"
            alt="Корзина"
            width={24}
            height={24}
          />
          {totalItems > 0 && (
            <span className={styles.floatingCart__badge}>
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </div>
        <div className={styles.floatingCart__info}>
          <div className={styles.floatingCart__price}>
            {totalPrice.toLocaleString("ru-RU")} ₽
          </div>
          <div className={styles.floatingCart__items}>
            {totalItems} {getItemsText(totalItems)}
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

const getItemsText = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "товаров";
  }

  if (lastDigit === 1) {
    return "товар";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "товара";
  }

  return "товаров";
};

export default FloatingCart;

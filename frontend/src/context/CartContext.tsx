// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType } from "@/types/cart/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cart";
const CART_EXPIRATION_KEY = "cart_expiration";
const CART_TTL = 30 * 60 * 1000;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Загружаем корзину из localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const expiration = localStorage.getItem(CART_EXPIRATION_KEY);

      if (savedCart && expiration) {
        const now = Date.now();
        if (now < Number(expiration)) {
          setItems(JSON.parse(savedCart));
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
          localStorage.removeItem(CART_EXPIRATION_KEY);
        }
      }
    } catch (err) {}
  }, []);

  // Сохраняем корзину в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(
        CART_EXPIRATION_KEY,
        (Date.now() + CART_TTL).toString()
      );
    } catch (err) {}
  }, [items]);

  const addItem = (itemData: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemData.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemData.id
            ? { ...item, quantity: item.quantity + itemData.quantity }
            : item
        );
      } else {
        return [...prevItems, itemData];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

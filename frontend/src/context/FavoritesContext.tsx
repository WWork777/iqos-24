// context/FavoritesContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FavoriteItem,
  FavoritesContextType,
} from "@/types/favorites/favorites";
import { generateProductId } from "@/utils/productId";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setItems(JSON.parse(savedFavorites));
      } catch (error) {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(items));
  }, [items]);

  const addItem = (item: FavoriteItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (prevItem) => prevItem.id === item.id
      );
      if (!existingItem) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearFavorites = () => {
    setItems([]);
  };

  const totalItems = items.length;

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isFavorite,
        clearFavorites,
        totalItems,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

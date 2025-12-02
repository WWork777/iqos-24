export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  variant?: {
    type: "pack" | "block";
    name: string;
  };
}

export interface FavoritesContextType {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  totalItems: number;
}

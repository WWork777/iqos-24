// types/cart/cart.ts
export interface CartItem {
  id: string;
  ref: string; // Добавляем поле ref
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variant?: {
    type: "pack" | "block";
    name: string;
  };
}

export interface CartContextType {
  items: CartItem[];
  addItem: (itemData: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

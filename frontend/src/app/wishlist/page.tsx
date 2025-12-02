import WishlistLayout from "@/components/wishlist/wishlistLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Избранное | Iqos-24",
  description: "Ваш список избранных товаров IQOS Iluma и TEREA",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Избранное | Iqos-24",
    description: "Ваш список избранных товаров",
    url: "https://iqos-24.ru/wishlist",
  },
};

export default function WishList() {
  return <WishlistLayout />;
}

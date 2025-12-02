import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Montserrat } from "next/font/google";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Notification from "@/components/ui/notification/notification";
import FloatingCart from "@/components/ui/floatingCart/floatingCart";
import AgeGate from "@/components/ui/AgeModal/AgeGate";
import YandexMetrika from "@/components/YandexMetrika/YandexMetrika";

const roboto = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Iqos-24",
  icons: {
    icon: [
      { rel: "icon", type: "image/svg+xml", url: "/favicon/favicon.svg" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/favicon/favicon-32x32.png",
      },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <NotificationProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              <AgeGate>{children}</AgeGate>
              <Notification />
              <FloatingCart />
              <Footer />
              <YandexMetrika />
            </FavoritesProvider>
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

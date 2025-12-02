"use client";
import BreadCrumbs from "../common/breadcrums";
import WishlistList from "./wishlistList/wishlistlist";

export default function WishlistLayout() {
  return (
    <section className="hero-container">
      <div className={"second_page_header"}>
        <h1>Избранное</h1>
        <BreadCrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Избранное" }]}
        />
      </div>
      <WishlistList />
    </section>
  );
}

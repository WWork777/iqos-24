import Link from "next/link";
import styles from "./exclusive.module.scss";
import Image from "next/image";

export default function Exclusive() {
  return (
    <section className="container">
      <div className={styles.exclusive_container}>
        <div className={styles.exclusive_text}>
          <p>Не пропустите!!</p>
          <h3>Iqos Iluma i Prime Minera</h3>
          <span>Эксклюзив</span>
          <Link href="/product/i-Prime-Minera">Купить</Link>
        </div>
        <div className={styles.exclusive_iamge}>
          <Image
            src="/sales/sale4.webp"
            alt="Iluma Minera"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </section>
  );
}

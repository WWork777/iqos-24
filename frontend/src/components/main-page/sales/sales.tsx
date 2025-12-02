import Link from "next/link";
import styles from "./sales.module.scss";
import Image from "next/image";

export default function Sales() {
  return (
    <section className="container">
      <div className={styles.sales__container}>
        <div className={styles.sales_top}>
          <h2>Iqos Iluma I One</h2>
          <p>СКИДКА 15%</p>
          <span>
            Нагреватель табака Iqos Iluma i One Midnight Black - новинка от IQOS
            с единым пластиковым корпусом без чехла и бесконтактной системой
            нагрева табака, что исключает поломку нагревательного элемента
            механическим способом
          </span>
          <Link href="/catalog/iqos/one">Купить</Link>
          <Image
            src="/sales/sale1.webp"
            alt="iluma i one"
            width={1920}
            height={1080}
          />
        </div>
        <div className={styles.sales_bottom}>
          <div className={styles.sales_bottom__left}>
            <Image
              src="/sales/sale2.webp"
              alt="iluma Standart"
              width={1920}
              height={1080}
            />
            <h2>Iqos Iluma Standart</h2>
            <p>СКИДКА 15%</p>
            <span>Новинка от IQOS</span>
            <Link href="/catalog/iqos/standart">Купить</Link>
          </div>
          <div className={styles.salse_bottom__right}>
            <Image
              src="/sales/sale3.webp"
              alt="iluma Standart"
              width={1920}
              height={1080}
            />
            <h2>Iqos Iluma Standart I</h2>
            <p>новинка от IQOS</p>
            <span>Скидка 15%</span>
            <Link href="/catalog/iqos/standarti">Купить</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

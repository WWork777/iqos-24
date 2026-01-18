"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./checkout.module.scss";

type DeliveryMethod = "pickup" | "delivery";

// Константы для Telegram бота
const TELEGRAM_BOT_TOKEN = "7364548522:AAGpn05pGfX3rqtu8if1BDxILlbtOUGHbeA";
const TELEGRAM_CHAT_ID = "-1002155675591";

// Минимальные требования для заказа
const MIN_PACKS_FOR_DELIVERY = 10;
const MIN_BLOCKS_FOR_DELIVERY = 1;
const MIN_ORDER_AMOUNT = 3500; // 3.5 тысячи рублей

export default function CheckoutPage() {
  function encodeImageUrl(url: string): string {
    if (!url) return "https://placehold.net/600x600.png";

    try {
      // Если это абсолютный URL
      if (url.startsWith("http")) {
        const urlObj = new URL(url);
        urlObj.pathname = encodeURI(urlObj.pathname);
        return urlObj.toString();
      }

      // Если это относительный путь
      const parts = url.split("/");
      const encodedParts = parts.map((part) =>
        part.includes("%") || part === "" ? part : encodeURIComponent(part),
      );
      return encodedParts.join("/");
    } catch (error) {
      console.warn("Error encoding image URL:", url, error);
      return "https://placehold.net/600x600.png"; // 🔥 Всегда возвращаем fallback при ошибке
    }
  }
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery"); // По умолчанию доставка
  const [agreementChecked, setAgreementChecked] = useState(false); // Добавлено состояние для чекбокса

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    tg: "",
    city: "",
    address: "",
  });

  const pickupAddress = "г. Москва, ул. Примерная, д. 123, офис 45";

  // Функция для проверки минимального количества товаров и суммы
  const canOrderDelivery = () => {
    const totalPacks = items.reduce((sum, item) => {
      // Предполагаем, что товары с определенными категориями или названиями являются пачками
      const isPack =
        item.name.toLowerCase().includes("пачка") ||
        item.name.toLowerCase().includes("sticks");
      return isPack ? sum + item.quantity : sum;
    }, 0);

    const totalBlocks = items.reduce((sum, item) => {
      // Предполагаем, что товары с определенными категориями или названиями являются блоками
      const isBlock =
        item.name.toLowerCase().includes("блок") ||
        item.name.toLowerCase().includes("block");
      return isBlock ? sum + item.quantity : sum;
    }, 0);

    // Проверяем все условия: достаточно пачек ИЛИ достаточно блоков ИЛИ сумма заказа достаточна
    return (
      totalPacks >= MIN_PACKS_FOR_DELIVERY ||
      totalBlocks >= MIN_BLOCKS_FOR_DELIVERY ||
      totalPrice >= MIN_ORDER_AMOUNT
    );
  };

  // Функция для получения причины недоступности доставки
  const getDeliveryRestrictionReason = () => {
    const { packs, blocks } = getProductCounts();
    const reasons = [];

    if (packs < MIN_PACKS_FOR_DELIVERY) {
      reasons.push(`${MIN_PACKS_FOR_DELIVERY} пачек`);
    }
    if (blocks < MIN_BLOCKS_FOR_DELIVERY) {
      reasons.push(`${MIN_BLOCKS_FOR_DELIVERY} блок`);
    }
    if (totalPrice < MIN_ORDER_AMOUNT) {
      reasons.push(`${MIN_ORDER_AMOUNT.toLocaleString("ru-RU")} ₽`);
    }

    return reasons.length > 0
      ? `Для заказа доставки необходимо минимум ${reasons.join(" ИЛИ ")}`
      : null;
  };

  // Функция для подсчета текущего количества пачек и блоков
  const getProductCounts = () => {
    const packs = items.reduce((sum, item) => {
      const isPack =
        item.name.toLowerCase().includes("пачка") ||
        item.name.toLowerCase().includes("sticks");
      return isPack ? sum + item.quantity : sum;
    }, 0);

    const blocks = items.reduce((sum, item) => {
      const isBlock =
        item.name.toLowerCase().includes("блок") ||
        item.name.toLowerCase().includes("block");
      return isBlock ? sum + item.quantity : sum;
    }, 0);

    return { packs, blocks };
  };

  // Функция для отправки уведомления в Telegram
  const sendTelegramNotification = async (orderData: any) => {
    try {
      // Формируем красивое сообщение для Telegram
      const message = `
заказ с сайта iqos-24.ru


Имя: ${orderData.customer_name}
Телефон: ${orderData.phone_number}
Telegram: ${orderData.tg_username}
Способ доставки: ${orderData.is_delivery ? "Доставка" : "Самовывоз"}

${
  orderData.is_delivery
    ? `
 Город: ${orderData.city}
 Адрес: ${orderData.address}`
    : ``
}

Корзина:
${orderData.ordered_items
  .map(
    (item: any, index: number) =>
      `• ${item.product_name} x${
        item.quantity
      }: ${item.price_at_time_of_order.toLocaleString("ru-RU")} ₽`,
  )
  .join("\n")}

 *Общая сумма:* ${totalPrice.toLocaleString("ru-RU")} ₽
      `.trim();

      // Отправляем сообщение в Telegram
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка отправки в Telegram:", errorData);
        throw new Error("Не удалось отправить уведомление в Telegram");
      }

      return true;
    } catch (error) {
      console.error("❌ Ошибка при отправке в Telegram:", error);
      // Не прерываем основной поток оформления заказа из-за ошибки Telegram
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue = "+7 ";
      if (value.length > 1) {
        formattedValue += `(${value.substring(1, 4)}`;
      }
      if (value.length > 4) {
        formattedValue += `) ${value.substring(4, 7)}`;
      }
      if (value.length > 7) {
        formattedValue += `-${value.substring(7, 9)}`;
      }
      if (value.length > 9) {
        formattedValue += `-${value.substring(9, 11)}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      phone: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Валидация
    if (!formData.name.trim()) {
      alert("Пожалуйста, введите ваше имя");
      setIsSubmitting(false);
      return;
    }

    if (
      !formData.phone.trim() ||
      formData.phone.replace(/\D/g, "").length < 11
    ) {
      alert("Пожалуйста, введите корректный номер телефона");
      setIsSubmitting(false);
      return;
    }

    // Проверка согласия с политикой
    if (!agreementChecked) {
      alert(
        "Пожалуйста, согласитесь с политикой конфиденциальности и пользовательским соглашением",
      );
      setIsSubmitting(false);
      return;
    }

    // Проверка минимального количества для доставки
    if (deliveryMethod === "delivery" && !canOrderDelivery()) {
      const restrictionReason = getDeliveryRestrictionReason();
      alert(restrictionReason || "Недостаточно товаров для заказа доставки");
      setIsSubmitting(false);
      return;
    }

    if (deliveryMethod === "delivery") {
      if (!formData.city.trim()) {
        alert("Пожалуйста, введите город");
        setIsSubmitting(false);
        return;
      }
      if (!formData.address.trim()) {
        alert("Пожалуйста, введите адрес доставки");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const orderPayload = {
        customer_name: formData.name,
        phone_number: formData.phone.replace(/\D/g, ""),
        tg_username: formData.tg,
        is_delivery: deliveryMethod === "delivery",
        city: formData.city || "",
        address: formData.address || "",
        ordered_items: items.map((item) => ({
          product_name: item.name,
          quantity: item.quantity,
          price_at_time_of_order: item.price,
        })),
      };

      // 🔥 Отправляем заказ на бэкенд
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Ошибка отправки заказа на сервер");
      }

      // 🔥 Отправляем уведомление в Telegram
      const telegramSent = await sendTelegramNotification(orderPayload);

      if (!telegramSent) {
        console.warn(
          "⚠️ Заказ сохранен, но уведомление в Telegram не отправлено",
        );
        // Продолжаем выполнение, так как основной заказ сохранен
      }

      clearCart();
      router.push("/order-success");
    } catch (error) {
      console.error(error);
      alert("Не удалось отправить заказ. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Добавляем noindex метатег
  useEffect(() => {
    // Создаем meta тег для noindex
    const metaNoindex = document.createElement("meta");
    metaNoindex.name = "robots";
    metaNoindex.content = "noindex, nofollow";
    document.head.appendChild(metaNoindex);

    // Очистка при размонтировании компонента
    return () => {
      document.head.removeChild(metaNoindex);
    };
  }, []);

  const { packs, blocks } = getProductCounts();
  const canDeliver = canOrderDelivery();
  const restrictionReason = getDeliveryRestrictionReason();

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyCartContent}>
          <Image
            src="/cart/empty.svg"
            alt="Корзина пуста"
            width={150}
            height={150}
          />
          <h2>Корзина пуста</h2>
          <p>Добавьте товары в корзину для оформления заказа</p>
          <button
            className={styles.continueShopping}
            onClick={() => router.push("/catalog")}
          >
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-container">
      <div className={styles.container}>
        <h1 className={styles.title}>
          Оформление заказа
          <br />
          <span className={styles.subtitle}>
            ВАЖНО! Укажите Ваш номер в WhatsApp или Telegram ник для связи
          </span>
        </h1>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.orderForm}>
              <div className={styles.formGroup}>
                <h3>Контактные данные</h3>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="telegram">Telegram</label>
                  <input
                    // type="tel"
                    id="tg"
                    name="tg"
                    value={formData.tg}
                    onChange={handleInputChange}
                    // required
                    placeholder="@Alena_ilumastoreRUS"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <h3>Способ получения</h3>

                {/* Сообщение о недоступности самовывоза */}
                <div className={styles.pickupDisabled}>
                  <div className={styles.pickupDisabledIcon}>⚠️</div>
                  <div className={styles.pickupDisabledText}>
                    <strong>Самовывоз временно недоступен</strong>
                    <p>В данный момент доступна только доставка</p>
                  </div>
                </div>

                {/* Сообщение о минимальном количестве для доставки */}
                {!canDeliver && (
                  <div className={styles.deliveryWarning}>
                    <div className={styles.deliveryWarningIcon}>🚫</div>
                    <div className={styles.deliveryWarningText}>
                      <p className={styles.currentCount}>
                        Доставка доступна от 1 блока или 10 пачек
                      </p>
                    </div>
                  </div>
                )}

                <div className={styles.deliveryMethods}>
                  {/* Самовывоз - заблокирован */}
                  <label className={`${styles.deliveryMethod}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={deliveryMethod === "pickup"}
                      disabled
                      onChange={(e) =>
                        setDeliveryMethod(e.target.value as DeliveryMethod)
                      }
                    />
                    <span className={styles.radioCustom}></span>
                    <div className={styles.deliveryInfo}>
                      <span className={styles.deliveryTitle}>Самовывоз</span>
                      <span className={styles.deliveryDescription}>
                        Временно недоступен
                      </span>
                    </div>
                  </label>

                  {/* Доставка - может быть заблокирована */}
                  <label
                    className={`${styles.deliveryMethod} ${
                      !canDeliver ? styles.disabled : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={deliveryMethod === "delivery"}
                      disabled={!canDeliver}
                      onChange={(e) =>
                        setDeliveryMethod(e.target.value as DeliveryMethod)
                      }
                    />
                    <span className={styles.radioCustom}></span>
                    <div className={styles.deliveryInfo}>
                      <span className={styles.deliveryTitle}>Доставка</span>
                      <span className={styles.deliveryDescription}>
                        {canDeliver
                          ? "Стоимость уточняется"
                          : `Минимум ${MIN_PACKS_FOR_DELIVERY} пачек ИЛИ ${MIN_BLOCKS_FOR_DELIVERY} блок ИЛИ ${MIN_ORDER_AMOUNT.toLocaleString(
                              "ru-RU",
                            )} ₽`}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Блок с полями для доставки */}
                {deliveryMethod === "delivery" && canDeliver && (
                  <div className={styles.deliveryFields}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="city">Город *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Введите город"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="address">Адрес доставки *</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Введите адрес доставки"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Блок согласия с политикой */}
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  required
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                />
                <span className={styles.checkboxText}>
                  Я соглашаюсь с{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className={styles.link}
                  >
                    политикой конфиденциальности
                  </a>{" "}
                  и{" "}
                  <a href="/terms" target="_blank" className={styles.link}>
                    пользовательским соглашением
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !agreementChecked}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner}></div>
                    Оформляем заказ...
                  </>
                ) : !agreementChecked ? (
                  "Примите соглашение"
                ) : (
                  `Оформить заказ · ${totalPrice.toLocaleString("ru-RU")} ₽`
                )}
              </button>
            </form>
          </div>

          <div className={styles.cartSection}>
            <div className={styles.cartItems}>
              <h3>Ваш заказ</h3>

              {/* Отображение количества пачек, блоков и суммы */}

              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemImage}>
                    <Image
                      src={encodeImageUrl(item.imageUrl)}
                      alt={item.name}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className={styles.cartItemInfo}>
                    <h4 className={styles.cartItemName}>{item.name}</h4>
                    {item.variant && (
                      <p className={styles.cartItemVariant}>
                        {item.variant.name}
                      </p>
                    )}
                    <div className={styles.cartItemDetails}>
                      <span className={styles.cartItemQuantity}>
                        {item.quantity} шт.
                      </span>
                      <span className={styles.cartItemPrice}>
                        {item.price.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.orderSummary}>
              <h3>Итоги заказа</h3>
              <div className={styles.summaryRow}>
                <span>
                  Товары ({items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  шт.)
                </span>
                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Доставка</span>
                <span>
                  {canDeliver ? "Рассчитывается отдельно" : "Недоступна"}
                </span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Итого</span>
                <span className={styles.totalPrice}>
                  {totalPrice.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

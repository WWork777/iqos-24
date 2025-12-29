'use client'
import { useEffect, useState } from 'react';
import styles from "./PromotionModal.module.scss"

const PromotionModal = ({ allowClose = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Устанавливаем таймер на 3 секунды
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    // Очищаем таймер при размонтировании компонента
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Функция для полного закрытия
  const handleClose = () => {
    setIsVisible(false);
    // Вызываем колбэк из родителя
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {allowClose && (
          <button 
            className={styles.closeButton}
            onClick={handleClose} // Используем handleClose вместо setIsVisible(false)
            aria-label="Закрыть уведомление"
          >
            &times;
          </button>
        )}
        <a href="/catalog/iqos?brand=standart">
          <div className={styles.leftHalf}>
            <h2>Новогодние Скидки</h2>
            <p>До конца года вы можете приобрести продукцию Iluma Standart и Iluma Prime со скидкой</p>
          </div>
          <div className={styles.rightHalf}>
            <img src="/Promotion/promo.png" alt="" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default PromotionModal;
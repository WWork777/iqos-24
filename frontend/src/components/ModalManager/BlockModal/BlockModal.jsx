'use client';
import { useEffect, useState } from 'react';
import styles from "./BlockModal.module.scss"

const BlockModal = ({ allowClose = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Форматирование текущей даты
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    // Блокировка скролла
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Исправленная функция закрытия
  const handleClose = () => {
    setIsVisible(false);
    // Вызываем колбэк onClose, если он передан
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
            onClick={handleClose} // Изменено с setIsVisible(false) на handleClose
            aria-label='Закрыть уведомление'
          >
            &times;
          </button>
        )}
        <h2>График работы в праздничные дни</h2>

        <p>
          С 1 по 3 января включительно наш магазин работать не будет.<br/> Планируйте покупки заблаговременно.
        </p>

        {/* <p>
          Сегодня <strong>{currentDate}</strong> наш магазин начнет работать с{' '}
          <strong>14:00</strong> по московскому времени. Желаем всем отличного
          дня!{' '}
        </p> */}

        <button className={styles.continueButton}
          onClick={handleClose} // Изменено с setIsVisible(false) на handleClose
          aria-label='Закрыть уведомление'>
            Понятно</button>
      </div>
    </div>
  );
};

export default BlockModal;
'use client'
import { useEffect, useState } from 'react';
import './BlockModal.scss';

const BlockModal = ({ allowClose = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    // Форматирование текущей даты
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setCurrentDate(formattedDate);
    
    // Блокировка скролла
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {allowClose && (
          <button 
            className="closeButton"
            onClick={() => setIsVisible(false)}
            aria-label="Закрыть уведомление"
          >
            &times;
          </button>
        )}
        <h2>Сайт временно не работает</h2>
        <p>Сегодня <strong>{currentDate}</strong> наш магазин по техническим причинам не работает. Принимаем заказы на завтра и желаем всем отличного дня!</p>
      </div>
    </div>
  );
};

export default BlockModal;
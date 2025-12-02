'use client'
import { useEffect, useState } from 'react';
import './PromotionModal.scss';

const PromotionModal = ({ allowClose = false }) => {
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
        <a href="/catalog/iqos?brand=standart">
          <div className='leftHalf'>
            <h2>Новогодние Скидки</h2>
            <p>До конца года вы можете приобрести продукцию Iluma Standart и Iluma Prime со скидкой</p>
          </div>
          <div className='rightHalf'>
            <img src="/Promotion/promo.png" alt="" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default PromotionModal;
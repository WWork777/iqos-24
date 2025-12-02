"use client";

import { FC } from "react";
import styles from "./AgeModal.module.scss";

interface AgeModalProps {
  onConfirm: (isAdult: boolean) => void;
}

const AgeModal: FC<AgeModalProps> = ({ onConfirm }) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Подтвердите ваш возраст</h2>
        <p>Вам должно быть больше 18 лет, чтобы продолжить.</p>
        <div className={styles.buttons}>
          <button className={styles.yes} onClick={() => onConfirm(true)}>
            Да
          </button>
          <button className={styles.no} onClick={() => onConfirm(false)}>
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeModal;

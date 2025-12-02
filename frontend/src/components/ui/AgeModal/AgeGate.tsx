"use client";

import { FC, useState, useEffect, ReactNode } from "react";
import AgeModal from "../AgeModal/AgeModal";

interface AgeGateProps {
  children: ReactNode;
}

const AGE_CONFIRM_KEY = "ageConfirmedAt";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 3 дня в миллисекундах

const AgeGate: FC<AgeGateProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const lastConfirmed = localStorage.getItem(AGE_CONFIRM_KEY);
    const now = new Date().getTime();

    if (!lastConfirmed || now - Number(lastConfirmed) > THREE_DAYS_MS) {
      setShowModal(true);
    }
  }, []);

  const handleConfirm = (isAdult: boolean) => {
    if (isAdult) {
      const now = new Date().getTime();
      localStorage.setItem(AGE_CONFIRM_KEY, now.toString());
      setShowModal(false);
    } else {
      window.location.href = "https://www.google.com";
    }
  };

  if (showModal) return <AgeModal onConfirm={handleConfirm} />;
  return <>{children}</>;
};

export default AgeGate;

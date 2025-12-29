'use client';
import { useEffect, useState } from 'react';
import PromotionModal from './PromotionModal/PromotionModal';
import BlockModal from './BlockModal/BlockModal';

const ModalManager = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = нет модалок, 1 = блок, 2 = промо
  
  useEffect(() => {
    setCurrentStep(1);
  }, []);

  const handleCloseBlock = () => {
    setCurrentStep(2);
  };

  const handleClosePromo = () => {
    setCurrentStep(0);
  };

  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(() => {

      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <>
      {currentStep === 1 && (
        <BlockModal 
          allowClose={false} 
          onClose={handleCloseBlock}
        />
      )}
      
      {currentStep === 2 && (
        <PromotionModal 
          allowClose={true}
          onClose={handleClosePromo}
        />
      )}
    </>
  );
};

export default ModalManager;
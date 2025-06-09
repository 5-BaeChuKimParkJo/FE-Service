'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import {
  Step1ProductDetails,
  Step2AuctionSettings,
  Step3Preview,
} from './steps';
import {
  AuctionStepperHeader,
  AuctionProgressIndicator,
  AuctionNavigationFooter,
} from './navigation';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function AuctionStepperContainer() {
  const { currentStep, prevStep, nextStep } = useCreateAuctionStore();
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = () => {
    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProductDetails key='step1' />;
      case 2:
        return <Step2AuctionSettings key='step2' />;
      case 3:
        return <Step3Preview key='step3' />;
      default:
        return <Step1ProductDetails key='step1' />;
    }
  };

  return (
    <>
      <AuctionStepperHeader onPrevStep={handlePrev} />

      <AuctionProgressIndicator />

      <main
        className='flex-1 overflow-hidden'
        role='main'
        aria-label='경매 등록 단계'
      >
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className='h-full'
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AuctionNavigationFooter
        onPrevStep={handlePrev}
        onNextStep={handleNext}
      />
    </>
  );
}

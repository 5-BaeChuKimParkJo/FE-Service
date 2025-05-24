'use client';

import { useRegisterStore } from '@/store/use-register-store';

export function useStepAnimation() {
  const stepVariants = {
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

  const direction = useRegisterStore((state) => {
    const prevStep = state.prevStep || 0;
    return state.currentStep > prevStep ? 1 : -1;
  });

  const transition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  };

  return { stepVariants, direction, transition };
}

'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useRegisterStore } from '@/stores/use-register-store';
import { createRegistrationService } from '@/services/registration.service';

export function useRegistration() {
  const router = useRouter();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showWhaleTransition, setShowWhaleTransition] = useState(false);
  const {
    currentStep,
    setCurrentStep,
    stepOneValid,
    stepTwoValid,
    setIsSubmitting,
  } = useRegisterStore();

  const registrationService = useMemo(
    () =>
      createRegistrationService({
        router,
        setShowWelcomeDialog,
        setShowWhaleTransition,
        setIsSubmitting,
      }),
    [router, setIsSubmitting],
  );

  const handleNext = () => {
    if (
      (currentStep === 0 && stepOneValid) ||
      (currentStep === 1 && stepTwoValid)
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => registrationService.complete();
  const handleSkip = () => registrationService.skip();
  const handleCloseWelcomeDialog = () =>
    registrationService.closeWelcomeDialog();
  const handleGoToLogin = () => registrationService.startGoToLogin();
  const handleWhaleTransitionComplete = () =>
    registrationService.completeWhaleTransition();

  return {
    handleNext,
    handlePrevious,
    handleComplete,
    handleSkip,
    showWelcomeDialog,
    showWhaleTransition,
    handleCloseWelcomeDialog,
    handleGoToLogin,
    handleWhaleTransitionComplete,
  };
}

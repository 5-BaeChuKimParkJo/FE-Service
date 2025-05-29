'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useRegisterStore } from '@/store/use-register-store';
import { registerUser } from '@/actions/auth-service';

export function useRegistration() {
  const router = useRouter();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const {
    currentStep,
    setCurrentStep,
    stepOneValid,
    stepTwoValid,
    setIsSubmitting,
  } = useRegisterStore();

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

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      await registerUser({
        userId: userData.userId,
        phoneNumber: userData.phoneNumber,
        nickname: userData.nickname,
        password: userData.password,
        interests: userData.interests,
      });

      // 회원가입 성공 후 WelcomeDialog 표시
      setShowWelcomeDialog(true);
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      await registerUser({
        userId: userData.userId,
        phoneNumber: userData.phoneNumber,
        nickname: userData.nickname,
        password: userData.password,
      });

      // 회원가입 성공 후 WelcomeDialog 표시
      setShowWelcomeDialog(true);
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseWelcomeDialog = () => {
    setShowWelcomeDialog(false);
  };

  const handleGoToLogin = () => {
    router.replace('/sign-in');
  };

  return {
    handleNext,
    handlePrevious,
    handleComplete,
    handleSkip,
    showWelcomeDialog,
    handleCloseWelcomeDialog,
    handleGoToLogin,
  };
}

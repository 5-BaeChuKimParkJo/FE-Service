'use client';
import { useRouter } from 'next/navigation';

import { useRegisterStore } from '@/store/use-register-store';
import { registerUser } from '@/services/auth-service';

export function useRegistrationHandler() {
  const router = useRouter();
  const { setCurrentStep, setIsSubmitting } = useRegisterStore();

  const handleNext = () => {
    const { currentStep } = useRegisterStore.getState();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    const { currentStep } = useRegisterStore.getState();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // StepThree에서 비밀번호 확인 후 다음 단계로 이동
  const handlePasswordConfirm = () => {
    setCurrentStep(3); // 관심 카테고리 단계로 이동
  };

  // StepFour에서 최종 회원가입 처리
  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      // 회원가입 API 호출
      const result = await registerUser({
        phoneNumber: userData.phoneNumber,
        name: userData.name,
        nickname: userData.nickname,
        email: userData.email,
        password: userData.password,
        interests: userData.interests,
      });

      console.log('회원가입 성공!', result);

      // 홈 페이지로 이동
      router.push('/home');
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 관심 카테고리 건너뛰기 시 회원가입 처리
  const handleSkip = async () => {
    setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      // 회원가입 API 호출 (관심 카테고리 없이)
      const result = await registerUser({
        phoneNumber: userData.phoneNumber,
        name: userData.name,
        nickname: userData.nickname,
        email: userData.email,
        password: userData.password,
        interests: [],
      });

      console.log('회원가입 성공! (관심 카테고리 없음)', result);

      // 홈 페이지로 이동
      router.push('/home');
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleNext,
    handlePrevious,
    handlePasswordConfirm,
    handleComplete,
    handleSkip,
  };
}

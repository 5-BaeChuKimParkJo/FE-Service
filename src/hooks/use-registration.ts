'use client';
import { useRouter } from 'next/navigation';

import { useRegisterStore } from '@/store/use-register-store';
import { registerUser } from '@/actions/auth-service';

export function useRegistration() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    stepOneValid,
    stepTwoValid,
    setIsSubmitting,
  } = useRegisterStore();

  // 다음 단계로 이동
  const handleNext = () => {
    if (
      (currentStep === 0 && stepOneValid) ||
      (currentStep === 1 && stepTwoValid)
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 이전 단계로 이동
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // StepThree에서 관심사 선택 후 회원가입 처리
  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      // 회원가입 API 호출
      const result = await registerUser({
        userId: userData.userId, // 닉네임을 userId로 사용
        phoneNumber: userData.phoneNumber,
        nickname: userData.nickname,
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

  // 관심사 선택 건너뛰기
  const handleSkip = async () => {
    setIsSubmitting(true);

    try {
      const userData = useRegisterStore.getState();

      // 회원가입 API 호출 (관심사 없이)
      const result = await registerUser({
        userId: userData.nickname, // 닉네임을 userId로 사용
        phoneNumber: userData.phoneNumber,
        nickname: userData.nickname,
        password: userData.password,
        interests: [], // 빈 배열로 설정
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

  return {
    handleNext,
    handlePrevious,
    handleComplete,
    handleSkip,
  };
}

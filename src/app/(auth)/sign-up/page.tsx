'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { RegisterStepper } from '@/components/sign-up/RegisterStepper';
import { useRegistration } from '@/hooks/use-registration';
import { useStepAnimation } from '@/hooks/use-step-animation';
import { StepOne } from '@/components/sign-up/StepOne';
import { StepTwo } from '@/components/sign-up/StepTwo';
import { StepThree } from '@/components/sign-up/StepThree';
import { useRegisterStore } from '@/store/use-register-store';
import Back from '@/assets/icons/common/back.svg';

export default function SignUpPage() {
  const router = useRouter();
  const { currentStep, stepTwoValid, isSubmitting, interests, setCurrentStep } =
    useRegisterStore();
  const { stepVariants, direction, transition } = useStepAnimation();
  const { handleNext, handleComplete, handleSkip } = useRegistration();

  const getStepLabel = (step: number): string => {
    const labels = ['휴대폰 인증', '계정 정보', '관심사 선택'];
    return labels[step] || '';
  };

  const renderButtons = () => {
    switch (currentStep) {
      case 0:
        return null;
      case 1:
        return (
          <Button
            className='w-full'
            size='xl'
            onClick={handleNext}
            disabled={!stepTwoValid || isSubmitting}
          >
            {isSubmitting ? 'loading' : 'NEXT'}
          </Button>
        );
      case 2:
        return (
          <div className='flex flex-col gap-2'>
            <Button
              className='w-full'
              size='xl'
              onClick={handleComplete}
              disabled={interests.length === 0 || isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '가입 완료'}
            </Button>
            <Button
              variant='ghost'
              className='w-full'
              size='xl'
              onClick={handleSkip}
            >
              건너뛰고 가입
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className='container max-w-md mx-auto py-8 px-4 min-h-[100dvh] flex flex-col relative'>
      <button
        onClick={handleBack}
        className='absolute top-3 left-3 '
        aria-label='뒤로 가기'
      >
        <Back />
      </button>

      <h1 className='text-2xl font-bold mt-10 mb-10 text-center'>SIGN UP</h1>

      <nav aria-label='회원가입 진행 단계' className='mb-6'>
        <RegisterStepper />
      </nav>

      <section
        className='flex-1 pb-20 relative overflow-hidden'
        aria-live='polite'
        aria-label={`현재 단계: ${getStepLabel(currentStep)}`}
      >
        <AnimatePresence initial={false} mode='wait' custom={direction}>
          {currentStep === 0 && (
            <motion.div
              key='step-1'
              role='tabpanel'
              aria-labelledby='step-1-tab'
              aria-label='휴대폰 인증'
              custom={direction}
              variants={stepVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={transition}
              className='absolute w-full'
            >
              <StepOne />
            </motion.div>
          )}
          {currentStep === 1 && (
            <motion.div
              key='step-2'
              role='tabpanel'
              aria-labelledby='step-2-tab'
              aria-label='계정 정보 입력'
              custom={direction}
              variants={stepVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={transition}
              className='absolute w-full'
            >
              <StepTwo />
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key='step-3'
              role='tabpanel'
              aria-labelledby='step-3-tab'
              aria-label='관심사 선택'
              custom={direction}
              variants={stepVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={transition}
              className='absolute w-full'
            >
              <StepThree />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {renderButtons()}
    </main>
  );
}

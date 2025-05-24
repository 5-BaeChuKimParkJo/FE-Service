'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { RegisterStepper } from '@/components/sign-up/RegisterStepper';
import { useRegistrationHandler } from '@/components/sign-up/registration-handler';
import { StepOne } from '@/components/sign-up/StepOne';
import { StepTwo } from '@/components/sign-up/StepTwo';
import { StepThree } from '@/components/sign-up/StepThree';
import { StepFour } from '@/components/sign-up/StepFour';
import {
  NavigationButtons,
  RegistrationButtons,
} from '@/components/ui/button-group';
import { useStepAnimation } from '@/hooks/use-step-animation';
import { useRegisterStore } from '@/store/use-register-store';

export default function SignUpPage() {
  const { currentStep, stepTwoValid, stepThreeValid, isSubmitting, interests } =
    useRegisterStore();
  const { stepVariants, direction, transition } = useStepAnimation();
  const {
    handleNext,
    handlePrevious,
    handlePasswordConfirm,
    handleComplete,
    handleSkip,
  } = useRegistrationHandler();

  const getStepLabel = (step: number): string => {
    const labels = ['기본 정보', '개인 정보', '비밀번호 설정', '관심사 선택'];
    return labels[step] || '';
  };

  const renderButtons = () => {
    switch (currentStep) {
      case 0:
        return null;
      case 1:
        return (
          <NavigationButtons
            onPrevious={handlePrevious}
            onNext={handleNext}
            nextDisabled={!stepTwoValid}
            isLoading={isSubmitting}
          />
        );
      case 2:
        return (
          <NavigationButtons
            onPrevious={handlePrevious}
            onNext={handlePasswordConfirm}
            nextDisabled={!stepThreeValid}
            isLoading={isSubmitting}
            nextLabel='다음'
          />
        );
      case 3:
        return (
          <RegistrationButtons
            onComplete={handleComplete}
            onSkip={handleSkip}
            completeDisabled={interests.length === 0}
            isLoading={isSubmitting}
            completeLabel='가입 완료'
            skipLabel='건너뛰고 가입'
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className='container max-w-md mx-auto py-8 px-4 min-h-[100dvh] flex flex-col'>
      <h1 className='text-2xl font-bold mb-6 text-center'>회원가입</h1>

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
              aria-label='기본 정보 입력'
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
              aria-label='개인 정보 입력'
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
              aria-label='비밀번호 설정'
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
          {currentStep === 3 && (
            <motion.div
              key='step-4'
              role='tabpanel'
              aria-labelledby='step-4-tab'
              aria-label='관심사 선택'
              custom={direction}
              variants={stepVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={transition}
              className='absolute w-full'
            >
              <StepFour />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t'>
        {renderButtons()}
      </footer>
    </main>
  );
}

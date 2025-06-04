import { motion, AnimatePresence } from 'framer-motion';
import { useRegisterStore } from '@/store/use-register-store';
import { useStepAnimation } from '@/hooks/use-step-animation';
import { StepOne } from '@/components/sign-up/StepOne';
import { StepTwo } from '@/components/sign-up/StepTwo';
import { StepThree } from '@/components/sign-up/StepThree';

export function AnimatedStepContainer() {
  const { currentStep } = useRegisterStore();
  const { stepVariants, direction, transition } = useStepAnimation();

  const getStepLabel = (step: number): string => {
    const labels = ['휴대폰 인증', '계정 정보', '관심사 선택'];
    return labels[step] || '';
  };

  return (
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
  );
}

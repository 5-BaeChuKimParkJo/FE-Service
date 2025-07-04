'use client';
import { motion } from 'framer-motion';

import { useRegisterStore } from '@/stores/use-register-store';
import { cn } from '@/libs/cn';
import Whale from '@/assets/icons/common/whale.svg';

export function RegisterStepper() {
  const { currentStep } = useRegisterStore();

  const steps = [
    { label: '휴대폰 인증' },
    { label: '계정 정보' },
    { label: '관심 카테고리' },
  ];

  const progressWidth = (currentStep * 100) / 2;

  return (
    <nav aria-label='회원가입 단계' className='w-full'>
      <div className='flex items-center justify-between relative mx-5'>
        <div className='absolute top-1/2 left-0 right-0 h-[2px] bg-muted ' />

        <div className='absolute top-1/2 left-0 right-0'>
          <motion.div
            className='h-[2px] bg-primary-100 origin-left'
            animate={{
              width: `${progressWidth}%`,
            }}
            initial={{ width: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className='absolute top-0'
            animate={{
              left: `${progressWidth}%`,
            }}
            initial={{ left: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
            }}
          >
            <motion.div
              className='absolute -top-17 -translate-x-1/2'
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            >
              <Whale className='text-primary-100 scale-50' />
            </motion.div>
          </motion.div>
        </div>

        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              'relative z-10 flex flex-col items-center ',
              'transition-colors duration-200',
              index === currentStep
                ? 'text-primary-200'
                : index < currentStep
                  ? 'text-foreground'
                  : 'text-muted-foreground',
            )}
          >
            <span className='text-xs font-medium mt-12'>{step.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

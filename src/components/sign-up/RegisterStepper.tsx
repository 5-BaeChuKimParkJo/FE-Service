'use client';
import { Smartphone, User, Heart } from 'lucide-react';

import { motion } from 'framer-motion';
import { useRegisterStore } from '@/store/use-register-store';
import { cn } from '@/lib/cn';

export function RegisterStepper() {
  const { currentStep } = useRegisterStore();

  const steps = [
    { icon: <Smartphone className='h-5 w-5' />, label: '휴대폰 인증' },
    { icon: <User className='h-5 w-5' />, label: '계정 정보' },
    { icon: <Heart className='h-5 w-5' />, label: '관심 카테고리' },
  ];

  return (
    <nav aria-label='회원가입 단계' className='w-full'>
      <ol className='flex items-center justify-between relative'>
        <div className='absolute top-5 left-0 right-0 h-[2px] bg-muted' />

        {[1, 2].map((_, index) => (
          <motion.div
            key={`line-${index}`}
            className='absolute top-5 h-[2px] bg-primary'
            style={{
              left: `${(index * 100) / 2}%`,
              right: `${100 - ((index + 1) * 100) / 2}%`,
            }}
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{
              scaleX: index < currentStep ? 1 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        ))}

        {steps.map((step, index) => (
          <li key={index} className='flex flex-col items-center z-10'>
            <motion.div
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white',
                index === currentStep
                  ? 'border-primary'
                  : index < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted',
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {index < currentStep ? (
                <motion.svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <polyline points='20 6 9 17 4 12'></polyline>
                </motion.svg>
              ) : (
                step.icon
              )}
            </motion.div>
            <span
              className={cn(
                'mt-2 text-xs font-medium',
                index === currentStep
                  ? 'text-primary'
                  : index < currentStep
                    ? 'text-foreground'
                    : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { cn } from '@/libs/cn';
import Ray from '@/assets/icons/common/ray.svg';

const steps = [
  { id: 1, title: '상품 정보', description: '설명과 이미지를 등록해주세요' },
  {
    id: 2,
    title: '경매 설정',
    description: '경매 조건과 거래 방식을 설정해주세요',
  },
  { id: 3, title: '미리보기', description: '등록할 정보를 확인해주세요' },
];

export function AuctionProgressIndicator() {
  const { currentStep } = useCreateAuctionStore();

  const currentStepInfo = steps.find((step) => step.id === currentStep);
  const progressWidth = ((currentStep - 1) * 100) / (steps.length - 1);

  return (
    <section
      className='bg-white border-b border-gray-200 px-4'
      aria-labelledby='progress-title'
    >
      <div className='px-4 py-6'>
        <div className='sr-only'>
          <h2 id='progress-title'>진행 상황</h2>
          <p>
            총 {steps.length}단계 중 {currentStep}단계 진행 중
          </p>
        </div>

        {/* Progress bar for screen readers */}
        <div
          role='progressbar'
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuetext={`${currentStep}단계: ${currentStepInfo?.title}`}
          className='sr-only'
        >
          {progressWidth.toFixed(0)}% 완료
        </div>

        {/* Progress Navigation */}
        <nav aria-label='경매 등록 단계' className='w-full mb-6'>
          <div className='flex items-center justify-between relative'>
            {/* Background progress line */}
            <div className='absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200' />

            {/* Animated progress line */}
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

              {/* Ray animation */}
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
                  className='absolute -top-25 -translate-x-1/2 ml-1'
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
                  <Ray className='text-primary-100 scale-15 ' />
                </motion.div>
              </motion.div>
            </div>

            {/* Step labels */}
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'relative  flex flex-col items-center',
                  'transition-colors duration-200',
                  step.id === currentStep
                    ? 'text-primary-200'
                    : step.id < currentStep
                      ? 'text-gray-900'
                      : 'text-gray-500',
                )}
              >
                <span className='text-xs font-medium mt-12'>{step.title}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* Current step description */}
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            {currentStepInfo?.description}
          </p>
        </div>
      </div>
    </section>
  );
}

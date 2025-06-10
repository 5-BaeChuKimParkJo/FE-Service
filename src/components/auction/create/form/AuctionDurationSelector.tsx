'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { Input } from '@/components/ui';
import { P } from '@/components/ui/p';
import {
  durationOptions,
  extractNumbers,
  calculateEndTime,
} from '../utils/auction-utils';

interface AuctionDurationSelectorProps {
  animationDelay?: number;
}

export function AuctionDurationSelector({
  animationDelay = 0.3,
}: AuctionDurationSelectorProps) {
  const { duration, startAt, setDuration } = useCreateAuctionStore();

  const [customDuration, setCustomDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  const handleCustomDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = extractNumbers(e.target.value);
    setCustomDuration(value);
    if (value) {
      setDuration(parseInt(value));
    }
  };

  const handleDurationSelect = (hours: number) => {
    if (hours === 0) {
      setShowCustomDuration(true);
      setDuration(customDuration ? parseInt(customDuration) : 1);
    } else {
      setShowCustomDuration(false);
      setDuration(hours);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='space-y-3'
      aria-labelledby='duration-label'
    >
      <label
        id='duration-label'
        className={`block text-sm font-mono ${
          duration ? 'text-primary-100' : 'text-gray-700'
        }`}
      >
        경매 기간
      </label>

      <div
        className='grid grid-cols-4 gap-2'
        role='radiogroup'
        aria-labelledby='duration-label'
      >
        {durationOptions.map((option) => (
          <button
            key={option.hours}
            type='button'
            role='radio'
            aria-checked={
              (option.hours === 0 && showCustomDuration) ||
              (option.hours !== 0 &&
                duration === option.hours &&
                !showCustomDuration)
            }
            onClick={() => handleDurationSelect(option.hours)}
            className={`p-3 sm:p-4 rounded-xl border-2 font-medium transition-all touch-manipulation ${
              (option.hours === 0 && showCustomDuration) ||
              (option.hours !== 0 &&
                duration === option.hours &&
                !showCustomDuration)
                ? 'border-primary-200/50 bg-primary-100/10 text-purple-900 scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {showCustomDuration && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-2'
        >
          <Input
            label='경매 기간 (시간)'
            type='text'
            inputMode='numeric'
            fontWeight='medium'
            value={customDuration}
            onChange={handleCustomDurationChange}
            aria-describedby='custom-duration-help'
          />
          <p id='custom-duration-help' className='text-xs text-gray-500 px-1'>
            최소 1시간, 최대 720시간(30일)까지 설정 가능합니다
          </p>
        </motion.div>
      )}

      {startAt && (
        <div className='bg-primary-100/10 p-3 rounded-lg' role='status'>
          <P color='primary' size='sm'>
            종료 예정:{' '}
            {calculateEndTime(startAt, duration).toLocaleString('ko-KR')}
          </P>
        </div>
      )}
    </motion.section>
  );
}

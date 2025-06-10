'use client';
import { motion } from 'framer-motion';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { getMinDateTime } from '../utils/auction-utils';
import { DateTimePicker } from '@/components/ui/date-time-picker/index';

interface AuctionStartTimeSelectorProps {
  animationDelay?: number;
}

export function AuctionStartTimeSelector({
  animationDelay = 0.2,
}: AuctionStartTimeSelectorProps) {
  const { startAt, errors, setStartAt } = useCreateAuctionStore();

  const minDateTime = getMinDateTime();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='space-y-3'
      aria-labelledby='start-time-label'
    >
      <label
        id='start-time-label'
        className={`block text-sm font-mono ${
          startAt ? 'text-primary-100' : 'text-gray-700'
        }`}
      >
        경매 시작 시간
      </label>

      <DateTimePicker
        value={startAt || undefined}
        onChange={setStartAt}
        placeholder='경매 시작 날짜와 시간을 선택하세요'
        minDate={minDateTime}
        className={errors.startAt ? 'border-red-500' : 'border-gray-300'}
        aria-describedby={errors.startAt ? 'start-time-error' : undefined}
        aria-invalid={!!errors.startAt}
      />

      {errors.startAt && (
        <p
          id='start-time-error'
          className='text-sm text-red-500 px-1'
          role='alert'
        >
          {errors.startAt}
        </p>
      )}
    </motion.section>
  );
}

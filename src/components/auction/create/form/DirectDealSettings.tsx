'use client';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { Input } from '@/components/ui';

interface DirectDealSettingsProps {
  animationDelay?: number;
}

export function DirectDealSettings({
  animationDelay = 0.4,
}: DirectDealSettingsProps) {
  const {
    isDirectDeal,
    directDealLocation,
    errors,
    setIsDirectDeal,
    setDirectDealLocation,
  } = useCreateAuctionStore();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='space-y-3'
      aria-labelledby='deal-method-label'
    >
      <label
        id='deal-method-label'
        className='block text-sm font-medium text-gray-700'
      >
        거래 방식
      </label>

      <div className='flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white'>
        <div className='flex items-center gap-3'>
          <MapPin className='w-5 h-5 text-gray-400' aria-hidden='true' />
          <div>
            <p className='font-medium text-gray-900'>직거래 가능</p>
            <p className='text-sm text-gray-600'>택배 + 직거래 모두 가능</p>
          </div>
        </div>

        <button
          type='button'
          role='switch'
          aria-checked={isDirectDeal}
          aria-labelledby='deal-method-label'
          onClick={() => setIsDirectDeal(!isDirectDeal)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors touch-manipulation ${
            isDirectDeal ? 'bg-primary-200' : 'bg-gray-400'
          }`}
        >
          <span className='sr-only'>
            {isDirectDeal ? '직거래 사용 중' : '직거래 사용 안함'}
          </span>
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              isDirectDeal ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isDirectDeal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-2'
        >
          <Input
            label='직거래 희망 지역'
            type='text'
            value={directDealLocation}
            onChange={(e) => setDirectDealLocation(e.target.value)}
            error={errors.directDealLocation}
            aria-describedby={
              errors.directDealLocation ? 'location-error' : undefined
            }
            aria-invalid={!!errors.directDealLocation}
          />
          {errors.directDealLocation && (
            <p
              id='location-error'
              className='text-sm text-red-500 px-1'
              role='alert'
            >
              {errors.directDealLocation}
            </p>
          )}
        </motion.div>
      )}
    </motion.section>
  );
}

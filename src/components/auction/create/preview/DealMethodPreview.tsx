'use client';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';

interface DealMethodPreviewProps {
  animationDelay?: number;
}

export function DealMethodPreview({
  animationDelay = 0.3,
}: DealMethodPreviewProps) {
  const { isDirectDeal, directDealLocation } = useCreateAuctionStore();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='border rounded-xl bg-white p-6 space-y-5'
      aria-labelledby='deal-method-title'
    >
      <header className='flex items-center space-x-2 pb-3 border-b'>
        <MapPin className='w-5 h-5 text-primary-100' aria-hidden='true' />
        <h3
          id='deal-method-title'
          className='text-lg font-semibold text-gray-900'
        >
          거래 방식
        </h3>
      </header>

      <div className='space-y-3' role='list'>
        {/* 택배 거래 (항상 가능) */}
        <div
          className='flex items-center space-x-3 p-3 rounded-lg'
          role='listitem'
        >
          <div
            className='w-2 h-2 bg-green-500 rounded-full'
            aria-hidden='true'
          />
          <span className='font-medium text-gray-900'>택배 거래</span>
        </div>

        {/* 직거래 (조건부) */}
        {isDirectDeal && (
          <div
            className='flex items-center space-x-3 p-3 rounded-lg'
            role='listitem'
          >
            <div
              className='w-2 h-2 bg-primary-100 rounded-full'
              aria-hidden='true'
            />
            <span className='font-medium text-gray-900'>
              직거래 가능 ({directDealLocation})
            </span>
          </div>
        )}
      </div>
    </motion.section>
  );
}

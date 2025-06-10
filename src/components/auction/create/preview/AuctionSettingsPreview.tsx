'use client';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { koreanDateFormatOptions } from '../utils/preview-utils';

interface AuctionSettingsPreviewProps {
  animationDelay?: number;
}

export function AuctionSettingsPreview({
  animationDelay = 0.2,
}: AuctionSettingsPreviewProps) {
  const { minimumBid, startAt, endAt, duration } = useCreateAuctionStore();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='border rounded-xl bg-white p-6 space-y-5'
      aria-labelledby='auction-settings-title'
    >
      <header className='flex items-center space-x-2 pb-3 border-b'>
        <DollarSign className='w-5 h-5 text-primary-100' aria-hidden='true' />
        <h3
          id='auction-settings-title'
          className='text-lg font-semibold text-gray-900'
        >
          경매 설정
        </h3>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* 최소 입찰가 */}
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-500'>최소 입찰가</p>
          <div className='border-primary-100/10 border rounded-lg p-4'>
            <p
              className='text-2xl text-gray-900'
              aria-label={`최소 입찰가 ${parseInt(minimumBid).toLocaleString()}원`}
            >
              {parseInt(minimumBid).toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 경매 시간 */}
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-500'>경매 시간</p>

          <div className='space-y-2'>
            {/* 총 경매 시간 */}
            <div className='rounded-lg p-3 border border-gray-200'>
              <p className='text-xs text-gray-500 mb-1'>총 경매 시간</p>
              <p
                className='pl-2 text-lg text-gray-900'
                aria-label={`총 경매 시간 ${duration}시간`}
              >
                {duration}시간
              </p>
            </div>

            {/* 시작 시간 */}
            {startAt && (
              <div className='border border-gray-200 rounded-lg p-3'>
                <p className='text-xs text-gray-500 mb-2'>시작 시간</p>
                <p className='pl-2 text-lg text-gray-900'>
                  <time dateTime={startAt.toISOString()}>
                    {startAt.toLocaleString('ko-KR', koreanDateFormatOptions)}
                  </time>
                </p>
              </div>
            )}

            {/* 종료 시간 */}
            {endAt && (
              <div className='border border-gray-200 rounded-lg p-3'>
                <p className='text-xs text-gray-500 mb-2'>종료 시간</p>
                <p className='pl-2 text-lg text-gray-900'>
                  <time dateTime={endAt.toISOString()}>
                    {endAt.toLocaleString('ko-KR', koreanDateFormatOptions)}
                  </time>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

'use client';

import React from 'react';
import { exposeHandleSubmit } from '../utils/preview-utils';
import { Loader2 } from 'lucide-react';
import {
  ProductInfoPreview,
  AuctionSettingsPreview,
  DealMethodPreview,
  AuctionWarnings,
} from '../preview';
import { useAuctionSubmit } from '@/hooks/use-auction-submit';

export function Step3Preview() {
  const { handleSubmit, isLoading } = useAuctionSubmit();

  // Step3 컴포넌트에 handleSubmit 함수를 노출
  React.useEffect(() => {
    exposeHandleSubmit(handleSubmit);
  }, [handleSubmit]);

  return (
    <>
      <main className='flex-1 overflow-y-auto p-4 pb-20' data-step='3'>
        <div className='max-w-2xl mx-auto space-y-6'>
          <ProductInfoPreview animationDelay={0.1} />
          <AuctionSettingsPreview animationDelay={0.2} />
          <DealMethodPreview animationDelay={0.3} />
          <AuctionWarnings animationDelay={0.4} />
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl p-8 shadow-2xl'>
            <div className='flex flex-col items-center space-y-4'>
              <Loader2 className='w-8 h-8 text-primary-200 animate-spin' />
              <p className='text-lg font-medium text-gray-900'>
                경매 등록 중...
              </p>
              <p className='text-sm text-gray-500'>잠시만 기다려주세요</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

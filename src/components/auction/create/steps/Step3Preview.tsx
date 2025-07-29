'use client';

import React, { useEffect } from 'react';
import { exposeHandleSubmit } from '../utils/preview-utils';
import {
  ProductInfoPreview,
  AuctionSettingsPreview,
  DealMethodPreview,
  AuctionWarnings,
} from '../preview';
import { useAuctionSubmit } from '@/hooks/use-auction-submit';
import { AuctionLoading } from '@/components/common/AuctionLoading';
import { AuctionSuccessDialog } from '@/components/common/AuctionSuccessDialog';
import { Dialog } from '@/components/ui/dialog';

export function Step3Preview() {
  const {
    handleSubmit,
    isLoading,
    isSuccess,
    auctionTitle,
    goToAuctionDetail,
    resetSubmitState,
  } = useAuctionSubmit();

  useEffect(() => {
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

      {/* 로딩 중 모달 */}
      <Dialog
        isOpen={isLoading}
        onClose={() => {}}
        closeOnBackdropClick={false}
        size='sm'
      >
        <AuctionLoading />
      </Dialog>

      {/* 등록 완료 다이얼로그 */}
      <AuctionSuccessDialog
        isOpen={isSuccess}
        onClose={resetSubmitState}
        onGoToDetail={goToAuctionDetail}
        auctionTitle={auctionTitle || undefined}
        motionType='welcome'
      />
    </>
  );
}

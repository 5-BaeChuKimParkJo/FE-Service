'use client';

import { ArrowLeft } from 'lucide-react';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';

interface AuctionStepperHeaderProps {
  onPrevStep: () => void;
}

export function AuctionStepperHeader({
  onPrevStep,
}: AuctionStepperHeaderProps) {
  const { currentStep } = useCreateAuctionStore();

  const handleBackClick = () => {
    if (currentStep === 1) {
      // 페이지를 떠나기 전 확인
      if (confirm('작성중인 내용이 사라집니다. 정말 나가시겠습니까?')) {
        window.history.back();
      }
    } else {
      onPrevStep();
    }
  };

  return (
    <header className='sticky top-0 z-10 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-between p-4'>
        <button
          onClick={handleBackClick}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label={currentStep === 1 ? '경매 등록 취소' : '이전 단계로'}
        >
          <ArrowLeft className='w-6 h-6 text-gray-700' />
        </button>
        <h1 className='text-lg font-semibold text-gray-900'>경매 등록</h1>
        <div className='w-10 h-10' aria-hidden='true' /> {/* Spacer */}
      </div>
    </header>
  );
}

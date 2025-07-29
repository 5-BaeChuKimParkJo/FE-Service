'use client';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { Button } from '@/components/ui/button';

interface AuctionNavigationFooterProps {
  onPrevStep: () => void;
  onNextStep: () => void;
  isLoading?: boolean;
}

export function AuctionNavigationFooter({
  onPrevStep,
  onNextStep,
  isLoading = false,
}: AuctionNavigationFooterProps) {
  const { currentStep, isStepValid } = useCreateAuctionStore();

  const canProceed = isStepValid(currentStep);

  const handleSubmit = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stepComponent = document.querySelector('[data-step="3"]') as any;
    if (stepComponent?.handleSubmit) {
      stepComponent.handleSubmit();
    }
  };

  return (
    <footer className='sticky bottom-0 '>
      <nav className='flex justify-between p-3 ' aria-label='단계 네비게이션'>
        {currentStep > 1 && (
          <Button
            variant='outline'
            width='half'
            size='lg'
            onClick={onPrevStep}
            aria-label='이전 단계로 이동'
          >
            이전
          </Button>
        )}

        <div className='flex-1 mr-2' aria-hidden='true' />

        {currentStep < 3 ? (
          <Button
            width='half'
            size='lg'
            onClick={onNextStep}
            disabled={!canProceed}
            aria-label='다음 단계로 이동'
          >
            다음
          </Button>
        ) : (
          <Button
            width='half'
            size='lg'
            onClick={handleSubmit}
            isPending={isLoading}
            disabled={isLoading}
            aria-label='경매 등록 완료'
          >
            등록하기
          </Button>
        )}
      </nav>
    </footer>
  );
}

'use client';
import type * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/libs/cn';

interface ButtonGroupProps {
  className?: string;
  children: React.ReactNode;
}

export function ButtonGroup({ className, children }: ButtonGroupProps) {
  return <div className={cn('flex gap-2', className)}>{children}</div>;
}

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function NavigationButtons({
  onPrevious,
  onNext,
  nextLabel = '다음',
  prevLabel = '이전',
  nextDisabled = false,
  prevDisabled = false,
  isLoading = false,
  className,
}: NavigationButtonsProps) {
  return (
    <ButtonGroup className={className}>
      {onPrevious && (
        <Button
          className='flex-1'
          onClick={onPrevious}
          disabled={prevDisabled || isLoading}
        >
          {prevLabel}
        </Button>
      )}
      {onNext && (
        <Button
          className='flex-1'
          onClick={onNext}
          disabled={nextDisabled || isLoading}
        >
          {isLoading ? '처리 중...' : nextLabel}
        </Button>
      )}
    </ButtonGroup>
  );
}

interface RegistrationButtonsProps {
  onComplete: () => void;
  onSkip: () => void;
  completeLabel?: string;
  skipLabel?: string;
  completeDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function RegistrationButtons({
  onComplete,
  onSkip,
  completeLabel = '완료',
  skipLabel = '건너뛰기',
  completeDisabled = false,
  isLoading = false,
  className,
}: RegistrationButtonsProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        className='w-full'
        onClick={onComplete}
        disabled={completeDisabled || isLoading}
      >
        {isLoading ? '저장 중...' : completeLabel}
      </Button>
      <Button variant='ghost' className='w-full' onClick={onSkip}>
        {skipLabel}
      </Button>
    </div>
  );
}

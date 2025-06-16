'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { FilledInput } from '@/components/ui/filled-input';

type BidderFormStepProps = {
  bidAmount: number;
  inputAmount: string;
  loading: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onPercent: (percent: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  bidButtonText: string;
  bidButtonDisabled: boolean;
};

export function BidderFormStep({
  bidAmount,
  inputAmount,
  loading,
  error,
  onInputChange,
  onClear,
  onPercent,
  onSubmit,
  inputRef,
  bidButtonText,
  bidButtonDisabled,
}: BidderFormStepProps) {
  return (
    <motion.form
      key='step2'
      variants={{
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
      }}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ duration: 0.3 }}
      className='flex flex-col items-center gap-6 px-4 pb-6 w-full'
      onSubmit={onSubmit}
    >
      <div className='w-full text-left mb-2'>
        <div className='text-sm text-gray-500 mb-1'>현재 입찰가</div>
        <div className='text-xl font-bold text-primary-100 mb-2'>
          {bidAmount.toLocaleString()} 원
        </div>
        <div className='text-sm text-gray-500 mb-1'>최대 입찰 가능 금액</div>
        <div className='text-xl font-bold text-primary-100 mb-2'>
          {Math.floor(bidAmount * 1.3).toLocaleString()} 원
        </div>
      </div>

      <div className='flex gap-2 w-full mb-2'>
        <Button
          type='button'
          variant='outline'
          className='flex-1'
          onClick={() => onPercent(10)}
        >
          +10%
        </Button>
        <Button
          type='button'
          variant='outline'
          className='flex-1'
          onClick={() => onPercent(20)}
        >
          +20%
        </Button>
        <Button
          type='button'
          variant='outline'
          className='flex-1'
          onClick={() => onPercent(30)}
        >
          +30%
        </Button>
      </div>
      <div className='relative w-full'>
        <FilledInput
          type='number'
          min={bidAmount}
          value={inputAmount}
          onChange={onInputChange}
          label='금액을 입력하세요.'
          disabled={loading}
          required
          ref={inputRef}
        />
        {parseInt(inputAmount, 10) > 0 && (
          <button
            type='button'
            className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
            onClick={onClear}
            tabIndex={-1}
          >
            <svg width='20' height='20' fill='none' viewBox='0 0 24 24'>
              <path
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>
      {error && <div className='text-red-500 text-sm'>{error}</div>}
      <Button
        width='full'
        size='xl'
        type='submit'
        disabled={bidButtonDisabled}
        className='mt-2'
      >
        {bidButtonText}
      </Button>
    </motion.form>
  );
}

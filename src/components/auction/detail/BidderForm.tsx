'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui';
import { Dialog } from '@/components/ui/dialog';
import { createBid } from '@/actions/auction-service/create-bid';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { isErrorResponse } from '@/utils/type-guards';
import {
  BidderDialogHeader,
  BidderAgreementStep,
  BidderFormStep,
  BidderSuccessStep,
} from './bidder-form';

type BidderFormProps = {
  auctionUuid: string;
  bidAmount: number;
  status: 'waiting' | 'active' | 'ended' | 'hidden' | 'cancelled';
};

export function BidderForm({
  auctionUuid,
  bidAmount,
  status,
}: BidderFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [inputAmount, setInputAmount] = useState(String(bidAmount));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setInputAmount(String(bidAmount));
    setError('');
    setSuccess(false);
  };

  const handleBid = async () => {
    const numAmount = parseInt(inputAmount, 10);
    if (numAmount < bidAmount) {
      setError('입찰 금액은 현재 입찰가 이상이어야 합니다.');
      return;
    }
    if (numAmount > Math.floor(bidAmount * 1.3)) {
      setError('입찰 금액은 현재 입찰가의 30%를 초과할 수 없습니다.');
      return;
    }
    if (!window.confirm('입찰하시겠습니까?')) return;
    setLoading(true);
    setError('');
    try {
      const response = await createBid(auctionUuid, numAmount);
      if (isErrorResponse(response)) {
        setError(response.message);
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch (error) {
      setError(
        isErrorResponse(error)
          ? error.message
          : '입찰에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePercent = (percent: number) => {
    const newAmount = Math.floor(bidAmount * (1 + percent / 100));
    setInputAmount(String(newAmount));
    setTimeout(() => {
      inputRef.current?.blur();
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/^0+/, '');
    if (!value) value = '0';
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 0) num = 0;
    setInputAmount(String(num));
    setError('');
  };

  const handleClear = () => {
    setInputAmount('0');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  let bidButtonText = '입찰하기';
  let bidButtonDisabled = loading;
  const numAmount = parseInt(inputAmount, 10);
  if (status === 'waiting') {
    bidButtonText = '입찰 대기';
    bidButtonDisabled = true;
  } else if (status !== 'active') {
    bidButtonText = '입찰 마감';
    bidButtonDisabled = true;
  }
  if (
    inputAmount === '' ||
    isNaN(numAmount) ||
    numAmount < bidAmount ||
    numAmount > Math.floor(bidAmount * 1.3)
  ) {
    bidButtonDisabled = true;
  }

  return (
    <footer className='fixed bottom-0 left-0 w-full z-30'>
      <div className='flex justify-center mx-10 my-2'>
        <Button
          width='full'
          size='xl'
          onClick={() => setOpen(true)}
          disabled={status !== 'active'}
          className={status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {bidButtonText}
        </Button>
      </div>
      <Dialog isOpen={open} onClose={handleClose} size='md' showCloseButton>
        <motion.div
          variants={{
            initial: { opacity: 0, y: 80 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 80 },
          }}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          <BidderDialogHeader title='Your Bids' />
          <AnimatePresence mode='wait'>
            {step === 1 && !success && (
              <BidderAgreementStep
                onClose={handleClose}
                onAgree={() => setStep(2)}
              />
            )}
            {step === 2 && !success && (
              <BidderFormStep
                bidAmount={bidAmount}
                inputAmount={inputAmount}
                loading={loading}
                error={error}
                onInputChange={handleInputChange}
                onClear={handleClear}
                onPercent={handlePercent}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBid();
                }}
                inputRef={inputRef}
                bidButtonText={bidButtonText}
                bidButtonDisabled={bidButtonDisabled}
              />
            )}
            {success && <BidderSuccessStep onClose={handleClose} />}
          </AnimatePresence>
        </motion.div>
      </Dialog>
    </footer>
  );
}

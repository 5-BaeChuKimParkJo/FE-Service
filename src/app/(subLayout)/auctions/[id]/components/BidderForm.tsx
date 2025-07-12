'use client';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { Dialog } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/contexts/AlertContext';
import { useBidderForm } from '../hooks';
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
  const { showConfirm } = useAlert();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const {
    inputAmount,
    loading,
    error,
    inputRef,
    isAmountInvalid,
    handleInputChange,
    handlePercent,
    handleClear,
    submitBid,
    reset,
  } = useBidderForm({
    auctionUuid,
    bidAmount,
    onSuccess: () => {
      setSuccess(true);
      router.refresh();
    },
  });

  const handleClose = () => {
    reset();
    setOpen(false);
    setStep(1);
    setSuccess(false);
  };

  const handleBid = async () => {
    const numAmount = parseInt(inputAmount, 10);

    const confirmed = await showConfirm(
      'info',
      '입찰하기',
      `입찰 후 취소가 불가능 합니다.`,
      {
        confirmText: '확인했습니다',
        cancelText: '나중에 하기',
      },
    );

    if (!confirmed) return;

    await submitBid(numAmount);
  };

  const bidButtonDisabled = loading || isAmountInvalid;

  if (status !== 'active') {
    return null;
  }

  return (
    <footer className=' border-t border-gray-200'>
      <div className='flex justify-center mx-10 my-2'>
        <Button
          width='full'
          aria-label='입찰하러가기'
          size='xl'
          onClick={() => setOpen(true)}
        >
          입찰하기
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
                bidButtonText='입찰하기'
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

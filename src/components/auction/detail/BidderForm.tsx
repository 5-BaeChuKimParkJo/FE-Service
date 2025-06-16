'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui';
import { Dialog } from '@/components/ui/dialog';
import Penguin from '@/assets/icons/common/penguin.svg';
import { createBid } from '@/actions/auction-service/create-bid';
import { motion, AnimatePresence } from 'framer-motion';
import { FilledInput } from '@/components/ui/filled-input';
import { useRouter } from 'next/navigation';
import { isErrorResponse } from '@/utils/type-guards';

export function BidderForm({
  auctionUuid,
  bidAmount,
  status,
}: {
  auctionUuid: string;
  bidAmount: number;
  status: 'waiting' | 'active' | 'ended' | 'hidden' | 'cancelled';
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [inputAmount, setInputAmount] = useState(String(bidAmount));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  let showError = error;

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
          ? (showError = error.message)
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

  const dialogVariants = {
    initial: { opacity: 0, y: 80 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 80 },
  };
  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
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

  if (!error && numAmount > Math.floor(bidAmount * 1.3)) {
    showError = '입찰 금액은 현재 입찰가의 30%를 초과할 수 없습니다.';
  }

  return (
    <div className='fixed bottom-0 left-0 w-full z-30'>
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
          variants={dialogVariants}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          <div className='flex flex-col items-center pt-6 pb-2'>
            <Penguin className='w-24 h-24 mb-2' />
            <motion.h2
              className='text-2xl font-bold text-primary-100 mb-2'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Your Bids
            </motion.h2>
          </div>
          <AnimatePresence mode='wait'>
            {step === 1 && !success && (
              <motion.div
                key='step1'
                variants={stepVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ duration: 0.3 }}
                className='flex flex-col items-center gap-6 px-4 pb-6'
              >
                <div className='text-center text-gray-700 text-base mb-2'>
                  입찰은{' '}
                  <span className='font-bold text-primary-100'>
                    취소가 불가능
                  </span>
                  하며,
                  <br />
                  거래 거부 시 서비스 이용이{' '}
                  <span className='font-bold text-primary-100'>제한</span>될 수
                  있습니다.
                </div>
                <div className='flex gap-4 w-full'>
                  <Button
                    className='flex-1'
                    variant='outline'
                    onClick={handleClose}
                  >
                    나가기
                  </Button>
                  <Button className='flex-1' onClick={() => setStep(2)}>
                    동의
                  </Button>
                </div>
              </motion.div>
            )}
            {step === 2 && !success && (
              <motion.form
                key='step2'
                variants={stepVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ duration: 0.3 }}
                className='flex flex-col items-center gap-6 px-4 pb-6 w-full'
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBid();
                }}
              >
                <div className='w-full text-left mb-2'>
                  <div className='text-sm text-gray-500 mb-1'>현재 입찰가</div>
                  <div className='text-xl font-bold text-primary-100 mb-2'>
                    {bidAmount.toLocaleString()} 원
                  </div>
                  <div className='text-sm text-gray-500 mb-1'>
                    최대 입찰 가능 금액
                  </div>
                  <div className='text-xl font-bold text-primary-100 mb-2'>
                    {Math.floor(bidAmount * 1.3).toLocaleString()} 원
                  </div>
                </div>

                <div className='flex gap-2 w-full mb-2'>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1'
                    onClick={() => handlePercent(10)}
                  >
                    +10%
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1'
                    onClick={() => handlePercent(20)}
                  >
                    +20%
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1'
                    onClick={() => handlePercent(30)}
                  >
                    +30%
                  </Button>
                </div>
                <div className='relative w-full'>
                  <FilledInput
                    type='number'
                    min={bidAmount}
                    value={inputAmount}
                    onChange={handleInputChange}
                    label='금액을 입력하세요.'
                    disabled={loading}
                    required
                    ref={inputRef}
                  />
                  {/* X(지우기) 버튼 */}
                  {parseInt(inputAmount, 10) > 0 && (
                    <button
                      type='button'
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      onClick={handleClear}
                      tabIndex={-1}
                    >
                      <svg
                        width='20'
                        height='20'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
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
                {showError && (
                  <div className='text-red-500 text-sm'>{showError}</div>
                )}
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
            )}
            {success && (
              <motion.div
                key='success'
                variants={stepVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ duration: 0.3 }}
                className='flex flex-col items-center gap-6 px-4 pb-6'
              >
                <div className='text-center text-primary-100 text-xl font-bold mb-2'>
                  입찰이 완료되었습니다!
                </div>
                <Button width='full' size='lg' onClick={handleClose}>
                  닫기
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Dialog>
    </div>
  );
}

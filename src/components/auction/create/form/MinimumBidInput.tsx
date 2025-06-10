'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { Input } from '@/components/ui';
import { formatCurrency, numberToKorean } from '@/utils/format';
import { extractNumbers } from '../utils/auction-utils';

interface MinimumBidInputProps {
  animationDelay?: number;
}

export function MinimumBidInput({
  animationDelay = 0.1,
}: MinimumBidInputProps) {
  const { minimumBid, errors, setMinimumBid } = useCreateAuctionStore();
  const [touched, setTouched] = useState(false);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = extractNumbers(e.target.value);
    const sanitizedValue = value.replace(/^0+(?=\d)/, '');
    setMinimumBid(sanitizedValue);
  };

  // 한국어 단위 표시를 위한 계산
  const koreanAmount = numberToKorean(minimumBid);

  // 실시간 유효성 검사 (포커스 아웃 후에만 보여줌)
  const bidAmount = parseFloat(minimumBid) || 0;
  const isValid = bidAmount >= 1000;
  const showValidationError = touched && minimumBid.length > 0 && !isValid;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='space-y-3'
      aria-labelledby='minimum-bid-label'
    >
      <Input
        id='minimum-bid'
        label='최소 입찰가'
        type='numeric'
        inputMode='numeric'
        value={formatCurrency(minimumBid)}
        onChange={handleBidChange}
        onBlur={() => setTouched(true)}
        fontWeight='medium'
        aria-describedby={koreanAmount ? 'korean-amount' : undefined}
        aria-invalid={!!errors.minimumBid || showValidationError}
      />

      {koreanAmount && (
        <div className='px-1'>
          <p id='korean-amount' className='text-sm text-gray-500 font-medium'>
            {koreanAmount}
          </p>
        </div>
      )}

      {/* 스토어 에러 (제출 시 검증 에러) */}
      {errors.minimumBid && (
        <p className='text-sm text-red-500 px-1' role='alert'>
          {errors.minimumBid}
        </p>
      )}

      {/* 실시간 유효성 검사 에러 */}
      {showValidationError && !errors.minimumBid && (
        <p className='text-sm text-red-500 px-1' role='alert'>
          최소 입찰가는 1,000원 이상이어야 합니다
        </p>
      )}
    </motion.section>
  );
}

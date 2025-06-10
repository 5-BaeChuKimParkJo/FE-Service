'use client';

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

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = extractNumbers(e.target.value);
    const sanitizedValue = value.replace(/^0+(?=\d)/, '');
    setMinimumBid(sanitizedValue);
  };

  // 한국어 단위 표시를 위한 계산
  const koreanAmount = numberToKorean(minimumBid);

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
        fontWeight='medium'
        aria-describedby={koreanAmount ? 'korean-amount' : undefined}
        aria-invalid={!!errors.minimumBid}
      />

      {koreanAmount && (
        <div className='px-1'>
          <p id='korean-amount' className='text-sm text-gray-500 font-medium'>
            {koreanAmount}
          </p>
        </div>
      )}

      {errors.minimumBid && (
        <p className='text-sm text-red-500 px-1' role='alert'>
          {errors.minimumBid}
        </p>
      )}
    </motion.section>
  );
}

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Penguin from '@/assets/icons/common/penguin.svg';
import {
  ReviewData,
  ReviewType,
  SellerReviewData,
  BuyerReviewData,
} from '@/types/review';
import { formatNumber } from '@/utils/format';

interface StarRatingProps {
  score: number;
  onScoreChange: (score: number) => void;
  label: string;
}

function StarRating({ score, onScoreChange, label }: StarRatingProps) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='text-sm font-medium text-gray-700'>{label}</div>
      <div className='flex gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => onScoreChange(star)}
            className={`w-8 h-8 transition-colors ${
              star <= score
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <svg
              className='w-full h-full'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewDialog({
  isOpen,
  onClose,
  onSubmit,
  reviewType,
  targetUuid,
  postUuid,
  targetName,
  productInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => void;
  reviewType: ReviewType;
  targetUuid: string;
  postUuid: string;
  targetName?: string;
  productInfo?: {
    title: string;
    imageUrl: string;
    price: number;
    status: string;
  };
}) {
  const [mannerScore, setMannerScore] = useState(5);
  const [timeScore, setTimeScore] = useState(5);
  const [replyScore, setReplyScore] = useState(5);
  const [statusScore, setStatusScore] = useState(5);

  const handleSubmit = () => {
    if (reviewType === 'seller-to-buyer') {
      const reviewData: SellerReviewData = {
        buyerUuid: targetUuid,
        postUuid,
        postType: 'AUCTION',
        mannerScore,
        timeScore,
        replyScore,
      };
      onSubmit(reviewData);
    } else {
      const reviewData: BuyerReviewData = {
        sellerUuid: targetUuid,
        postUuid,
        postType: 'AUCTION',
        mannerScore,
        timeScore,
        replyScore,
        statusScore,
      };
      onSubmit(reviewData);
    }
  };

  const sectionVariants = {
    initial: { opacity: 0, scale: 0.95, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 40 },
  };

  const penguinVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size='md'
      closeOnBackdropClick={false}
      className='text-center'
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className='p-8 py-12 flex flex-col items-center gap-6'
            initial={sectionVariants.initial}
            animate={sectionVariants.animate}
            exit={sectionVariants.exit}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className='w-24 h-24 flex items-center justify-center bg-blue-50 rounded-full mb-4'
              initial={penguinVariants.initial}
              animate={penguinVariants.animate}
              exit={penguinVariants.exit}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <Penguin className='w-full h-full' />
            </motion.div>

            {/* 상품 정보 섹션 */}
            {productInfo && (
              <motion.div
                className='w-full bg-gray-50 rounded-lg p-4 mb-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <div className='flex items-center gap-3'>
                  <div className='relative w-12 h-12 flex-shrink-0'>
                    <Image
                      src={productInfo.imageUrl}
                      alt={productInfo.title}
                      fill
                      className='rounded-md object-cover'
                    />
                  </div>
                  <div className='flex-1 text-left'>
                    <div className='text-xs text-gray-500 mb-1'>
                      {productInfo.status}
                    </div>
                    <div className='font-medium text-sm text-gray-900 line-clamp-1'>
                      {productInfo.title}
                    </div>
                    <div className='text-sm font-bold text-gray-900'>
                      {formatNumber(productInfo.price)}원
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className='text-gray-700 mb-2'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {targetName}님과의 거래는 어떠셨나요?
              <br />
              평점을 남겨주세요
            </motion.div>

            <motion.div
              className='w-full space-y-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <StarRating
                score={mannerScore}
                onScoreChange={setMannerScore}
                label='매너 점수'
              />
              <StarRating
                score={timeScore}
                onScoreChange={setTimeScore}
                label='시간 약속'
              />
              <StarRating
                score={replyScore}
                onScoreChange={setReplyScore}
                label='답장 속도'
              />
              {reviewType === 'buyer-to-seller' && (
                <StarRating
                  score={statusScore}
                  onScoreChange={setStatusScore}
                  label='상품 상태'
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className='w-full flex gap-2'
            >
              <Button variant='outline' className='flex-1' onClick={onClose}>
                나중에 보내기
              </Button>
              <Button className='flex-1' onClick={handleSubmit}>
                리뷰 보내기
              </Button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

'use client';
import { useState } from 'react';
import { ReviewDialog } from '@/components/common';
import { MemberSummary } from '@/types/member';
import { ReviewData, ReviewType } from '@/types/review';
import { StatusBadge } from '../icons';
import {
  sendReviewBuyerToSeller,
  sendReviewSellerToBuyer,
} from '@/actions/review-service';

interface ReviewButtonProps {
  currentUserUuid: string;
  opponentInfo: MemberSummary;
  productInfo: {
    uuid: string;
    title: string;
    sellerUuid: string;
    type: 'PRODUCT' | 'AUCTION';
    imageUrl: string;
    price: number;
    status: string;
  };
}

export function ReviewButton({
  currentUserUuid,
  opponentInfo,
  productInfo,
}: ReviewButtonProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const isCurrentUserSeller = currentUserUuid === productInfo.sellerUuid;
  const reviewType: ReviewType = isCurrentUserSeller
    ? 'seller-to-buyer'
    : 'buyer-to-seller';

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    try {
      if (reviewType === 'buyer-to-seller') {
        await sendReviewBuyerToSeller(reviewData);
      } else {
        await sendReviewSellerToBuyer(reviewData);
      }

      setIsReviewDialogOpen(false);
    } catch (error) {
      console.error('리뷰 전송 실패:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsReviewDialogOpen(true)}
        className='flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-200  rounded-lg transition-colors'
        aria-label='리뷰 보내기'
      >
        <StatusBadge variant='primary' size='lg'>
          거래 완료
        </StatusBadge>
      </button>

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        reviewType={reviewType}
        targetUuid={opponentInfo.memberUuid}
        postUuid={productInfo.uuid}
        targetName={opponentInfo.nickname}
        productInfo={{
          title: productInfo.title,
          imageUrl: productInfo.imageUrl,
          price: productInfo.price,
          status: productInfo.status,
        }}
      />
    </>
  );
}

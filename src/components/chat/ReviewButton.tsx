'use client';
import { useState } from 'react';
import { ReviewDialog } from '@/components/common';
import { MemberSummary } from '@/types/member';
import { ReviewData, ReviewType } from '@/types/review';
import { StatusBadge } from '../icons';

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

  // 현재 사용자가 판매자인지 구매자인지 판단
  const isCurrentUserSeller = currentUserUuid === productInfo.sellerUuid;
  const reviewType: ReviewType = isCurrentUserSeller
    ? 'seller-to-buyer'
    : 'buyer-to-seller';

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    try {
      console.log('리뷰 데이터:', reviewData);
      // TODO: 리뷰 API 호출

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

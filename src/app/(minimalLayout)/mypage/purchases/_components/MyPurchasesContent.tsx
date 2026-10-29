import { ShoppingCart } from 'lucide-react';
import type { BidHistory } from '@/types/auction';
import { EmptyState } from '@/components/common/EmptyState';
import { MyBidHistoryList } from '@/components/mypage/MyBidHistoryList';
import { summarizeBidHistory } from '@/libs/bidHistory';

export function MyPurchasesContent({
  bidHistory,
}: {
  bidHistory: BidHistory[];
}) {
  const groups = summarizeBidHistory(bidHistory);
  if (!groups.length) {
    return (
      <EmptyState
        className='[&_a]:bg-primary-200 [&_a]:hover:bg-primary-300'
        icon={ShoppingCart}
        title='참여한 거래가 없습니다'
        description='관심있는 상품에 입찰해보세요!'
        actionText='경매 둘러보기'
        actionHref='/auctions'
      />
    );
  }
  return <MyBidHistoryList groups={groups} />;
}

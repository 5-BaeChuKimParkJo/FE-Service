import { BidHistory } from '@/types/auction';

export interface AuctionStatus {
  text: string;
  color: string;
}

export const getAuctionStatus = (
  auction: BidHistory['auction'],
  bidder: BidHistory['bidder'],
): AuctionStatus => {
  const isActive = auction.status === 'active';
  const isEnded = auction.status === 'ended';
  const isWaiting = auction.status === 'waiting';
  const isWinning = auction.currentBid === bidder.bidAmount && isEnded;

  if (isWinning) {
    return {
      text: '낙찰',
      color: 'text-green-600 bg-green-100 border border-green-200',
    };
  }
  if (isWaiting) {
    return { text: '대기중', color: 'text-yellow-600 bg-yellow-50' };
  }
  if (isActive) {
    return { text: '진행중', color: 'text-green-600 bg-green-50' };
  }
  if (isEnded) {
    return { text: '유찰', color: 'text-gray-600 bg-gray-50' };
  }
  return { text: '취소됨', color: 'text-red-600 bg-red-50' };
};

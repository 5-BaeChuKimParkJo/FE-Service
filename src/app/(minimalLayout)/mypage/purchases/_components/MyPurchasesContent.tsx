import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { BidHistory } from '@/types/auction';
import { formatCurrency } from '@/utils/format';

import Image from 'next/image';
import { getAuctionStatus } from '@/utils/auction-status';
import { EmptyState } from '@/components/common/EmptyState';

interface MyPurchasesContentProps {
  bidHistory: BidHistory[];
}

export function MyPurchasesContent({ bidHistory }: MyPurchasesContentProps) {
  if (!bidHistory || bidHistory.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title='참여한 거래가 없습니다'
        description='관심있는 상품에 입찰해보세요!'
        actionText='경매 둘러보기'
        actionHref='/auctions'
      />
    );
  }

  return (
    <section aria-label='내 입찰 내역'>
      <ul className='space-y-4' role='list'>
        {bidHistory.map((item) => (
          <li key={`${item.bidder.bidderUuid}-${item.auction.auctionUuid}`}>
            <BidHistoryCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface BidHistoryCardProps {
  item: BidHistory;
}

function BidHistoryCard({ item }: BidHistoryCardProps) {
  const { bidder, auction } = item;
  const isWinning =
    auction.currentBid === bidder.bidAmount && auction.status === 'ended';
  const status = getAuctionStatus(auction, bidder);

  return (
    <Link href={`/auctions/${auction.auctionUuid}`}>
      <article className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            <Image
              src={auction.thumbnailUrl || '/images/dummy/dummy1.png'}
              alt={auction.title}
              className='w-20 h-20 object-cover rounded-lg'
              width={80}
              height={80}
            />
          </div>

          <div className='flex-1 min-w-0'>
            <header className='flex items-start justify-between mb-2'>
              <h3 className='font-medium text-gray-900 truncate pr-2 flex items-center gap-2'>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}
                  role='status'
                  aria-label={`경매 상태: ${status.text}`}
                >
                  {status.text}
                </span>
                <span className='line-clamp-1'>{auction.title}</span>
              </h3>
            </header>

            <dl className='space-y-1 text-sm text-gray-500'>
              <div className='flex items-center justify-between'>
                <dt>내 입찰가</dt>
                <dd
                  className={`font-medium ${isWinning ? 'text-primary-100' : 'text-gray-900'}`}
                >
                  {formatCurrency(bidder.bidAmount)}원
                </dd>
              </div>

              <div className='flex items-center justify-between'>
                <dt>현재 입찰가</dt>
                <dd
                  className={`font-medium ${isWinning ? 'text-primary-200' : 'text-gray-900'}`}
                >
                  {formatCurrency(auction.currentBid)}원
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </article>
    </Link>
  );
}

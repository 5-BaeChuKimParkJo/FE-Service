'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, X } from 'lucide-react';
import {
  getRecentlyViewedAuctions,
  deleteRecentlyViewedAuction,
  groupAuctionsByDate,
  RecentlyViewedAuction,
} from '@/utils/recently-viewed-auctions';
import { formatCurrency } from '@/utils/format';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';

export function MyRecentAuctionsContent() {
  const [recentAuctions, setRecentAuctions] = useState<RecentlyViewedAuction[]>(
    [],
  );
  const [groupedAuctions, setGroupedAuctions] = useState<
    Array<{
      viewedAt: string;
      auctions: RecentlyViewedAuction[];
    }>
  >([]);

  useEffect(() => {
    const auctions = getRecentlyViewedAuctions();
    setRecentAuctions(auctions);
    setGroupedAuctions(groupAuctionsByDate(auctions));
  }, []);

  const handleDeleteAuction = (auctionUuid: string) => {
    const updatedAuctions = deleteRecentlyViewedAuction(auctionUuid);
    setRecentAuctions(updatedAuctions);
    setGroupedAuctions(groupAuctionsByDate(updatedAuctions));
  };

  if (recentAuctions.length === 0) {
    return (
      <div className='text-center py-16'>
        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Eye className='w-10 h-10 text-gray-400' />
        </div>
        <h3 className='text-lg font-semibold text-gray-700 mb-2'>
          최근본 경매가 없습니다
        </h3>
        <p className='text-sm text-gray-500 mb-6'>
          관심있는 경매들을 둘러보세요!
        </p>
        <Link
          href='/auctions'
          className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
        >
          경매 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <section className='space-y-6' aria-label='최근 본 경매 목록'>
      {groupedAuctions.map(({ viewedAt, auctions }) => (
        <div key={viewedAt} className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            {new Date(viewedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            {auctions.map((auction) => (
              <RecentAuctionCard
                key={auction.auctionUuid}
                auction={auction}
                onDelete={handleDeleteAuction}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

interface RecentAuctionCardProps {
  auction: RecentlyViewedAuction;
  onDelete: (auctionUuid: string) => void;
}

function RecentAuctionCard({ auction, onDelete }: RecentAuctionCardProps) {
  return (
    <article className='block bg-white border border-gray-400/50 rounded-lg p-3 hover:border-gray-300 transition-colors relative group'>
      <Link
        href={`/auctions/${auction.auctionUuid}`}
        className='block'
        aria-label={`${auction.title} 상세 보기`}
      >
        <div className='space-y-3'>
          <figure className='relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden'>
            <Image
              src={auction.thumbnailUrl || '/images/dummy/dummy1.png'}
              alt={`${auction.title} 경매 이미지`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </figure>

          <div className='space-y-2'>
            <header>
              <h3 className='font-medium text-gray-900 text-sm line-clamp-2 leading-tight'>
                {auction.title}
              </h3>
            </header>

            <div className='space-y-1 text-xs'>
              <div className='text-primary-300 font-medium'>
                {formatCurrency(auction.minimumBid)}
              </div>
              <div className='text-gray-500'>
                <time dateTime={auction.viewedAt}>
                  {formatDistanceToNow(new Date(auction.viewedAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          onDelete(auction.auctionUuid);
        }}
        className='absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100'
        aria-label='최근 본 경매에서 삭제'
      >
        <X className='w-3 h-3 text-gray-500' />
      </button>
    </article>
  );
}

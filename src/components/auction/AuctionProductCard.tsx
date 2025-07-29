import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/libs/cn';
import { MinimalAuctionTimer } from './MinimalAuctionTimer';
import { formatNumber } from '@/utils/format';

interface AuctionProductCardProps {
  auctionUuid: string;
  title: string;
  minimumBid: number;
  startAt: string;
  endAt: string;
  status: string;
  viewCount: number;
  thumbnailUrl: string;

  bidAmount?: number;
  LikeButtonComponent: React.ComponentType<{
    auctionUuid: string;
    onLike?: (auctionUuid: string) => void;
  }>;
  onLike?: (auctionUuid: string) => void;
  className?: string;
}

export function AuctionProductCard({
  auctionUuid,
  title,
  minimumBid,
  startAt,
  endAt,
  status,
  viewCount,
  thumbnailUrl,

  bidAmount,

  className,
}: AuctionProductCardProps) {
  const currentPrice = bidAmount || minimumBid;

  const now = Date.now();
  const startTime = new Date(startAt).getTime();
  const endTime = new Date(endAt).getTime();
  const isExpired = now >= endTime;
  const isNotStarted = now < startTime;

  return (
    <section
      className={cn('overflow-hidden transition-all duration-300', className)}
    >
      <Link href={`/auctions/${auctionUuid}`}>
        <div className='relative aspect-square overflow-hidden rounded-lg'>
          <Image
            src={thumbnailUrl}
            alt={title}
            width={100}
            height={100}
            priority
            className='object-cover transition-transform duration-300 hover:scale-105 w-full h-full'
          />

          {(status === 'ended' || isExpired) && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <span className='text-white font-semibold text-lg'>
                경매 종료
              </span>
            </div>
          )}

          {(status === 'waiting' || isNotStarted) && (
            <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
              <span className='text-white font-semibold text-lg'>
                오픈 대기
              </span>
            </div>
          )}
        </div>

        <h1 className='mt-2 mb-1 ml-2  leading-tight line-clamp-2 min-h-[2.5rem] overflow-hidden'>
          {title}
        </h1>
      </Link>

      <div className='ml-2 space-y-1'>
        <p className='text-xl font-bold'>{formatNumber(currentPrice)}원</p>
        <span className='flex items-center mr-3 justify-between text-xs text-gray-500 gap-1'>
          <p className='text-sm text-gray-500 line-through'>
            {formatNumber(minimumBid)}원
          </p>
          <div className='flex items-center gap-1'>
            <Eye className='w-3 h-3' />
            <span>{formatNumber(viewCount)}</span>
          </div>
        </span>
      </div>

      <MinimalAuctionTimer
        startAt={startAt}
        endAt={endAt}
        status={status}
        className='mx-2 my-1'
      />
    </section>
  );
}

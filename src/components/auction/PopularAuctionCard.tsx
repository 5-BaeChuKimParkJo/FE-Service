import Image from 'next/image';
import Link from 'next/link';
import { Eye, Gavel } from 'lucide-react';
import type { PopularAuction } from '@/types/auction/popular-auctions';
import { MinimalAuctionTimer } from './MinimalAuctionTimer';
import { isApplicationMediaUrl } from '@/utils/media-url';

function formatDecimal(value: string): string {
  const [integer, fraction] = value.split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

export function PopularAuctionCard({ auction }: { auction: PopularAuction }) {
  const price =
    auction.currentBid === '0' ? auction.minimumBid : auction.currentBid;

  return (
    <li className='w-[250px] max-w-full shrink-0'>
      <Link
        href={`/auctions/${encodeURIComponent(auction.auctionUuid)}`}
        aria-label={`${auction.rank}위 ${auction.title}`}
        className='block h-full overflow-hidden rounded-[8px] bg-white shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary-100'
      >
        <article>
          <header className='relative h-[100px] w-full bg-gray-100'>
            {auction.thumbnailUrl ? (
              <Image
                src={auction.thumbnailUrl}
                alt={auction.title}
                fill
                sizes='250px'
                className='object-cover'
                unoptimized={isApplicationMediaUrl(auction.thumbnailUrl)}
              />
            ) : null}
            <span className='absolute left-2 top-2 min-w-8 rounded bg-primary-100 px-2 py-1 text-center text-sm font-bold text-white'>
              {auction.rank}위
            </span>
          </header>
          <div className='flex flex-col gap-2 px-4 py-3'>
            <h3 className='truncate text-base font-bold' title={auction.title}>
              {auction.title}
            </h3>
            <p className='min-h-6 break-all text-right text-lg font-bold tabular-nums'>
              {formatDecimal(price)}원
            </p>
            <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600'>
              <span className='flex min-w-0 items-start gap-1'>
                <Eye className='mt-0.5 size-3 shrink-0' aria-hidden='true' />
                <span className='break-all'>
                  조회 {formatDecimal(auction.uniqueViewers)}명
                </span>
              </span>
              <span className='flex min-w-0 items-start gap-1'>
                <Gavel className='mt-0.5 size-3 shrink-0' aria-hidden='true' />
                <span className='break-all'>
                  입찰 {formatDecimal(auction.uniqueBidders)}명
                </span>
              </span>
            </div>
            <MinimalAuctionTimer
              startAt={auction.startAt}
              endAt={auction.endAt}
              status='active'
              className='w-full rounded-[8px]'
            />
          </div>
        </article>
      </Link>
    </li>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import {
  bidHistoryStatus,
  formatBidHistoryTime,
  type BidHistoryGroup,
} from '@/libs/bidHistory';
import { formatCurrency } from '@/utils/format';
import { isApplicationMediaUrl } from '@/utils/media-url';

export function MyBidHistoryCard({ group }: { group: BidHistoryGroup }) {
  const state = bidHistoryStatus(group.status);
  return (
    <article
      className='overflow-hidden rounded-xl border border-gray-200 bg-white'
      aria-labelledby={`history-${group.auctionUuid}`}
    >
      <div className='p-4'>
        <div className='flex gap-3'>
          <Image
            src={group.thumbnailUrl || '/images/dummy/dummy1.png'}
            alt=''
            width={72}
            height={72}
            unoptimized={isApplicationMediaUrl(group.thumbnailUrl || '')}
            className='h-[72px] w-[72px] shrink-0 rounded-lg bg-gray-50 object-cover'
          />
          <div className='min-w-0 flex-1'>
            <span
              className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${state.color}`}
            >
              {state.text}
            </span>
            <h2
              id={`history-${group.auctionUuid}`}
              className='mt-2 break-words text-sm font-semibold leading-6 text-gray-900'
            >
              {group.title}
            </h2>
          </div>
        </div>
        <dl className='mt-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 px-3 py-3'>
          <div>
            <dt className='text-xs text-gray-500'>내 최고 입찰가</dt>
            <dd className='mt-1 break-words text-base font-semibold tabular-nums text-gray-900'>
              {formatCurrency(group.highestBid)}원
            </dd>
          </div>
          <div>
            <dt className='text-xs text-gray-500'>현재 입찰가</dt>
            <dd className='mt-1 break-words text-base font-medium tabular-nums text-gray-700'>
              {formatCurrency(group.currentBid)}원
            </dd>
          </div>
        </dl>
        <div className='mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500'>
          <span>총 {group.bidCount}회 입찰</span>
          <span>
            최근 입찰{' '}
            <time
              dateTime={
                Number.isFinite(Date.parse(group.latestBidAt))
                  ? group.latestBidAt
                  : undefined
              }
            >
              {formatBidHistoryTime(group.latestBidAt)}
            </time>
          </span>
        </div>
      </div>
      <details className='group border-t border-gray-100'>
        <summary className='flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-200'>
          입찰 기록 {group.bidCount}회
          <ChevronDown
            aria-hidden='true'
            className='h-4 w-4 transition-transform group-open:rotate-180'
          />
        </summary>
        <ol
          aria-label={`${group.title} 입찰 기록`}
          className='space-y-3 border-t border-gray-100 px-4 py-3'
        >
          {group.bids.map((bid) => (
            <li
              key={bid.bidderUuid}
              className='flex flex-wrap items-center justify-between gap-2 text-xs'
            >
              <time
                dateTime={
                  Number.isFinite(Date.parse(bid.createdAt))
                    ? bid.createdAt
                    : undefined
                }
                className='text-gray-500'
              >
                {formatBidHistoryTime(bid.createdAt)}
              </time>
              <span className='font-medium tabular-nums text-gray-800'>
                {formatCurrency(bid.bidAmount)}원
              </span>
            </li>
          ))}
        </ol>
      </details>
      <div className='border-t border-gray-100 px-4 py-2'>
        <Link
          href={`/auctions/${encodeURIComponent(group.auctionUuid)}`}
          prefetch={false}
          className='flex min-h-11 items-center justify-between gap-2 text-sm font-medium text-primary-200'
        >
          {group.status === 'ended' ? '상세 · 결제 확인' : '경매 상세 보기'}
          <ArrowUpRight aria-hidden='true' className='h-4 w-4 shrink-0' />
        </Link>
      </div>
    </article>
  );
}

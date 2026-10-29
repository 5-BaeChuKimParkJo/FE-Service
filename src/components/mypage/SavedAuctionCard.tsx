import Image from 'next/image';
import Link from 'next/link';
import type { SavedAuction } from '@/types/auction/saved-auctions';
import { formatSavedAmount } from '@/libs/savedAuctions';
import { formatBidHistoryTime, bidHistoryStatus } from '@/libs/bidHistory';
import { SavedAuctionButton } from '@/components/auction/SavedAuctionButton';
import { isApplicationMediaUrl } from '@/utils/media-url';

export function SavedAuctionCard({ item }: { item: SavedAuction }) {
  const state = bidHistoryStatus(item.status);
  const amount = item.currentBid === '0' ? item.minimumBid : item.currentBid;
  return (
    <article
      aria-labelledby={'saved-' + item.auctionUuid}
      className='rounded-xl border border-gray-200 bg-white p-4'
    >
      <Link
        href={'/auctions/' + encodeURIComponent(item.auctionUuid)}
        prefetch={false}
        className='flex gap-3'
      >
        <Image
          src={item.thumbnailUrl || '/images/dummy/dummy1.png'}
          alt=''
          width={72}
          height={72}
          unoptimized={isApplicationMediaUrl(item.thumbnailUrl || '')}
          className='h-[72px] w-[72px] shrink-0 rounded-lg bg-gray-50 object-cover'
        />
        <div className='min-w-0 flex-1'>
          <span
            className={
              'inline-flex rounded-md px-2 py-1 text-xs font-medium ' +
              state.color
            }
          >
            {state.text}
          </span>
          <h2
            id={'saved-' + item.auctionUuid}
            className='mt-2 break-words text-sm font-semibold leading-6 text-gray-900'
          >
            {item.title}
          </h2>
        </div>
      </Link>
      <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3'>
        <div>
          <p className='text-xs text-gray-500'>현재 가격</p>
          <p className='mt-1 break-all text-base font-semibold tabular-nums text-gray-900'>
            {formatSavedAmount(amount)}원
          </p>
        </div>
        <SavedAuctionButton
          auctionUuid={item.auctionUuid}
          initial={{ ok: true, saved: true }}
        />
      </div>
      <p className='mt-3 text-xs text-gray-500'>
        관심 등록{' '}
        <time dateTime={item.savedAt}>
          {formatBidHistoryTime(item.savedAt)}
        </time>
      </p>
    </article>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { CountUp } from '../ui';
import { MinimalAuctionTimer } from '@/components/auction/MinimalAuctionTimer';
import { formatNumber } from '@/utils/format';
import { SearchAuctionItem } from '@/types/auction/search-products';

export interface AuctionPreview {
  auctionUuid: string;
  title: string;
  imageUrl: string;
  minimumBid: number;
  currentPrice: number;
  startAt: string;
  endAt: string;
  status: string;
  isLiked?: boolean;
}

export function AuctionPreviewCard({
  auction,
}: {
  auction: SearchAuctionItem;
}) {
  const countUpFrom = auction.currentBid === 0 ? 0 : auction.minimumBid;
  const countUpTo =
    auction.currentBid === 0 ? auction.minimumBid : auction.currentBid;

  return (
    <Link
      href={`/auctions/${auction.auctionUuid}`}
      className='flex-shrink-0 rounded-2xl bg-white shadow-sm overflow-hidden transition hover:shadow-md w-full max-w-[250px]'
    >
      <article>
        <header className='relative w-full h-[100px]'>
          <Image
            src={auction.thumbnailUrl}
            alt={auction.auctionTitle}
            fill
            className='object-cover'
          />
        </header>
        <section className='py-3 px-4 flex flex-col gap-2'>
          <h3 className='text-base font-bold truncate'>
            {auction.auctionTitle}
          </h3>
          <div className='flex justify-end items-end gap-2 pr-3'>
            <span className='text-gray-400 line-through text-sm'>
              {formatNumber(auction.minimumBid)}
            </span>
            <span className='text-xl h-6 font-bold text-black'>
              <CountUp from={countUpFrom} to={countUpTo} separator=',' />
            </span>
          </div>
          <footer className='mt-1'>
            <MinimalAuctionTimer
              startAt={auction.startAt}
              endAt={auction.endAt}
              status={auction.status || 'active'}
              className='w-full'
            />
          </footer>
        </section>
      </article>
    </Link>
  );
}

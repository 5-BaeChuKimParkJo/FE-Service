import Image from 'next/image';
import Link from 'next/link';
import type { MySale } from '@/types/auction/my-sales';
import { formatMySalesAmount, mySalesStatuses } from '@/libs/mySales';
import { formatBidHistoryTime } from '@/libs/bidHistory';
import { isApplicationMediaUrl } from '@/utils/media-url';

export function MySaleCard({ item }: { item: MySale }) {
  const amount =
    BigInt(item.currentBid) > BigInt(item.minimumBid)
      ? item.currentBid
      : item.minimumBid;
  const visible = !['hidden', 'cancelled'].includes(item.status);
  return (
    <article
      aria-labelledby={'sale-' + item.auctionUuid}
      className='rounded-xl border border-gray-200 bg-white p-4'
    >
      <div className='flex gap-3'>
        <Image
          src={item.thumbnailUrl || '/images/dummy/dummy1.png'}
          alt=''
          width={72}
          height={72}
          unoptimized={isApplicationMediaUrl(item.thumbnailUrl)}
          className='h-[72px] w-[72px] shrink-0 rounded-lg bg-gray-50 object-cover'
        />
        <div className='min-w-0 flex-1'>
          <span
            className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${item.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          >
            {mySalesStatuses[item.status]}
          </span>
          <h2
            id={'sale-' + item.auctionUuid}
            className='mt-2 break-words text-sm font-semibold leading-6 text-gray-900'
          >
            {item.title}
          </h2>
        </div>
      </div>
      <dl className='mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm'>
        <div className='flex flex-wrap justify-between gap-2'>
          <dt className='text-gray-500'>
            {item.bidCount ? '현재 최고가' : '시작가'}
          </dt>
          <dd className='break-all font-semibold tabular-nums text-gray-900'>
            {formatMySalesAmount(amount)}원
          </dd>
        </div>
        <div className='flex justify-between gap-2'>
          <dt className='text-gray-500'>입찰 횟수</dt>
          <dd className='text-gray-900'>
            {item.bidCount.toLocaleString('ko-KR')}회
          </dd>
        </div>
        <div className='flex flex-wrap justify-between gap-2'>
          <dt className='text-gray-500'>마감</dt>
          <dd className='text-gray-700'>
            <time dateTime={item.endAt}>
              {formatBidHistoryTime(item.endAt)}
            </time>
          </dd>
        </div>
      </dl>
      <Link
        href={'/mypage/sales/' + item.auctionUuid}
        prefetch={false}
        className='mr-2 mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary-200 px-3 text-sm font-medium text-white'
      >
        경매 관리
      </Link>
      {visible ? (
        <Link
          href={'/auctions/' + item.auctionUuid}
          prefetch={false}
          className='mt-4 inline-flex min-h-11 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700'
        >
          경매 상세 보기
        </Link>
      ) : (
        <p className='mt-4 text-xs leading-5 text-gray-500'>
          숨김·취소 경매는 공개 상세를 제공하지 않습니다.
        </p>
      )}
    </article>
  );
}

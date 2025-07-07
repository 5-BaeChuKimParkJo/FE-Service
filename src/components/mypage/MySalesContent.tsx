import { AuctionHistory } from '@/types/auction';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/date';
import { ShoppingBag } from 'lucide-react';

interface MySalesContentProps {
  auctions: AuctionHistory[];
}

export function MySalesContent({ auctions }: MySalesContentProps) {
  if (!Array.isArray(auctions)) {
    return (
      <section className='text-center py-16' role='alert' aria-live='polite'>
        <p className='text-gray-500'>상품을 불러오는 중 오류가 발생했습니다.</p>
      </section>
    );
  }

  if (auctions.length === 0) {
    return (
      <section className='text-center py-16'>
        <div
          className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'
          role='img'
          aria-label='상품 없음'
        >
          <ShoppingBag className='w-10 h-10 text-gray-400' aria-hidden='true' />
        </div>
        <h2 className='text-lg font-semibold text-gray-700 mb-2'>
          등록한 상품이 없습니다
        </h2>
        <p className='text-sm text-gray-500 mb-6'>첫 경매를 시작해보세요!</p>
        <Link
          href='/auctions/create'
          className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
        >
          경매 등록하기
        </Link>
      </section>
    );
  }

  return (
    <section className='space-y-4' aria-label='판매한 상품 목록'>
      {auctions.map((auction) => (
        <SalesCard key={auction.auctionUuid} auction={auction} />
      ))}
    </section>
  );
}

function SalesCard({ auction }: { auction: AuctionHistory }) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { text: '대기중', className: 'bg-yellow-100 text-yellow-800' },
      active: { text: '진행중', className: 'bg-green-100 text-green-800' },
      ended: { text: '종료', className: 'bg-gray-100 text-gray-800' },
      cancelled: { text: '취소', className: 'bg-red-100 text-red-800' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.waiting;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
        role='status'
        aria-label={`경매 상태: ${config.text}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <article className='block bg-white border border-gray-400/50 rounded-lg p-4 hover:border-gray-300 transition-colors'>
      <Link
        href={`/auctions/${auction.auctionUuid}`}
        className='block'
        aria-label={`${auction.title} 상세 보기`}
      >
        <div className='flex gap-4'>
          <figure className='relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden'>
            <Image
              src={auction.thumbnailUrl}
              alt={`${auction.title} 상품 이미지`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </figure>

          <div className='flex-1 min-w-0'>
            <header className='flex items-start justify-between mb-2'>
              <h3 className='font-medium text-gray-900 truncate pr-2 flex items-center gap-2'>
                {getStatusBadge(auction.status)}
                <span className='line-clamp-1'>{auction.title}</span>
              </h3>
            </header>

            <dl className='space-y-1 text-sm text-gray-500'>
              <div className='flex items-center justify-between'>
                <dt>시작가</dt>
                <dd className='font-medium text-gray-900'>
                  {auction.minimumBid.toLocaleString()}원
                </dd>
              </div>

              <div className='flex items-center justify-between'>
                <dt>등록일</dt>
                <dd>
                  <time dateTime={auction.createdAt}>
                    {formatDate(auction.createdAt)}
                  </time>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Link>
    </article>
  );
}

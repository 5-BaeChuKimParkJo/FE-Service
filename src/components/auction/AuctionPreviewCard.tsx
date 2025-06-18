import Image from 'next/image';
import Link from 'next/link';
import { CountUp } from '../ui';
import { MinimalAuctionTimer } from '@/components/auction/MinimalAuctionTimer';

// 경매 미리보기 타입 정의
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

// 더미 데이터 예시
const dummyAuction: AuctionPreview = {
  auctionUuid: '1',
  title: '경매상품 테스트 제목',
  imageUrl: '/images/dummy/dummy2.png',
  minimumBid: 215000,
  currentPrice: 700000,
  startAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전 시작
  endAt: new Date(Date.now() + 1000 * 60 * 60 * 2 + 1000 * 36).toISOString(), // 2시간 36초 후 종료
  status: 'active',
  isLiked: true,
};

export function AuctionPreviewCard({
  auction = dummyAuction,
}: {
  auction?: AuctionPreview;
}) {
  // 가격 포맷팅
  const formatPrice = (price: number) => price.toLocaleString('ko-KR');

  return (
    <Link
      href={`/auction/${auction.auctionUuid}`}
      className='flex-shrink-0 rounded-2xl bg-white shadow-sm overflow-hidden transition hover:shadow-md  w-full max-w-[250px] '
    >
      <div className='relative w-full h-[100px]'>
        <Image
          src={auction.imageUrl}
          alt={auction.title}
          fill
          className='object-cover'
        />
      </div>
      <div className='py-3 px-4 flex flex-col gap-2'>
        <div className='text-base font-bold truncate'>{auction.title}</div>
        <div className='flex justify-end items-end gap-2 pr-3'>
          <span className='text-gray-400 line-through text-sm'>
            {formatPrice(auction.minimumBid)}
          </span>
          <span className='text-xl h-6 font-bold text-black'>
            <CountUp
              from={auction.minimumBid}
              to={auction.currentPrice}
              separator=','
            />
          </span>
        </div>
        <div className='mt-1'>
          <MinimalAuctionTimer
            startAt={auction.startAt}
            endAt={auction.endAt}
            status={auction.status}
            className='w-full'
          />
        </div>
      </div>
    </Link>
  );
}

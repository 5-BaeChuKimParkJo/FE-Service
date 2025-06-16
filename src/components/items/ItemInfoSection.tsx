'use client';

import Image from 'next/image';
import { Heart, Eye, Users } from 'lucide-react';
import { AuctionTimer } from './AuctionTimer';
import { AuctionDetailResponse } from '@/types/auction';

export function ItemInfoSection({
  auction,
}: {
  auction: AuctionDetailResponse;
}) {
  // 현재 시간 기준으로 테스트 가능한 시간 설정
  const now = new Date();
  const testEndTime = new Date(
    now.getTime() +
      2 * 24 * 60 * 60 * 1000 +
      3 * 60 * 60 * 1000 +
      15 * 60 * 1000,
  ); // 현재 시간 + 2일 3시간 15분
  //   const testEndTime = new Date(
  //     now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000,
  //   ); // 현재 시간 + 5시간 30분 45초 (24시간 이하 테스트용)

  const dummyData = {
    title: auction.title || 'BT21 Bag',
    likes: auction.likes || 130,
    profileImageUrl: auction.profileImageUrl || '/placeholder.svg',
    nickname: auction.nickname || 'BTS Forever',
    minimumBid: auction.minimumBid || 35000,
    startAt: auction.startAt || now.toISOString(),
    endAt: auction.endAt || testEndTime.toISOString(),
    bidAmount: auction.bidAmount || 39000,
    viewCount: auction.viewCount || 156,
    bidderCount: auction.bidderCount || 25,
  };

  // 숫자 포맷팅 (천단위 콤마)
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <section className='px-4 py-6 '>
      {/* 제목과 좋아요 */}
      <header className='flex items-start justify-between mb-1'>
        {/* 판매자 정보 */}
        <div className='flex items-center gap-3 '>
          <div className='relative w-12 h-12 rounded-full overflow-hidden'>
            <Image
              src={dummyData.profileImageUrl}
              alt={`${dummyData.nickname} 프로필`}
              fill
              className='object-cover'
            />
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-gray-900 font-medium'>
              {dummyData.nickname}
            </span>
            <span className='px-2 py-1 bg-primary-100 text-white text-xs font-normal rounded-full'>
              경매자
            </span>
          </div>
        </div>

        <button
          className=' items-center gap-1 text-red-500 touch-manipulation'
          aria-label='좋아요'
        >
          <Heart size={24} fill='currentColor' />
          <span className='text-lg font-medium'>{dummyData.likes}</span>
        </button>
      </header>
      <div className='flex items-center justify-end gap-4 pb-2 text-sm text-gray-600'>
        <div className='flex items-center gap-1'>
          <Users size={16} />
          <span>{dummyData.bidderCount}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Eye size={16} />
          <span>{dummyData.viewCount}</span>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900 flex-1 mr-4'>
          {dummyData.title}
        </h1>
      </div>
      {/* 가격 정보 */}
      <div className='mb-6'>
        <div className='text-right mb-2'>
          <span className='text-2xl font-bold text-gray-900'>
            {formatPrice(dummyData.bidAmount)} 원
          </span>
        </div>
        <div className='text-right text-sm mb-2 text-gray-500'>
          시작가: {formatPrice(dummyData.minimumBid)} 원
        </div>
      </div>

      <AuctionTimer startAt={dummyData.startAt} endAt={dummyData.endAt} />
    </section>
  );
}

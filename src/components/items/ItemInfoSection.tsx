'use client';

import Image from 'next/image';
import { Heart, Eye, Users } from 'lucide-react';
import { AuctionTimer } from './AuctionTimer';
import { MemberInfo } from '@/types/member';
import { CatalogAuctionResponseDto } from '@/types/auction/auction-read';
import { formatNumber } from '@/utils/format';

export function ItemInfoSection({
  auction,
  memberInfo,
  bidAmount,
}: {
  auction: CatalogAuctionResponseDto;
  memberInfo: MemberInfo;
  bidAmount: number;
}) {
  const dummyData = {
    title: auction.title,
    likes: auction.likes || 130,
    profileImageUrl: memberInfo.profileImageUrl || '/images/dummy/airpods.png',
    nickname: memberInfo.nickname,
    minimumBid: auction.minimumBid,
    startAt: auction.startAt,
    endAt: auction.endAt,
    bidAmount: bidAmount,
    viewCount: auction.viewCount,
    bidderCount: auction.bidderCount || 25,
  };

  return (
    <section className='px-4 py-6 '>
      {/* 제목과 좋아요 */}
      <header className='flex items-start justify-between mb-1'>
        {/* 판매자 정보 */}
        <div className='flex items-center gap-3 '>
          <div className='relative w-12 h-12 rounded-full overflow-hidden'>
            <Image
              src={dummyData.profileImageUrl || '/images/dummy/profile.png'}
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
            {formatNumber(dummyData.bidAmount)} 원
          </span>
        </div>
        <div className='text-right text-sm mb-2 text-gray-500'>
          시작가: {formatNumber(dummyData.minimumBid)} 원
        </div>
      </div>

      <AuctionTimer startAt={dummyData.startAt} endAt={dummyData.endAt} />
    </section>
  );
}

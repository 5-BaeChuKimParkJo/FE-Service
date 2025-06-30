import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';
import { CatalogAuctionResponseDto } from '@/types/auction/auction-read';
import { formatNumber } from '@/utils/format';
import {
  DealInfo,
  ProductCategory,
  ProductCondition,
  ProductConditionType,
} from './details';

export function ItemInfoSection({
  auction,
}: {
  auction: CatalogAuctionResponseDto;
}) {
  return (
    <section className='divide-y divide-gray-200'>
      <div className='px-4 py-5'>
        <header className='mb-1 flex items-start justify-between'>
          <div className='flex items-center gap-3 '>
            <div className='relative h-12 w-12 overflow-hidden rounded-full'>
              <Image
                src={
                  auction.seller.profileImageUrl || '/images/dummy/profile.png'
                }
                alt={`${auction.seller.nickname} 프로필`}
                fill
                className='object-cover'
              />
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-medium text-gray-900'>
                {auction.seller.nickname}
              </span>
              <span className='rounded-full bg-primary-100 px-2 py-1 text-xs font-normal text-white'>
                경매자
              </span>
            </div>
          </div>

          <button
            className=' items-center gap-1 text-red-500 touch-manipulation'
            aria-label='좋아요'
          >
            <Heart size={24} fill='currentColor' />
            <span className='text-lg font-medium'>{auction.likes}</span>
          </button>
        </header>
        <div className='flex items-center justify-end gap-4 pb-2 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            <Eye size={16} />
            <span>{auction.viewCount}</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <h1 className='mr-4 flex-1 text-2xl font-bold text-gray-900'>
            {auction.title}
          </h1>
        </div>
      </div>
      <div className='space-y-3 px-4 '>
        <ProductCategory category={auction.category.name} />
        <ProductCondition
          condition={auction.productCondition as ProductConditionType}
        />
        <DealInfo
          isDirectDeal={auction.isDirectDeal}
          location={auction.directDealLocation}
        />
      </div>
      <div className='px-4'>
        <div className='mb-2 text-right'>
          <span className='text-2xl font-bold text-gray-900'>
            {auction.currentBid
              ? formatNumber(auction.currentBid)
              : formatNumber(auction.minimumBid)}
            원
          </span>
        </div>
        <div className='mb-2 text-right text-sm text-gray-500'>
          시작가: {formatNumber(auction.minimumBid)} 원
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';
import { ProductDetailResponse } from '@/types/product';
import { formatNumber } from '@/utils/format';
import { DealInfo, ProductCategory, ProductCondition } from './details';

export function ProductInfoSection({
  product,
}: {
  product: ProductDetailResponse;
}) {
  return (
    <section className='divide-y divide-gray-200'>
      <div className='mt-2 px-6 py-5'>
        <header className='mb-1 flex items-start justify-between'>
          <div className='flex items-center gap-3 '>
            <div className='relative h-12 w-12 overflow-hidden rounded-full'>
              <Image
                src={
                  product.seller.profileImageUrl || '/images/dummy/profile.png'
                }
                alt={`${product.seller.nickname} 프로필`}
                fill
                className='object-cover'
              />
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-medium text-gray-900'>
                {product.seller.nickname}
              </span>
              <span className='rounded-full bg-primary-100 px-2 py-1 text-xs font-normal text-white'>
                판매자
              </span>
            </div>
          </div>

          <button
            className=' items-center gap-1 text-red-500 touch-manipulation'
            aria-label='좋아요'
          >
            <Heart size={24} />
            <span className='text-lg font-medium'>0</span>
          </button>
        </header>
        <div className='flex items-center justify-end gap-4 pb-2 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            <Eye size={16} />
            <span>{product.viewCount}</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <h1 className='mr-4 flex-1 text-2xl font-bold text-gray-900'>
            {product.title}
          </h1>
        </div>
        <div className='text-right'>
          <span className='text-3xl font-bold '>
            {formatNumber(product.price)}원
          </span>
        </div>
      </div>
      <div className='space-y-3 px-6 py-4'>
        <ProductCategory category={product.category.name} />
        <ProductCondition condition={product.productCondition} />
        <DealInfo
          isDirectDeal={product.isDirectDeal}
          location={product.directDealLocation}
        />
      </div>
    </section>
  );
}

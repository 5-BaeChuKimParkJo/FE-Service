import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';

import { formatNumber, formatPrice } from '@/utils/format';
import { formatRelativeTime } from '@/utils/date';
import { SearchProductItemType } from '@/types/product/search-product-type';

export default function ProductCard({
  product,
}: {
  product: SearchProductItemType;
}) {
  const isActive = product.status === 'ACTIVE';

  return (
    <article>
      <Link
        href={`/products/${product.productUuid}`}
        className={` rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
      >
        <div className='relative aspect-square overflow-hidden rounded-lg'>
          <Image
            src={product.imageUrlList[0].url}
            alt={product.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          />

          {/* 판매완료 오버레이 */}
          {!isActive && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <span className='text-white font-semibold text-lg'>판매완료</span>
            </div>
          )}
        </div>

        <div className='p-3'>
          <h1 className='leading-tight line-clamp-2 min-h-[2.5rem] overflow-hidden'>
            {product.title}
          </h1>

          <div className='flex items-center justify-between mb-2'>
            <span className='font-bold text-lg text-gray-900'>
              {formatPrice(product.price)}
            </span>
          </div>

          <div className='flex items-center justify-between text-xs text-gray-500'>
            <span>{formatRelativeTime(product.createdAt)}</span>
            <div className='flex items-center gap-1'>
              <Eye className='w-3 h-3' />
              <span>{formatNumber(product.viewCount)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

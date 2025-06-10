'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { findCategoryById } from '@/utils/category';
import { productConditionLabels } from '../utils/preview-utils';
import { useCategories } from '@/hooks/use-categories';

interface ProductInfoPreviewProps {
  animationDelay?: number;
}

export function ProductInfoPreview({
  animationDelay = 0.1,
}: ProductInfoPreviewProps) {
  const { title, description, categoryId, images, productCondition } =
    useCreateAuctionStore();
  const { data: categories = [] } = useCategories();

  const selectedCategory = findCategoryById(categories, categoryId);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='border rounded-xl bg-white p-6 space-y-5'
      aria-labelledby='product-info-title'
    >
      <header className='flex items-center space-x-2 pb-3 border-b'>
        <Package className='w-5 h-5 text-primary-100' aria-hidden='true' />
        <h3
          id='product-info-title'
          className='text-lg font-semibold text-gray-900'
        >
          상품 정보
        </h3>
      </header>

      <div className='space-y-4'>
        {/* 상품명 */}
        <div>
          <p className='text-sm font-medium text-gray-500 mb-1'>상품명</p>
          <p className='pl-2 text-lg font-medium text-gray-900'>{title}</p>
        </div>

        {/* 카테고리 */}
        <div>
          <p className='text-sm font-medium text-gray-500 mb-2'>카테고리</p>
          <div className='flex items-center space-x-3'>
            {selectedCategory ? (
              <>
                <div className='w-8 h-8 rounded-lg bg-primary-100/10 flex items-center justify-center'>
                  {selectedCategory.imageUrl ? (
                    <Image
                      src={selectedCategory.imageUrl}
                      alt={selectedCategory.name}
                      width={24}
                      height={24}
                      className='object-cover rounded'
                    />
                  ) : (
                    <span className='text-lg' role='img' aria-label='패키지'>
                      📦
                    </span>
                  )}
                </div>
                <span className='font-medium text-gray-900'>
                  {selectedCategory.name}
                </span>
              </>
            ) : (
              <span className='text-gray-400'>
                카테고리가 선택되지 않았습니다
              </span>
            )}
          </div>
        </div>

        {/* 상품 상태 */}
        <div>
          <p className='text-sm font-medium text-gray-500 mb-1'>상품 상태</p>
          <p className='pl-2 font-medium text-gray-900'>
            {productConditionLabels[productCondition]}
          </p>
        </div>

        {/* 상품 설명 */}
        <div>
          <p className='text-sm font-medium text-gray-500 mb-2'>상품 설명</p>
          <div className='border-gray-300 border rounded-lg p-3'>
            <p className='text-gray-900 whitespace-pre-wrap text-sm leading-relaxed'>
              {description}
            </p>
          </div>
        </div>

        {/* 상품 이미지 */}
        <div>
          <p className='text-sm font-medium text-gray-500 mb-2'>상품 이미지</p>
          <div className='pl-1 grid grid-cols-4 gap-3' role='list'>
            {images.map((image, index) => (
              <div
                key={image.key}
                className='relative aspect-square rounded-lg overflow-hidden border'
                role='listitem'
              >
                <Image
                  src={image.url || '/api/placeholder/100/100'}
                  alt={`상품 이미지 ${index + 1}`}
                  fill
                  className='object-cover'
                />
                {index === 0 && (
                  <div className='absolute top-1 left-1 bg-primary-100 text-white text-xs px-1.5 py-0.5 rounded'>
                    대표
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

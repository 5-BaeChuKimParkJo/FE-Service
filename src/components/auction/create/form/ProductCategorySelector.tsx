'use client';

import { useState } from 'react';
import { Tag } from 'lucide-react';
import Image from 'next/image';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { CategorySelector } from '@/components/category';
import { useCategories } from '@/hooks/useCategories';
import { findCategoryById } from '@/utils/category';

export function ProductCategorySelector() {
  const { categoryId, errors, setCategoryId } = useCreateAuctionStore();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 카테고리 데이터 가져오기
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const selectedCategory = findCategoryById(categories, categoryId);

  return (
    <section className='space-y-1'>
      <div
        className={`relative border-b transition-colors ${
          isFocused ? 'border-primary-100' : 'border-gray-300'
        } ${errors.categoryId ? 'border-red-500' : ''} ${
          isLoadingCategories ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <label
          className={`absolute transition-all duration-200 pointer-events-none ${
            isFocused || selectedCategory
              ? 'text-xs top-0 text-primary-100'
              : 'text-base text-gray-500 top-4'
          }`}
        >
          카테고리
        </label>

        <button
          type='button'
          onClick={() => setShowCategoryModal(true)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoadingCategories}
          className='w-full pt-6 pb-3 bg-transparent focus:outline-none text-left flex items-center justify-between font-medium'
          aria-describedby={errors.categoryId ? 'category-error' : undefined}
          aria-invalid={!!errors.categoryId}
          aria-expanded={showCategoryModal}
          aria-haspopup='dialog'
        >
          <div className='flex items-center gap-3'>
            {selectedCategory ? (
              <>
                <div className='w-5 h-5 rounded overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0'>
                  {selectedCategory.imageUrl ? (
                    <Image
                      src={selectedCategory.imageUrl || '/placeholder.svg'}
                      alt={selectedCategory.name}
                      width={20}
                      height={20}
                      className='object-cover'
                    />
                  ) : (
                    <span className='text-sm'>📦</span>
                  )}
                </div>
                <span className='text-gray-900'>{selectedCategory.name}</span>
              </>
            ) : (
              <span className='text-gray-500'>
                {isLoadingCategories ? '로딩 중...' : ''}
              </span>
            )}
          </div>
          <Tag className='w-5 h-5 text-gray-400' aria-hidden='true' />
        </button>
      </div>

      {errors.categoryId && (
        <p id='category-error' className='text-xs text-red-500' role='alert'>
          {errors.categoryId}
        </p>
      )}

      {/* 카테고리 선택 모달 */}
      {showCategoryModal && !isLoadingCategories && (
        <CategorySelector
          categories={categories}
          selectedId={categoryId}
          onSelect={(id: number) => {
            setCategoryId(id);
          }}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </section>
  );
}

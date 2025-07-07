'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryType } from '@/actions/category-service/get-categories';

interface CategoryFilterSliderProps {
  categories: CategoryType[];
  onCategorySelect?: (categoryName: string | null) => void;
}

export function CategoryFilterSlider({
  categories,
  onCategorySelect,
}: CategoryFilterSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('categoryName');
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    setShouldAutoScroll(true);
    const trimmedName = categoryName.split('/')[0].trim();

    if (onCategorySelect) {
      onCategorySelect(trimmedName);
    } else {
      // 기본 동작: auctions 페이지로 이동
      const params = new URLSearchParams(searchParams);
      params.set('categoryName', trimmedName);
      router.replace(`/auctions?${params.toString()}`);
    }
  };

  const handleAllCategoryClick = () => {
    setShouldAutoScroll(true);

    if (onCategorySelect) {
      onCategorySelect(null);
    } else {
      // 기본 동작: auctions 페이지로 이동
      const params = new URLSearchParams(searchParams);
      params.delete('categoryName');
      router.replace(`/auctions?${params.toString()}`);
    }
  };

  useEffect(() => {
    if (shouldAutoScroll && activeButtonRef.current) {
      setTimeout(() => {
        if (activeButtonRef.current) {
          const button = activeButtonRef.current;
          const container = button.parentElement;
          const scrollContainer = container?.parentElement;

          if (container && scrollContainer) {
            const buttonLeft = button.offsetLeft;
            const buttonWidth = button.offsetWidth;
            const containerWidth = scrollContainer.offsetWidth;

            const scrollLeft =
              buttonLeft - containerWidth / 2 + buttonWidth / 2;

            scrollContainer.scrollTo({
              left: scrollLeft,
              behavior: 'smooth',
            });
          }
        }
      }, 100);
      setShouldAutoScroll(false);
    }
  }, [currentCategory, shouldAutoScroll]);

  const isSelected = (categoryName: string) => {
    const trimmedName = categoryName.split('/')[0].trim();
    return currentCategory === trimmedName;
  };

  const isAllSelected = !currentCategory;

  return (
    <div className='overflow-x-auto scrollbar-hide -mx-4 px-4 mb-4'>
      <div className='flex gap-3 w-max'>
        <button
          ref={isAllSelected ? activeButtonRef : null}
          onClick={handleAllCategoryClick}
          className={`flex-shrink-0 px-4 py-2 rounded-xl transition-colors ${
            isAllSelected
              ? 'bg-primary-100 text-white'
              : 'bg-primary-100/5 text-primary-100 hover:bg-primary-100/10'
          }`}
        >
          <span className='text-sm font-medium whitespace-nowrap'>전체</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.categoryId}
            ref={isSelected(category.name) ? activeButtonRef : null}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl transition-colors ${
              isSelected(category.name)
                ? 'bg-primary-100 text-white'
                : 'bg-primary-100/5 text-primary-100 hover:bg-primary-100/10'
            }`}
          >
            <span className='text-sm font-medium whitespace-nowrap'>
              {category.name.split('/')[0].trim()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

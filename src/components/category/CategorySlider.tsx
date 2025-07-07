import React from 'react';
import Link from 'next/link';
import { CategoryType } from '@/actions/category-service/get-categories';

interface CategorySliderProps {
  categories: CategoryType[];
}

export function CategorySlider({ categories }: CategorySliderProps) {
  const firstRow = categories.slice(0, Math.ceil(categories.length / 2));
  const secondRow = categories.slice(Math.ceil(categories.length / 2));

  return (
    <div className='overflow-x-auto scrollbar-hide -mx-4 px-4 mb-2'>
      <div className='grid grid-rows-2 gap-2 w-max'>
        <div className='flex gap-3'>
          {firstRow.map((category) => (
            <Link
              key={category.categoryId}
              href={`/auctions?categoryName=${encodeURIComponent(category.name.split('/')[0].trim())}`}
              className='flex-shrink-0 px-4 py-2 bg-primary-100/5 rounded-xl '
            >
              <span className='text-sm font-medium text-primary-100 whitespace-nowrap'>
                {category.name.split('/')[0].trim()}
              </span>
            </Link>
          ))}
        </div>

        <div className='flex gap-3'>
          {secondRow.map((category) => (
            <Link
              key={category.categoryId}
              href={`/auctions?categoryName=${encodeURIComponent(category.name.split('/')[0].trim())}`}
              className='flex-shrink-0 px-4 py-2 bg-primary-100/5 rounded-xl '
            >
              <span className='text-sm font-medium text-primary-100 whitespace-nowrap'>
                {category.name.split('/')[0].trim()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

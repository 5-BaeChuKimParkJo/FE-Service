'use client';

import { useSearchParams } from 'next/navigation';
import { ProductGrid, ProductCardSkeleton } from '@/components/product';
import { CategoryFilterSlider } from '@/components/category';
import useSearchProductInfiniteScroll from '@/hooks/use-search-product-infinite-scroll';
import { CategoryType } from '@/actions/category-service/get-categories';

interface ProductContentProps {
  categories: CategoryType[];
}

export default function ProductContent({ categories }: ProductContentProps) {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get('categoryName');
  const sortBy = searchParams.get('sortBy');

  const {
    data: products,
    isLoading,
    isLoadingMore,
    hasNextPage,
    error,
    loadMoreRef,
  } = useSearchProductInfiniteScroll({
    searchQuery: '',
    filters: {
      sortBy: sortBy ? sortBy : 'latest',
      categoryName: categoryName ? decodeURIComponent(categoryName) : undefined,
    },
    enabled: true,
  });

  if (error) {
    return (
      <main className='text-center py-12'>
        <div className='text-red-500 text-lg mb-2'>오류가 발생했습니다</div>
        <div className='text-gray-400 text-sm'>{error}</div>
      </main>
    );
  }

  return (
    <>
      <CategoryFilterSlider categories={categories} isProduct={true} />

      {categoryName && (
        <div className='py-3 border-b'>
          <h2 className='text-md font-semibold text-gray-700'>
            {decodeURIComponent(categoryName)}
          </h2>
        </div>
      )}

      {isLoading && products.length === 0 ? (
        <div className='grid grid-cols-2 gap-4 p-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 && !isLoading ? (
            <div className='text-center py-12'>
              <div className='text-gray-500 text-lg mb-2'>
                {categoryName
                  ? `${decodeURIComponent(categoryName)} 카테고리에 상품이 없습니다`
                  : '상품이 없습니다'}
              </div>
              <div className='text-gray-400 text-sm'>
                나중에 다시 확인해주세요
              </div>
            </div>
          ) : (
            <ProductGrid
              products={products.map((product) => ({
                product: product,
              }))}
            />
          )}
        </>
      )}

      {hasNextPage && (
        <div ref={loadMoreRef} className='flex justify-center py-8'>
          {isLoadingMore && (
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-100'></div>
          )}
        </div>
      )}

      {!hasNextPage && !isLoadingMore && products.length > 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-500 text-sm'>
            {categoryName
              ? `${decodeURIComponent(categoryName)} 카테고리의 모든 상품을 불러왔습니다`
              : '모든 상품을 불러왔습니다'}
          </p>
        </div>
      )}
    </>
  );
}

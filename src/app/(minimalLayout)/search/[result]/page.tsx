'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  AuctionProductCard,
  AuctionProductCardSkeleton,
} from '@/components/auction';
import { LikeButton } from '@/components/auction/LikeButton';
import { SearchFilters } from '@/components/search';
import { CategoryFilterSlider } from '@/components/category';
import { SearchHeader } from '@/components/layouts';
import useSearchInfiniteScroll from '@/hooks/use-search-infinite-scroll';
import { useCategories } from '@/hooks/use-categories';

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const { data: categories = [] } = useCategories();

  const filters = useMemo(() => {
    const productCondition = searchParams.get('productCondition') || undefined;
    const tagNames = searchParams.get('tags')
      ? searchParams.get('tags')!.split(',').filter(Boolean)
      : undefined;
    const sortBy = searchParams.get('sortBy') || 'latest';
    const categoryName = searchParams.get('categoryName') || undefined;

    return {
      productCondition,
      tagNames,
      sortBy,
      categoryName,
    };
  }, [searchParams]);

  const {
    data: searchResults,
    isLoading,
    isLoadingMore,
    hasNextPage,
    error,
    loadMoreRef,
  } = useSearchInfiniteScroll({
    searchQuery: query,
    filters,
    enabled: !!query,
  });

  const handleCategorySelect = (categoryName: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (categoryName) {
      params.set('categoryName', categoryName);
    } else {
      params.delete('categoryName');
    }

    router.replace(`/search/${encodeURIComponent(query)}?${params.toString()}`);
  };

  const handleFiltersChange = (newFilters: {
    productCondition?: string;
    tagNames?: string[];
    sortBy?: string;
  }) => {
    const params = new URLSearchParams(searchParams);

    params.delete('productCondition');
    params.delete('tags');
    params.delete('sortBy');
    // categoryName은 유지 (CategoryFilterSlider에서 별도 관리)

    if (newFilters.productCondition) {
      params.set('productCondition', newFilters.productCondition);
    }
    if (newFilters.tagNames && newFilters.tagNames.length > 0) {
      params.set('tags', newFilters.tagNames.join(','));
    }
    if (newFilters.sortBy && newFilters.sortBy !== 'latest') {
      params.set('sortBy', newFilters.sortBy);
    }

    router.replace(`/search/${encodeURIComponent(query)}?${params.toString()}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <SearchHeader title={`'${query}' 검색 결과`} />

      <div className='pt-20'>
        {/* 카테고리 필터 슬라이더 */}
        <CategoryFilterSlider
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />

        <div className='mb-4'>
          <SearchFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
        </div>
      </div>

      <div className='px-4 py-6'>
        {error && (
          <div className='text-center py-12'>
            <div className='text-red-500 text-lg mb-2'>오류가 발생했습니다</div>
            <div className='text-gray-400 text-sm'>{error}</div>
          </div>
        )}

        {isLoading && searchResults.length === 0 && (
          <div className='grid grid-cols-2 gap-4'>
            {Array.from({ length: 8 }).map((_, index) => (
              <AuctionProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && !error && searchResults.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-500 text-lg mb-2'>
              검색 결과가 없습니다
            </div>
            <div className='text-gray-400 text-sm'>
              다른 검색어나 필터를 시도해보세요
            </div>
          </div>
        )}

        {searchResults.length > 0 && (
          <>
            <div className='grid grid-cols-2 gap-4'>
              {searchResults.map((auction) => (
                <AuctionProductCard
                  key={`${auction.auctionUuid}-${auction.createdAt}`}
                  auctionUuid={auction.auctionUuid}
                  title={auction.auctionTitle}
                  minimumBid={auction.minimumBid}
                  startAt={auction.startAt}
                  endAt={auction.endAt}
                  status={auction.status || 'active'}
                  viewCount={auction.viewCount}
                  thumbnailUrl={auction.thumbnailUrl}
                  bidAmount={auction.currentBid}
                  LikeButtonComponent={LikeButton}
                />
              ))}
            </div>

            {hasNextPage && (
              <div ref={loadMoreRef} className='flex justify-center py-8'>
                {isLoadingMore && (
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-100'></div>
                )}
              </div>
            )}

            {!hasNextPage && !isLoadingMore && (
              <div className='text-center py-8'>
                <p className='text-gray-500 text-sm'>
                  모든 검색 결과를 불러왔습니다
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

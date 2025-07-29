'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchProducts } from '@/actions/search-service';
import {
  SearchProductItemType,
  SearchProductRequest,
  SearchAfterProductCursor,
} from '@/types/product/search-product-type';

interface UseSearchProductInfiniteScrollProps {
  searchQuery: string;
  filters?: {
    productCondition?: string;
    tagNames?: string[];
    sortBy?: string;
    categoryName?: string;
  };
  enabled?: boolean;
}

export default function useSearchProductInfiniteScroll({
  searchQuery,
  filters,
  enabled = true,
}: UseSearchProductInfiniteScrollProps) {
  const [data, setData] = useState<SearchProductItemType[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lastProductUuid, setLastProductUuid] = useState<string | null>(null);
  const [lastProductCreatedAt, setLastProductCreatedAt] = useState<
    string | null
  >(null);
  const [lastProductPrice, setLastProductPrice] = useState<number | null>(null);
  const [lastProductViewCount, setLastProductViewCount] = useState<
    number | null
  >(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const productCondition = filters?.productCondition;
  const sortBy = filters?.sortBy;
  const categoryName = filters?.categoryName;

  // 첫 번째 데이터 로딩
  const loadInitialData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setData([]);
    setLastProductUuid(null);
    setLastProductCreatedAt(null);
    setLastProductPrice(null);
    setLastProductViewCount(null);
    setHasNextPage(true);

    try {
      const request: SearchProductRequest = {
        productTitle: searchQuery,
      };

      if (productCondition) {
        request.productCondition = productCondition;
      }
      if (filters?.tagNames && filters.tagNames.length > 0) {
        request.tagNames = filters.tagNames;
      }
      if (sortBy) {
        request.sortBy = sortBy;
      }
      if (categoryName) {
        request.categoryName = categoryName;
      }

      const response = await searchProducts(request);
      const newData = response.getProductSearchResponseVoList;

      setData(newData);

      if (newData.length > 0) {
        const lastItem = newData[newData.length - 1];
        setLastProductUuid(lastItem.productUuid || null);
        setLastProductCreatedAt(lastItem.createdAt || null);
        setLastProductPrice(lastItem.price || null);
        setLastProductViewCount(lastItem.viewCount || null);
      }

      setHasNextPage(newData.length >= 10);
    } catch (err) {
      console.error('상품 검색 데이터 로딩 실패:', err);
      setError('검색 결과를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    productCondition,
    sortBy,
    categoryName,
    enabled,
    filters?.tagNames,
  ]);

  const loadMoreData = useCallback(async () => {
    if (
      !enabled ||
      isLoadingMore ||
      !hasNextPage ||
      !lastProductUuid ||
      !lastProductCreatedAt
    ) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const request: SearchProductRequest = {
        productTitle: searchQuery,
      };

      if (productCondition) {
        request.productCondition = productCondition;
      }
      if (filters?.tagNames && filters.tagNames.length > 0) {
        request.tagNames = filters.tagNames;
      }
      if (sortBy) {
        request.sortBy = sortBy;
      }
      if (categoryName) {
        request.categoryName = categoryName;
      }

      const cursor: SearchAfterProductCursor = {
        lastProductUuid,
      };

      if (sortBy === 'priceHigh' || sortBy === 'priceLow') {
        if (lastProductPrice !== null) {
          cursor.lastProductPrice = lastProductPrice;
        }
      } else if (sortBy === 'recommended') {
        if (lastProductViewCount !== null) {
          cursor.lastProductViewCount = lastProductViewCount;
        }
      } else {
        cursor.lastProductCreatedAt = lastProductCreatedAt;
      }

      if (cursor.lastProductCreatedAt) {
        request.searchAfter1 = cursor.lastProductCreatedAt;
      }
      if (cursor.lastProductUuid) {
        request.searchAfter2 = cursor.lastProductUuid;
      }

      const response = await searchProducts(request);
      const newData = response.getProductSearchResponseVoList;

      if (newData.length > 0) {
        setData((prev) => [...prev, ...newData]);

        const lastItem = newData[newData.length - 1];
        setLastProductUuid(lastItem.productUuid || null);
        setLastProductCreatedAt(lastItem.createdAt || null);
        setLastProductPrice(lastItem.price || null);
        setLastProductViewCount(lastItem.viewCount || null);

        setHasNextPage(newData.length >= 10);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error('추가 상품 데이터 로딩 실패:', err);
      setError('추가 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    searchQuery,
    productCondition,
    sortBy,
    categoryName,
    enabled,
    isLoadingMore,
    hasNextPage,
    lastProductUuid,
    lastProductCreatedAt,
    lastProductPrice,
    lastProductViewCount,
    filters?.tagNames,
  ]);

  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;

    if (!currentLoadMoreRef || !hasNextPage) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore) {
          loadMoreData();
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(currentLoadMoreRef);

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMoreData, hasNextPage, isLoadingMore]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isLoadingMore,
    hasNextPage,
    error,
    loadMoreRef,
    refetch: loadInitialData,
  };
}

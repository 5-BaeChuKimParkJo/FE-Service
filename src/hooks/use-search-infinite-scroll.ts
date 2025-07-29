'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchAuctions } from '@/actions/search-service';
import {
  SearchAuctionItem,
  SearchAuctionRequest,
  SearchAfterCursor,
} from '@/types/auction';

interface UseSearchInfiniteScrollProps {
  searchQuery: string;
  filters?: {
    productCondition?: string;
    tagNames?: string[];
    sortBy?: string;
    categoryName?: string;
  };
  enabled?: boolean;
}

export default function useSearchInfiniteScroll({
  searchQuery,
  filters,
  enabled = true,
}: UseSearchInfiniteScrollProps) {
  const [data, setData] = useState<SearchAuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lastAuctionUuid, setLastAuctionUuid] = useState<string | null>(null);
  const [lastAuctionCreatedAt, setLastAuctionCreatedAt] = useState<
    string | null
  >(null);
  const [lastAuctionCurrentBid, setLastAuctionCurrentBid] = useState<
    number | null
  >(null);
  const [lastAuctionViewCount, setLastAuctionViewCount] = useState<
    number | null
  >(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const productCondition = filters?.productCondition;
  const sortBy = filters?.sortBy;
  const categoryName = filters?.categoryName;

  const loadInitialData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setData([]);
    setLastAuctionUuid(null);
    setLastAuctionCreatedAt(null);
    setLastAuctionCurrentBid(null);
    setLastAuctionViewCount(null);
    setHasNextPage(true);

    try {
      const request: SearchAuctionRequest = {
        auctionTitle: searchQuery,
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

      const response = await searchAuctions(request);
      const newData = response.getAuctionSearchResponseVoList;

      setData(newData);

      if (newData.length > 0) {
        const lastItem = newData[newData.length - 1];
        setLastAuctionUuid(lastItem.auctionUuid);
        setLastAuctionCreatedAt(lastItem.createdAt);
        setLastAuctionCurrentBid(lastItem.currentBid);
        setLastAuctionViewCount(lastItem.viewCount);
      }

      setHasNextPage(newData.length >= 10);
    } catch (err) {
      console.error('검색 데이터 로딩 실패:', err);
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
      !lastAuctionUuid ||
      !lastAuctionCreatedAt
    ) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const request: SearchAuctionRequest = {
        auctionTitle: searchQuery,
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

      const cursor: SearchAfterCursor = {
        lastAuctionUuid,
      };

      if (sortBy === 'priceHigh' || sortBy === 'priceLow') {
        if (lastAuctionCurrentBid !== null) {
          cursor.lastAuctionCurrentBid = lastAuctionCurrentBid;
        }
      } else if (sortBy === 'recommended') {
        if (lastAuctionViewCount !== null) {
          cursor.lastAuctionViewCount = lastAuctionViewCount;
        }
      } else {
        cursor.lastAuctionCreatedAt = lastAuctionCreatedAt;
      }

      request.searchAfter = [cursor];

      const response = await searchAuctions(request);
      const newData = response.getAuctionSearchResponseVoList;

      if (newData.length > 0) {
        setData((prev) => [...prev, ...newData]);

        const lastItem = newData[newData.length - 1];
        setLastAuctionUuid(lastItem.auctionUuid);
        setLastAuctionCreatedAt(lastItem.createdAt);
        setLastAuctionCurrentBid(lastItem.currentBid);
        setLastAuctionViewCount(lastItem.viewCount);

        setHasNextPage(newData.length >= 10);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error('추가 데이터 로딩 실패:', err);
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
    lastAuctionUuid,
    lastAuctionCreatedAt,
    lastAuctionCurrentBid,
    lastAuctionViewCount,
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

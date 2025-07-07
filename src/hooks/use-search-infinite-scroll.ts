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

  // 다음 페이지를 위한 커서 정보
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

  // 무한 스크롤 감지를 위한 ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 첫 번째 데이터 로딩
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
      // 직접 요청 객체 생성 (의존성 줄이기)
      const request: SearchAuctionRequest = {
        auctionTitle: searchQuery,
      };

      // 필터 추가
      if (filters?.productCondition) {
        request.productCondition = filters.productCondition;
      }
      if (filters?.tagNames && filters.tagNames.length > 0) {
        request.tagNames = filters.tagNames;
      }
      if (filters?.sortBy) {
        request.sortBy = filters.sortBy;
      }
      if (filters?.categoryName) {
        request.categoryName = filters.categoryName;
      }

      const response = await searchAuctions(request);
      const newData = response.getAuctionSearchResponseVoList;

      setData(newData);

      // 다음 페이지를 위한 커서 설정
      if (newData.length > 0) {
        const lastItem = newData[newData.length - 1];
        setLastAuctionUuid(lastItem.auctionUuid);
        setLastAuctionCreatedAt(lastItem.createdAt);
        setLastAuctionCurrentBid(lastItem.currentBid);
        setLastAuctionViewCount(lastItem.viewCount);
      }

      // 데이터가 적으면 더 이상 페이지가 없다고 가정
      setHasNextPage(newData.length >= 10);
    } catch (err) {
      console.error('검색 데이터 로딩 실패:', err);
      setError('검색 결과를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    filters?.productCondition,
    filters?.tagNames?.join(','),
    filters?.sortBy,
    filters?.categoryName,
    enabled,
  ]);

  // 더 많은 데이터 로딩
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
      // 직접 요청 객체 생성 (의존성 줄이기)
      const request: SearchAuctionRequest = {
        auctionTitle: searchQuery,
      };

      // 필터 추가
      if (filters?.productCondition) {
        request.productCondition = filters.productCondition;
      }
      if (filters?.tagNames && filters.tagNames.length > 0) {
        request.tagNames = filters.tagNames;
      }
      if (filters?.sortBy) {
        request.sortBy = filters.sortBy;
      }
      if (filters?.categoryName) {
        request.categoryName = filters.categoryName;
      }

      // 페이지네이션 커서 추가
      const cursor: SearchAfterCursor = {
        lastAuctionUuid, // UUID는 항상 포함
      };

      // 정렬 방식에 따라 첫번째 값 설정
      if (filters?.sortBy === 'priceHigh' || filters?.sortBy === 'priceLow') {
        if (lastAuctionCurrentBid !== null) {
          cursor.lastAuctionCurrentBid = lastAuctionCurrentBid;
        }
      } else if (filters?.sortBy === 'recommended') {
        if (lastAuctionViewCount !== null) {
          cursor.lastAuctionViewCount = lastAuctionViewCount;
        }
      } else {
        // latest의 경우 createdAt 사용
        cursor.lastAuctionCreatedAt = lastAuctionCreatedAt;
      }

      request.searchAfter = [cursor];

      const response = await searchAuctions(request);
      const newData = response.getAuctionSearchResponseVoList;

      if (newData.length > 0) {
        setData((prev) => [...prev, ...newData]);

        // 다음 페이지를 위한 커서 업데이트
        const lastItem = newData[newData.length - 1];
        setLastAuctionUuid(lastItem.auctionUuid);
        setLastAuctionCreatedAt(lastItem.createdAt);
        setLastAuctionCurrentBid(lastItem.currentBid);
        setLastAuctionViewCount(lastItem.viewCount);

        // 데이터가 적으면 더 이상 페이지가 없다고 가정
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
    filters?.productCondition,
    filters?.tagNames?.join(','),
    filters?.sortBy,
    filters?.categoryName,
    enabled,
    isLoadingMore,
    hasNextPage,
    lastAuctionUuid,
    lastAuctionCreatedAt,
    lastAuctionCurrentBid,
    lastAuctionViewCount,
  ]);

  // 무한 스크롤 설정
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

  // 검색어나 필터 변경 시 초기 데이터 로딩
  useEffect(() => {
    loadInitialData();
  }, [
    searchQuery,
    filters?.productCondition,
    filters?.tagNames?.join(','),
    filters?.sortBy,
    filters?.categoryName,
    enabled,
  ]);

  // cleanup
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

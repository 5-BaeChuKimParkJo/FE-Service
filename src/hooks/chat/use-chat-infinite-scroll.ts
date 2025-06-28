'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollParams {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
}

export const useChatInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  containerRef,
  enabled = true,
}: UseInfiniteScrollParams) => {
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled || !loadTriggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          onLoadMore();
        }
      },
      {
        root: containerRef.current,
        rootMargin: '20px',
        threshold: 0.1,
      },
    );

    observerRef.current.observe(loadTriggerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, hasMore, onLoadMore, containerRef, enabled]);

  return { loadTriggerRef };
};

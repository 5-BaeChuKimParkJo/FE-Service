'use client';

import { useEffect, useRef, useState } from 'react';
import { useConnectSSE } from '@/hooks/use-connect-sse';

interface UseBidderSSEProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  timeoutMs?: number;
}

export function useBidderSSE({
  onSuccess,
  onError,
  timeoutMs = 10000,
}: UseBidderSSEProps) {
  const { sseMessage } = useConnectSSE();
  const [isWaiting, setIsWaiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isWaiting || !sseMessage) return;

    if (sseMessage.type === 'auction-bidder-awarded') {
      clearTimeoutAndReset();
      onSuccess();
    } else if (sseMessage.type === 'auction-bidder-rejected') {
      clearTimeoutAndReset();
      onError('입찰이 거부되었습니다. 다시 시도해주세요.');
    } else {
      clearTimeoutAndReset();
      onError('입찰 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [sseMessage, isWaiting, onSuccess, onError]);

  const clearTimeoutAndReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsWaiting(false);
  };

  const startWaiting = () => {
    setIsWaiting(true);

    timeoutRef.current = setTimeout(() => {
      setIsWaiting(false);
      onError('입찰 처리 시간이 초과되었습니다. 다시 시도해주세요.');
      timeoutRef.current = null;
    }, timeoutMs);
  };

  const stopWaiting = () => {
    clearTimeoutAndReset();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isWaiting,
    startWaiting,
    stopWaiting,
  };
}

'use client';

import { useState, useRef } from 'react';
import { createBid } from '@/actions/auction-service';
import { isErrorResponse } from '@/utils/type-guards';
import { useBidderSSE } from './use-bidder-sse';

interface UseBidderFormProps {
  auctionUuid: string;
  bidAmount: number;
  onSuccess: () => void;
}

export function useBidderForm({
  auctionUuid,
  bidAmount,
  onSuccess,
}: UseBidderFormProps) {
  const [inputAmount, setInputAmount] = useState(String(bidAmount));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { startWaiting, stopWaiting } = useBidderSSE({
    onSuccess: () => {
      setLoading(false);
      onSuccess();
    },
    onError: (message) => {
      setLoading(false);
      setError(message);
    },
  });

  const validateBidAmount = (amount: number): string | null => {
    if (amount <= bidAmount) {
      return '입찰 금액은 현재 입찰가 이상이어야 합니다.';
    }
    if (amount > Math.floor(bidAmount * 1.3)) {
      return '입찰 금액은 현재 입찰가의 30%를 초과할 수 없습니다.';
    }
    return null;
  };

  const submitBid = async (amount: number) => {
    const validationError = validateBidAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    startWaiting();

    try {
      const response = await createBid(auctionUuid, amount);
      if (isErrorResponse(response)) {
        stopWaiting();
        setError(response.message);
        setLoading(false);
        return;
      }
      // API 호출 성공 시 SSE 메시지를 기다림
    } catch (error) {
      stopWaiting();
      setError(
        isErrorResponse(error)
          ? error.message
          : '입찰에 실패했습니다. 다시 시도해주세요.',
      );
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/^0+/, '');
    if (!value) value = '0';
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 0) num = 0;
    setInputAmount(String(num));
    setError('');
  };

  const handlePercent = (percent: number) => {
    const newAmount = Math.floor(bidAmount * (1 + percent / 100));
    setInputAmount(String(newAmount));
    setTimeout(() => {
      inputRef.current?.blur();
    }, 0);
  };

  const handleClear = () => {
    setInputAmount('0');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const reset = () => {
    stopWaiting();
    setInputAmount(String(bidAmount));
    setError('');
    setLoading(false);
  };

  const numAmount = parseInt(inputAmount, 10);
  const isAmountInvalid =
    inputAmount === '' ||
    isNaN(numAmount) ||
    numAmount <= bidAmount ||
    numAmount > Math.floor(bidAmount * 1.3);

  return {
    inputAmount,
    loading,
    error,
    inputRef,
    isAmountInvalid,
    handleInputChange,
    handlePercent,
    handleClear,
    submitBid,
    reset,
  };
}

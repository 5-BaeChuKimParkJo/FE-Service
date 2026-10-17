'use client';

import { useState, useRef, useEffect } from 'react';
import { createBid } from '@/actions/auction-service';
import { isErrorResponse } from '@/utils/type-guards';

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
  const requestVersion = useRef(0);
  const submitting = useRef(false);
  useEffect(
    () => () => {
      requestVersion.current += 1;
    },
    [],
  );

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
    if (submitting.current) return;
    const validationError = validateBidAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    submitting.current = true;
    const version = ++requestVersion.current;

    try {
      const response = await createBid(auctionUuid, amount);
      if (version !== requestVersion.current) return;
      if (!response.ok) {
        setError(response.error.message);
        return;
      }
      onSuccess();
    } catch (error) {
      if (version !== requestVersion.current) return;
      setError(
        isErrorResponse(error)
          ? error.message
          : '입찰 결과를 확인하지 못했습니다. 입찰 내역을 먼저 확인해 주세요.',
      );
    } finally {
      if (version === requestVersion.current) {
        submitting.current = false;
        setLoading(false);
      }
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
    requestVersion.current += 1;
    submitting.current = false;
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

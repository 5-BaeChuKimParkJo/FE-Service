'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, DollarSign } from 'lucide-react';
import {
  useCreateAuctionStore,
  ProductCondition,
} from '@/stores/use-create-auction-store';

export function Step2AuctionSettings() {
  const {
    minimumBid,
    startAt,
    duration,
    productCondition,
    isDirectDeal,
    directDealLocation,
    errors,
    setMinimumBid,
    setStartAt,
    setDuration,
    setProductCondition,
    setIsDirectDeal,
    setDirectDealLocation,
  } = useCreateAuctionStore();

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');

  // 시작 시간 설정 (정시만 가능)
  useEffect(() => {
    if (startDate && startTime) {
      const date = new Date(`${startDate}T${startTime}:00`);
      // 정시로 조정
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      setStartAt(date);
    }
  }, [startDate, startTime, setStartAt]);

  // 최소 시작 시간 계산 (현재 시간의 다음 정시)
  const getMinDateTime = () => {
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    nextHour.setMinutes(0, 0, 0);

    const date = nextHour.toISOString().split('T')[0];
    const time = nextHour.toTimeString().slice(0, 5);

    return { date, time };
  };

  const { date: minDate } = getMinDateTime();

  const productConditions: {
    value: ProductCondition;
    label: string;
    description: string;
  }[] = [
    {
      value: 'unopened',
      label: '미개봉',
      description: '포장을 뜯지 않은 새 상품',
    },
    { value: 'new', label: '새상품', description: '사용하지 않은 새 상품' },
    { value: 'used', label: '중고', description: '사용감이 있는 상품' },
  ];

  const durationOptions = [
    { hours: 1, label: '1시간' },
    { hours: 3, label: '3시간' },
    { hours: 6, label: '6시간' },
    { hours: 12, label: '12시간' },
    { hours: 24, label: '1일' },
    { hours: 48, label: '2일' },
    { hours: 72, label: '3일' },
    { hours: 168, label: '1주일' },
  ];

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMinimumBid(value);
  };

  return (
    <div className='flex-1 overflow-y-auto p-4 pb-20'>
      <div className='max-w-2xl mx-auto space-y-6'>
        {/* 최소 입찰가 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='space-y-3'
        >
          <label className='block text-sm font-medium text-gray-700'>
            최소 입찰가 <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <DollarSign className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              value={formatCurrency(minimumBid)}
              onChange={handleBidChange}
              placeholder='0'
              className={`w-full pl-12 pr-12 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.minimumBid ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium'>
              원
            </span>
          </div>
          {errors.minimumBid && (
            <p className='text-sm text-red-500 px-1'>{errors.minimumBid}</p>
          )}
          <p className='text-xs text-gray-500 px-1'>경매 시작가로 사용됩니다</p>
        </motion.div>

        {/* 경매 시작 시간 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='space-y-3'
        >
          <label className='block text-sm font-medium text-gray-700'>
            경매 시작 시간 <span className='text-red-500'>*</span>
          </label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div className='relative'>
              <Calendar className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={minDate}
                className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.startAt ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div className='relative'>
              <Clock className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none ${
                  errors.startAt ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>시간 선택</option>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  const timeValue = `${hour}:00`;
                  const now = new Date();
                  const selectedDate = new Date(startDate);
                  const isToday =
                    selectedDate.toDateString() === now.toDateString();
                  const isDisabled = isToday && i <= now.getHours();

                  return (
                    <option key={i} value={timeValue} disabled={isDisabled}>
                      {timeValue}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {errors.startAt && (
            <p className='text-sm text-red-500 px-1'>{errors.startAt}</p>
          )}
          <p className='text-xs text-gray-500 px-1'>
            정시에만 경매를 시작할 수 있습니다
          </p>
        </motion.div>

        {/* 경매 기간 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='space-y-3'
        >
          <label className='block text-sm font-medium text-gray-700'>
            경매 기간 <span className='text-red-500'>*</span>
          </label>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
            {durationOptions.map((option) => (
              <button
                key={option.hours}
                type='button'
                onClick={() => setDuration(option.hours)}
                className={`p-3 sm:p-4 rounded-xl border-2 font-medium transition-all touch-manipulation ${
                  duration === option.hours
                    ? 'border-purple-500 bg-purple-50 text-purple-900 scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {startAt && (
            <div className='bg-blue-50 p-3 rounded-lg'>
              <p className='text-xs text-blue-700 font-medium'>
                종료 예정:{' '}
                {new Date(
                  startAt.getTime() + duration * 60 * 60 * 1000,
                ).toLocaleString('ko-KR')}
              </p>
            </div>
          )}
        </motion.div>

        {/* 상품 상태 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='space-y-3'
        >
          <label className='block text-sm font-medium text-gray-700'>
            상품 상태 <span className='text-red-500'>*</span>
          </label>
          <div className='space-y-3'>
            {productConditions.map((condition) => (
              <button
                key={condition.value}
                type='button'
                onClick={() => setProductCondition(condition.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all touch-manipulation ${
                  productCondition === condition.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p
                      className={`font-medium ${
                        productCondition === condition.value
                          ? 'text-purple-900'
                          : 'text-gray-900'
                      }`}
                    >
                      {condition.label}
                    </p>
                    <p className='text-sm text-gray-600 mt-1'>
                      {condition.description}
                    </p>
                  </div>
                  {productCondition === condition.value && (
                    <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0'>
                      <div className='w-2 h-2 bg-white rounded-full' />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 직거래 설정 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='space-y-3'
        >
          <label className='block text-sm font-medium text-gray-700'>
            거래 방식
          </label>

          <div className='flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white'>
            <div className='flex items-center gap-3'>
              <MapPin className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>직거래 가능</p>
                <p className='text-sm text-gray-600'>택배 + 직거래 모두 가능</p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => setIsDirectDeal(!isDirectDeal)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 touch-manipulation ${
                isDirectDeal ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isDirectDeal ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isDirectDeal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='space-y-2'
            >
              <label className='block text-sm font-medium text-gray-700'>
                직거래 희망 지역 <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={directDealLocation}
                onChange={(e) => setDirectDealLocation(e.target.value)}
                placeholder='예: 서울시 강남구 역삼동'
                className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.directDealLocation
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.directDealLocation && (
                <p className='text-sm text-red-500 px-1'>
                  {errors.directDealLocation}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

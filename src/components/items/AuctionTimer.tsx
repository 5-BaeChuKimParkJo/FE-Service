'use client';

import { useState, useEffect } from 'react';

type AuctionTimerProps = {
  endAt: string;
};

export function AuctionTimer({ endAt }: AuctionTimerProps) {
  console.log('endAt', endAt);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalHours: 0,
    isMoreThan24Hours: false,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(endAt).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const isMoreThan24Hours = difference > 24 * 60 * 60 * 1000;

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          totalHours,
          isMoreThan24Hours,
          isExpired: false,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalHours: 0,
          isMoreThan24Hours: false,
          isExpired: true,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endAt]);

  // 시간 포맷팅 (2자리)
  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  // 남은 시간 텍스트 생성
  const getTimeLeftText = () => {
    if (timeLeft.isExpired) {
      return '경매 종료';
    }

    if (timeLeft.isMoreThan24Hours) {
      // 24시간 이상: "02d : 03h : 15m" 형태
      const parts = [];
      if (timeLeft.days > 0) parts.push(`${formatTime(timeLeft.days)}d`);
      if (timeLeft.hours > 0) parts.push(`${formatTime(timeLeft.hours)}h`);
      if (timeLeft.minutes > 0) parts.push(`${formatTime(timeLeft.minutes)}m`);
      return parts.join(' : ') || '00m';
    } else {
      // 24시간 미만: "23h : 45m : 30s" 형태
      return `${formatTime(timeLeft.hours)}h : ${formatTime(timeLeft.minutes)}m : ${formatTime(timeLeft.seconds)}s`;
    }
  };

  return (
    <div
      className={`p-4 w-full border-2 rounded-xl ${
        timeLeft.isExpired
          ? 'border-gray-400 bg-gray-50'
          : timeLeft.isMoreThan24Hours
            ? 'border-primary-200 '
            : 'border-red-100 '
      }`}
    >
      <h3
        className={`text-sm font-medium mb-2 text-center ${
          timeLeft.isMoreThan24Hours ? 'text-primary-200' : 'text-red-100'
        }`}
      >
        남은 경매 시간
      </h3>
      <div className='text-center'>
        <span
          className={`text-lg font-bold ${
            timeLeft.isExpired
              ? 'text-gray-500'
              : timeLeft.isMoreThan24Hours
                ? 'text-blue-200'
                : 'text-red-100'
          }`}
        >
          {getTimeLeftText()}
        </span>
      </div>
    </div>
  );
}

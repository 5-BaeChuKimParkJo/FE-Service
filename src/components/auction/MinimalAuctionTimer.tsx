'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/libs/cn';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import { calculateAuctionTime, getTimeLeftText } from '@/utils/auction-timer';

interface AuctionTimerProps {
  startAt: string;
  endAt: string;
  status: string;
  className?: string;
}

export function MinimalAuctionTimer({
  startAt,
  endAt,
  status,
  className,
}: AuctionTimerProps) {
  const now = useGlobalTimer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className={cn(
          'block px-3 py-1 rounded-full text-center text-sm bg-gray-500/15 text-gray-500',
          className,
        )}
      >{`loading...`}</span>
    );
  }

  const timeData = calculateAuctionTime(startAt, endAt, now);

  const getStatusStyle = () => {
    if (status === 'ended' || timeData.isExpired) {
      return 'bg-gray-500/15 text-gray-500';
    }
    if (timeData.isNotStarted) {
      return 'bg-blue-100/15 text-blue-600';
    }
    if (timeData.totalHours < 1) {
      return 'bg-red-100/15 text-red-600';
    }
    return 'bg-primary-100/15 text-primary-200';
  };

  const getDisplayText = () => {
    if (status === 'ended' || timeData.isExpired) {
      return '00h 00m 00s';
    }
    return getTimeLeftText(timeData);
  };

  return (
    <span
      className={cn(
        'block px-3 py-1 rounded-full text-center text-sm',
        getStatusStyle(),
        className,
      )}
    >
      {getDisplayText()}
    </span>
  );
}

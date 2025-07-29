'use client';

import { useEffect, useState } from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import {
  calculateAuctionTime,
  getDetailedTimeLeftText,
  getTimerStyles,
} from '@/utils/auction-timer';

type AuctionTimerProps = {
  startAt: string;
  endAt: string;
};

export function AuctionTimer({ startAt, endAt }: AuctionTimerProps) {
  const now = useGlobalTimer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const timeData = calculateAuctionTime(startAt, endAt, now);
  const timeText = getDetailedTimeLeftText(timeData);
  const styles = getTimerStyles(timeData);

  if (!mounted) {
    return (
      <div className={styles.containerClass}>
        <h3 className={styles.titleClass}>로딩중...</h3>
        <div className='text-center'>
          <span className={styles.timeClass}>--</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerClass}>
      <h3 className={styles.titleClass}>
        {timeData.isNotStarted
          ? '오픈까지'
          : timeData.isExpired
            ? '경매 종료'
            : '남은 시간'}
      </h3>
      <div className='text-center'>
        <span className={styles.timeClass}>{timeText}</span>
      </div>
    </div>
  );
}

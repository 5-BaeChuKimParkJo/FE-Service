'use client';

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

  // 실시간으로 시간 계산 (상태 없이)
  const timeData = calculateAuctionTime(startAt, endAt, now);
  const timeText = getDetailedTimeLeftText(timeData);
  const styles = getTimerStyles(timeData);

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

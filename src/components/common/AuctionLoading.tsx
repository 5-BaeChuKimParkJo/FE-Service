'use client';
import { useState, useEffect } from 'react';
import { Gavel, ShoppingBag, Coins, Tag } from 'lucide-react';

const icons = [Gavel, ShoppingBag, Coins, Tag];

const iconNames = [
  '경매 준비 중...',
  '상품 등록 중...',
  '입찰 중...',
  '태그 처리 중...',
];

export function AuctionLoading({
  size = 48,
  interval = 1000,
  text = '로딩 중...',
  showIcon = true,
}: {
  size?: number;
  interval?: number;
  text?: string;
  showIcon?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!showIcon) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, showIcon]);

  const Icon = icons[index];
  const label = showIcon ? iconNames[index] || text : text;

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8'>
      {showIcon && <Icon className='animate-bounce text-primary' size={size} />}
      <span className='text-lg font-semibold text-gray-700 animate-pulse'>
        {label}
      </span>
    </div>
  );
}

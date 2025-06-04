'use client';
import { Eye, Heart, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/cn';
import { Button } from '../ui/button';

interface AuctionProductCardProps {
  id: string;
  title: string;
  currentPrice: number;
  imageUrl: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
  participants: number;
  likes: number;
  views: number;
  onLike?: (id: string) => void;
  onBid?: (id: string) => void;
  className?: string;
}

export function AuctionProductCard({
  id,
  title,
  currentPrice,
  imageUrl,
  timeLeft,
  participants,
  likes,
  views,
  onLike,
  onBid,
  className,
}: AuctionProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(id);
  };

  const handleBid = () => {
    onBid?.(id);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const formatTimeLeft = () => {
    const { days, hours, minutes } = timeLeft;
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <section
      className={cn(
        'bg-white rounded-2xl shadow-sm overflow-hidden',
        'transition-all duration-300 hover:shadow-md',
        className,
      )}
    >
      {/* 상품 이미지 */}
      <div className='relative aspect-square overflow-hidden'>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className='object-cover transition-transform duration-300 hover:scale-105'
        />

        {/* 좋아요 버튼 */}
        <button
          onClick={handleLike}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full',
            ' transition-all duration-200',
            ' hover:scale-110 active:scale-95',
          )}
          aria-label='좋아요'
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-colors duration-200',
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600',
            )}
          />
        </button>
      </div>

      <div className='px-4 py-2 space-y-2'>
        <h1 className=' leading-tight line-clamp-2 min-h-[2.5rem] flex items-center'>
          {title}
        </h1>{' '}
        {/* 현재 가격 */}
        <div className='flex items-center justify-between gap-2'>
          <p className='text-xl font-'>{formatPrice(currentPrice)}</p>
          <Button onClick={handleBid} label='입찰' size='xs' />
        </div>
        {/* 남은 시간 */}
        <div className='flex items-center justify-end gap-1 text-sm'>
          <span className='bg-primary-100/15 text-primary-100 px-4 py-1 rounded-full'>
            {formatTimeLeft()}
          </span>
        </div>
        {/* 통계 정보 */}
        <div className='flex items-center justify-end text-xs text-gray-500'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <Users className='w-3 h-3' />
              <span>{participants.toLocaleString()}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Heart className='w-3 h-3' />
              <span>{likes.toLocaleString()}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Eye className='w-3 h-3' />
              <span>{views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

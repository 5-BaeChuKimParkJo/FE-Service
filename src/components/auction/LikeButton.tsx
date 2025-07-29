'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/libs/cn';

interface LikeButtonProps {
  auctionUuid: string;
  onLike?: (auctionUuid: string) => void;
}

export function LikeButton({ auctionUuid, onLike }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLiked(!isLiked);
    onLike?.(auctionUuid);
  };

  return (
    <button
      onClick={handleLike}
      className='absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110 active:scale-100'
      aria-label='좋아요'
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-colors duration-200',
          isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600',
        )}
      />
    </button>
  );
}

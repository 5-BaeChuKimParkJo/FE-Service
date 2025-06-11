'use client';

import Image from 'next/image';
import { cn } from '@/libs/cn';

type ThumbnailCarouselProps = {
  images: { auctionImageId: number; url: string; order: number }[];
  selectedIndex: number;
  emblaRef: (node: HTMLElement | null) => void;
  onThumbnailClick: (index: number) => void;
};

export function ThumbnailCarousel({
  images,
  selectedIndex,
  emblaRef,
  onThumbnailClick,
}: ThumbnailCarouselProps) {
  return (
    <nav
      className='px-4 py-4'
      role='tablist'
      aria-label='이미지 썸네일 네비게이션'
    >
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex gap-3'>
          {images.map((image, index) => (
            <button
              key={image.auctionImageId}
              onClick={() => onThumbnailClick(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 touch-manipulation',
                selectedIndex === index
                  ? 'opacity-100 scale-105 shadow-lg'
                  : 'opacity-50 hover:opacity-75',
              )}
              role='tab'
              aria-selected={selectedIndex === index}
              aria-label={`${index + 1}번째 썸네일`}
            >
              <Image
                src={image.url || '/placeholder.svg'}
                alt={`썸네일 ${index + 1}`}
                width={64}
                height={64}
                className='w-full h-full object-cover'
                loading='lazy'
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

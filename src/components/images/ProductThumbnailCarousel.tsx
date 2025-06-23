'use client';

import Image from 'next/image';
import { cn } from '@/libs/cn';

type ProductThumbnailCarouselProps = {
  images: string[];
  selectedIndex: number;
  emblaRef: (node: HTMLElement | null) => void;
  onThumbnailClick: (index: number) => void;
};

export function ProductThumbnailCarousel({
  images,
  selectedIndex,
  emblaRef,
  onThumbnailClick,
}: ProductThumbnailCarouselProps) {
  return (
    <div className='px-4 pb-4'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex space-x-2'>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onThumbnailClick(index)}
              className={cn(
                'flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
                selectedIndex === index
                  ? 'border-primary-100 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300',
              )}
              aria-label={`썸네일 ${index + 1} 선택`}
            >
              <Image
                src={image || '/placeholder.svg'}
                alt={`썸네일 ${index + 1}`}
                fill
                className='object-cover'
                sizes='64px'
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

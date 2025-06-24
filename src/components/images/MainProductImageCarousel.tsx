'use client';

import Image from 'next/image';

type MainProductImageCarouselProps = {
  images: string[];
  emblaRef: (node: HTMLElement | null) => void;
};

export function MainProductImageCarousel({
  images,
  emblaRef,
}: MainProductImageCarouselProps) {
  return (
    <figure
      className='relative m-4 rounded-lg overflow-hidden'
      role='img'
      aria-label='상품 이미지 갤러리'
    >
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          {images.map((image, index) => (
            <div
              key={index}
              className='flex-0-0-100 min-w-0 relative aspect-square'
            >
              <Image
                src={image || '/placeholder.svg'}
                alt={`상품 이미지 ${index + 1}`}
                fill
                className='object-cover'
                priority={index === 0}
                sizes='(max-width: 640px) 100vw, 640px'
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

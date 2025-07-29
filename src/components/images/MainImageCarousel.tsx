'use client';

import Image from 'next/image';

type MainImageCarouselProps = {
  images: { imageId: number; url: string; order: number }[];
  emblaRef: (node: HTMLElement | null) => void;
};

export function MainImageCarousel({
  images,
  emblaRef,
}: MainImageCarouselProps) {
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
              key={image.imageId}
              className='flex-0-0-100 min-w-0 relative aspect-square'
            >
              <Image
                src={image.url || '/placeholder.svg'}
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

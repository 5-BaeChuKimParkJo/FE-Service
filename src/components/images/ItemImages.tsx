'use client';

import { useImageCarousel } from '@/hooks/useImageCarousel';
import { MainImageCarousel } from './MainImageCarousel';
import { ImageCounter } from './ImageCounter';
import { ImageIndicators } from './ImageIndicators';
import { ThumbnailCarousel } from './ThumbnailCarousel';

type ItemImagesProps = {
  images: { auctionImageId: number; url: string; order: number }[];
};

export function ItemImages({ images }: ItemImagesProps) {
  const {
    selectedIndex,
    displayIndex,
    hasMultipleImages,
    emblaMainRef,
    emblaThumbsRef,
    onThumbClick,
  } = useImageCarousel({ images });

  if (!images?.length) {
    return (
      <section className='w-full aspect-square  flex items-center justify-center'>
        <p className='text-gray-500'>이미지가 없습니다</p>
      </section>
    );
  }

  return (
    <article className='w-full ' role='region' aria-label='상품 이미지 갤러리'>
      <section className='relative'>
        <MainImageCarousel images={images} emblaRef={emblaMainRef} />

        {hasMultipleImages && (
          <ImageCounter
            currentIndex={displayIndex}
            totalCount={images.length}
          />
        )}

        {hasMultipleImages && (
          <ImageIndicators
            images={images}
            selectedIndex={selectedIndex}
            onIndicatorClick={onThumbClick}
          />
        )}
      </section>

      {hasMultipleImages && (
        <section>
          <ThumbnailCarousel
            images={images}
            selectedIndex={selectedIndex}
            emblaRef={emblaThumbsRef}
            onThumbnailClick={onThumbClick}
          />
        </section>
      )}
    </article>
  );
}

'use client';

import { useProductImageCarousel } from '@/hooks/useProductImageCarousel';
import { ImageCounter } from './ImageCounter';
import { ProductThumbnailCarousel } from './ProductThumbnailCarousel';
import { MainProductImageCarousel } from './MainProductImageCarousel';
import { ProductImageIndicators } from './ProductImageIndicators';

type ProductImagesProps = {
  images: string[];
};

export function ProductImages({ images }: ProductImagesProps) {
  const {
    selectedIndex,
    displayIndex,
    hasMultipleImages,
    emblaMainRef,
    emblaThumbsRef,
    onThumbClick,
  } = useProductImageCarousel({ images });

  if (!images?.length) {
    return (
      <section className='w-full aspect-square flex items-center justify-center'>
        <p className='text-gray-500'>이미지가 없습니다</p>
      </section>
    );
  }

  return (
    <article className='w-full' role='region' aria-label='상품 이미지 갤러리'>
      <section className='relative'>
        <MainProductImageCarousel images={images} emblaRef={emblaMainRef} />

        {hasMultipleImages && (
          <ImageCounter
            currentIndex={displayIndex}
            totalCount={images.length}
          />
        )}

        {hasMultipleImages && (
          <ProductImageIndicators
            images={images}
            selectedIndex={selectedIndex}
            onIndicatorClick={onThumbClick}
          />
        )}
      </section>

      {hasMultipleImages && (
        <section>
          <ProductThumbnailCarousel
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

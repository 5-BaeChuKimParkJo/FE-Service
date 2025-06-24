import { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type UseProductImageCarouselProps = {
  images: string[];
};

export function useProductImageCarousel({
  images,
}: UseProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
  });

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const hasMultipleImages = useMemo(() => images.length > 1, [images.length]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi]);

  const onThumbsSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaThumbsApi.selectedScrollSnap());
    emblaMainApi.scrollTo(emblaThumbsApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
    return () => {
      emblaMainApi.off('select', onSelect);
      emblaMainApi.off('reInit', onSelect);
    };
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    if (!emblaThumbsApi) return;
    onThumbsSelect();
    emblaThumbsApi.on('select', onThumbsSelect);
    emblaThumbsApi.on('reInit', onThumbsSelect);
    return () => {
      emblaThumbsApi.off('select', onThumbsSelect);
      emblaThumbsApi.off('reInit', onThumbsSelect);
    };
  }, [emblaThumbsApi, onThumbsSelect]);

  useEffect(() => {
    setDisplayIndex(selectedIndex + 1);
  }, [selectedIndex]);

  return {
    selectedIndex,
    displayIndex,
    hasMultipleImages,
    emblaMainRef,
    emblaThumbsRef,
    onThumbClick,
  };
}

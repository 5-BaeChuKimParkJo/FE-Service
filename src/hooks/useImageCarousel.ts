import { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type UseImageCarouselProps = {
  images: { auctionImageId: number; url: string; order: number }[];
};

export function useImageCarousel({ images }: UseImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mainOptions = useMemo(
    () => ({
      loop: true,
      dragFree: false,
    }),
    [],
  );

  const thumbOptions = useMemo(
    () => ({
      containScroll: 'keepSnaps' as const,
      dragFree: true,
      loop: false,
      align: 'start' as const,
    }),
    [],
  );

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(mainOptions);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(thumbOptions);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const newIndex = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    emblaThumbsApi.scrollTo(newIndex);
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;

    const handleSelect = () => onSelect();

    onSelect();
    emblaMainApi.on('select', handleSelect);
    emblaMainApi.on('reInit', handleSelect);

    return () => {
      emblaMainApi.off('select', handleSelect);
      emblaMainApi.off('reInit', handleSelect);
    };
  }, [emblaMainApi, onSelect]);

  const hasMultipleImages = useMemo(
    () => images && images.length > 1,
    [images],
  );
  const displayIndex = useMemo(() => selectedIndex + 1, [selectedIndex]);

  return {
    selectedIndex,
    displayIndex,
    hasMultipleImages,
    emblaMainRef,
    emblaThumbsRef,
    onThumbClick,
  };
}

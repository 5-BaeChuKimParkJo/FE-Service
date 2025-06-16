import { cn } from '@/libs/cn';

type ImageIndicatorsProps = {
  images: { auctionImageId: number; url: string; order: number }[];
  selectedIndex: number;
  onIndicatorClick: (index: number) => void;
};

export function ImageIndicators({
  images,
  selectedIndex,
  onIndicatorClick,
}: ImageIndicatorsProps) {
  return (
    <nav
      className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10'
      role='tablist'
      aria-label='이미지 네비게이션'
    >
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-200 touch-manipulation',
            selectedIndex === index
              ? 'bg-white scale-125'
              : 'bg-white/60 hover:bg-white/80',
          )}
          role='tab'
          aria-selected={selectedIndex === index}
          aria-label={`${index + 1}번째 이미지로 이동`}
        />
      ))}
    </nav>
  );
}

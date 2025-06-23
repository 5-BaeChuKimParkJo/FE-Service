import { cn } from '@/libs/cn';

type ProductImageIndicatorsProps = {
  images: string[];
  selectedIndex: number;
  onIndicatorClick: (index: number) => void;
};

export function ProductImageIndicators({
  images,
  selectedIndex,
  onIndicatorClick,
}: ProductImageIndicatorsProps) {
  return (
    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-200',
            selectedIndex === index
              ? 'bg-white shadow-lg scale-125'
              : 'bg-white/50 hover:bg-white/75',
          )}
          aria-label={`이미지 ${index + 1}로 이동`}
        />
      ))}
    </div>
  );
}

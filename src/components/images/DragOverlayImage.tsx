import Image from 'next/image';

interface DragOverlayImageProps {
  image: { url?: string; key: string };
  index: number;
}

export function DragOverlayImage({ image, index }: DragOverlayImageProps) {
  return (
    <div
      className='relative w-20 h-20 rounded-lg overflow-hidden border-2 border-primary-200 shadow-xl bg-white opacity-90 select-none'
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image
        src={image.url || '/placeholder.svg?height=100&width=100'}
        alt={`상품 이미지 ${index + 1}`}
        width={80}
        height={80}
        className='object-cover select-none'
        draggable={false}
      />
      {index === 0 && (
        <div className='absolute top-1 left-1 bg-primary-100 text-white text-xs px-1.5 py-0.5 rounded font-medium select-none'>
          대표
        </div>
      )}
    </div>
  );
}

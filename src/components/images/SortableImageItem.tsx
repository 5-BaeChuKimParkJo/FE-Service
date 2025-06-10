'use client';

import Image from 'next/image';
import { X, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableImageItemProps {
  image: { url?: string; key: string };
  index: number;
  onRemove: () => void;
}

export function SortableImageItem({
  image,
  index,
  onRemove,
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-move touch-manipulation select-none ${
        index === 0 ? 'border-primary-100 ' : 'border-gray-200'
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image
        src={image.url || '/placeholder.svg?height=100&width=100'}
        alt={`상품 이미지 ${index + 1}`}
        width={80}
        height={80}
        className='object-cover select-none pointer-events-none'
        draggable={false}
      />

      {/* 대표 이미지 표시 */}
      {index === 0 && (
        <div className='absolute top-1 left-1 bg-primary-200 text-white text-xs px-1.5 py-0.5 rounded font-medium select-none'>
          대표
        </div>
      )}

      {/* 삭제 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='absolute top-1 right-1 w-3 h-3 text-black rounded-full touch-manipulation flex items-center justify-center select-none'
        style={{ pointerEvents: 'auto' }}
        aria-label={`이미지 ${index + 1} 삭제`}
      >
        <X className='w-4 h-4' />
      </button>

      {/* 순서 번호 */}
      <div className='absolute bottom-1 left-1 bg-primary-100 text-white text-xs px-1.5 py-0.5 rounded font-medium backdrop-blur-sm select-none'>
        {index + 1}
      </div>

      {/* 드래그 핸들 표시 */}
      <div className='absolute bottom-1 right-1 text-white/70 select-none'>
        <GripVertical className='w-3 h-3' />
      </div>
    </div>
  );
}

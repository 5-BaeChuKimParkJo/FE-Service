import { useCallback, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDragScrollLock } from './use-drag-scroll-lock';
import { SortableImageItem } from './SortableImageItem';
import { UploadButton } from './UploadButton';
import { DragOverlayImage } from './DragOverlayImage';

const MAX_IMAGES = 10;

interface ProductImage {
  key: string;
  file: File;
  url: string;
}

interface ProductImageUploaderForProductProps {
  images: ProductImage[];
  setImages: (images: ProductImage[]) => void;
  addImage: (image: ProductImage) => void;
  removeImage: (index: number) => void;
  error?: string;
}

export function ProductImageUploaderForProduct({
  images,
  setImages,
  addImage,
  removeImage,
  error,
}: ProductImageUploaderForProductProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
        tolerance: 8,
        delay: 300,
      },
    }),
  );

  useDragScrollLock(isDragActive);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragActive(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setIsDragActive(false);

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.key === active.id);
      const newIndex = images.findIndex((img) => img.key === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setImages(arrayMove(images, oldIndex, newIndex));
      }
    }
  };

  const handleImageUpload = useCallback(
    async (files: FileList) => {
      const currentImageCount = images.length;
      const remainingSlots = MAX_IMAGES - currentImageCount;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToUpload) {
        const imageUrl = URL.createObjectURL(file);
        const imageKey = `product_${Date.now()}_${Math.random()}`;

        addImage({
          key: imageKey,
          file,
          url: imageUrl,
        });
      }
    },
    [images.length, addImage],
  );

  const activeIndex = activeId
    ? images.findIndex((img) => img.key === activeId)
    : -1;

  return (
    <section className='space-y-1 select-none'>
      <label className='block text-sm font-medium transition-colors duration-200'>
        상품 이미지
        <span className='text-xs text-gray-500 block font-normal'>
          (최대 {MAX_IMAGES}장, 첫 번째 이미지가 대표 이미지)
        </span>
      </label>
      <div className='relative'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className='flex gap-3 pb-2 px-1 overflow-x-auto scrollbar-hide'>
            <SortableContext
              items={images.map((img) => img.key)}
              strategy={horizontalListSortingStrategy}
            >
              {images.map((image, index) => (
                <SortableImageItem
                  key={image.key}
                  image={{ key: image.key, url: image.url }}
                  index={index}
                  onRemove={() => removeImage(index)}
                />
              ))}
            </SortableContext>
            <UploadButton
              onUpload={handleImageUpload}
              currentCount={images.length}
              maxCount={MAX_IMAGES}
            />
          </div>
          <DragOverlay>
            {activeIndex !== -1 && (
              <DragOverlayImage
                image={{
                  key: images[activeIndex].key,
                  url: images[activeIndex].url,
                }}
                index={activeIndex}
              />
            )}
          </DragOverlay>
        </DndContext>
        {images.length > 0 && (
          <p className='text-xs text-gray-500 mt-2 select-none'>
            이미지를 길게 눌러서 드래그해서 순서를 변경할 수 있습니다
          </p>
        )}
      </div>
      {error && (
        <p className='text-xs text-red-500 select-none' role='alert'>
          {error}
        </p>
      )}
    </section>
  );
}

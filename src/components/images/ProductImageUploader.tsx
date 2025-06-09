'use client';
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

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { useDragScrollLock } from './use-drag-scroll-lock';
import { SortableImageItem } from './SortableImageItem';
import { UploadButton } from './UploadButton';
import { DragOverlayImage } from './DragOverlayImage';

const MAX_IMAGES = 10;

export function ProductImageUploader() {
  const { images, errors, setImages, addImage, removeImage } =
    useCreateAuctionStore();

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
      const oldIndex = images.findIndex((item) => item.key === active.id);
      const newIndex = images.findIndex((item) => item.key === over?.id);

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
        const imageKey = `temp_${Date.now()}_${Math.random()}`;

        addImage({
          key: imageKey,
          order: currentImageCount,
          file,
          url: imageUrl,
        });
      }
    },
    [images.length, addImage],
  );

  const activeImage = activeId
    ? images.find((img) => img.key === activeId)
    : null;
  const activeIndex = activeImage
    ? images.findIndex((img) => img.key === activeId)
    : -1;

  return (
    <section className='space-y-1 select-none'>
      <label
        className={`block text-sm font-medium transition-colors duration-200 ${
          isDragActive || images.length > 0
            ? 'text-primary-100'
            : 'text-gray-700'
        }`}
      >
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
                  image={image}
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
            {activeImage && (
              <DragOverlayImage image={activeImage} index={activeIndex} />
            )}
          </DragOverlay>
        </DndContext>

        {images.length > 0 && (
          <p className='text-xs text-gray-500 mt-2 select-none'>
            이미지를 길게 눌러서 드래그해서 순서를 변경할 수 있습니다
          </p>
        )}
      </div>

      {errors.images && (
        <p className='text-xs text-red-500 select-none' role='alert'>
          {errors.images}
        </p>
      )}
    </section>
  );
}

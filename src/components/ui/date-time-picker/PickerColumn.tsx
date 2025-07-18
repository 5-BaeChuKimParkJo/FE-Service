'use client';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { cn } from '@/libs/cn';
import { dateLabelMap } from '@/utils/date-time';
import { PickerColumnProps, DatePickerColumnProps } from './types';

export function PickerColumn({
  items,
  selectedItem,
  onItemChange,
  label,
}: PickerColumnProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const initialSlide = items.indexOf(selectedItem);

  useEffect(() => {
    if (swiper && selectedItem !== undefined) {
      const index = items.indexOf(selectedItem);
      if (index !== -1 && swiper.activeIndex !== index) {
        swiper.slideTo(index, 0);
      }
    }
  }, [selectedItem, swiper, items]);

  return (
    <div className='h-full flex flex-col'>
      <Swiper
        direction='vertical'
        slidesPerView={4}
        centeredSlides={true}
        onSwiper={setSwiper}
        initialSlide={Math.max(0, initialSlide)}
        onSlideChange={(swiper) => {
          const newItem = items[swiper.activeIndex];
          if (newItem !== undefined && newItem !== selectedItem) {
            onItemChange(newItem);
          }
        }}
        className='flex-1 w-full'
      >
        {items.map((item) => (
          <SwiperSlide key={item} className='w-full'>
            <div
              className={cn(
                'h-10 flex items-center justify-center text-lg font-medium transition-colors w-full',
                selectedItem === item
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-400',
              )}
            >
              {`${item.toString().padStart(2, '0')}${dateLabelMap[label]}`}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function DatePickerColumn({
  items,
  selectedIndex,
  onIndexChange,
}: DatePickerColumnProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiper && selectedIndex !== undefined) {
      if (swiper.activeIndex !== selectedIndex) {
        swiper.slideTo(selectedIndex, 0);
      }
    }
  }, [selectedIndex, swiper]);

  return (
    <div className='h-full flex flex-col'>
      <Swiper
        direction='vertical'
        slidesPerView={4}
        centeredSlides={true}
        onSwiper={setSwiper}
        initialSlide={Math.max(0, selectedIndex)}
        onSlideChange={(swiper) => {
          if (swiper.activeIndex !== selectedIndex) {
            onIndexChange(swiper.activeIndex);
          }
        }}
        className='flex-1 w-full'
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.value} className='w-full'>
            <div
              className={cn(
                'h-10 flex items-center justify-center text-lg font-medium transition-colors w-full',
                selectedIndex === index
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-400',
              )}
            >
              {item.label}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

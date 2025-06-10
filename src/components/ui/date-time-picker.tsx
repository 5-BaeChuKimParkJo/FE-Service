'use client';
import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { cn } from '@/libs/cn';
import { BottomSheet } from './bottom-sheet';
import { Button } from './button';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = '날짜와 시간을 선택하세요',
  className,
  disabled = false,
  minDate = new Date(),
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onChange(selectedDate);
      setIsOpen(false);
    }
  };

  const isValidDate = (date: Date) => {
    const now = new Date();
    const compareDate = new Date(date);
    compareDate.setSeconds(0, 0);
    now.setSeconds(0, 0);
    return compareDate >= now;
  };

  return (
    <>
      <div
        className={cn(
          'w-full px-4 py-4 text-base border rounded-xl transition-colors duration-200 cursor-pointer focus-within:outline-none',
          'hover:border-gray-400',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className,
        )}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className='flex items-center justify-between'>
          <span
            className={cn(
              'flex-1 text-base',
              value ? 'text-gray-900' : 'text-gray-500',
            )}
          >
            {value ? formatDateTime(value) : placeholder}
          </span>
          <div className='flex items-center space-x-2 text-gray-400'>
            <Calendar className='h-5 w-5' />
            <Clock className='h-5 w-5' />
          </div>
        </div>
      </div>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        height='auto'
      >
        <div className='space-y-4'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900'>
              경매 시작 시간 설정
            </h3>
            <p className='text-sm text-gray-500 mt-1'>
              현재 시간 이후, 정각에만 시작 가능합니다
            </p>
          </div>

          <div className='flex bg-gray-100 p-1 rounded-lg'>
            <button
              type='button'
              onClick={() => setActiveTab('date')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                activeTab === 'date'
                  ? 'bg-white text-primary-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              날짜 선택
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('time')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                activeTab === 'time'
                  ? 'bg-white text-primary-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              시간 선택
            </button>
          </div>

          <div className='min-h-[200px]'>
            {activeTab === 'date' ? (
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                minDate={minDate}
              />
            ) : (
              <TimeSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                minDate={minDate}
              />
            )}
          </div>

          <div className='flex space-x-3 pt-4'>
            <Button
              variant='outline'
              onClick={() => setIsOpen(false)}
              className='flex-1'
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !isValidDate(selectedDate)}
              className='flex-1'
            >
              확인
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  minDate: Date;
}

function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      let label = '';
      if (i === 0) {
        label = '오늘';
      } else if (i === 1) {
        label = '내일';
      } else {
        label = `${i}일 후`;
      }

      const dateString = date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
      });

      options.push({
        date,
        label: `${label} (${dateString})`,
        value: i,
      });
    }

    return options;
  };

  const dateOptions = generateDateOptions();

  // 현재 선택된 날짜가 몇 일 후인지 계산
  const getSelectedIndex = () => {
    if (!selectedDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    const diffTime = selected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, Math.min(7, diffDays));
  };

  const [selectedIndex, setSelectedIndex] = useState(getSelectedIndex());

  const handleDateIndexChange = (index: number) => {
    const selectedOption = dateOptions[index];
    if (selectedOption) {
      const newDate = new Date(selectedOption.date);
      if (selectedDate) {
        // 기존 시간 정보 유지
        newDate.setHours(selectedDate.getHours(), 0, 0, 0);
      }
      onDateChange(newDate);
      setSelectedIndex(index);
    }
  };

  return (
    <div className='flex justify-center h-[160px] relative'>
      {/* Selection indicator */}
      <div className='absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-10 pointer-events-none border-t border-b border-gray-200 bg-gray-50 rounded-lg ' />

      {/* Date Picker */}
      <div className='w-64'>
        <DatePickerColumn
          items={dateOptions}
          selectedIndex={selectedIndex}
          onIndexChange={handleDateIndexChange}
        />
      </div>
    </div>
  );
}

// Time Selector Component with Swiper
interface TimeSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  minDate?: Date;
}

function TimeSelector({ selectedDate, onDateChange }: TimeSelectorProps) {
  const currentDate = selectedDate || new Date();
  const [selectedHour, setSelectedHour] = useState(currentDate.getHours());

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeChange = useCallback(
    (hour: number) => {
      const newDate = new Date(selectedDate || new Date());
      newDate.setHours(hour, 0, 0, 0);
      onDateChange(newDate);
    },
    [selectedDate, onDateChange],
  );

  useEffect(() => {
    handleTimeChange(selectedHour);
  }, [selectedHour, handleTimeChange]);

  const isHourDisabled = (hour: number) => {
    if (!selectedDate) return false;

    const checkDate = new Date(selectedDate);
    checkDate.setHours(hour, 0, 0, 0);

    const now = new Date();
    now.setMinutes(0, 0, 0);

    return checkDate <= now;
  };

  const availableHours = hours.filter((hour) => !isHourDisabled(hour));

  return (
    <div className='flex justify-center h-[160px] relative'>
      <div className='absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-10 pointer-events-none border-t border-b border-gray-200 bg-gray-50 rounded-lg ' />

      <div className='w-32'>
        <PickerColumn
          items={availableHours}
          selectedItem={selectedHour}
          onItemChange={setSelectedHour}
          label='hour'
        />
      </div>
    </div>
  );
}

interface DatePickerColumnProps {
  items: Array<{ date: Date; label: string; value: number }>;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

function DatePickerColumn({
  items,
  selectedIndex,
  onIndexChange,
}: DatePickerColumnProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiper && selectedIndex !== undefined) {
      if (swiper.activeIndex !== selectedIndex) {
        swiper.slideTo(selectedIndex);
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
        className='flex-1'
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.value}>
            <div
              className={cn(
                'h-10 flex items-center justify-center text-lg font-medium transition-colors px-2 text-center',
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

interface PickerColumnProps {
  items: number[];
  selectedItem: number;
  onItemChange: (newItem: number) => void;
  label: 'hour';
}

const dateLabelMap: Record<'hour', string> = {
  hour: ':00',
};

function PickerColumn({
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
        swiper.slideTo(index);
      }
    }
  }, [selectedItem, items, swiper]);

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
        className='flex-1'
      >
        {items.map((item) => (
          <SwiperSlide key={item}>
            <div
              className={cn(
                'h-10 flex items-center justify-center text-lg font-medium transition-colors',
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

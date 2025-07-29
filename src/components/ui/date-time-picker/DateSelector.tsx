'use client';
import { useState, useCallback } from 'react';

import { generateDateOptions, calculateDaysFromToday } from '@/utils/date-time';
import { DatePickerColumn } from './PickerColumn';
import { DateSelectorProps } from './types';

export function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  const dateOptions = generateDateOptions();

  const getSelectedIndex = () => {
    if (!selectedDate) return 0;
    return calculateDaysFromToday(selectedDate);
  };

  const [selectedIndex, setSelectedIndex] = useState(getSelectedIndex());

  const handleDateIndexChange = useCallback(
    (index: number) => {
      const selectedOption = dateOptions[index];
      if (selectedOption && index !== selectedIndex) {
        const newDate = new Date(selectedOption.date);
        if (selectedDate) {
          newDate.setHours(selectedDate.getHours(), 0, 0, 0);
        } else {
          const now = new Date();
          newDate.setHours(now.getHours(), 0, 0, 0);
        }
        setSelectedIndex(index);
        onDateChange(newDate);
      }
    },
    [dateOptions, selectedDate, selectedIndex, onDateChange],
  );

  return (
    <section
      className='flex justify-center h-[160px] relative'
      role='region'
      aria-labelledby='date-selector-heading'
    >
      <h3 id='date-selector-heading' className='sr-only'>
        날짜 선택
      </h3>

      <div className='absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-10 pointer-events-none border-t border-b border-gray-200 bg-gray-50 rounded-lg' />

      <div className='w-64'>
        <DatePickerColumn
          items={dateOptions}
          selectedIndex={selectedIndex}
          onIndexChange={handleDateIndexChange}
        />
      </div>
    </section>
  );
}

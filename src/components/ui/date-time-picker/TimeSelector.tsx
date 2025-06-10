'use client';
import { useState, useEffect, useCallback } from 'react';

import { isHourDisabled } from '@/utils/date-time';
import { PickerColumn } from './PickerColumn';
import { TimeSelectorProps } from './types';

/**
 * 시간 선택 컴포넌트
 */
export function TimeSelector({
  selectedDate,
  onDateChange,
}: TimeSelectorProps) {
  const currentDate = selectedDate || new Date();
  const [selectedHour, setSelectedHour] = useState(currentDate.getHours());

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // selectedDate가 변경될 때 selectedHour를 업데이트
  useEffect(() => {
    if (selectedDate) {
      setSelectedHour(selectedDate.getHours());
    }
  }, [selectedDate]);

  // selectedHour가 변경될 때만 onDateChange 호출
  useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(selectedHour, 0, 0, 0);

      // 시간이 실제로 변경된 경우에만 업데이트
      if (newDate.getTime() !== selectedDate.getTime()) {
        onDateChange(newDate);
      }
    }
  }, [selectedHour, onDateChange, selectedDate]);

  const checkIsHourDisabled = useCallback(
    (hour: number) => {
      if (!selectedDate) return false;
      return isHourDisabled(hour, selectedDate);
    },
    [selectedDate],
  );

  const availableHours = hours.filter((hour) => !checkIsHourDisabled(hour));

  return (
    <section
      className='flex justify-center h-[160px] relative'
      role='region'
      aria-labelledby='time-selector-heading'
    >
      <h3 id='time-selector-heading' className='sr-only'>
        시간 선택
      </h3>

      <div className='absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-10 pointer-events-none border-t border-b border-gray-200 bg-gray-50 rounded-lg' />

      <div className='w-32'>
        <PickerColumn
          items={availableHours}
          selectedItem={selectedHour}
          onItemChange={setSelectedHour}
          label='hour'
        />
      </div>
    </section>
  );
}

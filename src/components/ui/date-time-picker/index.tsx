'use client';
import { useState, useCallback } from 'react';
import { Calendar, Clock } from 'lucide-react';

import { cn } from '@/libs/cn';
import { formatDateTime, isValidDate } from '@/utils/date-time';
import { BottomSheet } from '../bottom-sheet';
import { Button } from '../button';
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';
import { DateTimePickerProps } from './types';

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

  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      onChange(selectedDate);
      setIsOpen(false);
    }
  }, [selectedDate, onChange]);

  const handleCancel = useCallback(() => {
    setSelectedDate(value); // 취소 시 원래 값으로 복원
    setIsOpen(false);
  }, [value]);

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setSelectedDate(value); // 열 때 현재 값으로 초기화
      setIsOpen(true);
    }
  }, [disabled, value]);

  return (
    <>
      <div
        className={cn(
          'w-full px-4 py-4 text-base border rounded-xl transition-colors duration-200',
          disabled ? 'opacity-50 cursor-not-allowed' : ' hover:border-gray-400',
          className,
        )}
        onClick={handleOpen}
        aria-label={
          value ? `선택된 날짜: ${formatDateTime(value)}` : placeholder
        }
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
            <Calendar className='h-5 w-5' aria-hidden='true' />
            <Clock className='h-5 w-5' aria-hidden='true' />
          </div>
        </div>
      </div>

      <BottomSheet isOpen={isOpen} onClose={handleCancel} height='auto'>
        <main className='space-y-4'>
          <header className='text-center'>
            <h2 className='text-lg font-semibold text-gray-900'>
              경매 시작 시간 설정
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              현재 시간 이후, 정각에만 시작 가능합니다
            </p>
          </header>

          <nav
            className='flex bg-gray-100 p-1 rounded-lg'
            role='tablist'
            aria-label='날짜 시간 선택 탭'
          >
            <button
              type='button'
              role='tab'
              aria-selected={activeTab === 'date'}
              aria-controls='date-panel'
              id='date-tab'
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
              role='tab'
              aria-selected={activeTab === 'time'}
              aria-controls='time-panel'
              id='time-tab'
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
          </nav>

          <div className='min-h-[200px]'>
            {activeTab === 'date' ? (
              <div id='date-panel' role='tabpanel' aria-labelledby='date-tab'>
                <DateSelector
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  minDate={minDate}
                />
              </div>
            ) : (
              <div id='time-panel' role='tabpanel' aria-labelledby='time-tab'>
                <TimeSelector
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  minDate={minDate}
                />
              </div>
            )}
          </div>

          <footer className='flex space-x-3 pt-4'>
            <Button variant='outline' onClick={handleCancel} className='flex-1'>
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !isValidDate(selectedDate)}
              className='flex-1'
            >
              확인
            </Button>
          </footer>
        </main>
      </BottomSheet>
    </>
  );
}

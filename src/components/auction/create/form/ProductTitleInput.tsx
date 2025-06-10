'use client';

import { useState } from 'react';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { Input } from '@/components/ui/input';

export function ProductTitleInput() {
  const { title, errors, setTitle } = useCreateAuctionStore();
  const [touched, setTouched] = useState(false);

  // 실시간 유효성 검사 (포커스 아웃 후에만 보여줌)
  const isValid = title.trim().length >= 5;
  const showValidationError = touched && title.trim().length > 0 && !isValid;

  return (
    <section className='space-y-3 '>
      <Input
        label='제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => setTouched(true)}
        maxLength={100}
        aria-describedby={errors.title ? 'title-error' : 'title-help'}
        aria-invalid={!!errors.title || showValidationError}
      />

      {/* 스토어 에러 (제출 시 검증 에러) */}
      {errors.title && (
        <p id='title-error' className='text-sm text-red-500 px-1' role='alert'>
          {errors.title}
        </p>
      )}

      {/* 실시간 유효성 검사 에러 */}
      {showValidationError && !errors.title && (
        <p className='text-sm text-red-500 px-1' role='alert'>
          제목은 5자 이상이어야 합니다
        </p>
      )}

      <p id='title-help' className='text-xs text-gray-500 px-1'>
        {title.length}/50
      </p>
    </section>
  );
}

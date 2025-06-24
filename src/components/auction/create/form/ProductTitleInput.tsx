'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface ProductTitleInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  maxLength?: number;
}

export function ProductTitleInput({
  value,
  onChange,
  error,
  maxLength = 100,
}: ProductTitleInputProps) {
  const [touched, setTouched] = useState(false);
  const isValid = value.trim().length >= 5;
  const showValidationError = touched && value.trim().length > 0 && !isValid;

  return (
    <section className='space-y-3'>
      <Input
        label='제목'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        maxLength={maxLength}
        aria-describedby={error ? 'title-error' : 'title-help'}
        aria-invalid={!!error || showValidationError}
      />
      {error && (
        <p id='title-error' className='text-sm text-red-500 px-1' role='alert'>
          {error}
        </p>
      )}
      {showValidationError && !error && (
        <p className='text-sm text-red-500 px-1' role='alert'>
          제목은 5자 이상이어야 합니다
        </p>
      )}
      <p id='title-help' className='text-xs text-gray-500 px-1'>
        {value.length}/{maxLength}
      </p>
    </section>
  );
}

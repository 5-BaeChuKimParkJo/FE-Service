'use client';

import { useState } from 'react';

interface ProductDescriptionInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  maxLength?: number;
}

export function ProductDescriptionInput({
  value,
  onChange,
  error,
  maxLength = 1000,
}: ProductDescriptionInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className='space-y-1'>
      <label
        htmlFor='product-description'
        className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused || value ? 'text-primary-100' : 'text-gray-700'
        }`}
      >
        상품 설명
      </label>
      <textarea
        id='product-description'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder='상품에 대한 자세한 설명을 입력해주세요'
        rows={6}
        className={`w-full px-4 py-4 text-base border rounded-xl transition-colors duration-200 resize-none focus:outline-none ${
          isFocused
            ? 'border-primary-100'
            : error
              ? 'border-red-500'
              : 'border-gray-300'
        }`}
        maxLength={maxLength}
        aria-describedby={error ? 'description-error' : 'description-help'}
        aria-invalid={!!error}
      />
      {error && (
        <p id='description-error' className='text-xs text-red-500' role='alert'>
          {error}
        </p>
      )}
      <p id='description-help' className='text-xs text-gray-500'>
        {value.length}/{maxLength}
      </p>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';

export function ProductDescriptionInput() {
  const { description, errors, setDescription } = useCreateAuctionStore();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className='space-y-1'>
      <label
        htmlFor='product-description'
        className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused || description ? 'text-primary-100' : 'text-gray-700'
        }`}
      >
        상품 설명
      </label>
      <textarea
        id='product-description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder='상품에 대한 자세한 설명을 입력해주세요'
        rows={6}
        className={`w-full px-4 py-4 text-base border rounded-xl transition-colors duration-200 resize-none focus:outline-none ${
          isFocused
            ? 'border-primary-100'
            : errors.description
              ? 'border-red-500'
              : 'border-gray-300'
        }`}
        maxLength={1000}
        aria-describedby={
          errors.description ? 'description-error' : 'description-help'
        }
        aria-invalid={!!errors.description}
      />
      {errors.description && (
        <p id='description-error' className='text-xs text-red-500' role='alert'>
          {errors.description}
        </p>
      )}
      <p id='description-help' className='text-xs text-gray-500'>
        {description.length}/1000
      </p>
    </section>
  );
}

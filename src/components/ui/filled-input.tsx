'use client';

import { cn } from '@/lib/cn';
import type React from 'react';
import { forwardRef } from 'react';

interface FilledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  _variant?: 'default' | 'gray-bg' | 'bordered';
  label?: string;
  error?: string;
}

export const FilledInput = forwardRef<HTMLInputElement, FilledInputProps>(
  (
    { className, _variant = 'default', disabled, label, error, ...props },
    ref,
  ) => {
    return (
      <>
        <div
          className={cn(
            'w-full space-y-2 bg-gray-200 rounded-full p-3.5',
            className,
          )}
        >
          <input
            placeholder={label}
            ref={ref}
            className={cn(
              'flex-1  ml-3 focus:outline-none text-base text-blue-100 placeholder:text-blue-100',
              disabled && 'cursor-not-allowed',
            )}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && <p className='text-sm text-red-500 ml-4'>{error}</p>}
      </>
    );
  },
);

FilledInput.displayName = 'FilledInput';

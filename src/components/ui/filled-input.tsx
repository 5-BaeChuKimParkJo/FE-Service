'use client';

import { cn } from '@/lib/cn';
import type React from 'react';

import { forwardRef } from 'react';

interface FilledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  _variant?: 'default' | 'gray-bg' | 'bordered';
}

export const FilledInput = forwardRef<HTMLInputElement, FilledInputProps>(
  ({ className, _variant = 'default', disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex-1 bg-transparent focus:outline-none text-base placeholder:text-blue-100',
          disabled && 'cursor-not-allowed',
          className,
        )}
        disabled={disabled}
        {...props}
      />
    );
  },
);
FilledInput.displayName = 'FilledInput';

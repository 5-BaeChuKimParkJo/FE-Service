'use client';

import { cn } from '@/libs/cn';
import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fontWeight?: string;
  className?: string;
}

export function Input({
  label,
  error,
  className,
  fontWeight,
  disabled,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className='space-y-1'>
      <div
        className={cn(
          'relative border-b transition-colors',
          isFocused ? 'border-primary-100 ' : 'border-gray-300',
          error && 'border-destructive',
          disabled && 'opacity-60 cursor-not-allowed',
          className,
        )}
        onClick={handleContainerClick}
      >
        <label
          className={cn(
            'absolute transition-all duration-200 pointer-events-none',
            isFocused || props.value
              ? 'text-sm  top-0 text-primary-100'
              : 'text-base text-muted-foreground top-4',
          )}
        >
          {label}
        </label>
        <input
          ref={inputRef}
          className={cn(
            'pl-2 w-full pt-6 pb-3 bg-transparent focus:outline-none',
            fontWeight ? `font-${fontWeight}` : 'font-medium',
            disabled && 'cursor-not-allowed',
          )}
          style={{
            outline: 'none',
            boxShadow: 'none',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}

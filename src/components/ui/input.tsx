'use client';

import { cn } from '@/lib/cn';
import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export function Input({
  label,
  error,
  className,
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
          'relative pb-1 border-b transition-colors',
          isFocused ? 'border-primary' : 'border-gray-300',
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
              ? 'text-xs text-muted-foreground top-0'
              : 'text-base text-muted-foreground top-4',
          )}
        >
          {label}
        </label>
        <input
          ref={inputRef}
          className={cn(
            'w-full pt-6 pb-1 bg-transparent focus:outline-none text-base',
            disabled && 'cursor-not-allowed',
          )}
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

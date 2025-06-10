import React from 'react';
import { ChevronLeftIcon } from 'lucide-react';

import { cn } from '@/libs/cn';

export default function CustomBackIcon({
  className = '',
  color = 'primary',
  size,
}: Readonly<{
  className?: string;
  color?: 'primary' | 'gray' | string;
  size?: number;
}>) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        'border-1',
        className,
      )}
      style={{
        width: size,
        height: size,
        borderColor: color === 'primary' ? 'var(--color-primary-200)' : color,
      }}
    >
      <ChevronLeftIcon
        style={{
          color: color === 'primary' ? 'var(--color-primary-200)' : color,
          width: size ? size * 0.4 : '1.2rem',
        }}
      />
    </div>
  );
}

import { cn } from '@/libs/cn';
import type React from 'react';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'orange' | 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  red: 'text-red-100 border-red-100 ',
  orange: 'text-yellow-300 border-yellow-300 ',
  primary: 'text-primary-200 border-primary-200 bg-primary-200/10',
  default: 'text-gray-600 border-gray-600 bg-gray-50',
};

const sizeStyles = {
  sm: 'px-2 pt-0.5 text-xs font-black',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function StatusBadge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-full border-1 transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

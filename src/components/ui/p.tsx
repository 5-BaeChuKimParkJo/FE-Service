import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/libs/cn';

const pVariants = cva('leading-relaxed', {
  variants: {
    size: {
      xs: 'text-xs', // 12px
      sm: 'text-sm', // 14px
      base: 'text-base', // 16px
      lg: 'text-lg', // 18px
      xl: 'text-xl', // 20px
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: '',
      primary: 'text-primary-100',
      secondary: 'text-secondary-100',
      muted: 'text-gray-500',
      danger: 'text-red-500',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'default',
    align: 'left',
  },
});

interface PProps extends VariantProps<typeof pVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'article' | 'section';
}

export const P = ({
  size,
  weight,
  color,
  align,
  className,
  children,
  as = 'p',
}: PProps) => {
  const classes = cn(pVariants({ size, weight, color, align }), className);

  return React.createElement(as, { className: classes }, children);
};

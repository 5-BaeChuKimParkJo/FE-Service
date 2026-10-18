import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/libs/cn';

const titleVariants = cva('font-sans leading-tight', {
  variants: {
    level: {
      1: 'text-4xl md:text-5xl',
      2: 'text-3xl md:text-4xl',
      3: 'text-2xl md:text-3xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: '',
      primary: 'text-primary-100 ',
      secondary: 'text-secondary-100 ',
      danger: 'text-red-500 ',
    },
  },
  defaultVariants: {
    level: 1,
    weight: 'semibold',
    color: 'default',
  },
});

interface TitleProps extends VariantProps<typeof titleVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export const Title = ({
  level = 1,
  weight,
  color,
  className,
  children,
  as,
}: TitleProps) => {
  const classes = cn(titleVariants({ level, weight, color }), className);

  if (as) {
    return React.createElement(as, { className: classes }, children);
  }

  switch (level) {
    case 1:
      return <h1 className={classes}>{children}</h1>;
    case 2:
      return <h2 className={classes}>{children}</h2>;
    case 3:
      return <h3 className={classes}>{children}</h3>;
    default:
      return <h1 className={classes}>{children}</h1>;
  }
};

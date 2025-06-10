import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/libs/cn';

const labelVariants = cva('font-medium', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
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
    display: {
      inline: '',
      block: 'block',
      'inline-block': 'inline-block',
    },
    required: {
      true: 'after:content-["*"] after:text-red-500 after:ml-1',
      false: '',
    },
  },
  defaultVariants: {
    size: 'sm',
    weight: 'medium',
    color: 'default',
    display: 'block',
    required: false,
  },
});

interface LabelProps extends VariantProps<typeof labelVariants> {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
  onClick?: () => void;
}

export const Label = ({
  size,
  weight,
  color,
  display,
  required,
  className,
  children,
  htmlFor,
  onClick,
}: LabelProps) => {
  const classes = cn(
    labelVariants({ size, weight, color, display, required }),
    className,
  );

  return (
    <label className={classes} htmlFor={htmlFor} onClick={onClick}>
      {children}
    </label>
  );
};

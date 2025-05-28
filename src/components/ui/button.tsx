import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const LoadingSpinner = () => (
  <svg className='animate-spin size-4' viewBox='0 0 24 24'>
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
      fill='none'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
);

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary-200 text-white shadow-xs hover:bg-primary-200/90',
        primary: 'bg-primary-100 text-white shadow-xs hover:bg-primary-100/90',
        secondary:
          'bg-primary-300 text-white shadow-xs hover:bg-primary-300/90',
        yellow_100: 'bg-yellow-100 text-white shadow-xs hover:bg-yellow-100/90',
        yellow_200: 'bg-yellow-200 text-white shadow-xs hover:bg-yellow-200/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        pending: 'bg-primary-200/70 text-white shadow-xs cursor-wait',
        disabled: 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
      width: {
        auto: 'px-6',
        full: 'w-full px-6',
        half: 'w-1/2 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isPending?: boolean;
  label?: string;
}

function Button({
  className,
  variant,
  width,
  size,
  asChild = false,
  disabled,
  isPending,
  label,
  style,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const getButtonVariant = () => {
    if (disabled) return 'disabled';
    if (isPending) return 'pending';
    return variant;
  };

  const isDisabled = disabled || isPending;

  return (
    <Comp
      data-slot='button'
      className={cn(
        buttonVariants({
          variant: getButtonVariant(),
          width,
          size,
          className,
        }),
      )}
      disabled={isDisabled}
      style={style}
      {...props}
    >
      {isPending && <LoadingSpinner />}
      {label || children}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };

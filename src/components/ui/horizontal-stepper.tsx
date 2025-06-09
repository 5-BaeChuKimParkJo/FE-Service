'use client';

import type * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/libs/cn';

interface StepIconProps {
  icon: React.ReactNode;
  isCompleted?: boolean;
  isActive?: boolean;
}

const StepIcon: React.FC<StepIconProps> = ({ icon, isCompleted, isActive }) => {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full border-2',
        isCompleted
          ? 'border-primary bg-primary text-primary-foreground'
          : isActive
            ? 'border-primary'
            : 'border-muted',
      )}
    >
      {isCompleted ? <Check className='h-5 w-5' /> : icon}
    </div>
  );
};

interface HorizontalStepperProps {
  steps: Array<{
    icon: React.ReactNode;
    label: string;
  }>;
  currentStep: number;
}

export function HorizontalStepper({
  steps,
  currentStep,
}: HorizontalStepperProps) {
  return (
    <nav aria-label='Registration progress' className='w-full'>
      <ol className='flex items-center justify-between'>
        {steps.map((step, index) => (
          <li key={index} className='flex flex-col items-center'>
            <StepIcon
              icon={step.icon}
              isCompleted={index < currentStep}
              isActive={index === currentStep}
            />
            <span
              className={cn(
                'mt-2 text-xs font-medium',
                index === currentStep
                  ? 'text-primary'
                  : index < currentStep
                    ? 'text-foreground'
                    : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'absolute top-5 h-[2px] w-[calc(100%/var(--step-count)-1rem)]',
                  index < currentStep ? 'bg-primary' : 'bg-muted',
                )}
                style={
                  {
                    left: `calc(${index * (100 / steps.length)}% + 2.5rem)`,
                    '--step-count': steps.length,
                  } as React.CSSProperties
                }
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

import { CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import * as React from 'react';

interface UserIdInputProps {
  userId: string;
  error: string;
  isVerified: boolean;
  isChecking: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserIdInput({
  userId,
  error,
  isVerified,
  isChecking,
  onChange,
}: UserIdInputProps) {
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
          isVerified && !error && 'border-green-500',
        )}
        onClick={handleContainerClick}
      >
        <label
          className={cn(
            'absolute transition-all duration-200 pointer-events-none',
            isFocused || userId
              ? 'text-xs text-muted-foreground top-0'
              : 'text-base text-muted-foreground top-4',
          )}
        >
          아이디
        </label>
        <div className='flex items-center'>
          <input
            ref={inputRef}
            className='w-full pt-6 pb-1 bg-transparent focus:outline-none text-base'
            type='text'
            value={userId}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {isChecking && (
            <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
          )}
          {isVerified && !error && (
            <CheckCircle className='h-4 w-4 text-green-500' />
          )}
        </div>
      </div>
      {error && <p className='text-xs text-destructive'>{error}</p>}
      {isVerified && !error && (
        <p className='text-xs text-green-500'>사용 가능한 아이디입니다.</p>
      )}
    </div>
  );
}

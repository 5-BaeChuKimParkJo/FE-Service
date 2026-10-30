'use client';
import { useEffect, useRef, useState } from 'react';
import { LogIn } from 'lucide-react';
import { signInDemo } from '@/actions/auth-service/sign-in-demo';
import { Button } from '@/components/ui/Button';
import { demoReturnTo, type DemoMode } from '@/libs/demoSignIn';

export interface DemoSignInChoice {
  mode: DemoMode;
  label: string;
  returnTo?: string;
  description?: string;
}

export function DemoSignInButtons({
  choices,
}: {
  choices: DemoSignInChoice[];
}) {
  const busy = useRef(false);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<DemoMode | null>(null);
  const [error, setError] = useState('');
  useEffect(() => setReady(true), []);
  async function handleClick(choice: DemoSignInChoice) {
    if (busy.current) return;
    busy.current = true;
    setPending(choice.mode);
    setError('');
    try {
      await signInDemo(choice.mode);
      window.location.assign(demoReturnTo(choice.mode, choice.returnTo));
    } catch {
      setError('체험 계정에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.');
      setPending(null);
      busy.current = false;
    }
  }
  return (
    <div className='w-full space-y-3'>
      {choices.map((choice) => (
        <div key={choice.mode}>
          {choice.description && (
            <p className='mb-2 text-xs text-gray-500'>{choice.description}</p>
          )}
          <Button
            type='button'
            width='full'
            size='xl'
            disabled={!ready || pending !== null}
            aria-busy={pending === choice.mode}
            onClick={() => handleClick(choice)}
            className={
              choice.mode === 'seller'
                ? 'border border-primary-200 bg-white text-primary-200 hover:bg-gray-50'
                : undefined
            }
          >
            <LogIn className='mr-2 size-5' aria-hidden='true' />
            {pending === choice.mode ? '연결 중...' : choice.label}
          </Button>
        </div>
      ))}
      {error && (
        <p role='alert' className='mt-2 text-sm text-red-700'>
          {error}
        </p>
      )}
    </div>
  );
}

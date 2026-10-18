'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { signInDemo } from '@/actions/auth-service/sign-in-demo';
import { Button } from '@/components/ui/Button';

export function DemoSignInButton({
  returnTo = '/',
  label = '체험 계정으로 입찰하기',
}: {
  returnTo?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    try {
      await signInDemo();
      router.replace(returnTo);
      router.refresh();
    } catch {
      setError('체험 계정에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    }
  }

  return (
    <div className='w-full'>
      <Button
        type='button'
        width='full'
        size='xl'
        disabled={loading}
        onClick={handleClick}
      >
        <LogIn className='mr-2 size-5' aria-hidden='true' />
        {loading ? '연결 중...' : label}
      </Button>
      {error && (
        <p role='alert' className='mt-2 text-sm text-red-700'>
          {error}
        </p>
      )}
    </div>
  );
}

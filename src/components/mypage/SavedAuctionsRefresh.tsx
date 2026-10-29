'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

export function SavedAuctionsRefresh() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type='button'
      disabled={pending}
      aria-busy={pending}
      onClick={() => startTransition(() => router.refresh())}
      className='inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm text-gray-600 disabled:opacity-50'
    >
      <RefreshCw
        aria-hidden='true'
        className={`h-4 w-4 ${pending ? 'animate-spin' : ''}`}
      />
      {pending ? '불러오는 중' : '새로고침'}
    </button>
  );
}

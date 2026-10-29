'use client';

import { useEffect, useState } from 'react';
import { signOut } from '@/actions/auth-service/sign-out';

export function SavedAuctionsSignIn({
  returnTo,
  children,
}: {
  returnTo: string;
  children: React.ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  async function signIn() {
    setPending(true);
    setError(false);
    try {
      await signOut();
      window.location.assign(
        '/sign-in?redirect=' + encodeURIComponent(returnTo),
      );
    } catch {
      setError(true);
      setPending(false);
    }
  }
  return (
    <div>
      <button
        type='button'
        onClick={signIn}
        disabled={!ready || pending}
        aria-busy={pending}
        className='inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 disabled:opacity-50'
      >
        {pending ? '로그인 화면으로 이동 중...' : children}
      </button>
      {error && (
        <p role='alert' className='mt-2 text-xs text-red-700'>
          로그인 화면으로 이동하지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}

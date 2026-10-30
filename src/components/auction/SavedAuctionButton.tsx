'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, RefreshCw } from 'lucide-react';
import {
  getSavedAuctionState,
  saveAuction,
  removeSavedAuction,
} from '@/actions/auction-service/saved-auctions';
import type { SavedAuctionStateResult } from '@/types/auction/saved-auctions';
import { SessionSignInButton } from '@/components/auth/SessionSignInButton';

export function SavedAuctionButton({
  auctionUuid,
  initial,
}: {
  auctionUuid: string;
  initial: SavedAuctionStateResult;
}) {
  const router = useRouter();
  const [state, setState] = useState(initial);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const saved = state.ok ? state.saved : null;

  if (!state.ok && state.error.code === 'AUTH_REQUIRED')
    return (
      <SessionSignInButton returnTo={'/auctions/' + auctionUuid}>
        <Heart className='h-4 w-4' aria-hidden='true' />
        로그인하고 관심 등록
      </SessionSignInButton>
    );

  async function submit() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      const result =
        saved === null
          ? await getSavedAuctionState(auctionUuid)
          : saved
            ? await removeSavedAuction(auctionUuid)
            : await saveAuction(auctionUuid);
      if (result.ok) {
        setState(result);
        if (saved !== null) router.refresh();
      } else {
        setError(result.error.message);
        if (result.error.code === 'AUTH_REQUIRED') setState(result);
      }
    } catch {
      setError('처리 결과를 확인하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <div>
      <button
        type='button'
        disabled={pending}
        aria-busy={pending}
        aria-pressed={saved ?? undefined}
        onClick={submit}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium disabled:opacity-50 ${saved ? 'border-primary-100 bg-primary-100/5 text-primary-200' : 'border-gray-200 bg-white text-gray-700'}`}
      >
        {saved === null ? (
          <RefreshCw className='h-4 w-4' aria-hidden='true' />
        ) : (
          <Heart
            className={`h-4 w-4 ${saved ? 'fill-primary-100' : ''}`}
            aria-hidden='true'
          />
        )}
        {pending
          ? '처리 중...'
          : saved === null
            ? '관심 상태 다시 확인'
            : saved
              ? '관심 해제'
              : '관심 등록'}
      </button>
      {(error || !state.ok) && (
        <p role='alert' className='mt-2 text-xs leading-5 text-red-700'>
          {error || (!state.ok ? state.error.message : '')}
        </p>
      )}
    </div>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';
import { prepareSellerDemo } from '@/actions/auction-service/seller-demo';
import type { SellerDemoFailure } from '@/types/auction/seller-demo';
import { SessionSignInButton } from '@/components/auth/SessionSignInButton';
import { defaultMySalesQuery, mySalesUrl } from '@/libs/mySales';
export function PrepareSellerDemoButton() {
  const busy = useRef(false);
  const [ready, setReady] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState<SellerDemoFailure['error'] | null>(null);
  useEffect(() => setReady(true), []);
  async function prepare() {
    if (!ready || busy.current) return;
    busy.current = true;
    setPending(true);
    setError(null);
    let navigating = false;
    try {
      const result = await prepareSellerDemo();
      if (result.ok) {
        navigating = true;
        window.location.assign('/mypage/sales/' + result.auctionUuid);
        return;
      }
      setError(result.error);
    } catch {
      navigating = false;
      setError({
        code: 'REQUEST_FAILED',
        message:
          '처리 결과를 확인하지 못했습니다. 내 경매를 확인한 뒤 다시 준비해 주세요.',
      });
    } finally {
      if (!navigating) {
        busy.current = false;
        setPending(false);
      }
    }
  }
  return (
    <div className='mt-4 space-y-3'>
      <button
        type='button'
        disabled={!ready || pending}
        aria-busy={pending}
        onClick={() => void prepare()}
        className='inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-200 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
      >
        {pending ? '데모 준비 중...' : '판매자 데모 준비'}
      </button>
      {error && (
        <div
          role='alert'
          aria-label='데모 준비 결과'
          className='rounded-lg border border-red-100 bg-red-50 p-3 text-sm'
        >
          <p className='leading-6 text-red-800'>{error.message}</p>
          {error.code === 'AUTH_REQUIRED' ? (
            <div className='mt-2'>
              <SessionSignInButton returnTo='/mypage/sales'>
                로그인하기
              </SessionSignInButton>
            </div>
          ) : (
            <a
              href={mySalesUrl(defaultMySalesQuery)}
              className='mt-2 inline-flex min-h-11 items-center font-medium underline'
            >
              내 경매 확인
            </a>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CreditCard, RotateCw } from 'lucide-react';
import {
  confirmCheckout,
  getCheckout,
  prepareCheckout,
  reconcileCheckout,
} from '@/actions/auction-service/checkout';
import { Button } from '@/components/ui/button';
import { checkoutPhase, formatCheckoutTime } from '@/libs/checkout';
import type {
  CheckoutConfirmation,
  CheckoutResult,
} from '@/types/auction/checkout';
import { TossCheckout } from './TossCheckout';

type Props = {
  auctionUuid: string;
  initial: CheckoutResult;
  mode?: 'checkout' | 'success' | 'fail';
  confirmation?: CheckoutConfirmation | null;
};

export function CheckoutClient({
  auctionUuid,
  initial,
  mode = 'checkout',
  confirmation = null,
}: Props) {
  const [result, setResult] = useState(initial);
  const [prepared, setPrepared] = useState(false);
  const [recovery, setRecovery] = useState(
    mode !== 'checkout' ||
      (initial.ok && initial.view.purchase?.attempt?.status === 'READY'),
  );
  const [notice, setNotice] = useState<string | null>(
    mode === 'fail'
      ? '결제가 중단되었습니다. 다시 시도하기 전에 결제 상태를 확인해 주세요.'
      : null,
  );
  const [busy, setBusy] = useState(mode === 'success' && confirmation !== null);
  const running = useRef(false);
  const confirmed = useRef(false);
  const phase = result.ok ? checkoutPhase(result.view) : null;

  const uncertain = useCallback((message: string) => {
    setPrepared(false);
    setRecovery(true);
    setNotice(message);
  }, []);

  useEffect(() => {
    // Returning from an external payment page or the back/forward cache invalidates a prepared UI.
    const back = (event: PageTransitionEvent) => {
      if (event.persisted) uncertain('결제 상태를 다시 확인해 주세요.');
    };
    window.addEventListener('pageshow', back);
    return () => window.removeEventListener('pageshow', back);
  }, [uncertain]);

  useEffect(() => {
    if (mode !== 'success' || confirmed.current) return;
    confirmed.current = true;
    if (!confirmation) {
      setNotice(
        '결제 응답 정보가 올바르지 않습니다. 결제 상태를 확인해 주세요.',
      );
      setBusy(false);
      return;
    }
    running.current = true;
    // This runs after hydration. Server rendering and link prefetching perform GET only.
    void confirmCheckout(auctionUuid, confirmation)
      .then((next) => {
        setResult(next);
        setNotice(next.ok ? null : next.error.message);
      })
      .catch(() => {
        uncertain(
          '결제 승인 결과를 받지 못했습니다. 결제 상태를 확인해 주세요.',
        );
      })
      .finally(() => {
        running.current = false;
        setBusy(false);
      });
  }, [auctionUuid, confirmation, mode, uncertain]);

  async function run(action: 'read' | 'prepare' | 'reconcile') {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setPrepared(false);
    setNotice(null);
    try {
      const next = await (action === 'prepare'
        ? prepareCheckout(auctionUuid)
        : action === 'reconcile'
          ? reconcileCheckout(auctionUuid)
          : getCheckout(auctionUuid));
      setResult(next);
      if (!next.ok) {
        setRecovery(true);
        setNotice(next.error.message);
      } else {
        setRecovery(action === 'read');
        setPrepared(
          action === 'prepare' && checkoutPhase(next.view) === 'ready',
        );
      }
    } catch {
      uncertain('요청 결과를 받지 못했습니다. 결제 상태를 확인해 주세요.');
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  const purchase = result.ok ? result.view.purchase : null;
  const pendingDeposit = purchase?.attempt?.status === 'WAITING_FOR_DEPOSIT';
  const cancelPending =
    phase === 'pending' &&
    (purchase?.attempt?.status === 'CANCELING' || purchase?.status === 'PAID');
  const title =
    phase === 'paid'
      ? '결제가 완료되었습니다'
      : phase === 'canceled'
        ? '취소된 주문입니다'
        : cancelPending
          ? '결제 취소 상태 확인'
          : pendingDeposit
            ? '입금을 기다리고 있습니다'
            : phase === 'pending' || recovery
              ? '결제 상태 확인'
              : '낙찰 상품 결제';

  return (
    <div className='min-h-[70vh] bg-white pb-8'>
      <header className='space-y-3 px-4 py-6'>
        <p className='text-xs font-semibold tracking-normal text-blue-700'>
          Toss TEST
        </p>
        <h1 className='break-words text-xl font-bold'>{title}</h1>
        {phase === 'paid' && (
          <CheckCircle2
            className='size-8 text-emerald-700'
            aria-hidden='true'
          />
        )}
      </header>

      {purchase && (
        <section
          className='space-y-4 border-y px-4 py-5'
          aria-label='주문 내역'
        >
          <h2 className='break-words text-base font-semibold [overflow-wrap:anywhere]'>
            {purchase.orderName}
          </h2>
          <dl className='space-y-3 text-sm'>
            <div className='flex flex-wrap items-baseline justify-between gap-2'>
              <dt className='text-gray-600'>낙찰 금액</dt>
              <dd className='break-all text-lg font-bold'>
                {BigInt(purchase.amount).toLocaleString('ko-KR')}원
              </dd>
            </div>
            {purchase.attempt && (
              <div className='space-y-1'>
                <dt className='text-gray-600'>주문번호</dt>
                <dd className='break-all text-xs'>
                  {purchase.attempt.orderId}
                </dd>
              </div>
            )}
            {purchase.paidAt && (
              <div className='space-y-1'>
                <dt className='text-gray-600'>결제 일시 (KST)</dt>
                <dd>{formatCheckoutTime(purchase.paidAt)}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <div className='space-y-4 px-4 py-5' aria-live='polite'>
        {busy && (
          <p className='text-sm text-gray-600' role='status'>
            결제 상태를 확인하는 중입니다.
          </p>
        )}
        {notice && (
          <p className='break-words text-sm text-red-700' role='alert'>
            {notice}
          </p>
        )}
        {!result.ok && (
          <p className='text-sm text-gray-700'>{result.error.message}</p>
        )}
        {phase === 'unavailable' && (
          <p className='text-sm text-gray-700'>
            현재 이 주문의 테스트 결제를 이용할 수 없습니다.
          </p>
        )}
        {phase === 'pending' && (
          <p className='text-sm text-gray-700'>
            {cancelPending
              ? '취소 처리 결과를 확인하고 있습니다. 취소 상태가 확정될 때까지 기다려 주세요.'
              : pendingDeposit
                ? '입금 대기 상태입니다. 입금 완료 후 결제 상태를 확인해 주세요.'
                : '결제 처리 결과를 확인하고 있습니다. 상태가 확정될 때까지 추가 결제는 진행할 수 없습니다.'}
          </p>
        )}
        {phase === 'paid' && (
          <p className='text-sm text-gray-700'>주문 결제가 확인되었습니다.</p>
        )}
        {phase === 'canceled' && (
          <p className='text-sm text-gray-700'>
            취소된 주문은 다시 결제할 수 없습니다.
          </p>
        )}
        {!result.ok && result.error.code === 'AUTH_REQUIRED' && (
          <Button asChild className='w-full rounded-lg'>
            <Link href='/sign-in'>로그인</Link>
          </Button>
        )}
        {!result.ok &&
          !['AUTH_REQUIRED', 'FORBIDDEN'].includes(result.error.code) && (
            <Button
              variant='outline'
              className='w-full rounded-lg'
              isPending={busy}
              onClick={() => void run('read')}
            >
              <RotateCw aria-hidden='true' />
              다시 불러오기
            </Button>
          )}
        {result.ok &&
          phase !== 'paid' &&
          phase !== 'canceled' &&
          (recovery || phase === 'pending') && (
            <Button
              className='w-full rounded-lg'
              size='xl'
              isPending={busy}
              onClick={() => void run('reconcile')}
            >
              <RotateCw aria-hidden='true' />
              결제 상태 확인
            </Button>
          )}
        {result.ok &&
          !recovery &&
          !prepared &&
          (phase === 'prepare' || phase === 'ready') && (
            <Button
              className='w-full rounded-lg'
              size='xl'
              isPending={busy}
              onClick={() => void run('prepare')}
            >
              <CreditCard aria-hidden='true' />
              테스트 결제 준비
            </Button>
          )}
      </div>

      {result.ok && prepared && !recovery && phase === 'ready' && (
        <TossCheckout view={result.view} onUncertain={uncertain} />
      )}

      <nav className='px-4 pt-4' aria-label='주문 이동'>
        <Button asChild variant='outline' className='w-full rounded-lg'>
          <Link
            href={`/auctions/${encodeURIComponent(auctionUuid)}`}
            prefetch={false}
          >
            <ArrowLeft aria-hidden='true' />
            경매로 돌아가기
          </Link>
        </Button>
      </nav>
    </div>
  );
}

'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CreditCard, RotateCw } from 'lucide-react';
import { getCheckout } from '@/actions/auction-service/checkout';
import { Button } from '@/components/ui/Button';
import { checkoutPhase } from '@/libs/checkout';
import {
  loadTossSdk,
  mountTossCheckout,
  type MountedCheckout,
} from '@/libs/toss-checkout';
import type { CheckoutView } from '@/types/auction/checkout';

export function TossCheckout({
  view,
  onUncertain,
}: {
  view: CheckoutView;
  onUncertain: (message: string) => void;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const checkout = useRef<MountedCheckout | null>(null);
  const requesting = useRef(false);
  const [ready, setReady] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let mounted: MountedCheckout | null = null;
    setReady(false);
    setAgreed(false);
    setError(false);
    void (async () => {
      try {
        const factory = await loadTossSdk();
        if (controller.signal.aborted) return;
        mounted = await mountTossCheckout(
          factory,
          view,
          { methods: `#methods-${id}`, agreement: `#agreement-${id}` },
          setAgreed,
          controller.signal,
        );
        if (controller.signal.aborted) {
          await mounted.destroy();
          return;
        }
        checkout.current = mounted;
        setReady(true);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    })();
    return () => {
      controller.abort();
      checkout.current = null;
      if (mounted) void mounted.destroy();
    };
  }, [id, view, retry]);

  async function pay() {
    if (requesting.current || !checkout.current || !ready || !agreed) return;
    requesting.current = true;
    setBusy(true);
    try {
      const latest = await getCheckout(view.auctionUuid);
      if (
        !latest.ok ||
        checkoutPhase(latest.view) !== 'ready' ||
        latest.view.purchase?.attempt?.orderId !==
          view.purchase?.attempt?.orderId ||
        latest.view.purchase?.amount !== view.purchase?.amount ||
        latest.view.purchase?.customerKey !== view.purchase?.customerKey ||
        latest.view.clientKey !== view.clientKey
      ) {
        onUncertain('주문 상태가 변경되었습니다. 결제 상태를 확인해 주세요.');
        return;
      }
      await checkout.current.requestPayment(window.location.origin);
      // A resolved SDK promise is not proof of payment; only the backend can mark PAID.
      onUncertain('결제 결과를 확인해 주세요.');
    } catch {
      onUncertain(
        '결제가 중단되었거나 결과를 받지 못했습니다. 결제 상태를 확인해 주세요.',
      );
    } finally {
      requesting.current = false;
      setBusy(false);
    }
  }

  return (
    <section
      className='space-y-4 border-t bg-white py-5'
      aria-label='결제 수단 및 약관'
    >
      <h2 className='px-4 text-base font-semibold'>결제 수단</h2>
      {!ready && !error && (
        <p className='px-4 text-sm text-gray-600' role='status'>
          결제 수단을 불러오는 중입니다.
        </p>
      )}
      <div id={`methods-${id}`} className='min-h-32 w-full' />
      <div id={`agreement-${id}`} className='min-h-20 w-full' />
      <div className='space-y-3 px-4'>
        {error && (
          <div role='alert' className='space-y-3 text-sm text-red-700'>
            <p>
              결제 수단을 불러오지 못했습니다. 연결을 확인한 후 다시 시도해
              주세요.
            </p>
            <Button
              variant='outline'
              className='w-full rounded-lg'
              onClick={() => setRetry((value) => value + 1)}
            >
              <RotateCw aria-hidden='true' />
              결제 수단 다시 불러오기
            </Button>
          </div>
        )}
        <Button
          className='w-full rounded-lg'
          size='xl'
          disabled={!ready || !agreed || error || busy}
          isPending={busy}
          onClick={() => void pay()}
        >
          <CreditCard aria-hidden='true' />
          테스트 결제하기
        </Button>
      </div>
    </section>
  );
}

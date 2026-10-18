import { checkoutPhase, sdkAmount, testCheckoutEnabled } from '@/libs/checkout';
import type { CheckoutView } from '@/types/auction/checkout';

type Widget = { destroy(): Promise<void> | void };
type AgreementWidget = Widget & {
  on(
    event: 'agreementStatusChange',
    callback: (event: { agreedRequiredTerms: boolean }) => void,
  ): void;
};
type TossWidgets = {
  setAmount(amount: { currency: 'KRW'; value: number }): Promise<void>;
  renderPaymentMethods(options: {
    selector: string;
    variantKey: string;
  }): Promise<Widget>;
  renderAgreement(options: {
    selector: string;
    variantKey: string;
  }): Promise<AgreementWidget>;
  requestPayment(options: {
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
  }): Promise<void>;
};
export type TossFactory = (clientKey: string) => {
  widgets(options: { customerKey: string }): TossWidgets;
};
export type MountedCheckout = {
  requestPayment(origin: string): Promise<void>;
  destroy(): Promise<void>;
};

declare global {
  interface Window {
    TossPayments?: TossFactory;
  }
}

let loading: Promise<TossFactory> | null = null;
const scriptId = 'toss-payments-v2-standard';

export function loadTossSdk(): Promise<TossFactory> {
  if (window.TossPayments) return Promise.resolve(window.TossPayments);
  if (loading) return loading;
  loading = new Promise<TossFactory>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.async = true;
    const timer = setTimeout(() => fail(), 15000);
    function fail() {
      clearTimeout(timer);
      script.remove();
      loading = null;
      reject(new Error('Payment SDK could not load'));
    }
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timer);
      if (window.TossPayments) resolve(window.TossPayments);
      else fail();
    };
    document.getElementById(scriptId)?.remove();
    document.head.appendChild(script);
  });
  return loading;
}

function bounded<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    function cleanup() {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
    }
    const abort = () => {
      cleanup();
      reject(new Error('Payment widget initialization stopped'));
    };
    const timer = setTimeout(abort, 20000);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(error);
      },
    );
  });
}

export async function mountTossCheckout(
  factory: TossFactory,
  view: CheckoutView,
  selectors: { methods: string; agreement: string },
  onAgreement: (agreed: boolean) => void,
  signal: AbortSignal,
): Promise<MountedCheckout> {
  if (
    !testCheckoutEnabled(view) ||
    checkoutPhase(view) !== 'ready' ||
    !view.purchase?.attempt ||
    signal.aborted
  )
    throw new Error('Checkout is not ready');
  const purchase = view.purchase;
  const orderId = purchase.attempt!.orderId;
  const amount = sdkAmount(purchase.amount);
  const widgets = factory(view.clientKey!).widgets({
    customerKey: purchase.customerKey,
  });
  const mounted: Widget[] = [];
  let stopped = false;
  let agreed = false;
  async function destroy() {
    stopped = true;
    signal.removeEventListener('abort', abort);
    await Promise.allSettled(
      mounted
        .splice(0)
        .map((widget) => Promise.resolve().then(() => widget.destroy())),
    );
  }
  const abort = () => {
    void destroy();
  };
  signal.addEventListener('abort', abort, { once: true });
  async function take<T extends Widget>(promise: Promise<T>): Promise<T> {
    return bounded(
      promise.then((widget) => {
        if (stopped || signal.aborted) {
          void Promise.resolve()
            .then(() => widget.destroy())
            .catch(() => {});
          throw new Error('Checkout stopped');
        }
        mounted.push(widget);
        return widget;
      }),
      signal,
    );
  }
  try {
    await bounded(
      widgets.setAmount({ currency: 'KRW', value: amount }),
      signal,
    );
    if (stopped) throw new Error('Checkout stopped');
    await take(
      widgets.renderPaymentMethods({
        selector: selectors.methods,
        variantKey: 'DEFAULT',
      }),
    );
    const agreement = await take(
      widgets.renderAgreement({
        selector: selectors.agreement,
        variantKey: 'AGREEMENT',
      }),
    );
    agreement.on('agreementStatusChange', (event) => {
      if (!stopped) {
        agreed = event.agreedRequiredTerms === true;
        onAgreement(agreed);
      }
    });
    return {
      destroy,
      async requestPayment(origin) {
        if (stopped || signal.aborted || !agreed)
          throw new Error('Checkout is not ready');
        const base = `${origin}/auctions/${encodeURIComponent(view.auctionUuid)}/checkout`;
        await widgets.requestPayment({
          orderId,
          orderName: purchase.orderName,
          successUrl: `${base}/success`,
          failUrl: `${base}/fail`,
        });
      },
    };
  } catch (error) {
    await destroy();
    throw error;
  }
}

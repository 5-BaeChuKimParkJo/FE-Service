import { describe, expect, it, vi } from 'vitest';
import { checkoutFixture } from '@/test/checkout-fixture';
import { mountTossCheckout, type TossFactory } from './toss-checkout';

function fakeSdk() {
  const events: string[] = [];
  let agreementChanged: (event: {
    agreedRequiredTerms: boolean;
  }) => void = () => {};
  let agreed = false;
  const methods = {
    destroy: vi.fn(async () => {
      events.push('destroy methods');
    }),
  };
  const agreement = {
    getAgreementStatus: vi.fn(async () => ({ agreedRequiredTerms: agreed })),
    destroy: vi.fn(async () => {
      events.push('destroy agreement');
    }),
    on: vi.fn((_name, callback) => {
      agreementChanged = callback;
    }),
  };
  const sdk = {
    setAmount: vi.fn(async () => {
      events.push('amount');
    }),
    renderPaymentMethods: vi.fn(async () => {
      events.push('methods');
      return methods;
    }),
    renderAgreement: vi.fn(async () => {
      events.push('agreement');
      return agreement;
    }),
    requestPayment: vi.fn(async () => {
      events.push('request');
    }),
  };
  const widgets = vi.fn(() => sdk);
  const factory: TossFactory = vi.fn(() => ({ widgets }));
  return {
    events,
    sdk,
    factory,
    widgets,
    methods,
    agreement,
    agree: () => {
      agreed = true;
      agreementChanged({ agreedRequiredTerms: true });
    },
  };
}

const selectors = { methods: '#test-methods', agreement: '#test-agreement' };

describe('Toss v2 order-page widgets', () => {
  it('sets snapshot amount, renders both widgets and requires agreement before requesting', async () => {
    const fake = fakeSdk();
    const checkout = await mountTossCheckout(
      fake.factory,
      checkoutFixture(),
      selectors,
      vi.fn(),
      new AbortController().signal,
    );
    expect(fake.events).toEqual(['amount', 'methods', 'agreement']);
    expect(fake.widgets).toHaveBeenCalledWith({
      customerKey: 'random-customer-test',
    });
    expect(fake.sdk.setAmount).toHaveBeenCalledWith({
      currency: 'KRW',
      value: 15000,
    });
    await expect(
      checkout.requestPayment('http://localhost:3000'),
    ).rejects.toThrow();
    expect(fake.sdk.requestPayment).not.toHaveBeenCalled();
    fake.agree();
    await checkout.requestPayment('http://localhost:3000');
    expect(fake.sdk.requestPayment).toHaveBeenCalledWith({
      orderId: 'order_test_123',
      orderName: '테스트 경매 상품',
      successUrl:
        'http://localhost:3000/auctions/auction-test-123/checkout/success',
      failUrl: 'http://localhost:3000/auctions/auction-test-123/checkout/fail',
    });
    await checkout.destroy();
    expect(fake.methods.destroy).toHaveBeenCalledTimes(1);
    expect(fake.agreement.destroy).toHaveBeenCalledTimes(1);
    await expect(
      checkout.requestPayment('http://localhost:3000'),
    ).rejects.toThrow();
  });

  it('never initializes unsafe, non-test or unresolved snapshots', async () => {
    for (const mutate of [
      (view: ReturnType<typeof checkoutFixture>) => {
        view.clientKey = 'live_gck_unsafe';
      },
      (view: ReturnType<typeof checkoutFixture>) => {
        view.purchase!.amount = '9007199254740992';
      },
      (view: ReturnType<typeof checkoutFixture>) => {
        view.purchase!.attempt!.status = 'UNKNOWN';
      },
    ]) {
      const fake = fakeSdk();
      const view = checkoutFixture();
      mutate(view);
      await expect(
        mountTossCheckout(
          fake.factory,
          view,
          selectors,
          vi.fn(),
          new AbortController().signal,
        ),
      ).rejects.toThrow();
      expect(fake.factory).not.toHaveBeenCalled();
    }
  });

  it('destroys the methods widget when agreement rendering fails', async () => {
    const fake = fakeSdk();
    fake.sdk.renderAgreement.mockRejectedValue(new Error('render failed'));
    await expect(
      mountTossCheckout(
        fake.factory,
        checkoutFixture(),
        selectors,
        vi.fn(),
        new AbortController().signal,
      ),
    ).rejects.toThrow();
    expect(fake.methods.destroy).toHaveBeenCalledTimes(1);
    expect(fake.sdk.requestPayment).not.toHaveBeenCalled();
  });

  it('initializes prechecked required agreement before enabling payment', async () => {
    const fake = fakeSdk();
    fake.agreement.getAgreementStatus.mockResolvedValue({
      agreedRequiredTerms: true,
    });
    const changed = vi.fn();
    const checkout = await mountTossCheckout(
      fake.factory,
      checkoutFixture(),
      selectors,
      changed,
      new AbortController().signal,
    );
    expect(changed).toHaveBeenCalledWith(true);
    await checkout.requestPayment('http://localhost:3000');
    expect(fake.sdk.requestPayment).toHaveBeenCalledTimes(1);
    await checkout.destroy();
  });

  it('cleans up a widget that resolves after navigation aborts initialization', async () => {
    const fake = fakeSdk();
    let resolve: (value: typeof fake.methods) => void = () => {};
    fake.sdk.renderPaymentMethods.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const abort = new AbortController();
    const pending = mountTossCheckout(
      fake.factory,
      checkoutFixture(),
      selectors,
      vi.fn(),
      abort.signal,
    );
    await vi.waitFor(() =>
      expect(fake.sdk.renderPaymentMethods).toHaveBeenCalled(),
    );
    abort.abort();
    await expect(pending).rejects.toThrow();
    resolve(fake.methods);
    await vi.waitFor(() =>
      expect(fake.methods.destroy).toHaveBeenCalledTimes(1),
    );
    expect(fake.sdk.renderAgreement).not.toHaveBeenCalled();
  });
});

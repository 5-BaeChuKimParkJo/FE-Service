import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkoutFixture } from '@/test/checkout-fixture';

const { auth, get, post } = vi.hoisted(() => ({
  auth: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));
vi.mock('@/actions/auth', () => ({ auth }));
vi.mock('@/actions/instance', () => ({ instance: { get, post } }));

import {
  confirmCheckout,
  getCheckout,
  prepareCheckout,
  reconcileCheckout,
} from './checkout';

describe('authenticated checkout actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue({ user: { accessToken: 'private-server-cookie' } });
    get.mockResolvedValue(checkoutFixture());
    post.mockResolvedValue(checkoutFixture());
  });

  it('only reads on entry with no cache and never prepares during GET', async () => {
    expect(await getCheckout('auction-test-123')).toEqual({
      ok: true,
      view: checkoutFixture(),
    });
    expect(get).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/auction-test-123/checkout',
      { cache: 'no-store', timeout: 35000 },
    );
    expect(post).not.toHaveBeenCalled();
  });

  it('skips all backend calls when logged out and sanitizes forbidden failures', async () => {
    auth.mockResolvedValue(null);
    expect(await getCheckout('auction-test-123')).toMatchObject({
      ok: false,
      error: { code: 'AUTH_REQUIRED' },
    });
    expect(get).not.toHaveBeenCalled();
    auth.mockResolvedValue({ user: { accessToken: 'token' } });
    get.mockRejectedValue({
      code: 'HTTP_ERROR_403',
      message: 'private backend details',
    });
    expect(await getCheckout('auction-test-123')).toMatchObject({
      ok: false,
      error: { code: 'FORBIDDEN' },
    });
    expect(JSON.stringify(await getCheckout('auction-test-123'))).not.toContain(
      'private backend details',
    );
  });

  it('prepares explicitly with the exact route and empty body', async () => {
    await prepareCheckout('auction-test-123');
    expect(post).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/auction-test-123/checkout',
      {},
      { cache: 'no-store', timeout: 35000 },
    );
  });

  it('does not prepare pending, paid, canceled, disabled, ineligible or live-key views', async () => {
    for (const status of [
      'UNKNOWN',
      'CONFIRMING',
      'WAITING_FOR_DEPOSIT',
      'CANCELING',
      'DONE',
    ] as const) {
      const view = checkoutFixture();
      view.purchase!.attempt!.status = status;
      get.mockResolvedValue(view);
      await prepareCheckout('auction-test-123');
    }
    for (const status of ['PAID', 'CANCELED'] as const) {
      const view = checkoutFixture();
      view.purchase!.status = status;
      get.mockResolvedValue(view);
      await prepareCheckout('auction-test-123');
    }
    for (const changes of [
      { enabled: false },
      { eligible: false },
      { clientKey: 'live_gck_unsafe' },
      { clientKey: 'test_ck_legacy' },
    ]) {
      get.mockResolvedValue(checkoutFixture(changes));
      await prepareCheckout('auction-test-123');
    }
    expect(post).not.toHaveBeenCalled();
  });

  it('confirms only an exact fresh snapshot match and forwards decimal string money', async () => {
    const paid = checkoutFixture();
    paid.purchase!.status = 'PAID';
    paid.purchase!.attempt!.status = 'DONE';
    post.mockResolvedValue(paid);
    const result = await confirmCheckout('auction-test-123', {
      orderId: 'order_test_123',
      paymentKey: 'payment_test_123',
      amount: '15000',
    });
    expect(result).toEqual({ ok: true, view: paid });
    expect(post).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/auction-test-123/checkout/confirm',
      {
        orderId: 'order_test_123',
        paymentKey: 'payment_test_123',
        amount: '15000',
      },
      { cache: 'no-store', timeout: 35000 },
    );
  });

  it('never forwards tampered or duplicate redirect values', async () => {
    for (const changed of [
      { amount: '15001' },
      { orderId: 'order_other' },
      { amount: '1.5' },
      { paymentKey: ['one', 'two'] },
    ]) {
      expect(
        await confirmCheckout('auction-test-123', {
          orderId: 'order_test_123',
          paymentKey: 'payment_test_123',
          amount: '15000',
          ...changed,
        }),
      ).toMatchObject({ ok: false, error: { code: 'INVALID_RETURN' } });
    }
    expect(post).not.toHaveBeenCalled();
  });

  it('preserves an uncertain confirmation as a recoverable error, never success', async () => {
    post.mockRejectedValue({ code: 'TIMEOUT_ERROR' });
    expect(
      await confirmCheckout('auction-test-123', {
        orderId: 'order_test_123',
        paymentKey: 'payment_test_123',
        amount: '15000',
      }),
    ).toMatchObject({ ok: false, error: { code: 'REQUEST_FAILED' } });
    expect(post).toHaveBeenCalledTimes(1);
  });

  it('reconciles through the authenticated backend with an empty body', async () => {
    const pending = checkoutFixture();
    pending.purchase!.attempt!.status = 'UNKNOWN';
    get.mockResolvedValue(pending);
    await reconcileCheckout('auction-test-123');
    expect(post).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/auction-test-123/checkout/reconcile',
      {},
      { cache: 'no-store', timeout: 35000 },
    );
  });

  it('returns paid and canceled snapshots on success refresh without another confirmation', async () => {
    for (const status of ['PAID', 'CANCELED'] as const) {
      const view = checkoutFixture({ eligible: false, clientKey: null });
      view.purchase!.status = status;
      view.purchase!.attempt!.status = status === 'PAID' ? 'DONE' : 'CANCELED';
      get.mockResolvedValue(view);
      expect(
        await confirmCheckout('auction-test-123', {
          orderId: 'order_test_123',
          paymentKey: 'payment_test_123',
          amount: '15000',
        }),
      ).toEqual({ ok: true, view });
    }
    expect(post).not.toHaveBeenCalled();
  });

  it('rejects malformed or cross-auction backend responses', async () => {
    get.mockResolvedValue(checkoutFixture({ auctionUuid: 'other-auction' }));
    expect(await getCheckout('auction-test-123')).toMatchObject({ ok: false });
    get.mockResolvedValue({ enabled: true });
    expect(await getCheckout('auction-test-123')).toMatchObject({ ok: false });
  });
});

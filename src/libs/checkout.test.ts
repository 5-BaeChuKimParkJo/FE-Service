import { describe, expect, it } from 'vitest';
import { formatCheckoutTime } from './checkout';

it('formats KST payment timestamps without locale-dependent AM/PM text', () => {
  expect(formatCheckoutTime('2026-10-17T12:00:00Z')).toBe('2026.10.17. 21:00:00');
  expect(formatCheckoutTime('2026-10-17T15:00:00Z')).toBe('2026.10.18. 00:00:00');
  expect(formatCheckoutTime('invalid')).toBe('확인 필요');
});
import { checkoutFixture } from '@/test/checkout-fixture';
import {
  checkoutPhase,
  parseCheckoutReturn,
  sdkAmount,
  showCheckoutEntry,
  validCheckoutView,
} from './checkout';

describe('checkout snapshot safety', () => {
  it('converts only positive canonical safe integer decimal strings', () => {
    expect(sdkAmount('15000')).toBe(15000);
    expect(sdkAmount('9007199254740991')).toBe(Number.MAX_SAFE_INTEGER);
    for (const value of [
      '0',
      '-1',
      '01',
      '1.5',
      '1e3',
      ' 10',
      '10 ',
      '',
      '9007199254740992',
    ]) {
      expect(() => sdkAmount(value)).toThrow();
    }
  });

  it('accepts the exact nullable DTO and rejects invalid status and numeric money', () => {
    expect(validCheckoutView(checkoutFixture())).toBe(true);
    expect(validCheckoutView(checkoutFixture({ purchase: null }))).toBe(true);
    const view = checkoutFixture();
    expect(
      validCheckoutView({
        ...view,
        purchase: { ...view.purchase, amount: 15000 },
      }),
    ).toBe(false);
    expect(
      validCheckoutView({
        ...view,
        purchase: { ...view.purchase, status: 'DONE' },
      }),
    ).toBe(false);
    expect(
      validCheckoutView({
        ...view,
        purchase: { ...view.purchase, attempt: { status: 'READY' } },
      }),
    ).toBe(false);
    expect(validCheckoutView(null)).toBe(false);
  });

  it('treats every unresolved attempt as pending even if enabled becomes false', () => {
    for (const status of [
      'UNKNOWN',
      'CONFIRMING',
      'WAITING_FOR_DEPOSIT',
      'CANCELING',
      'DONE',
    ] as const) {
      const view = checkoutFixture();
      view.purchase!.attempt!.status = status;
      expect(checkoutPhase(view)).toBe('pending');
      view.enabled = false;
      expect(checkoutPhase(view)).toBe('pending');
    }
  });

  it('offers prepare only for reusable or terminal attempts, never canceled purchases', () => {
    expect(checkoutPhase(checkoutFixture({ purchase: null }))).toBe('prepare');
    expect(checkoutPhase(checkoutFixture())).toBe('ready');
    for (const status of ['ABORTED', 'EXPIRED', 'CANCELED'] as const) {
      const view = checkoutFixture();
      view.purchase!.attempt!.status = status;
      expect(checkoutPhase(view)).toBe('prepare');
    }
    const view = checkoutFixture();
    view.purchase!.status = 'CANCELED';
    expect(checkoutPhase(view)).toBe('canceled');
    view.purchase!.status = 'PAID';
    expect(checkoutPhase(view)).toBe('paid');
  });

  it('hides the entry outside an eligible, backend-enabled ended winner view', () => {
    expect(showCheckoutEntry('ended', checkoutFixture())).toBe(true);
    expect(showCheckoutEntry('active', checkoutFixture())).toBe(false);
    expect(showCheckoutEntry('ended', null)).toBe(false);
    expect(
      showCheckoutEntry(
        'ended',
        checkoutFixture({ eligible: false, purchase: null }),
      ),
    ).toBe(false);
    expect(
      showCheckoutEntry(
        'ended',
        checkoutFixture({ enabled: false, purchase: null }),
      ),
    ).toBe(false);
  });

  it('keeps owned history and pending purchases visible without eligibility or a client key', () => {
    for (const status of ['PAID', 'CANCELED', 'AWAITING_PAYMENT'] as const) {
      const view = checkoutFixture({
        eligible: false,
        clientKey: null,
        enabled: false,
      });
      view.purchase!.status = status;
      expect(showCheckoutEntry('ended', view)).toBe(true);
    }
  });

  it('shows cancellation uncertainty before paid while preserving completed receipts', () => {
    const view = checkoutFixture({ eligible: false, clientKey: null });
    view.purchase!.status = 'PAID';
    for (const status of ['CANCELING', 'UNKNOWN'] as const) {
      view.purchase!.attempt!.status = status;
      expect(checkoutPhase(view)).toBe('pending');
    }
    view.purchase!.attempt!.status = 'DONE';
    expect(checkoutPhase(view)).toBe('paid');
  });

  it('rejects missing, duplicate, malformed and unsafe redirect values', () => {
    const query = {
      orderId: 'order_test_123',
      paymentKey: 'payment_test_123',
      amount: '15000',
    };
    expect(parseCheckoutReturn(query)).toEqual(query);
    for (const changed of [
      { amount: '1e3' },
      { amount: '9007199254740992' },
      { orderId: ['order_test_123', 'other'] },
      { paymentKey: '' },
      { amount: undefined },
    ]) {
      expect(parseCheckoutReturn({ ...query, ...changed })).toBeNull();
    }
  });
});

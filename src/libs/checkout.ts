import type {
  CheckoutConfirmation,
  CheckoutReturnQuery,
  CheckoutView,
} from '@/types/auction/checkout';

export function formatCheckoutTime(value: string): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '확인 필요';
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date);
  const fields = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${fields.year}.${fields.month}.${fields.day}. ${fields.hour}:${fields.minute}:${fields.second}`;
}

export function sdkAmount(amount: string): number {
  if (!/^[1-9]\d*$/.test(amount)) throw new Error('Invalid payment amount');
  const value = Number(amount);
  if (!Number.isSafeInteger(value)) throw new Error('Unsafe payment amount');
  return value;
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string';
const nullableText = (value: unknown) => value === null || text(value);

export function validCheckoutView(value: unknown): value is CheckoutView {
  if (
    !record(value) ||
    typeof value.enabled !== 'boolean' ||
    typeof value.eligible !== 'boolean' ||
    !text(value.auctionUuid) ||
    !nullableText(value.reason) ||
    !nullableText(value.clientKey)
  )
    return false;
  const purchase = value.purchase;
  if (purchase === null) return true;
  if (
    !record(purchase) ||
    ![
      'purchaseUuid',
      'buyerUuid',
      'sellerUuid',
      'orderName',
      'customerKey',
    ].every((key) => text(purchase[key])) ||
    !text(purchase.amount) ||
    !/^[1-9]\d*$/.test(purchase.amount) ||
    !['AWAITING_PAYMENT', 'PAID', 'CANCELED'].includes(
      String(purchase.status),
    ) ||
    !nullableText(purchase.paidAt)
  )
    return false;
  const attempt = purchase.attempt;
  return (
    attempt === null ||
    (record(attempt) &&
      text(attempt.orderId) &&
      [
        'READY',
        'CONFIRMING',
        'UNKNOWN',
        'WAITING_FOR_DEPOSIT',
        'DONE',
        'CANCELING',
        'CANCELED',
        'ABORTED',
        'EXPIRED',
      ].includes(String(attempt.status)) &&
      ['method', 'approvedAt', 'cancelReason', 'errorCode'].every((key) =>
        nullableText(attempt[key]),
      ))
  );
}

export function testCheckoutEnabled(view: CheckoutView): boolean {
  return (
    view.enabled &&
    view.eligible &&
    typeof view.clientKey === 'string' &&
    /^test_gck_[A-Za-z0-9_-]+$/.test(view.clientKey)
  );
}

export function checkoutPhase(
  view: CheckoutView,
): 'paid' | 'canceled' | 'pending' | 'unavailable' | 'prepare' | 'ready' {
  if (view.purchase?.status === 'CANCELED') return 'canceled';
  const status = view.purchase?.attempt?.status;
  if (status === 'CANCELING' || status === 'UNKNOWN') return 'pending';
  if (view.purchase?.status === 'PAID') return 'paid';
  if (
    status &&
    [
      'CONFIRMING',
      'UNKNOWN',
      'WAITING_FOR_DEPOSIT',
      'CANCELING',
      'DONE',
    ].includes(status)
  )
    return 'pending';
  if (!testCheckoutEnabled(view)) return 'unavailable';
  return status === 'READY' ? 'ready' : 'prepare';
}

export function showCheckoutEntry(
  status: string,
  view: CheckoutView | null,
): boolean {
  return (
    status === 'ended' &&
    view !== null &&
    (view.purchase !== null || (view.enabled && view.eligible))
  );
}

export function parseCheckoutReturn(
  query: CheckoutReturnQuery,
): CheckoutConfirmation | null {
  const { orderId, paymentKey, amount } = query;
  if (
    typeof orderId !== 'string' ||
    !/^[A-Za-z0-9_=-]{6,64}$/.test(orderId) ||
    typeof paymentKey !== 'string' ||
    paymentKey.length === 0 ||
    paymentKey.length > 200 ||
    /\s/.test(paymentKey) ||
    typeof amount !== 'string'
  )
    return null;
  try {
    sdkAmount(amount);
    return { orderId, paymentKey, amount };
  } catch {
    return null;
  }
}

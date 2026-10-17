'use server';

import { auth } from '@/actions/auth';
import { instance } from '@/actions/instance';
import {
  checkoutPhase,
  parseCheckoutReturn,
  testCheckoutEnabled,
  validCheckoutView,
} from '@/libs/checkout';
import type {
  CheckoutResult,
  CheckoutReturnQuery,
} from '@/types/auction/checkout';

const options = { cache: 'no-store' as const, timeout: 35000 };
const checkoutPath = (id: string) =>
  `/auction-service/api/v1/auctions/${encodeURIComponent(id)}/checkout`;

function failure(
  code: Extract<CheckoutResult, { ok: false }>['error']['code'],
): CheckoutResult {
  const messages = {
    AUTH_REQUIRED: '로그인 후 결제 내역을 확인해 주세요.',
    FORBIDDEN: '낙찰자만 결제할 수 있습니다.',
    UNAVAILABLE: '현재 테스트 결제를 이용할 수 없습니다.',
    INVALID_RETURN:
      '결제 정보가 주문과 일치하지 않습니다. 결제 상태를 확인해 주세요.',
    REQUEST_FAILED:
      '결제 상태를 확인하지 못했습니다. 다시 결제하기 전에 상태를 확인해 주세요.',
  };
  return { ok: false, error: { code, message: messages[code] } };
}

function requestFailure(error: unknown): CheckoutResult {
  const code =
    error && typeof error === 'object' && 'code' in error ? error.code : null;
  if (code === 'HTTP_ERROR_401' || code === 'UNAUTHORIZED')
    return failure('AUTH_REQUIRED');
  if (code === 'HTTP_ERROR_403' || code === 'FORBIDDEN')
    return failure('FORBIDDEN');
  return failure('REQUEST_FAILED');
}

function checkedView(value: unknown, id: string): CheckoutResult {
  return validCheckoutView(value) && value.auctionUuid === id
    ? { ok: true, view: value }
    : failure('REQUEST_FAILED');
}

export async function getCheckout(id: string): Promise<CheckoutResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  try {
    return checkedView(
      await instance.get<unknown>(checkoutPath(id), options),
      id,
    );
  } catch (error) {
    return requestFailure(error);
  }
}

export async function prepareCheckout(id: string): Promise<CheckoutResult> {
  const current = await getCheckout(id);
  if (!current.ok) return current;
  const phase = checkoutPhase(current.view);
  if (['paid', 'canceled', 'pending'].includes(phase)) return current;
  if (!testCheckoutEnabled(current.view)) return failure('UNAVAILABLE');
  try {
    return checkedView(
      await instance.post<unknown>(checkoutPath(id), {}, options),
      id,
    );
  } catch (error) {
    return requestFailure(error);
  }
}

export async function confirmCheckout(
  id: string,
  query: CheckoutReturnQuery,
): Promise<CheckoutResult> {
  const confirmation = parseCheckoutReturn(query);
  if (!confirmation) return failure('INVALID_RETURN');
  const current = await getCheckout(id);
  if (!current.ok) return current;
  const { view } = current;
  // Redirect parameters are untrusted; the backend must also verify provider key and currency.
  if (
    view.purchase?.attempt?.orderId !== confirmation.orderId ||
    view.purchase.amount !== confirmation.amount
  )
    return failure('INVALID_RETURN');
  if (view.purchase.status === 'PAID' || view.purchase.status === 'CANCELED')
    return current;
  if (!testCheckoutEnabled(view)) return failure('UNAVAILABLE');
  try {
    return checkedView(
      await instance.post<unknown>(
        `${checkoutPath(id)}/confirm`,
        confirmation,
        options,
      ),
      id,
    );
  } catch (error) {
    return requestFailure(error);
  }
}

export async function reconcileCheckout(id: string): Promise<CheckoutResult> {
  const current = await getCheckout(id);
  if (!current.ok) return current;
  if (!current.view.enabled) return failure('UNAVAILABLE');
  try {
    return checkedView(
      await instance.post<unknown>(
        `${checkoutPath(id)}/reconcile`,
        {},
        options,
      ),
      id,
    );
  } catch (error) {
    return requestFailure(error);
  }
}

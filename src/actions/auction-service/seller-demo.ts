'use server';
import { auth } from '@/actions/auth';
import { instance } from '@/actions/instance';
import { validSellerUuid } from '@/libs/sellerManagement';
import type {
  SellerDemoAvailability,
  SellerDemoResult,
  SellerDemoFailure,
} from '@/types/auction/seller-demo';
const root = '/auction-service/api/v1/auctions/seller-demo';
function failure(code: SellerDemoFailure['error']['code']): SellerDemoFailure {
  const messages = {
    AUTH_REQUIRED: '로그인 후 판매자 데모를 준비해 주세요.',
    UNAVAILABLE:
      '현재 데모를 준비할 수 없습니다. 기존 내 경매를 확인해 주세요.',
    COOLDOWN:
      '새 데모는 1분 뒤 준비할 수 있습니다. 기존 내 경매를 확인해 주세요.',
    REQUEST_FAILED:
      '처리 결과를 확인하지 못했습니다. 내 경매를 확인한 뒤 다시 준비해 주세요.',
  };
  return { ok: false, error: { code, message: messages[code] } };
}
function requestFailure(error: unknown): SellerDemoFailure {
  const code =
    error && typeof error === 'object' && 'code' in error ? error.code : null;
  return failure(
    code === 'HTTP_ERROR_401' || code === 'UNAUTHORIZED'
      ? 'AUTH_REQUIRED'
      : code === 'HTTP_ERROR_403' ||
          code === 'HTTP_ERROR_404' ||
          code === 'HTTP_ERROR_503'
        ? 'UNAVAILABLE'
        : code === 'SELLER_DEMO_COOLDOWN' || code === 'HTTP_ERROR_429'
          ? 'COOLDOWN'
          : 'REQUEST_FAILED',
  );
}
export async function getSellerDemoAvailability(): Promise<SellerDemoAvailability> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  try {
    const result = await instance.get<unknown>(root, { cache: 'no-store' });
    return result &&
      typeof result === 'object' &&
      'available' in result &&
      typeof result.available === 'boolean'
      ? { ok: true, available: result.available }
      : failure('REQUEST_FAILED');
  } catch (error) {
    return requestFailure(error);
  }
}
export async function prepareSellerDemo(): Promise<SellerDemoResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  try {
    const result = await instance.post<unknown>(
      root,
      {},
      { cache: 'no-store', timeout: 15000 },
    );
    return result &&
      typeof result === 'object' &&
      'auctionUuid' in result &&
      validSellerUuid(result.auctionUuid) &&
      'status' in result &&
      (result.status === 'created' || result.status === 'reused')
      ? { ok: true, auctionUuid: result.auctionUuid, status: result.status }
      : failure('REQUEST_FAILED');
  } catch (error) {
    return requestFailure(error);
  }
}

'use server';
import { auth } from '@/actions/auth';
import { instance } from '@/actions/instance';
import {
  parseSellerAuction,
  parseSellerUpdateInput,
  parseSellerCancellation,
  validSellerUuid,
} from '@/libs/sellerManagement';
import type {
  SellerAuctionResult,
  SellerManagementFailure,
  SellerMutationResult,
} from '@/types/auction/seller-management';
const options = { cache: 'no-store' as const };
const path = (id: string) =>
  '/auction-service/api/v1/auctions/' + encodeURIComponent(id) + '/seller';
function failure(
  code: SellerManagementFailure['error']['code'],
): SellerManagementFailure {
  const messages = {
    AUTH_REQUIRED: '로그인 후 경매를 관리해 주세요.',
    UNAVAILABLE: '관리할 수 있는 경매를 찾지 못했습니다.',
    CONFLICT:
      '경매가 변경되었거나 시작되었습니다. 새로고침 후 다시 확인해 주세요.',
    INVALID_REQUEST:
      '입력 내용을 확인해 주세요. 제목은 5~100자, 시작가는 1,000~2,147,483,647원, 일정은 정각부터 1시간 이상이어야 합니다.',
    REQUEST_FAILED:
      '처리 결과를 확인하지 못했습니다. 다시 요청하기 전에 새로고침해 확인해 주세요.',
  };
  return { ok: false, error: { code, message: messages[code] } };
}
function requestFailure(error: unknown): SellerManagementFailure {
  const code =
    error && typeof error === 'object' && 'code' in error ? error.code : null;
  return failure(
    code === 'HTTP_ERROR_401' || code === 'UNAUTHORIZED'
      ? 'AUTH_REQUIRED'
      : code === 'HTTP_ERROR_404'
        ? 'UNAVAILABLE'
        : code === 'HTTP_ERROR_409'
          ? 'CONFLICT'
          : 'REQUEST_FAILED',
  );
}
export async function getSellerAuction(
  id: unknown,
): Promise<SellerAuctionResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  if (!validSellerUuid(id)) return failure('INVALID_REQUEST');
  try {
    const data = parseSellerAuction(
      await instance.get<unknown>(path(id), options),
      id,
    );
    return data ? { ok: true, data } : failure('REQUEST_FAILED');
  } catch (error) {
    return requestFailure(error);
  }
}
async function change(
  id: unknown,
  input: unknown,
  action: 'update' | 'cancel',
): Promise<SellerMutationResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  if (!validSellerUuid(id)) return failure('INVALID_REQUEST');
  const data =
    action === 'update'
      ? parseSellerUpdateInput(input)
      : parseSellerCancellation(input);
  if (!data) return failure('INVALID_REQUEST');
  try {
    const result =
      action === 'update'
        ? await instance.patch<unknown>(path(id), data, options)
        : await instance.post<unknown>(path(id) + '/cancel', data, options);
    return result &&
      typeof result === 'object' &&
      'ok' in result &&
      result.ok === true
      ? { ok: true }
      : failure('REQUEST_FAILED');
  } catch (error) {
    return requestFailure(error);
  }
}
export async function updateSellerAuction(
  id: unknown,
  input: unknown,
): Promise<SellerMutationResult> {
  return change(id, input, 'update');
}
export async function cancelSellerAuction(
  id: unknown,
  input: unknown,
): Promise<SellerMutationResult> {
  return change(id, input, 'cancel');
}

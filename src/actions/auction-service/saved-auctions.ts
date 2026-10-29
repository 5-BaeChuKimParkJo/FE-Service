'use server';

import { auth } from '@/actions/auth';
import { instance } from '@/actions/instance';
import {
  parseSavedAuctionPage,
  validSavedCursor,
  validSavedUuid,
} from '@/libs/savedAuctions';
import type {
  SavedAuctionFailure,
  SavedAuctionStateResult,
  SavedAuctionPageResult,
} from '@/types/auction/saved-auctions';

const options = { cache: 'no-store' as const };
const path = (id: string) =>
  `/auction-service/api/v1/auctions/${encodeURIComponent(id)}/saved`;
function failure(
  code: SavedAuctionFailure['error']['code'],
): SavedAuctionFailure {
  const messages = {
    AUTH_REQUIRED: '로그인 후 관심 경매를 확인해 주세요.',
    UNAVAILABLE: '현재 이용할 수 없는 경매입니다.',
    REQUEST_FAILED:
      '처리 결과를 확인하지 못했습니다. 잠시 후 같은 요청을 다시 시도해 주세요.',
    INVALID_REQUEST: '관심 경매 요청이 올바르지 않습니다.',
  };
  return { ok: false, error: { code, message: messages[code] } };
}
function requestFailure(error: unknown): SavedAuctionFailure {
  const code =
    error && typeof error === 'object' && 'code' in error ? error.code : null;
  return failure(
    code === 'HTTP_ERROR_401' || code === 'UNAUTHORIZED'
      ? 'AUTH_REQUIRED'
      : code === 'HTTP_ERROR_404'
        ? 'UNAVAILABLE'
        : 'REQUEST_FAILED',
  );
}
function checkedState(
  value: unknown,
  expected?: boolean,
): SavedAuctionStateResult {
  return value &&
    typeof value === 'object' &&
    'saved' in value &&
    typeof value.saved === 'boolean' &&
    (expected === undefined || value.saved === expected)
    ? { ok: true, saved: value.saved }
    : failure('REQUEST_FAILED');
}

export async function getSavedAuctions(
  cursor: unknown = undefined,
): Promise<SavedAuctionPageResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  if (cursor !== undefined && !validSavedCursor(cursor))
    return failure('INVALID_REQUEST');
  try {
    const page = parseSavedAuctionPage(
      await instance.get<unknown>(
        '/auction-service/api/v1/auctions/saved' +
          (cursor === undefined
            ? ''
            : '?cursor=' + encodeURIComponent(String(cursor))),
        options,
      ),
    );
    return page ? { ok: true, page } : failure('REQUEST_FAILED');
  } catch (error) {
    return requestFailure(error);
  }
}
export async function getSavedAuctionState(
  id: string,
): Promise<SavedAuctionStateResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  if (!validSavedUuid(id)) return failure('INVALID_REQUEST');
  try {
    return checkedState(await instance.get<unknown>(path(id), options));
  } catch (error) {
    return requestFailure(error);
  }
}
export async function saveAuction(
  id: string,
): Promise<SavedAuctionStateResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  if (!validSavedUuid(id)) return failure('INVALID_REQUEST');
  try {
    return checkedState(
      await instance.put<unknown>(path(id), {}, options),
      true,
    );
  } catch (error) {
    return requestFailure(error);
  }
}
export async function removeSavedAuction(
  id: string,
): Promise<SavedAuctionStateResult> {
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  if (!validSavedUuid(id)) return failure('INVALID_REQUEST');
  try {
    return checkedState(
      await instance.delete<unknown>(path(id), { ...options, body: '{}' }),
      false,
    );
  } catch (error) {
    return requestFailure(error);
  }
}

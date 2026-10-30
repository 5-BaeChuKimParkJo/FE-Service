'use server';

import { instance } from '@/actions/instance';
import { auth } from '@/actions/auth';
import {
  mySalesUrl,
  parseMySalesPage,
  parseMySalesQuery,
} from '@/libs/mySales';
import type { MySalesResult } from '@/types/auction/my-sales';

export async function getMyAuctions(
  input: unknown = {},
): Promise<MySalesResult> {
  const failure = (
    code: 'AUTH_REQUIRED' | 'INVALID_REQUEST' | 'REQUEST_FAILED',
  ): MySalesResult => ({
    ok: false,
    error: {
      code,
      message: {
        AUTH_REQUIRED: '로그인 후 내 경매를 확인해 주세요.',
        INVALID_REQUEST:
          '검색 조건이 올바르지 않습니다. 조건을 다시 선택해 주세요.',
        REQUEST_FAILED:
          '내 경매를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      }[code],
    },
  });
  if (!(await auth())?.user?.accessToken) return failure('AUTH_REQUIRED');
  const query = parseMySalesQuery(input);
  if (!query) return failure('INVALID_REQUEST');
  try {
    const suffix = mySalesUrl(query, query.page).slice('/mypage/sales'.length);
    const data = parseMySalesPage(
      await instance.get<unknown>(
        '/auction-service/api/v1/auctions/mine' + suffix,
        { cache: 'no-store' },
      ),
      query,
    );
    return data ? { ok: true, data } : failure('REQUEST_FAILED');
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error ? error.code : null;
    return failure(
      code === 'HTTP_ERROR_401' || code === 'UNAUTHORIZED'
        ? 'AUTH_REQUIRED'
        : 'REQUEST_FAILED',
    );
  }
}

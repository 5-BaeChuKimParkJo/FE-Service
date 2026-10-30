import type {
  MySale,
  MySalesData,
  MySalesQuery,
  MySaleStatus,
} from '@/types/auction/my-sales';

export const defaultMySalesQuery: MySalesQuery = {
  q: '',
  status: 'all',
  sort: 'recent',
  page: 1,
};
export const mySalesStatuses: Record<MySaleStatus, string> = {
  waiting: '대기',
  active: '진행',
  ended: '종료',
  hidden: '숨김',
  cancelled: '취소',
};
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const count = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const money = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^(0|[1-9]\d{0,18})$/.test(value) &&
  BigInt(value) <= BigInt('9223372036854775807');
const date = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));

export function parseMySalesQuery(input: unknown): MySalesQuery | null {
  if (
    !record(input) ||
    Object.keys(input).some(
      (key) => !['q', 'status', 'sort', 'page'].includes(key),
    )
  )
    return null;
  if (
    Object.values(input).some(
      (value) => value !== undefined && typeof value !== 'string',
    )
  )
    return null;
  const q = typeof input.q === 'string' ? input.q.trim() : '';
  const status = input.status ?? 'all';
  const sort = input.sort ?? 'recent';
  const page = input.page ?? '1';
  if (
    q.length > 80 ||
    !['all', ...Object.keys(mySalesStatuses)].includes(String(status)) ||
    !['recent', 'ending', 'price'].includes(String(sort)) ||
    typeof page !== 'string' ||
    !/^[1-9]\d{0,4}$/.test(page) ||
    Number(page) > 10000
  )
    return null;
  return {
    q,
    status: status as MySalesQuery['status'],
    sort: sort as MySalesQuery['sort'],
    page: Number(page),
  };
}

export function mySalesUrl(query: MySalesQuery, page = 1): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.status !== 'all') params.set('status', query.status);
  if (query.sort !== 'recent') params.set('sort', query.sort);
  if (page !== 1) params.set('page', String(page));
  return '/mypage/sales' + (params.size ? '?' + params.toString() : '');
}

export function parseMySalesPage(
  value: unknown,
  query: MySalesQuery,
): MySalesData | null {
  if (
    !record(value) ||
    !record(value.summary) ||
    !Array.isArray(value.items) ||
    value.items.length > 20 ||
    !count(value.total) ||
    value.page !== query.page ||
    value.pageSize !== 20
  )
    return null;
  const keys = [
    'total',
    'waiting',
    'active',
    'ended',
    'hidden',
    'cancelled',
  ] as const;
  if (
    !keys.every((key) => count((value.summary as Record<string, unknown>)[key]))
  )
    return null;
  const summary = Object.fromEntries(
    keys.map((key) => [key, (value.summary as Record<string, number>)[key]]),
  ) as MySalesData['summary'];
  if (
    summary.total !==
      summary.waiting +
        summary.active +
        summary.ended +
        summary.hidden +
        summary.cancelled ||
    value.total > summary.total
  )
    return null;
  const items: MySale[] = [];
  for (const item of value.items) {
    if (
      !record(item) ||
      typeof item.auctionUuid !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        item.auctionUuid,
      ) ||
      typeof item.title !== 'string' ||
      typeof item.thumbnailUrl !== 'string' ||
      !money(item.minimumBid) ||
      !money(item.currentBid) ||
      !count(item.bidCount) ||
      !date(item.startAt) ||
      !date(item.endAt) ||
      !date(item.createdAt) ||
      !Object.hasOwn(mySalesStatuses, String(item.status))
    )
      return null;
    items.push({
      auctionUuid: item.auctionUuid,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl,
      minimumBid: item.minimumBid,
      currentBid: item.currentBid,
      bidCount: item.bidCount,
      startAt: item.startAt,
      endAt: item.endAt,
      createdAt: item.createdAt,
      status: item.status as MySaleStatus,
    });
  }
  if (
    new Set(items.map((item) => item.auctionUuid)).size !== items.length ||
    items.length !==
      Math.min(20, Math.max(0, value.total - (query.page - 1) * 20))
  )
    return null;
  return { items, summary, total: value.total, page: query.page, pageSize: 20 };
}

export const formatMySalesAmount = (value: string) =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

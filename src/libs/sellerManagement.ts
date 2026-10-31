import type {
  SellerAuctionData,
  SellerAuctionSnapshot,
  SellerUpdateInput,
  SellerCancellation,
} from '@/types/auction/seller-management';
export const sellerCancellationReasons = {
  listing_error: '등록 정보 오류',
  item_unavailable: '상품 판매 불가',
  schedule_change: '경매 일정 변경',
  personal_reason: '개인 사정',
  other: '기타',
} as const;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const version = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= 2147483647;
const iso = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(value) &&
  Number.isFinite(Date.parse(value));
const wholeHour = (value: unknown): value is string =>
  iso(value) &&
  new Date(value).getUTCMinutes() === 0 &&
  new Date(value).getUTCSeconds() === 0 &&
  new Date(value).getUTCMilliseconds() === 0;
const money = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^(0|[1-9]\d{0,18})$/.test(value) &&
  BigInt(value) <= BigInt('9223372036854775807');
export const validSellerUuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
export function toKstHourInput(value: string): string {
  return new Date(new Date(value).getTime() + 9 * 3600000)
    .toISOString()
    .slice(0, 16);
}
export function fromKstHourInput(value: string): string | null {
  if (!/^\d{4}-\d\d-\d\dT\d\d:00$/.test(value)) return null;
  const parsed = new Date(value + ':00+09:00');
  return Number.isFinite(parsed.getTime()) &&
    toKstHourInput(parsed.toISOString()) === value
    ? parsed.toISOString()
    : null;
}
export function parseSellerUpdateInput(
  value: unknown,
): SellerUpdateInput | null {
  if (
    !record(value) ||
    Object.keys(value).some(
      (key) =>
        ![
          'version',
          'title',
          'description',
          'minimumBid',
          'startAt',
          'endAt',
        ].includes(key),
    ) ||
    !version(value.version) ||
    typeof value.title !== 'string' ||
    value.title.trim().length < 5 ||
    value.title.trim().length > 100 ||
    typeof value.description !== 'string' ||
    value.description.length > 1000 ||
    typeof value.minimumBid !== 'string' ||
    !/^[1-9]\d{3,15}$/.test(value.minimumBid) ||
    BigInt(value.minimumBid) > BigInt('9007199254740991') ||
    !wholeHour(value.startAt) ||
    !wholeHour(value.endAt) ||
    Date.parse(value.endAt) - Date.parse(value.startAt) < 3600000
  )
    return null;
  return {
    version: value.version,
    title: value.title.trim(),
    description: value.description,
    minimumBid: value.minimumBid,
    startAt: value.startAt,
    endAt: value.endAt,
  };
}
export function parseSellerCancellation(
  value: unknown,
): SellerCancellation | null {
  if (
    !record(value) ||
    Object.keys(value).some(
      (key) => !['version', 'reasonCode', 'reasonDetail'].includes(key),
    ) ||
    !version(value.version) ||
    typeof value.reasonCode !== 'string' ||
    !Object.hasOwn(sellerCancellationReasons, value.reasonCode)
  )
    return null;
  if (value.reasonCode === 'other') {
    if (
      typeof value.reasonDetail !== 'string' ||
      !value.reasonDetail.trim() ||
      value.reasonDetail.trim().length > 200
    )
      return null;
    return {
      version: value.version,
      reasonCode: value.reasonCode,
      reasonDetail: value.reasonDetail.trim(),
    };
  }
  return value.reasonDetail === undefined
    ? { version: value.version, reasonCode: value.reasonCode }
    : null;
}
function snapshot(value: unknown): SellerAuctionSnapshot | null {
  if (
    !record(value) ||
    typeof value.title !== 'string' ||
    value.title.length > 100 ||
    typeof value.description !== 'string' ||
    value.description.length > 1000 ||
    !money(value.minimumBid) ||
    !iso(value.startAt) ||
    !iso(value.endAt) ||
    typeof value.status !== 'string' ||
    !['visible', 'waiting', 'active', 'ended', 'hidden', 'cancelled'].includes(
      value.status,
    )
  )
    return null;
  return {
    title: value.title,
    description: value.description,
    minimumBid: value.minimumBid,
    startAt: value.startAt,
    endAt: value.endAt,
    status: value.status,
  };
}
export function parseSellerAuction(
  value: unknown,
  expected: string,
): SellerAuctionData | null {
  if (
    !record(value) ||
    !validSellerUuid(value.auctionUuid) ||
    value.auctionUuid !== expected ||
    !version(value.version) ||
    typeof value.editable !== 'boolean' ||
    !['waiting', 'active', 'ended', 'hidden', 'cancelled'].includes(
      String(value.status),
    ) ||
    (value.editable && value.status !== 'waiting') ||
    !Array.isArray(value.history) ||
    value.history.length > 20
  )
    return null;
  const base = snapshot(value);
  if (!base) return null;
  const history: SellerAuctionData['history'] = [];
  for (const row of value.history) {
    if (
      !record(row) ||
      (row.action !== 'update' && row.action !== 'cancel') ||
      !iso(row.createdAt)
    )
      return null;
    const before = snapshot(row.before),
      after = snapshot(row.after);
    if (!before || !after) return null;
    if (
      row.action === 'update' &&
      (row.reasonCode !== null || row.reasonDetail !== null)
    )
      return null;
    if (
      row.action === 'cancel' &&
      !parseSellerCancellation({
        version: 0,
        reasonCode: row.reasonCode,
        ...(row.reasonDetail === null
          ? {}
          : { reasonDetail: row.reasonDetail }),
      })
    )
      return null;
    history.push({
      action: row.action,
      reasonCode: row.reasonCode as string | null,
      reasonDetail: row.reasonDetail as string | null,
      before,
      after,
      createdAt: row.createdAt,
    });
  }
  return {
    ...base,
    auctionUuid: value.auctionUuid,
    version: value.version,
    editable: value.editable,
    history,
  };
}

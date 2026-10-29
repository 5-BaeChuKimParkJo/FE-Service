import type {
  SavedAuction,
  SavedAuctionPage,
} from '@/types/auction/saved-auctions';

const MAX_SIGNED_BIGINT = BigInt('9223372036854775807');

export const validSavedUuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
export const validSavedCursor = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[1-9]\d{0,18}$/.test(value) &&
  BigInt(value) <= MAX_SIGNED_BIGINT;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const money = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^(0|[1-9]\d{0,18})$/.test(value) &&
  BigInt(value) <= MAX_SIGNED_BIGINT;
const date = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));

function isSavedAuction(value: unknown): value is SavedAuction {
  return (
    record(value) &&
    validSavedUuid(value.auctionUuid) &&
    typeof value.title === 'string' &&
    typeof value.thumbnailUrl === 'string' &&
    money(value.minimumBid) &&
    money(value.currentBid) &&
    date(value.startAt) &&
    date(value.endAt) &&
    date(value.savedAt) &&
    ['waiting', 'active', 'ended'].includes(String(value.status))
  );
}

export function parseSavedAuctionPage(value: unknown): SavedAuctionPage | null {
  if (
    !record(value) ||
    !Array.isArray(value.items) ||
    value.items.length > 20 ||
    !value.items.every(isSavedAuction) ||
    !(value.nextCursor === null || validSavedCursor(value.nextCursor))
  )
    return null;
  return {
    items: value.items.map((item) => ({
      auctionUuid: item.auctionUuid,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl,
      minimumBid: item.minimumBid,
      currentBid: item.currentBid,
      startAt: item.startAt,
      endAt: item.endAt,
      savedAt: item.savedAt,
      status: item.status,
    })),
    nextCursor: value.nextCursor,
  };
}

export function formatSavedAmount(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

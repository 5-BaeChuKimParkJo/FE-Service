import { beforeEach, describe, expect, it, vi } from 'vitest';
const { auth, get, put, remove } = vi.hoisted(() => ({
  auth: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  remove: vi.fn(),
}));
vi.mock('@/actions/auth', () => ({ auth }));
vi.mock('@/actions/instance', () => ({
  instance: { get, put, delete: remove },
}));
import {
  getSavedAuctions,
  getSavedAuctionState,
  saveAuction,
  removeSavedAuction,
} from './saved-auctions';
import {
  formatSavedAmount,
  parseSavedAuctionPage,
  validSavedCursor,
} from '@/libs/savedAuctions';

const id = '10000000-0000-4000-8000-000000000001';
const item = {
  auctionUuid: id,
  title: 'Saved fixture',
  thumbnailUrl: '/fixture.png',
  minimumBid: '9007199254740993',
  currentBid: '9007199254740995',
  status: 'active',
  startAt: '2020-01-01T00:00:00Z',
  endAt: '2099-01-01T00:00:00Z',
  savedAt: '2026-10-29T00:00:00Z',
};

describe('private saved auction actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue({
      user: { accessToken: 'server-only-fixture-token' },
    });
    put.mockResolvedValue({ saved: true });
    remove.mockResolvedValue({ saved: false });
  });
  it('does not contact private endpoints without authentication', async () => {
    auth.mockResolvedValue(null);
    for (const run of [
      () => getSavedAuctions(),
      () => getSavedAuctionState(id),
      () => saveAuction(id),
      () => removeSavedAuction(id),
    ])
      expect(await run()).toMatchObject({
        ok: false,
        error: { code: 'AUTH_REQUIRED' },
      });
    expect(get).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
  it('reads pages with no-store and forwards a cursor without numeric coercion', async () => {
    get.mockResolvedValue({ items: [item], nextCursor: null });
    expect(await getSavedAuctions('9007199254740995')).toMatchObject({
      ok: true,
      page: { items: [item], nextCursor: null },
    });
    expect(get).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/saved?cursor=9007199254740995',
      { cache: 'no-store' },
    );
    expect(put).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
  it('sends no owner field and uses idempotent methods for save and remove', async () => {
    expect(await saveAuction(id)).toEqual({ ok: true, saved: true });
    expect(put).toHaveBeenCalledWith(
      `/auction-service/api/v1/auctions/${id}/saved`,
      {},
      { cache: 'no-store' },
    );
    expect(await removeSavedAuction(id)).toEqual({ ok: true, saved: false });
    expect(remove).toHaveBeenCalledWith(
      `/auction-service/api/v1/auctions/${id}/saved`,
      { cache: 'no-store', body: '{}' },
    );
  });
  it('does not guess saved state after a malformed or mismatching response', async () => {
    get.mockResolvedValue({ saved: 'true' });
    expect(await getSavedAuctionState(id)).toMatchObject({
      ok: false,
      error: { code: 'REQUEST_FAILED' },
    });
    put.mockResolvedValue({ saved: false });
    expect(await saveAuction(id)).toMatchObject({
      ok: false,
      error: { code: 'REQUEST_FAILED' },
    });
    remove.mockResolvedValue({ saved: true });
    expect(await removeSavedAuction(id)).toMatchObject({
      ok: false,
      error: { code: 'REQUEST_FAILED' },
    });
  });
  it('sanitizes server faults and expiry/unavailable responses', async () => {
    for (const [code, want] of [
      ['HTTP_ERROR_401', 'AUTH_REQUIRED'],
      ['HTTP_ERROR_404', 'UNAVAILABLE'],
      ['OTHER', 'REQUEST_FAILED'],
    ]) {
      get.mockRejectedValue({ code, message: 'private endpoint credential' });
      const result = await getSavedAuctionState(id);
      expect(result).toMatchObject({ ok: false, error: { code: want } });
      expect(JSON.stringify(result)).not.toContain('private endpoint');
    }
  });
  it.each(['0', '-1', '1.2', '9223372036854775808', ['1', '2']])(
    'rejects malformed/overflowing cursor %j before requesting',
    async (cursor) => {
      expect(await getSavedAuctions(cursor)).toMatchObject({
        ok: false,
        error: { code: 'INVALID_REQUEST' },
      });
      expect(get).not.toHaveBeenCalled();
    },
  );
  it('rejects invalid UUIDs and preserves only public display fields', async () => {
    expect(await saveAuction('../checkout')).toMatchObject({
      ok: false,
      error: { code: 'INVALID_REQUEST' },
    });
    expect(put).not.toHaveBeenCalled();
    const page = parseSavedAuctionPage({
      items: [{ ...item, memberUuid: 'private-owner', secret: 'private' }],
      nextCursor: null,
    });
    expect(page?.items[0]).toEqual(item);
    expect(page?.items[0]).not.toHaveProperty('memberUuid');
  });
  it('rejects invalid page values without turning failure into an empty list', () => {
    for (const page of [
      { items: [{ ...item, currentBid: 123 }], nextCursor: null },
      { items: [{ ...item, savedAt: 'bad' }], nextCursor: null },
      { items: [], nextCursor: '0' },
      null,
    ])
      expect(parseSavedAuctionPage(page)).toBeNull();
    expect(parseSavedAuctionPage({ items: [], nextCursor: null })).toEqual({
      items: [],
      nextCursor: null,
    });
  });
  it('preserves bigint money and validates both signed-bigint cursor boundaries', () => {
    expect(formatSavedAmount('9007199254740995')).toBe('9,007,199,254,740,995');
    expect(validSavedCursor('9223372036854775807')).toBe(true);
    expect(validSavedCursor('9223372036854775808')).toBe(false);
  });
});

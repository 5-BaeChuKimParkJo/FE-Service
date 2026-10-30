import { beforeEach, describe, expect, it, vi } from 'vitest';
const { auth, get } = vi.hoisted(() => ({ auth: vi.fn(), get: vi.fn() }));
vi.mock('@/actions/auth', () => ({ auth }));
vi.mock('@/actions/instance', () => ({ instance: { get } }));
import { getMyAuctions } from './get-my-auctions';
import {
  mySalesUrl,
  parseMySalesQuery,
  parseMySalesPage,
} from '@/libs/mySales';

const query = { q: '', status: 'all', sort: 'recent', page: 1 } as const;
const item = {
  auctionUuid: '10000000-0000-4000-8000-000000000001',
  title: 'Camera',
  thumbnailUrl: '/fixture.png',
  minimumBid: '9007199254740993',
  currentBid: '9007199254740995',
  bidCount: 2,
  startAt: '2020-01-01T00:00:00Z',
  endAt: '2099-01-01T00:00:00Z',
  createdAt: '2026-10-30T00:00:00Z',
  status: 'active',
};
const page = () => ({
  items: [item],
  summary: {
    total: 1,
    waiting: 0,
    active: 1,
    ended: 0,
    hidden: 0,
    cancelled: 0,
  },
  total: 1,
  page: 1,
  pageSize: 20,
});

describe('seller auctions query boundary', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue({ user: { accessToken: 'server-fixture-token' } });
    get.mockResolvedValue(page());
  });
  it('queries the active service with no-store and no cookie-supplied identity', async () => {
    expect(await getMyAuctions()).toMatchObject({ ok: true, data: page() });
    expect(get).toHaveBeenCalledWith('/auction-service/api/v1/auctions/mine', {
      cache: 'no-store',
    });
  });
  it('skips persistence for anonymous sessions and invalid/array/owner query fields', async () => {
    auth.mockResolvedValue(null);
    expect(await getMyAuctions()).toMatchObject({
      ok: false,
      error: { code: 'AUTH_REQUIRED' },
    });
    expect(get).not.toHaveBeenCalled();
    auth.mockResolvedValue({ user: { accessToken: 'server-fixture-token' } });
    for (const value of [
      { page: '0' },
      { page: '10001' },
      { page: '1.1' },
      { page: ['1', '2'] },
      { status: 'sold' },
      { sort: 'invalid' },
      { q: 'a'.repeat(81) },
      { memberUuid: 'other' },
    ])
      expect(await getMyAuctions(value)).toMatchObject({
        ok: false,
        error: { code: 'INVALID_REQUEST' },
      });
    expect(get).not.toHaveBeenCalled();
  });
  it('preserves literal search and filters in encoded page links, resetting page on filtering', async () => {
    expect(
      parseMySalesQuery({
        q: " Camera %_' ",
        status: 'hidden',
        sort: 'price',
        page: '2',
      }),
    ).toEqual({ q: "Camera %_'", status: 'hidden', sort: 'price', page: 2 });
    const url = new URL(
      mySalesUrl(
        { ...query, q: " Camera %_'", status: 'hidden', sort: 'price' },
        2,
      ),
      'http://fixture',
    );
    expect(url.searchParams.get('q')).toBe(" Camera %_'");
    expect(url.searchParams.get('status')).toBe('hidden');
    expect(url.searchParams.get('sort')).toBe('price');
    expect(url.searchParams.get('page')).toBe('2');
    expect(mySalesUrl(query)).toBe('/mypage/sales');
  });
  it('forwards validated search/filter/page and checks the response page', async () => {
    get.mockResolvedValue({ ...page(), items: [], total: 1, page: 2 });
    expect(
      await getMyAuctions({
        q: " %_' ",
        status: 'active',
        sort: 'ending',
        page: '2',
      }),
    ).toMatchObject({ ok: true });
    const [path, options] = get.mock.calls[0];
    const url = new URL(path, 'http://fixture');
    expect(url.pathname).toBe('/auction-service/api/v1/auctions/mine');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      q: "%_'",
      status: 'active',
      sort: 'ending',
      page: '2',
    });
    expect(options.cache).toBe('no-store');
    get.mockResolvedValue(page());
    expect(await getMyAuctions({ page: '2' })).toMatchObject({
      ok: false,
      error: { code: 'REQUEST_FAILED' },
    });
  });
  it('projects exact display values and omits private upstream fields', async () => {
    get.mockResolvedValue({
      ...page(),
      sellerUuid: 'private-owner',
      paymentKey: 'private-key',
      items: [
        {
          ...item,
          bidderUuid: 'private-bidder',
          description: 'private-description',
        },
      ],
    });
    const result = await getMyAuctions();
    expect(result).toEqual({ ok: true, data: page() });
    expect(JSON.stringify(result)).not.toContain('private-');
  });
  it.each([
    { code: 'HTTP_ERROR_401', expected: 'AUTH_REQUIRED' },
    { code: 'UNAUTHORIZED', expected: 'AUTH_REQUIRED' },
    { code: 'DATABASE_ERROR', expected: 'REQUEST_FAILED' },
  ])(
    'sanitizes upstream $code without inventing an empty success',
    async ({ code, expected }) => {
      get.mockRejectedValue({
        code,
        message: 'private-database-address-and-token',
      });
      const result = await getMyAuctions();
      expect(result).toMatchObject({ ok: false, error: { code: expected } });
      expect(JSON.stringify(result)).not.toContain('private-');
    },
  );
  it('rejects unsafe money, malformed dates, inconsistent counts, duplicate IDs and oversized pages', () => {
    for (const bad of [
      { ...page(), items: [{ ...item, currentBid: 9007199254740995 }] },
      { ...page(), items: [{ ...item, currentBid: '9223372036854775808' }] },
      { ...page(), items: [{ ...item, endAt: 'bad-date' }] },
      { ...page(), items: [{ ...item, bidCount: -1 }] },
      { ...page(), items: [{ ...item, status: 'sold' }] },
      { ...page(), items: [item, item], total: 2 },
      { ...page(), summary: { ...page().summary, total: 2 } },
      { ...page(), total: -1 },
      { ...page(), pageSize: 21 },
      { ...page(), items: Array(21).fill(item) },
    ])
      expect(parseMySalesPage(bad, query)).toBeNull();
    expect(parseMySalesPage({ ...page(), items: [], total: 0 }, query)).toEqual(
      { ...page(), items: [], total: 0 },
    );
  });
});

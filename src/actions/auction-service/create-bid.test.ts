import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { auth, get, post } = vi.hoisted(() => ({
  auth: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));
vi.mock('@/actions/auth', () => ({ auth }));
vi.mock('@/actions/instance', () => ({ instance: { get, post } }));

import { createBid } from './create-bid';

const auctionPath = '/auction-service/api/v1/auctions/auction-123';
const acceptedBid = {
  auctionUuid: 'auction-123',
  bidderUuid: 'member-a',
  bidAmount: 1100,
  createdAt: '2026-10-18T00:00:00Z',
};
let snapshot: { status: string; minimumBid: number; sellerUuid: string };
let pages: (typeof acceptedBid)[][];

describe('Kafka bid confirmation without notification SSE', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-18T00:00:00Z'));
    vi.resetAllMocks();
    auth.mockResolvedValue({
      user: { accessToken: 'token', memberUuid: 'member-a' },
    });
    snapshot = { status: 'active', minimumBid: 1000, sellerUuid: 'seller' };
    pages = [[], [], [acceptedBid]];
    get.mockImplementation(async (path: string) => {
      if (path === auctionPath) return snapshot;
      return {
        items: pages.length > 1 ? pages.shift() : pages[0],
        nextCursor: null,
      };
    });
    post.mockResolvedValue(undefined);
  });

  afterEach(() => vi.useRealTimers());

  it('confirms the persisted bid after queue processing, with only one submission', async () => {
    const pending = createBid('auction-123', 1100);
    await vi.runAllTimersAsync();
    expect(await pending).toEqual({ ok: true });
    expect(post).toHaveBeenCalledTimes(1);
    expect(post.mock.calls[0][0]).toBe(
      '/auction-service/api/v2/auctions/auction-123/bidders',
    );
    expect(post.mock.calls[0][1]).toMatchObject({ bidAmount: 1100 });
  });

  it('reconciles a lost HTTP response against the persisted bid without resubmitting', async () => {
    post.mockRejectedValue({ code: 'NETWORK_ERROR', message: 'response lost' });
    const pending = createBid('auction-123', 1100);
    await vi.runAllTimersAsync();
    expect(await pending).toEqual({ ok: true });
    expect(post).toHaveBeenCalledTimes(1);
  });

  it('immediately explains that the member is already the highest bidder', async () => {
    pages = [[acceptedBid]];
    expect(await createBid('auction-123', 1200)).toMatchObject({
      ok: false,
      error: { code: 'ALREADY_HIGHEST_BIDDER' },
    });
    expect(post).not.toHaveBeenCalled();
  });

  it('does not treat another member bid of the same amount as this member success', async () => {
    pages = [[], [{ ...acceptedBid, bidderUuid: 'member-b' }]];
    const pending = createBid('auction-123', 1100);
    await vi.runAllTimersAsync();
    expect(await pending).toMatchObject({
      ok: false,
      error: { code: 'BID_PRICE_CHANGED' },
    });
  });

  it('reports an unconfirmed outcome rather than declaring failure and retrying', async () => {
    pages = [[]];
    const pending = createBid('auction-123', 1100);
    await vi.runAllTimersAsync();
    expect(await pending).toMatchObject({
      ok: false,
      error: { code: 'BID_PENDING' },
    });
    expect(post).toHaveBeenCalledTimes(1);
  });

  it('requires a signed-in member before submitting', async () => {
    auth.mockResolvedValue(null);
    expect(await createBid('auction-123', 1100)).toMatchObject({
      ok: false,
      error: { code: 'AUTH_REQUIRED' },
    });
    expect(post).not.toHaveBeenCalled();
  });

  it.each(['ended', 'waiting', 'hidden', 'cancelled'])(
    'does not enqueue a bid on a %s auction',
    async (status) => {
      snapshot.status = status;
      expect(await createBid('auction-123', 1100)).toMatchObject({
        ok: false,
        error: { code: 'AUCTION_NOT_ACTIVE' },
      });
      expect(post).not.toHaveBeenCalled();
    },
  );

  it('prevents the seller from bidding', async () => {
    snapshot.sellerUuid = 'member-a';
    expect(await createBid('auction-123', 1100)).toMatchObject({
      ok: false,
      error: { code: 'SELLER_BID' },
    });
    expect(post).not.toHaveBeenCalled();
  });
});

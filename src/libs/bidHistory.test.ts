import { describe, expect, it } from 'vitest';
import {
  bidHistoryFixture,
  bidHistoryScenario,
} from '@/test/bidHistoryFixture';
import {
  bidHistoryStatus,
  selectBidHistory,
  summarizeBidHistory,
} from './bidHistory';

describe('personal bid history', () => {
  it('groups repeated auctions and duplicate bid IDs without inflating counts', () => {
    const groups = summarizeBidHistory(bidHistoryScenario());
    expect(groups.map((g) => g.auctionUuid)).toEqual([
      'auction-headphones',
      'auction-keyboard',
    ]);
    expect(groups[1]).toMatchObject({
      bidCount: 2,
      highestBid: 12000,
      currentBid: 15000,
      latestBidAt: '2026-10-29T10:00:00Z',
    });
    expect(groups[1].bids.map((b) => b.bidderUuid)).toEqual([
      'bid-keyboard-new',
      'bid-keyboard-old',
    ]);
    expect(groups.reduce((count, g) => count + g.bidCount, 0)).toBe(3);
  });

  it('uses the highest version even when its row appears first', () => {
    const groups = summarizeBidHistory(bidHistoryScenario().reverse());
    expect(
      groups.find((g) => g.auctionUuid === 'auction-keyboard')?.currentBid,
    ).toBe(15000);
  });

  it('does not send seller profiles or auction descriptions to the client projection', () => {
    const group = summarizeBidHistory([bidHistoryFixture()])[0];
    expect(group).not.toHaveProperty('seller');
    expect(group).not.toHaveProperty('description');
    expect(group).not.toHaveProperty('auction');
  });

  it('filters titles and states and sorts own maximum bid without mutating groups', () => {
    const groups = summarizeBidHistory(bidHistoryScenario());
    expect(
      selectBidHistory(groups, {
        query: '  키보드  ',
        status: 'active',
        sort: 'recent',
      }).map((g) => g.auctionUuid),
    ).toEqual(['auction-keyboard']);
    expect(
      selectBidHistory(groups, {
        query: '헤드폰',
        status: 'active',
        sort: 'recent',
      }),
    ).toEqual([]);
    expect(
      selectBidHistory(groups, {
        query: '',
        status: 'all',
        sort: 'amount',
      }).map((g) => g.auctionUuid),
    ).toEqual(['auction-keyboard', 'auction-headphones']);
    expect(groups.map((g) => g.auctionUuid)).toEqual([
      'auction-headphones',
      'auction-keyboard',
    ]);
  });

  it('normalizes case and uses stable identifiers when dates tie', () => {
    const groups = summarizeBidHistory([
      bidHistoryFixture({ auctionUuid: 'b', title: 'KEYBOARD' }),
      bidHistoryFixture({ auctionUuid: 'a', title: 'Keyboard' }),
    ]);
    expect(
      selectBidHistory(groups, {
        query: 'keyboard',
        status: 'all',
        sort: 'recent',
      }).map((g) => g.auctionUuid),
    ).toEqual(['a', 'b']);
  });

  it('labels an ended equal-price bid as ended without claiming a winner or loser', () => {
    const group = summarizeBidHistory(bidHistoryScenario())[0];
    expect(group.highestBid).toBe(group.currentBid);
    expect(bidHistoryStatus(group.status).text).toBe('종료');
    expect(bidHistoryStatus('unknown').text).toBe('확인 필요');
  });

  it('keeps invalid timestamps harmless and a bad response distinct from empty history', () => {
    const groups = summarizeBidHistory([
      bidHistoryFixture({ createdAt: 'not-a-date' }),
    ]);
    expect(groups).toHaveLength(1);
    expect(summarizeBidHistory([])).toEqual([]);
    expect(() => summarizeBidHistory(null as never)).toThrow();
  });
});

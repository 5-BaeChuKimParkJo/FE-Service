import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';

const { getAuctionDetail, getAuctionBidders } = vi.hoisted(() => ({
  getAuctionDetail: vi.fn(),
  getAuctionBidders: vi.fn(),
}));
vi.mock('@/actions/auction-service', () => ({
  getAuctionDetail,
  getAuctionBidders,
}));
vi.mock('@/actions/auth', () => ({ auth: async () => null }));
vi.mock('@/components/images', () => ({ ItemImages: () => null }));
vi.mock('@/components/items', () => ({
  ItemInfoSection: () => null,
  AuctionTimer: () => null,
  ItemDescriptionSection: () => null,
}));
vi.mock('./_components', () => ({
  BiddersSection: () => null,
  AuctionTags: () => null,
  BidderForm: () => null,
}));
vi.mock('@/components/auction/RecentAuctionTracker', () => ({
  default: () => null,
}));
vi.mock('@/components/auction/checkout/WinnerCheckoutEntry', () => ({
  WinnerCheckoutEntry: () => null,
}));

import AuctionPage from './page';
import { ItemInfoSection } from '@/components/items';
import { BidderForm } from './_components';

describe('auction detail current price', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getAuctionDetail.mockResolvedValue({
      auctionUuid: 'fixture',
      minimumBid: 1000,
      currentBid: 1000,
      images: [],
      tags: [],
      status: 'active',
    });
  });

  it.each([
    { bids: [], expected: 1000 },
    { bids: [{ bidAmount: 1200 }], expected: 1200 },
  ])(
    'uses the same current price in the item and bid form: $expected',
    async ({ bids, expected }) => {
      getAuctionBidders.mockResolvedValue({ items: bids, nextCursor: null });
      const page = await AuctionPage({
        params: Promise.resolve({ id: 'fixture' }),
      });
      const children = page.props.children as ReactElement[];
      const main = children[0] as ReactElement<{ children: ReactElement[] }>;
      const info = main.props.children.find(
        (child) => child.type === ItemInfoSection,
      ) as ReactElement<{
        auction: { currentBid: number; minimumBid: number };
      }>;
      const form = children.find(
        (child) => child.type === BidderForm,
      ) as ReactElement<{ bidAmount: number }>;
      expect(info.props.auction.currentBid).toBe(expected);
      expect(info.props.auction.minimumBid).toBe(1000);
      expect(form.props.bidAmount).toBe(expected);
    },
  );
});

import type { BidHistory } from '@/types/auction';

export function bidHistoryFixture(
  options: {
    auctionUuid?: string;
    bidderUuid?: string;
    title?: string;
    status?: BidHistory['auction']['status'];
    bidAmount?: number;
    createdAt?: string;
    version?: number;
    currentBid?: number;
  } = {},
): BidHistory {
  return {
    bidder: {
      bidderUuid: options.bidderUuid ?? 'bid-1',
      bidAmount: options.bidAmount ?? 12000,
      createdAt: options.createdAt ?? '2026-10-29T10:00:00Z',
    },
    auction: {
      type: 'auction',
      auctionUuid: options.auctionUuid ?? 'auction-keyboard',
      title: options.title ?? '기계식 키보드',
      description: '사용 이력이 있는 테스트 경매',
      minimumBid: 1000,
      startAt: '2026-10-28T00:00:00Z',
      endAt: '2099-01-01T00:00:00Z',
      isDirectDeal: false,
      directDealLocation: '',
      productCondition: 'used',
      viewCount: 5,
      thumbnailUrl: '/images/dummy/airpods.png',
      createdAt: '2026-10-28T00:00:00Z',
      soldAt: '',
      version: options.version ?? 1,
      currentBid: options.currentBid ?? 15000,
      status: options.status ?? 'active',
      category: {
        categoryId: 1,
        name: '전자기기',
        description: '',
        imageUrl: '',
      },
      tags: [],
      seller: {
        memberUuid: 'seller-fixture',
        nickname: '판매자',
        gradeUuid: 'grade-fixture',
        honor: 'NICE_GUY',
        state: 'ACTIVE',
        profileImageUrl: '',
        point: 100,
      },
      images: [],
    },
  };
}

export function bidHistoryScenario(): BidHistory[] {
  const newest = bidHistoryFixture({
    bidderUuid: 'bid-keyboard-new',
    version: 3,
  });
  return [
    bidHistoryFixture({
      auctionUuid: 'auction-headphones',
      bidderUuid: 'bid-headphones',
      title: '무선 헤드폰',
      status: 'ended',
      bidAmount: 5000,
      currentBid: 5000,
      createdAt: '2026-10-29T12:00:00Z',
    }),
    newest,
    bidHistoryFixture({
      bidderUuid: 'bid-keyboard-old',
      bidAmount: 10000,
      createdAt: '2026-10-29T09:00:00Z',
      currentBid: 10000,
      version: 1,
    }),
    newest,
  ];
}

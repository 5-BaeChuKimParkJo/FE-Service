import type { BidHistory, Bidder } from '@/types/auction/bid-history';

export interface BidHistoryGroup {
  auctionUuid: string;
  title: string;
  thumbnailUrl: string;
  currentBid: number;
  status: string;
  highestBid: number;
  bidCount: number;
  latestBidAt: string;
  bids: Bidder[];
}
export type BidHistoryFilter = {
  query: string;
  status: 'all' | BidHistory['auction']['status'];
  sort: 'recent' | 'amount';
};
const timestamp = (value: string) => Date.parse(value) || 0;
const recentFirst = (a: BidHistoryGroup, b: BidHistoryGroup) =>
  timestamp(b.latestBidAt) - timestamp(a.latestBidAt) ||
  a.auctionUuid.localeCompare(b.auctionUuid);

export function summarizeBidHistory(history: BidHistory[]): BidHistoryGroup[] {
  if (!Array.isArray(history)) throw new Error('Invalid bid history response');
  const auctions = new Map<
    string,
    { auction: BidHistory['auction']; bids: Map<string, Bidder> }
  >();
  for (const { auction, bidder } of history) {
    let group = auctions.get(auction.auctionUuid);
    if (!group) {
      group = { auction, bids: new Map() };
      auctions.set(auction.auctionUuid, group);
    }
    if (auction.version > group.auction.version) group.auction = auction;
    if (!group.bids.has(bidder.bidderUuid))
      group.bids.set(bidder.bidderUuid, {
        bidderUuid: bidder.bidderUuid,
        bidAmount: bidder.bidAmount,
        createdAt: bidder.createdAt,
      });
  }
  return Array.from(auctions.values(), ({ auction, bids: uniqueBids }) => {
    const bids = Array.from(uniqueBids.values()).sort(
      (a, b) =>
        timestamp(b.createdAt) - timestamp(a.createdAt) ||
        a.bidderUuid.localeCompare(b.bidderUuid),
    );
    return {
      auctionUuid: auction.auctionUuid,
      title: auction.title,
      thumbnailUrl: auction.thumbnailUrl,
      currentBid: auction.currentBid,
      status: auction.status,
      highestBid: bids.reduce(
        (amount, bid) => Math.max(amount, bid.bidAmount),
        0,
      ),
      bidCount: bids.length,
      latestBidAt: bids[0].createdAt,
      bids,
    };
  }).sort(recentFirst);
}

export function selectBidHistory(
  groups: BidHistoryGroup[],
  filter: BidHistoryFilter,
): BidHistoryGroup[] {
  const query = filter.query.trim().toLowerCase();
  return groups
    .filter(
      (group) =>
        (filter.status === 'all' || group.status === filter.status) &&
        group.title.toLowerCase().includes(query),
    )
    .sort(
      filter.sort === 'amount'
        ? (a, b) => b.highestBid - a.highestBid || recentFirst(a, b)
        : recentFirst,
    );
}

export function bidHistoryStatus(status: string): {
  text: string;
  color: string;
} {
  switch (status) {
    case 'active':
      return { text: '진행중', color: 'bg-emerald-50 text-emerald-700' };
    case 'ended':
      return { text: '종료', color: 'bg-gray-100 text-gray-600' };
    case 'waiting':
      return { text: '대기중', color: 'bg-amber-50 text-amber-800' };
    case 'cancelled':
      return { text: '취소됨', color: 'bg-red-50 text-red-700' };
    default:
      return { text: '확인 필요', color: 'bg-gray-100 text-gray-600' };
  }
}

export function formatBidHistoryTime(value: string): string {
  if (!Number.isFinite(Date.parse(value))) return '시간 정보 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

export interface RecentlyViewedAuction {
  auctionUuid: string;
  title: string;
  thumbnailUrl?: string;
  minimumBid: number;
  viewedAt: string;
}

export const LOCAL_STORAGE_KEY = 'recentlyViewedAuctions';
export const MAX_RECENT_AUCTIONS = 20;

export const storeRecentlyViewedAuction = (
  auctionUuid: string,
  title: string,
  minimumBid: number,
  thumbnailUrl?: string,
): void => {
  try {
    if (typeof window === 'undefined') return;

    const viewedAt = new Date().toISOString();

    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    let recentAuctions: RecentlyViewedAuction[] = storedItems
      ? JSON.parse(storedItems)
      : [];

    // 중복 제거 (같은 경매는 최신으로 업데이트)
    recentAuctions = recentAuctions.filter(
      (item) => item.auctionUuid !== auctionUuid,
    );

    // 새로운 경매를 맨 앞에 추가
    recentAuctions.unshift({
      auctionUuid,
      title,
      thumbnailUrl,
      minimumBid,
      viewedAt,
    });

    // 최대 개수 제한
    if (recentAuctions.length > MAX_RECENT_AUCTIONS) {
      recentAuctions = recentAuctions.slice(0, MAX_RECENT_AUCTIONS);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentAuctions));
  } catch (error) {
    console.error('최근 본 경매 로컬스토리지 저장 실패:', error);
  }
};

export const getRecentlyViewedAuctions = (): RecentlyViewedAuction[] => {
  try {
    if (typeof window === 'undefined') return [];

    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error('최근 본 경매 로컬스토리지 조회 실패:', error);
    return [];
  }
};

export const deleteRecentlyViewedAuction = (
  auctionUuid: string,
): RecentlyViewedAuction[] => {
  try {
    if (typeof window === 'undefined') return [];

    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedItems) return [];

    const items = JSON.parse(storedItems) as RecentlyViewedAuction[];
    const updatedItems = items.filter(
      (item) => item.auctionUuid !== auctionUuid,
    );

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    return updatedItems;
  } catch (error) {
    console.error(`경매 ${auctionUuid} 삭제 중 오류 발생:`, error);
    return [];
  }
};

export const deleteAllRecentlyViewedAuctions = (): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('모든 최근 본 경매 삭제 중 오류 발생:', error);
  }
};

export function groupAuctionsByDate(auctions: RecentlyViewedAuction[]): Array<{
  viewedAt: string;
  auctions: RecentlyViewedAuction[];
}> {
  if (!auctions || auctions.length === 0) return [];

  const groupedAuctions: Record<string, RecentlyViewedAuction[]> = {};

  auctions.forEach((auction) => {
    const datePart = auction.viewedAt.split('T')[0];

    if (!groupedAuctions[datePart]) {
      groupedAuctions[datePart] = [];
    }

    groupedAuctions[datePart].push(auction);
  });

  return Object.entries(groupedAuctions)
    .map(([viewedAt, auctions]) => ({ viewedAt, auctions }))
    .sort(
      (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
    );
}

export interface PopularAuction {
  rank: number;
  auctionUuid: string;
  title: string;
  thumbnailUrl: string;
  minimumBid: string;
  currentBid: string;
  startAt: string;
  endAt: string;
  uniqueViewers: string;
  uniqueBidders: string;
  score: string;
}

export interface PopularAuctionsResponse {
  items: PopularAuction[];
  generatedAt: string | null;
  windowHours: 24;
}

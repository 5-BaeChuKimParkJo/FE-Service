export type AuctionDetailResponse = {
  auctionUuid: string;
  title: string;
  description: string;
  images: string[];
  currentPrice: number;
  startPrice: number;
  endPrice: number;
  startDate: string;
  endDate: string;
};

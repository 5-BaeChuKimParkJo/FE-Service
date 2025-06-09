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

export type ProductCondition = 'unopened' | 'new' | 'used';

export interface AuctionImage {
  key: string;
  order: number;
}

export interface CreateAuctionRequest {
  categoryId: number;
  directDealLocation?: string;
  description: string;
  startAt: string; // ISO 8601 format
  endAt: string; // ISO 8601 format
  isDirectDeal: boolean;
  productCondition: ProductCondition;
  thumbnailKey: string;
  title: string;
  minimumBid: number;
  images: AuctionImage[];
}

export interface CreateAuctionResponse {
  auctionId: number;
  message: string;
}

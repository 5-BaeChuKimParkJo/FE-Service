export type AuctionDetailResponse = {
  auctionUuid: string;
  categoryId: number;
  title: string;
  description: string;
  minimumBid: number;
  startAt: string;
  endAt: string;
  isDirectDeal: boolean;
  directDealLocation: string | null;
  status: 'waiting' | 'active' | 'ended' | 'hidden' | 'cancelled';
  productCondition: ProductCondition;
  viewCount: number;
  thumbnailUrl: string;
  createdAt: string;
  sellerUuid: string;
  images: AuctionImage[];
  bidAmount?: number;
  bidderCount?: number;
  likes?: number;
  profileImageUrl?: string;
  nickname?: string;
  honor?: string;
  gradeName?: string;
  gradeImageUrl?: string;
};

export type ProductCondition = 'unopened' | 'new' | 'used' | '';

export interface AuctionImage {
  auctionImageId: number;
  url: string;
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
  images: { key: string; order: number }[];
  tagIds: number[];
}

export type AuctionStatus =
  | 'waiting'
  | 'active'
  | 'ended'
  | 'hidden'
  | 'cancelled';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export interface AuctionBiddersResponse {
  items: AuctionBidders[];
  nextCursor: string | null;
}

export interface AuctionBidders {
  auctionUuid: string;
  bidderUuid: string;
  bidAmount: number;
  createdAt: string;
}

export interface AuctionImage {
  auctionImageId: number;
  url: string;
  order: number;
}

export interface CreateAuctionResponse {
  auctionUuid: string;
  categoryId: number;
  title: string;
  description: string;
  minimumBid: number;
  startAt: string; // ISO 날짜 문자열
  endAt: string; // ISO 날짜 문자열
  isDirectDeal: boolean;
  directDealLocation: string;
  status: 'waiting' | 'ongoing' | 'finished'; // 필요한 경우 확장 가능
  productCondition: 'unopened' | 'used' | 'new'; // 조건 추가 가능
  viewCount: number;
  thumbnailUrl: string;
  createdAt: string; // ISO 날짜 문자열
  sellerUuid: string;
  images: AuctionImage[];
}

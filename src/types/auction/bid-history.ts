import { AuctionTag, AuctionImage } from './auction-history';

export interface BidHistory {
  bidder: Bidder;
  auction: AuctionWithSeller;
}

export interface Bidder {
  bidderUuid: string;
  bidAmount: number;
  createdAt: string;
}

export interface AuctionWithSeller {
  type: 'auction';
  auctionUuid: string;
  title: string;
  description: string;
  minimumBid: number;
  startAt: string;
  endAt: string;
  isDirectDeal: boolean;
  directDealLocation: string;
  productCondition: 'unopened' | 'opened' | 'used';
  viewCount: number;
  thumbnailUrl: string;
  createdAt: string;
  soldAt: string;
  version: number;
  currentBid: number;
  status: 'waiting' | 'active' | 'ended' | 'cancelled';
  category: AuctionCategory;
  tags: AuctionTag[];
  seller: Seller;
  images: AuctionImage[];
}

export interface AuctionCategory {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Seller {
  memberUuid: string;
  nickname: string;
  gradeUuid: string;
  honor: string;
  state: string;
  profileImageUrl: string;
  point: number;
}

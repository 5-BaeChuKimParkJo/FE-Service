import { Category } from '@/types/category';

export interface AuctionHistory {
  type: 'auction';
  auctionUuid: string;
  title: string;
  description: string;
  minimumBid: number;
  startAt: string;
  endAt: string;
  isDirectDeal: boolean;
  directDealLocation: string;
  productCondition: string;
  viewCount: number;
  thumbnailUrl: string;
  createdAt: string;
  soldAt: string;
  version: number;
  currentBid: number;
  status: string;
  category: Category;
  tags: AuctionTag[];
  images: AuctionImage[];
}

export interface AuctionTag {
  tagId: number;
  name: string;
}

export interface AuctionImage {
  auctionImageId: number;
  url: string;
  order: number;
}

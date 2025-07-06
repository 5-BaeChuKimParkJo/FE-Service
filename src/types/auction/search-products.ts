export interface SearchAuctionRequest {
  auctionTitle?: string;
  categoryName?: string;
  tagNames?: string[];
  productCondition?: string;
  sortBy?: string;
  searchAfter?: SearchAfterCursor[];
  directDeal?: boolean;
}

export interface SearchAfterCursor {
  lastAuctionUuid?: string;
  lastAuctionCreatedAt?: string;
  lastAuctionCurrentBid?: number;
  lastAuctionViewCount?: number;
}

export interface SearchAuctionResponse {
  getAuctionSearchResponseVoList: SearchAuctionItem[];
}

export interface SearchAuctionItem {
  id: string;
  auctionUuid: string;
  auctionTitle: string;
  auctionDescription: string;
  status: string | null;
  thumbnailKey: string;
  directDealLocation: string | null;
  thumbnailUrl: string;
  images: AuctionImage[];
  sellerUuid: string;
  startAt: string;
  endAt: string;
  version: number;
  createdAt: string;
  viewCount: number;
  currentBid: number;
  minimumBid: number;
  description: string | null;
  productCondition: string;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryThumbnailKey: string;
  tagId: number[];
  tagNames: string[];
  directDeal: boolean;
}

export interface AuctionImage {
  key: string;
  url: string;
  order: number;
  auctionImageId: number;
}

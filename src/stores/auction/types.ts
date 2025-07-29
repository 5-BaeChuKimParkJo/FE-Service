export type ProductCondition = 'unopened' | 'new' | 'used' | '';

export type AuctionImage = {
  key: string;
  order: number;
  file?: File;
  url?: string;
};

export type CreateAuctionCommand = {
  categoryId?: number | null;
  directDealLocation?: string | null;
  description: string;
  startAt: Date;
  endAt: Date;
  isDirectDeal: boolean;
  productCondition: ProductCondition;
  thumbnailKey: string;
  title: string;
  minimumBid: bigint;
  images: {
    key: string;
    order: number;
  }[];
  tags: string[];
  tagIds: number[];
};

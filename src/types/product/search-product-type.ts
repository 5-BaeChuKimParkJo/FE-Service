export interface SearchProductItemType {
  productUuid: string;
  title: string;
  tagNames: string[];
  status: string;
  thumbnailKey: string;
  sortBy: string;
  createdAt: string;
  price: number;
  viewCount: number;
  imageUrlList: ImageUrlListType[];
}

export interface SearchAfterProductCursor {
  lastProductUuid?: string;
  lastProductCreatedAt?: string;
  lastProductViewCount?: number;
  lastProductPrice?: number;
}

export interface SearchProductResponse {
  getProductSearchResponseVoList: SearchProductItemType[];
  nextCursorVo?: SearchAfterProductCursor;
}

export interface SearchProductRequest {
  productTitle?: string;
  categoryName?: string;
  tagNames?: string[];
  directDealLocation?: string;
  productCondition?: string;
  sortBy?: string;
  searchAfter1?: string;
  searchAfter2?: string;
  directDeal?: boolean;
}

export type ImageUrlListType = {
  url: string;
  order: number;
  productImageId?: number;
};

export interface SellerReviewData {
  buyerUuid: string;
  postUuid: string;
  postType: 'PRODUCT' | 'AUCTION';
  mannerScore: number;
  timeScore: number;
  replyScore: number;
}

export interface BuyerReviewData {
  sellerUuid: string;
  postUuid: string;
  postType: 'PRODUCT' | 'AUCTION';
  mannerScore: number;
  timeScore: number;
  replyScore: number;
  statusScore: number;
}

export type ReviewData = SellerReviewData | BuyerReviewData;

export type ReviewType = 'seller-to-buyer' | 'buyer-to-seller';

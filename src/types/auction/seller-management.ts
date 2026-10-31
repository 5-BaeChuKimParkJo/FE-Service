export interface SellerAuctionSnapshot {
  title: string;
  description: string;
  minimumBid: string;
  startAt: string;
  endAt: string;
  status: string;
}
export interface SellerAuctionData extends SellerAuctionSnapshot {
  auctionUuid: string;
  version: number;
  editable: boolean;
  history: Array<{
    action: 'update' | 'cancel';
    reasonCode: string | null;
    reasonDetail: string | null;
    before: SellerAuctionSnapshot;
    after: SellerAuctionSnapshot;
    createdAt: string;
  }>;
}
export type SellerUpdateInput = Omit<SellerAuctionSnapshot, 'status'> & {
  version: number;
};
export interface SellerCancellation {
  version: number;
  reasonCode: string;
  reasonDetail?: string;
}
export type SellerManagementFailure = {
  ok: false;
  error: {
    code:
      | 'AUTH_REQUIRED'
      | 'UNAVAILABLE'
      | 'CONFLICT'
      | 'INVALID_REQUEST'
      | 'REQUEST_FAILED';
    message: string;
  };
};
export type SellerAuctionResult =
  | { ok: true; data: SellerAuctionData }
  | SellerManagementFailure;
export type SellerMutationResult = { ok: true } | SellerManagementFailure;

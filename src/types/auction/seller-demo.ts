export type SellerDemoFailure = {
  ok: false;
  error: {
    code: 'AUTH_REQUIRED' | 'UNAVAILABLE' | 'COOLDOWN' | 'REQUEST_FAILED';
    message: string;
  };
};
export type SellerDemoAvailability =
  | { ok: true; available: boolean }
  | SellerDemoFailure;
export type SellerDemoResult =
  | { ok: true; auctionUuid: string; status: 'created' | 'reused' }
  | SellerDemoFailure;

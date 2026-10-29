export interface SavedAuction {
  auctionUuid: string;
  title: string;
  thumbnailUrl: string;
  minimumBid: string;
  currentBid: string;
  startAt: string;
  endAt: string;
  savedAt: string;
  status: 'waiting' | 'active' | 'ended';
}
export interface SavedAuctionPage {
  items: SavedAuction[];
  nextCursor: string | null;
}
export type SavedAuctionFailure = {
  ok: false;
  error: {
    code:
      | 'AUTH_REQUIRED'
      | 'UNAVAILABLE'
      | 'REQUEST_FAILED'
      | 'INVALID_REQUEST';
    message: string;
  };
};
export type SavedAuctionStateResult =
  | { ok: true; saved: boolean }
  | SavedAuctionFailure;
export type SavedAuctionPageResult =
  | { ok: true; page: SavedAuctionPage }
  | SavedAuctionFailure;

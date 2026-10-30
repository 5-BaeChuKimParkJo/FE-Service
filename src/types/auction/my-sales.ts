export type MySaleStatus =
  | 'waiting'
  | 'active'
  | 'ended'
  | 'hidden'
  | 'cancelled';
export interface MySalesQuery {
  q: string;
  status: 'all' | MySaleStatus;
  sort: 'recent' | 'ending' | 'price';
  page: number;
}
export interface MySale {
  auctionUuid: string;
  title: string;
  thumbnailUrl: string;
  minimumBid: string;
  currentBid: string;
  bidCount: number;
  startAt: string;
  endAt: string;
  createdAt: string;
  status: MySaleStatus;
}
export interface MySalesData {
  items: MySale[];
  summary: Record<'total' | MySaleStatus, number>;
  total: number;
  page: number;
  pageSize: 20;
}
export type MySalesResult =
  | { ok: true; data: MySalesData }
  | {
      ok: false;
      error: {
        code: 'AUTH_REQUIRED' | 'INVALID_REQUEST' | 'REQUEST_FAILED';
        message: string;
      };
    };

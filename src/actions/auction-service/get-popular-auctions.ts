'use server';

import type { PopularAuctionsResponse } from '@/types/auction/popular-auctions';
import { instance } from '@/actions/instance';

export async function getPopularAuctions(): Promise<PopularAuctionsResponse> {
  return instance.get<PopularAuctionsResponse>(
    '/auction-service/api/v1/auctions/popular',
  );
}

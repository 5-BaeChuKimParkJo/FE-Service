'use server';

import { instance } from '@/actions/instance';
import { BidHistory } from '@/types/auction';

export async function getMyBidHistory(): Promise<BidHistory[]> {
  return await instance.get<BidHistory[]>(
    '/auction-service/api/v1/auctions/my-bids',
  );
}

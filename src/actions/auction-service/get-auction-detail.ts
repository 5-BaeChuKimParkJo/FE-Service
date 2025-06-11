'use server';

import { AuctionDetailResponse } from '@/types/auction';
import { instance } from '../instance';

export async function getAuctionDetail(auctionUuid: string) {
  const auction = await instance.get<AuctionDetailResponse>(
    `/auction-service/api/v1/auctions/${auctionUuid}`,
  );

  return auction;
}

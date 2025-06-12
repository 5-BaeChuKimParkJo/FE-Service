'use server';

import { AuctionDetailResponse } from '@/types/auction';
import { instance } from '../instance';
import { ErrorResponse } from '@/types/api';

export async function getAuctionDetail(
  auctionUuid: string,
): Promise<AuctionDetailResponse | ErrorResponse> {
  // const auction = await instance.get<AuctionDetailResponse>(
  //   `/auction-service/api/v1/auctions/${auctionUuid}`,
  // );
  // return auction;

  try {
    const auction = await instance.get<AuctionDetailResponse>(
      `/auction-service/api/v1/auctions/${auctionUuid}`,
    );
    return auction;
  } catch (error) {
    return error as ErrorResponse;
  }
}

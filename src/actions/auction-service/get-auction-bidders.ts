'use server';

import { AuctionBiddersResponse } from '@/types/auction';
import { instance } from '@/actions/instance';
import { ErrorResponse } from '@/types/api';

export async function getAuctionBidders(
  auctionUuid: string,
): Promise<AuctionBiddersResponse | ErrorResponse> {
  // const bidders = await instance.get<AuctionBiddersResponse>(
  //   `/auction-service/api/v1/auctions/${auctionUuid}/bidders`,
  // );
  // return bidders;

  try {
    const bidders = await instance.get<AuctionBiddersResponse>(
      `/auction-service/api/v1/auctions/${auctionUuid}/bidders`,
    );
    return bidders;
  } catch (error) {
    return error as ErrorResponse;
  }
}

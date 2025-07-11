'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '@/actions/instance';

export async function createBid(auctionUuid: string, bidAmount: number) {
  // const response = await instance.post<null | ErrorResponse>(
  //   `/auction-service/api/v1/auctions/${auctionUuid}/bidders`,
  //   {
  //     bidAmount,
  //   },

  // );
  // return response;
  const requestId = crypto.randomUUID();

  try {
    const response = await instance.post<null | ErrorResponse>(
      `/auction-service/api/v2/auctions/${auctionUuid}/bidders`,
      {
        bidAmount,
        requestId,
      },
    );
    return response;
  } catch (error) {
    return error as ErrorResponse;
  }
}

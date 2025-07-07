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

  try {
    const response = await instance.post<null | ErrorResponse>(
      `/auction-service/api/v2/auctions/${auctionUuid}/bidders`,
      {
        bidAmount,
      },
    );
    console.log(response, 'response');
    return response;
  } catch (error) {
    return error as ErrorResponse;
  }
}

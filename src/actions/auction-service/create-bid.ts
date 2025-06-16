'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '../instance';

export async function createBid(auctionUuid: string, bidAmount: number) {
  // const response = await instance.post<null | ErrorResponse>(
  //   `/auction-service/api/v1/auctions/${auctionUuid}/bidders`,
  //   {
  //     bidAmount,
  //   },
  //   {
  //     requireAuth: true,
  //   },
  // );
  // return response;

  try {
    const response = await instance.post<null | ErrorResponse>(
      `/auction-service/api/v1/auctions/${auctionUuid}/bidders`,
      {
        bidAmount,
      },
      {
        requireAuth: true,
      },
    );
    console.log(response, 'response');
    return response;
  } catch (error) {
    return error as ErrorResponse;
  }
}

'use server';

import { CreateAuctionRequest, CreateAuctionResponse } from '@/types/auction';
import { instance } from '../instance';

export async function createAuction(
  request: CreateAuctionRequest,
): Promise<CreateAuctionResponse> {
  try {
    const response = await instance.post<CreateAuctionResponse>(
      '/auction-service/api/v1/auctions',
      request,
      {
        requireAuth: true,
      },
    );

    return response;
  } catch (error) {
    console.log(error);
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      throw error;
    }

    throw new Error('경매 등록에 실패했습니다.');
  }
}

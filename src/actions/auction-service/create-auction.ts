'use server';

import { CreateAuctionRequest, CreateAuctionResponse } from '@/types/auction';
import { instance } from '../instance';

export function convertStoreDataToApiRequest(
  storeData: {
    categoryId?: number | null;
    directDealLocation?: string | null;
    description: string;
    startAt: Date;
    endAt: Date;
    isDirectDeal: boolean;
    productCondition: 'unopened' | 'new' | 'used';
    thumbnailKey: string;
    title: string;
    minimumBid: bigint;
    images: { key: string; order: number }[];
  },
  uploadedImageKeys: string[],
): CreateAuctionRequest {
  return {
    categoryId: storeData.categoryId!,
    directDealLocation: storeData.isDirectDeal
      ? storeData.directDealLocation || undefined
      : undefined,
    description: storeData.description,
    startAt: storeData.startAt.toISOString(),
    endAt: storeData.endAt.toISOString(),
    isDirectDeal: storeData.isDirectDeal,
    productCondition: storeData.productCondition,
    thumbnailKey: uploadedImageKeys[0],
    title: storeData.title,
    minimumBid: Number(storeData.minimumBid),
    images: uploadedImageKeys.map((key, index) => ({
      key,
      order: index,
    })),
  };
}

export async function createAuction(
  request: CreateAuctionRequest,
): Promise<CreateAuctionResponse> {
  try {
    const response = await instance.post<CreateAuctionResponse>(
      'auction-service/api/v1/auctions',
      request,
    );

    return response;
  } catch (error) {
    console.error('Failed to create auction:', error);
    throw new Error('경매 등록에 실패했습니다.');
  }
}

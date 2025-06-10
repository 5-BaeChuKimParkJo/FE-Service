import { CreateAuctionRequest } from '@/types/auction';

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

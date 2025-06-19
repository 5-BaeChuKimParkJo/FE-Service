import {
  CreateAuctionRequest,
  ProductCondition,
  TimeLeft,
} from '@/types/auction';

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
    tagIds: number[];
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
    tagIds: storeData.tagIds,
  };
}

export const productConditionLabels: Record<ProductCondition, string> = {
  new: '새상품',
  used: '중고상품',
  unopened: '미개봉',
};

export const calculateTimeLeft = (endAt: string): TimeLeft => {
  const now = new Date().getTime();
  const end = new Date(endAt).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEnded: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isEnded: false,
  };
};

/**
 * 시간 포맷팅
 */
export const formatTimeLeft = (timeLeft: TimeLeft): string => {
  if (timeLeft.isEnded) {
    return '경매 종료';
  }

  const { days, hours, minutes } = timeLeft;

  if (days > 0) {
    return `${days}일 ${hours}시간 ${minutes}분`;
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }

  return `${minutes}분`;
};

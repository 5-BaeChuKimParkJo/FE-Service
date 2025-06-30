export type AuctionType = 'auction';

export type MemberHonor = 'NICE_GUY' | 'GOOD_BOY' | 'REAL_MAN';

export type MemberState = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface TagResponseDto {
  tagId: number;
  name: string;
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string | null;
}

export type AuctionStatus = 'waiting' | 'active' | 'ended';

export interface MemberResponseDto {
  memberUuid: string;
  nickname: string;
  gradeUuid: string;
  honor: MemberHonor;
  state: MemberState;
  profileImageUrl: string | null;
  point?: number;
}

export interface ImageResponseDto {
  auctionImageId: number;
  url: string;
  order: number;
}

export interface CatalogAuctionResponseDto {
  auctionUuid: string;
  title: string;
  description: string;
  minimumBid: number;
  startAt: string;
  endAt: string;
  isDirectDeal: boolean;
  directDealLocation: string | null;
  productCondition: string;
  viewCount: number;
  thumbnailUrl: string;
  createdAt: string;
  version: number;
  currentBid: number;
  status: AuctionStatus;
  type: AuctionType;
  category: Category;
  tags: TagResponseDto[];
  seller: MemberResponseDto;
  images: ImageResponseDto[];
  likes?: number;
  bidderCount?: number;
}

export interface CatalogAuctionResponseWithDates
  extends Omit<CatalogAuctionResponseDto, 'startAt' | 'endAt' | 'createdAt'> {
  startAt: Date;
  endAt: Date;
  createdAt: Date;
}

export const convertToDateObjects = (
  response: CatalogAuctionResponseDto,
): CatalogAuctionResponseWithDates => {
  return {
    ...response,
    startAt: new Date(response.startAt),
    endAt: new Date(response.endAt),
    createdAt: new Date(response.createdAt),
  };
};

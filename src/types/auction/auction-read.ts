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

export interface MemberResponseDto {
  memberUuid: string;
  nickname: string;
  gradeUuid: string;
  honor: MemberHonor;
  state: MemberState;
  profileImageUrl: string | null;
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
  type: AuctionType;
  category: Category | null;
  tags: TagResponseDto[];
  seller: MemberResponseDto;
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

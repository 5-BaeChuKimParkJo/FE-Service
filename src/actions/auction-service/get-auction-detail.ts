'use server';

import { instance } from '@/actions/instance';
import { API_PATHS } from '@/config/api';
import { ErrorResponse } from '@/types/api';
import { CatalogAuctionResponseDto } from '@/types/auction/auction-read';
import { MemberInfo } from '@/types/member';

type AuctionServiceResponse = {
  auctionUuid: string;
  categoryId?: number | null;
  categoryName: string | null;
  title: string;
  description: string;
  minimumBid: number;
  startAt: string;
  endAt: string;
  isDirectDeal: boolean;
  directDealLocation?: string | null;
  status: 'waiting' | 'active' | 'ended';
  productCondition: string;
  viewCount: number;
  thumbnailUrl: string;
  createdAt: string;
  sellerUuid: string;
  tagIds: number[];
  tagNames: string[];
  images: CatalogAuctionResponseDto['images'];
};

export async function getAuctionDetail(
  auctionUuid: string,
): Promise<CatalogAuctionResponseDto> {
  try {
    const auction = await instance.get<AuctionServiceResponse>(
      API_PATHS.auctionDetail(auctionUuid),
    );
    const seller = await instance.get<MemberInfo>(
      `/member-service/api/v1/member/${auction.sellerUuid}`,
    );

    return {
      ...auction,
      directDealLocation: auction.directDealLocation ?? null,
      version: 1,
      currentBid: auction.minimumBid,
      type: 'auction',
      category: {
        categoryId: auction.categoryId ?? 0,
        name: auction.categoryName ?? '기타',
        description: '',
        imageUrl: null,
      },
      tags: auction.tagNames.map((name, index) => ({
        tagId: auction.tagIds[index] ?? index,
        name,
      })),
      seller: {
        ...seller,
        honor: seller.honor as CatalogAuctionResponseDto['seller']['honor'],
        state: seller.state as CatalogAuctionResponseDto['seller']['state'],
      },
    };
  } catch (error) {
    throw error as ErrorResponse;
  }
}

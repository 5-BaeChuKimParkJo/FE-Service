'use server';

import { instance } from '../instance';
import { ErrorResponse } from '@/types/api';
// import { AuctionDetailResponse } from '@/types/auction';
import { CatalogAuctionResponseDto } from '@/types/auction/auction-read';

// export async function getAuctionDetail(
//   auctionUuid: string,
// ): Promise<AuctionDetailResponse | ErrorResponse> {
//   // const auction = await instance.get<AuctionDetailResponse>(
//   //   `/auction-service/api/v1/auctions/${auctionUuid}`,
//   // );
//   // return auction;

//   try {
//     const auction = await instance.get<AuctionDetailResponse>(
//       `/auction-service/api/v1/auctions/${auctionUuid}`,
//     );
//     return auction;
//   } catch (error) {
//     return error as ErrorResponse;
//   }
// }

// read DB에서 글어올 때
export async function getAuctionDetail(
  auctionUuid: string,
): Promise<CatalogAuctionResponseDto | ErrorResponse> {
  try {
    const auction = await instance.get<CatalogAuctionResponseDto>(
      `/catalog-query-service/api/v1/auctions/${auctionUuid}`,
    );
    return auction;
  } catch (error) {
    return error as ErrorResponse;
  }
}

export const API_PATHS = {
  categories: '/auction-service/api/v1/categories',
  auctionDetail: (auctionUuid: string) =>
    `/auction-service/api/v1/auctions/${auctionUuid}`,
  auctionImages: '/auction-service/api/v1/auction-images',
} as const;

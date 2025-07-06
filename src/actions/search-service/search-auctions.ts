'use server';

import { instance } from '@/actions/instance';
import {
  SearchAuctionRequest,
  SearchAuctionResponse,
  SearchAfterCursor,
} from '@/types/auction/search-products';

export async function searchAuctions(
  request: SearchAuctionRequest,
): Promise<SearchAuctionResponse> {
  try {
    const queryParams = buildSearchQueryParams(request);

    const response = await instance.get<SearchAuctionResponse>(
      `/search-service/search-service/api/v1/auction/search?${queryParams.toString()}`,
    );
    return response;
  } catch (error) {
    console.error('경매 검색 API 호출 실패:', error);
    throw error;
  }
}

function appendSearchAfterParams(
  queryParams: URLSearchParams,
  cursor: SearchAfterCursor,
  sortBy: string,
) {
  if (sortBy === 'priceHigh' || sortBy === 'priceLow') {
    if (cursor.lastAuctionCurrentBid !== undefined) {
      queryParams.append(
        'searchAfter',
        cursor.lastAuctionCurrentBid.toString(),
      );
    }
  } else if (sortBy === 'recommended') {
    if (cursor.lastAuctionViewCount !== undefined) {
      queryParams.append('searchAfter', cursor.lastAuctionViewCount.toString());
    }
  } else {
    if (cursor.lastAuctionCreatedAt) {
      queryParams.append('searchAfter', cursor.lastAuctionCreatedAt);
    }
  }

  if (cursor.lastAuctionUuid) {
    queryParams.append('searchAfter', cursor.lastAuctionUuid);
  }
}

function buildSearchQueryParams(
  request: SearchAuctionRequest,
): URLSearchParams {
  const queryParams = new URLSearchParams();

  if (request.auctionTitle) {
    queryParams.append('auctionTitle', request.auctionTitle);
  }
  if (request.categoryName) {
    queryParams.append('categoryName', request.categoryName);
  }
  if (request.tagNames && request.tagNames.length > 0) {
    request.tagNames.forEach((tag) => queryParams.append('tagNames', tag));
  }
  if (request.productCondition) {
    queryParams.append('productCondition', request.productCondition);
  }

  const sortBy = request.sortBy || 'latest';
  queryParams.append('sortBy', sortBy);

  if (request.directDeal !== undefined) {
    queryParams.append('directDeal', request.directDeal.toString());
  }

  if (request.searchAfter && request.searchAfter.length > 0) {
    request.searchAfter.forEach((cursor) => {
      appendSearchAfterParams(queryParams, cursor, sortBy);
    });
  }

  return queryParams;
}

'use server';

import { instance } from '@/actions/instance';
import {
  SearchProductRequest,
  SearchProductResponse,
  SearchAfterProductCursor,
} from '@/types/product/search-product-type';

export async function searchProducts(
  request: SearchProductRequest,
): Promise<SearchProductResponse> {
  const queryParams = buildSearchQueryParams(request);

  const response = await instance.get<SearchProductResponse>(
    `/search-service/search-service/api/v1/product/search?${queryParams.toString()}`,
  );
  return response;
}

function appendSearchAfterParams(
  queryParams: URLSearchParams,
  cursor: SearchAfterProductCursor,
  sortBy: string,
) {
  if (sortBy === 'priceHigh' || sortBy === 'priceLow') {
    if (cursor.lastProductPrice !== undefined) {
      queryParams.append('searchAfter1', cursor.lastProductPrice.toString());
    }
  } else if (sortBy === 'recommended') {
    if (cursor.lastProductViewCount !== undefined) {
      queryParams.append(
        'searchAfter1',
        cursor.lastProductViewCount.toString(),
      );
    }
  } else {
    if (cursor.lastProductCreatedAt) {
      queryParams.append('searchAfter1', cursor.lastProductCreatedAt);
    }
  }

  if (cursor.lastProductUuid) {
    queryParams.append('searchAfter2', cursor.lastProductUuid);
  }
}

function buildSearchQueryParams(
  request: SearchProductRequest,
): URLSearchParams {
  const queryParams = new URLSearchParams();

  if (request.productTitle) {
    queryParams.append('productTitle', request.productTitle);
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

  if (request.searchAfter1 || request.searchAfter2) {
    const cursor: SearchAfterProductCursor = {
      lastProductCreatedAt: request.searchAfter1,
      lastProductUuid: request.searchAfter2,
    };
    appendSearchAfterParams(queryParams, cursor, sortBy);
  }

  return queryParams;
}

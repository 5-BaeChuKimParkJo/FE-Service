'use server';

import { instance } from '@/actions/instance';
import { ErrorResponse } from '@/types/api';
import { ProductDetailResponse } from '@/types/product';

export async function getProductDetail(
  productUuid: string,
): Promise<ProductDetailResponse> {
  try {
    const response = await instance.get<ProductDetailResponse>(
      `/catalog-query-service/api/v1/products/${productUuid}`,
    );
    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

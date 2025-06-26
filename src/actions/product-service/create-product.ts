'use server';

import { CreateProductRequest } from '@/types/product';
import { instance } from '@/actions/instance';
import { ErrorResponse } from '@/types/api';

type CreateProductResponse = {
  productUuid: string;
};

export async function createProduct(
  request: CreateProductRequest,
): Promise<CreateProductResponse | ErrorResponse> {
  try {
    const response = await instance.post<CreateProductResponse>(
      '/product-service/api/v1/product',
      request,
    );

    return response;
  } catch (error) {
    console.log(error);
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      throw error;
    }

    throw new Error('상품 등록에 실패했습니다.');
  }
}

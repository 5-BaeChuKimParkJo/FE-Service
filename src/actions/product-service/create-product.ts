'use server';

import { CreateProductRequest } from '@/types/product';
import { instance } from '../instance';

export async function createProduct(request: CreateProductRequest) {
  try {
    const response = await instance.post(
      '/product-service/api/v1/product',
      request,
      {
        requireAuth: true,
      },
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

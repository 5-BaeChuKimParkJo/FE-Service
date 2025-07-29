'use server';

import { instance } from '@/actions/instance';
import { CompleteProductTransactionType } from '@/types/product/complete-product-transaction-type';

export async function completeProductTransaction(
  data: CompleteProductTransactionType,
) {
  return await instance.post(`/api/v1/product/complete`, data);
}

'use server';

import { instance } from '@/actions/instance';

export async function getAuctions() {
  const response = await instance.get(
    `/search-service/search-service/api/v1/auction/search`,
  );
  return response;
}

'use server';

import { instance } from '@/actions/instance';
import { ErrorResponse } from '@/types/api';
import { AuctionHistory } from '@/types/auction';
import { auth } from '@/actions/auth';

export async function getMyAuctions(): Promise<AuctionHistory[]> {
  const memberUuid = (await auth())?.user?.memberUuid;
  if (!memberUuid) {
    throw {
      code: '401',
      message: 'Member UUID is not found',
    } as ErrorResponse;
  }

  const response = await instance.get<AuctionHistory[]>(
    `/catalog-query-service/api/v1/users/${memberUuid}/auctions`,
  );
  return response;
}

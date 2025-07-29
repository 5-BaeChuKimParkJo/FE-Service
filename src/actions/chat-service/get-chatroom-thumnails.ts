'use server';

import { instance } from '@/actions/instance';
import { ChatRoomThumbnail } from '@/types/chat';

export async function getChatroomThumnails(
  productIds: string[],
): Promise<ChatRoomThumbnail[]> {
  const response = await instance.post<ChatRoomThumbnail[]>(
    '/catalog-query-service/api/v1/thumnails',
    {
      ids: productIds,
    },
  );
  return response;
}

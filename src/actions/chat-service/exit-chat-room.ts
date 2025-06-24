'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '../instance';

export async function exitChatRoom(chatRoomUuid: string) {
  try {
    const response = instance.post<void | ErrorResponse>(
      `/chat-service/api/v1/chatroom/exit/${chatRoomUuid}`,
    );

    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

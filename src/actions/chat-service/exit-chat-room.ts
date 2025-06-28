'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '@/actions/instance';

export async function exitChatRoom(chatRoomUuid: string) {
  try {
    const response = await instance.post<void>(
      `/chat-service/api/v1/chatroom/exit/${chatRoomUuid}`,
    );

    return response as void;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

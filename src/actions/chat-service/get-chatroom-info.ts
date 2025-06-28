'use server';

import { instance } from '@/actions/instance';
import { ErrorResponse } from '@/types/api';
import { ChatroomInfoResponse } from '@/types/chat';

export async function getChatroomInfo(chatRoomUuid: string) {
  try {
    const response = await instance.get<ChatroomInfoResponse>(
      `/chat-service/api/v1/chatroom/info/${chatRoomUuid}`,
    );
    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

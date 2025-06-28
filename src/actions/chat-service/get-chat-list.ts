'use server';

import { ChatRoomSummary } from '@/types/chat';
import { ErrorResponse } from '@/types/api';
import { instance } from '@/actions';

export async function getChatList(): Promise<ChatRoomSummary[]> {
  try {
    const response = await instance.get<ChatRoomSummary[]>(
      '/chat-service/api/v1/chatroom-summary',
    );
    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

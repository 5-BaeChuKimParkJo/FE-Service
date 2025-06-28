'use server';

import { ChatMessageResponseType } from '@/types/chat';
import { instance } from '@/actions/instance';
import { ErrorResponse } from '@/types/api';

export async function getChatHistory(
  chatRoomUuid: string,
  lastMessageUuid?: string,
  lastMessageSentAt?: string,
): Promise<ChatMessageResponseType> {
  try {
    if (lastMessageUuid && lastMessageSentAt) {
      const response = await instance.get<ChatMessageResponseType>(
        `/chat-service/api/v1/chat/messages/history?chatRoomUuid=${chatRoomUuid}&lastMessageUuid=${lastMessageUuid}&lastMessageSentAt=${lastMessageSentAt}`,
      );
      return response;
    }

    const response = await instance.get<ChatMessageResponseType>(
      `/chat-service/api/v1/chat/messages/history?chatRoomUuid=${chatRoomUuid}`,
    );
    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

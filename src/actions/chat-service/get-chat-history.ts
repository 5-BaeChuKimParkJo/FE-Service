'use server';

import { ChatMessage } from '@/types/chat';
import { instance } from '../instance';
import { ErrorResponse } from '@/types/api';

type GetChatHistoryResponse = {
  items: ChatMessage[];
  nextCursor: NextCursorType;
};

type NextCursorType = {
  messageId: string;
};

// 무한스크롤 방식 바뀌면 수정요함
export async function getChatHistory(
  chatRoomUuid: string,
  lastMessageUuid?: string,
) {
  try {
    if (lastMessageUuid) {
      const response = instance.get<GetChatHistoryResponse | ErrorResponse>(
        `/chat-service/api/v1/chat/messages/history?chatRoomUuid=${chatRoomUuid}&lastMessageUuid=${lastMessageUuid}`,
      );
      return response;
    }

    const response = instance.get<GetChatHistoryResponse | ErrorResponse>(
      `/chat-service/api/v1/chat/messages/history?chatRoomUuid=${chatRoomUuid}`,
    );
    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

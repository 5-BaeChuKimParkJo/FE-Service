'use server';

import { instance } from '@/actions/instance';
import { ErrorResponse } from '@/types/api';

type ReadCheckPointResponse = {
  lastReadMessageSentAt: string;
};

export async function getReadCheckPoint(
  chatRoomUuid: string,
  opponentUuid: string,
): Promise<ReadCheckPointResponse> {
  try {
    const response = await instance.get<ReadCheckPointResponse>(
      `/chat-service/api/v1/chat/messages/read-check-point?chatRoomUuid=${chatRoomUuid}&memberUuid=${opponentUuid}`,
    );
    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

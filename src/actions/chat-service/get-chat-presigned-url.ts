'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '@/actions/instance';

type GetChatPresignedUrlResponse = {
  url: string;
  fields: Record<string, string>;
};

export async function getChatPresignedUrl(contentType: string) {
  try {
    const response = await instance.get<GetChatPresignedUrlResponse>(
      `/chat-service/api/v1/pre-signed-url?contentType=${encodeURIComponent(contentType)}`,
    );

    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

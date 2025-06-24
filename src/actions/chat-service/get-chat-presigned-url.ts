'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '../instance';

type GetChatPresignedUrlResponse = {
  url: string;
  fields: Record<string, string>;
};

export async function getChatPresignedUrl(contentType: string) {
  try {
    const response = instance.get<GetChatPresignedUrlResponse | ErrorResponse>(
      `/chat-service/api/v1/pre-signed-url?contentType=${encodeURIComponent(contentType)}`,
    );

    return response;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

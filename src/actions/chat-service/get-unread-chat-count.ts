'use server';

import { instance } from '@/actions/instance';

export async function getUnreadChatCount(): Promise<number> {
  const response = await instance.get<number>(
    '/chat-service/api/v1/chatroom-summary/unread-count',
  );
  return response;
}

'use server';

import { instance } from '@/actions/instance';
import { auth } from '@/actions/auth';
import { ErrorResponse } from '@/types/api';

export async function createChatRoom(
  productUuid: string,
  sellerUuid: string,
): Promise<string> {
  const member = await auth();
  if (!member) {
    throw {
      message: '로그인 후 이용해주세요.',
      code: 'UNAUTHORIZED',
    } as ErrorResponse;
  }
  const memberUuid = member.user?.memberUuid;

  const response = await instance.post<string>(
    `/chat-service/api/v1/chatroom/private`,
    {
      postUuid: productUuid,
      sellerUuid,
      buyerUuid: memberUuid,
      chatRoomType: 'NORMAL_PRIVATE',
    },
  );
  console.log('상태', response);
  return response;
}

'use server';

import { ChatRoomSummary } from '@/types/chat';
import { MemberSummary } from '@/types/member';
import { ErrorResponse } from '@/types/api';
import { getChatList } from './get-chat-list';
import { getMemberSummary } from '@/actions/member-service';
import { isErrorResponse } from '@/utils/type-guards';

export interface ChatRoomWithMember {
  chat: ChatRoomSummary;
  memberInfo: MemberSummary;
}

export async function getChatListWithMembers(): Promise<ChatRoomWithMember[]> {
  try {
    const chatList = await getChatList();

    if (isErrorResponse(chatList)) {
      throw chatList;
    }

    const chatListWithMembers = await Promise.all(
      chatList.map(async (chat) => {
        try {
          const memberInfo = await getMemberSummary(chat.opponentUuid);

          if (isErrorResponse(memberInfo)) {
            return {
              chat,
              memberInfo: {
                memberUuid: chat.opponentUuid,
                nickname: '알 수 없음',
                profileImageUrl: '/images/dummy/dummy2.png',
              } as MemberSummary,
            };
          }

          return {
            chat,
            memberInfo,
          };
        } catch {
          return {
            chat,
            memberInfo: {
              memberUuid: chat.opponentUuid,
              nickname: '알 수 없음',
              profileImageUrl: '/images/dummy/dummy2.png',
            } as MemberSummary,
          };
        }
      }),
    );

    return chatListWithMembers;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

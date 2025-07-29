'use server';

import { ChatRoomSummary, ChatRoomThumbnail } from '@/types/chat';
import { MemberSummary } from '@/types/member';
import { ErrorResponse } from '@/types/api';
import { getChatList } from './get-chat-list';
import { getMemberSummary } from '@/actions/member-service';
import { getChatroomThumnails } from './get-chatroom-thumnails';
import { isErrorResponse } from '@/utils/type-guards';

export interface ChatRoomWithMember {
  chat: ChatRoomSummary;
  memberInfo: MemberSummary;
  thumbnail?: ChatRoomThumbnail;
}

export async function getChatListWithMembers(): Promise<ChatRoomWithMember[]> {
  try {
    const chatList = await getChatList();

    if (isErrorResponse(chatList)) {
      throw chatList;
    }

    const productIds = chatList
      .map((chat) => chat.postUuid)
      .filter((id): id is string => id !== undefined);

    let thumbnails: ChatRoomThumbnail[] = [];
    if (productIds.length > 0) {
      try {
        thumbnails = await getChatroomThumnails(productIds);
      } catch (error) {
        console.error('썸네일 조회 실패:', error);
        thumbnails = [];
      }
    }

    const thumbnailMap = new Map(thumbnails.map((thumb) => [thumb.id, thumb]));

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
              thumbnail: chat.postUuid
                ? thumbnailMap.get(chat.postUuid)
                : undefined,
            };
          }

          return {
            chat,
            memberInfo,
            thumbnail: chat.postUuid
              ? thumbnailMap.get(chat.postUuid)
              : undefined,
          };
        } catch {
          return {
            chat,
            memberInfo: {
              memberUuid: chat.opponentUuid,
              nickname: '알 수 없음',
              profileImageUrl: '/images/dummy/dummy2.png',
            } as MemberSummary,
            thumbnail: chat.postUuid
              ? thumbnailMap.get(chat.postUuid)
              : undefined,
          };
        }
      }),
    );

    return chatListWithMembers;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

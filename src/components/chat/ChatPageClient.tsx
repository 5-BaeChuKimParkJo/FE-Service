'use client';

import { useEffect, useState } from 'react';
import {
  getChatListWithMembers,
  type ChatRoomWithMember,
} from '@/actions/chat-service/get-chat-list-with-members';
import { ChatList } from './ChatList';
import { useConnectSSE } from '@/hooks/use-connect-sse';
import { isErrorResponse } from '@/utils/type-guards';

interface ChatPageClientProps {
  initialChatList: ChatRoomWithMember[];
}

export function ChatPageClient({ initialChatList }: ChatPageClientProps) {
  const [chatList, setChatList] =
    useState<ChatRoomWithMember[]>(initialChatList);
  const { sseMessage } = useConnectSSE();

  useEffect(() => {
    if (sseMessage?.type === 'MESSAGE_UPDATE') {
      // console.log('채팅 업데이트 감지:', sseMessage.chatRoomUuid);

      // 즉시 업데이트
      const updateChatList = async () => {
        try {
          const updatedChatList = await getChatListWithMembers();
          if (!isErrorResponse(updatedChatList)) {
            setChatList(updatedChatList);
          }
        } catch (err) {
          console.error('채팅 리스트 업데이트 실패:', err);
        }
      };

      updateChatList();
    }
  }, [sseMessage]);

  return (
    <div className='max-w-2xl mx-auto'>
      <ChatList chatList={chatList} />
    </div>
  );
}

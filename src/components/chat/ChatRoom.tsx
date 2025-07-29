'use client';

import React, { useRef, useEffect } from 'react';
import { ChatInput, MessageList } from '@/components/chat';
import { useChat, useOptimizedMessages } from '@/hooks/chat';
import { useChatUnreadStore } from '@/stores/use-chat-unread-store';
import { getUnreadChatCount } from '@/actions/chat-service/get-unread-chat-count';
import type {
  ChatMessageResponseType,
  ChatroomInfoResponse,
  ChatMessageType,
} from '@/types/chat';
import type { MemberSummary } from '@/types/member';

interface ChatRoomProps {
  initialChat: ChatMessageType[];
  initialNextCursor: ChatMessageResponseType['nextCursor'];
  opponentInfo: MemberSummary;
  chatroomInfo: ChatroomInfoResponse;
  memberUuid: string;
}

export const ChatRoom = ({
  initialChat,
  initialNextCursor,
  opponentInfo,
  chatroomInfo,
  memberUuid,
}: ChatRoomProps) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const { setUnreadCount } = useChatUnreadStore();

  const {
    messageInput,
    setMessageInput,
    isConnected,
    messages,
    loading,
    error,
    loadTriggerRef,
    sendMessage,
    sendImage,
    sendReadAck,
    isMessageUnread,
    retryFetchMessages,
    handleRetryMessage,
    handleDeleteMessage,
    isSending,
  } = useChat({
    memberUuid,
    chatRoomUuid: chatroomInfo.chatRoomUuid,
    opponentUuid: opponentInfo.memberUuid,
    chatWindowRef,
    initialMessages: initialChat,
    initialNextCursor,
    autoConnect: true,
  });

  // 채팅방 입장/퇴장 시 안읽은 메시지 수 동기화
  useEffect(() => {
    // 채팅방 입장 시 안읽은 메시지 수 동기화
    getUnreadChatCount().then((count) => {
      if (typeof count === 'number') {
        setUnreadCount(count);
      }
    });

    return () => {
      // 채팅방 퇴장 시 안읽은 메시지 수 동기화
      getUnreadChatCount().then((count) => {
        if (typeof count === 'number') {
          setUnreadCount(count);
        }
      });
    };
  }, [setUnreadCount]);

  useEffect(() => {
    if (isConnected && initialChat.length > 0) {
      const latestMessage = initialChat[0];
      if (latestMessage && latestMessage.senderUuid !== memberUuid) {
        // console.log('채팅방 접속 시 읽음 처리:', latestMessage.sentAt);
        setTimeout(() => {
          sendReadAck(latestMessage.sentAt);
        }, 100);
      }
    }
  }, [isConnected, initialChat, memberUuid, sendReadAck]);

  const optimizedMessages = useOptimizedMessages(
    messages,
    memberUuid,
    isMessageUnread,
    opponentInfo,
  );

  return (
    <div className='flex flex-col h-full'>
      <div
        ref={chatWindowRef}
        className='flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4'
      >
        <MessageList
          messages={optimizedMessages}
          loading={loading}
          error={error}
          loadTriggerRef={loadTriggerRef}
          onRetryFetchMessages={retryFetchMessages}
          onRetryMessage={handleRetryMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>

      <ChatInput
        message={messageInput}
        onMessageChange={setMessageInput}
        onSendMessage={sendMessage}
        onSendImage={sendImage}
        disabled={!isConnected || isSending}
      />
    </div>
  );
};

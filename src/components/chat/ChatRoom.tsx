'use client';

import React, { useRef, useEffect } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageList } from '@/components/chat/MessageList';
import { useChat } from '@/hooks/chat/use-chat';
import { useOptimizedMessages } from '@/hooks/chat/use-optimized-messages';
import type {
  ChatMessageResponseType,
  ChatroomInfoResponse,
} from '@/types/chat';
import type { MemberSummary } from '@/types/member';

interface ChatRoomProps {
  initialChat: ChatMessageResponseType;
  opponentInfo: MemberSummary;
  chatroomInfo: ChatroomInfoResponse;
  memberUuid: string;
}

export const ChatRoom = ({
  initialChat,
  opponentInfo,
  chatroomInfo,
  memberUuid,
}: ChatRoomProps) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);

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
  } = useChat({
    memberUuid,
    chatRoomUuid: chatroomInfo.chatRoomUuid,
    opponentUuid: opponentInfo.memberUuid,
    chatWindowRef,
    initialMessages: initialChat.items || [], // 서버에서 받은 초기 메시지들
    autoConnect: true, // 자동 연결
  });

  // 채팅방 접속 시 읽음 처리
  useEffect(() => {
    if (isConnected && initialChat.items && initialChat.items.length > 0) {
      // 가장 최근 메시지 (상대방이 보낸 메시지)의 시간으로 읽음 처리
      const latestMessage = initialChat.items[0]; // 최신 메시지는 첫 번째
      if (latestMessage && latestMessage.senderUuid !== memberUuid) {
        console.log('채팅방 접속 시 읽음 처리:', latestMessage.sentAt);
        sendReadAck(latestMessage.sentAt);
      }
    }
  }, [isConnected, initialChat.items, memberUuid, sendReadAck]);

  // 메시지 최적화 훅 사용
  const optimizedMessages = useOptimizedMessages(
    messages,
    memberUuid,
    isMessageUnread,
    opponentInfo,
  );

  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <div
        ref={chatWindowRef}
        className='flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4 min-h-0'
      >
        <MessageList
          messages={optimizedMessages}
          loading={loading}
          error={error}
          loadTriggerRef={loadTriggerRef}
          onRetryFetchMessages={retryFetchMessages}
        />
      </div>

      <ChatInput
        message={messageInput}
        onMessageChange={setMessageInput}
        onSendMessage={sendMessage}
        onSendImage={sendImage}
        disabled={!isConnected}
      />
    </div>
  );
};

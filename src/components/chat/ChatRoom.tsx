'use client';

import React, { useRef, useEffect } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageList } from '@/components/chat/MessageList';
import { useChat } from '@/hooks/chat/use-chat';
import { useOptimizedMessages } from '@/hooks/chat/use-optimized-messages';
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
    initialMessages: initialChat,
    initialNextCursor,
    autoConnect: true,
  });

  useEffect(() => {
    if (isConnected && initialChat.length > 0) {
      const latestMessage = initialChat[0];
      if (latestMessage && latestMessage.senderUuid !== memberUuid) {
        console.log('채팅방 접속 시 읽음 처리:', latestMessage.sentAt);
        sendReadAck(latestMessage.sentAt);
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
        className='flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-2 min-h-0'
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

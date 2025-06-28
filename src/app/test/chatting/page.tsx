'use client';

import React from 'react';
import { useState, useRef } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatRoomSettings } from '@/components/chat/ChatRoomSettings';
import { MessageList } from '@/components/chat/MessageList';
import { useChat } from '@/hooks/chat/use-chat';
import { useOptimizedMessages } from '@/hooks/chat/use-optimized-messages';

export default function ImprovedChatRoom() {
  // UUID 상태 관리 (테스트용)
  const [memberUuid, setMemberUuid] = useState(
    'f47efbd1-b1b4-4cb5-93ad-c023c689587e',
  );
  const [chatRoomUuid, setChatRoomUuid] = useState(
    '76789c53-b38d-4681-a562-03490f154295',
  );
  const [opponentUuid, setOpponentUuid] = useState(
    'ff10d154-9f8a-47b5-a884-45be3568a66d',
  );

  // 채팅 윈도우 ref
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // 채팅 훅 사용
  const {
    messageInput,
    setMessageInput,
    isConnected,
    messages,
    loading,
    error,
    loadTriggerRef,
    connect,
    disconnect,
    sendMessage,
    sendImage,
    isMessageUnread,
    retryFetchMessages,
  } = useChat({
    memberUuid,
    chatRoomUuid,
    opponentUuid,
    chatWindowRef,
  });

  // 메시지 최적화 훅 사용
  const optimizedMessages = useOptimizedMessages(
    messages,
    memberUuid,
    isMessageUnread,
  );

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>개선된 채팅 테스트</h1>

      {/* 설정 영역 */}
      <ChatRoomSettings
        memberUuid={memberUuid}
        chatRoomUuid={chatRoomUuid}
        opponentUuid={opponentUuid}
        isConnected={isConnected}
        onMemberUuidChange={setMemberUuid}
        onChatRoomUuidChange={setChatRoomUuid}
        onOpponentUuidChange={setOpponentUuid}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      {/* 채팅 영역 */}
      <div className='bg-white border rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)]'>
        {/* 채팅 창 */}
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
          />
        </div>

        {/* 메시지 입력 영역 */}
        <ChatInput
          message={messageInput}
          onMessageChange={setMessageInput}
          onSendMessage={sendMessage}
          onSendImage={sendImage}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatMessageEnhanced } from '@/components/chat/ChatMessageEnhanced';
import { ChatDateDivider } from '@/components/chat/ChatDateDivider';
import { ChatLoadingSpinner } from '@/components/chat/ChatLoadingSpinner';
import { SystemMessage } from '@/components/chat/SystemMessage';
import type { OptimizedMessage } from '@/hooks/chat/use-optimized-messages';

interface MessageListProps {
  messages: OptimizedMessage[];
  loading: boolean;
  error: string | null;
  loadTriggerRef: React.RefObject<HTMLDivElement | null>;
  onRetryFetchMessages: () => void;
  onRetryMessage?: (messageUuid: string) => void;
  onDeleteMessage?: (messageUuid: string) => void;
}

export const MessageList = React.memo<MessageListProps>(
  ({
    messages,
    loading,
    error,
    loadTriggerRef,
    onRetryFetchMessages,
    onRetryMessage,
    onDeleteMessage,
  }) => {
    return (
      <>
        <div ref={loadTriggerRef} className='h-1' />

        {loading && <ChatLoadingSpinner />}
        {error && (
          <div className='flex flex-col items-center py-4 text-red-500'>
            <p className='text-sm mb-2'>{error}</p>
            <button
              onClick={onRetryFetchMessages}
              className='text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded'
            >
              다시 시도
            </button>
          </div>
        )}

        {messages.map((item) => (
          <React.Fragment key={`${item.msg.sentAt}-${item.index}`}>
            {item.showDateDivider && <ChatDateDivider date={item.curDate} />}
            {item.msg.messageType === 'SYSTEM' ? (
              <SystemMessage message={item.msg.message} />
            ) : item.msg.isOptimistic ? (
              <ChatMessageEnhanced
                message={item.msg}
                isFromMe={item.isFromMe}
                isUnread={item.isUnread}
                profileVisible={item.profileVisible}
                profileUrl={item.profileUrl}
                senderName={item.senderName}
                showTime={item.showTime}
                onRetry={onRetryMessage}
                onDelete={onDeleteMessage}
              />
            ) : (
              <ChatMessage
                message={item.msg}
                isFromMe={item.isFromMe}
                isUnread={item.isUnread}
                profileVisible={item.profileVisible}
                profileUrl={item.profileUrl}
                senderName={item.senderName}
                showTime={item.showTime}
              />
            )}
          </React.Fragment>
        ))}
      </>
    );
  },
);

MessageList.displayName = 'MessageList';

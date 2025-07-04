'use client';

import { useState, useCallback, useEffect, type RefObject } from 'react';
import { getChatHistory, exitChatRoom } from '@/actions/chat-service';
import type { ChatMessageType, ReadAckData } from '@/types/chat';
import {
  useChatMessages,
  useReadStatus,
  useChatConnection,
  useChatInfiniteScroll,
} from '@/hooks/chat';
import { useOptimisticMessaging } from '@/hooks/chat/use-optimistic-messaging';
import { useChatActions } from '@/hooks/chat/use-chat-actions';
import { useChatScroll } from '@/hooks/chat/use-chat-scroll';

export interface UseChatParams {
  memberUuid: string;
  chatRoomUuid: string;
  opponentUuid: string;
  chatWindowRef: RefObject<HTMLDivElement | null>;
  maxMessages?: number;
  enableInfinityScroll?: boolean;
  initialMessages?: ChatMessageType[];
  initialNextCursor?: {
    lastMessageUuid: string;
    lastMessageSentAt: string;
  } | null;
  autoConnect?: boolean;
}

export const useChat = ({
  memberUuid,
  chatRoomUuid,
  opponentUuid,
  chatWindowRef,
  maxMessages = 500,
  enableInfinityScroll = true,
  initialMessages = [],
  initialNextCursor = null,
  autoConnect = false,
}: UseChatParams) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    messages,
    hasMoreMessages,
    lastMessageId,
    lastMessageSentAt,
    addMessage: addMessageToState,
    updateMessage: updateMessageInState,
    removeMessage: removeMessageFromState,
    clearMessages,
    setCursor,
    setHasMoreMessages,
  } = useChatMessages(maxMessages);

  const {
    lastReadTimeByOpponent,
    fetchOpponentCheckPoint,
    updateLastReadTime,
    isMessageUnread,
  } = useReadStatus(chatRoomUuid, opponentUuid, memberUuid);

  const {
    createOptimisticMessage,
    startTimeout,
    clearTimeout: _clearTimeout,
    handleSendSuccess: _handleSendSuccess,
    handleSendFailure,
    handleStompError,
    retryMessage,
    deleteMessage,
    handleRealMessageReceived,
    cleanup: cleanupOptimistic,
  } = useOptimisticMessaging({
    memberUuid,
    onMessageUpdate: updateMessageInState,
    onMessageAdd: addMessageToState,
    onMessageRemove: removeMessageFromState,
  });

  // 스크롤 관련 로직
  const { isInitialScrollDone, addMessage: addMessageWithScroll } =
    useChatScroll({
      chatWindowRef,
      messages,
    });

  const addMessage = useCallback(
    (message: ChatMessageType, prepend = false) => {
      addMessageToState(message, prepend);
      addMessageWithScroll(message, prepend);
    },
    [addMessageToState, addMessageWithScroll],
  );

  const fetchMessages = useCallback(
    async (initial = false) => {
      if (loading || !hasMoreMessages) return;

      setLoading(true);
      setError(null);

      try {
        const res = await getChatHistory(
          chatRoomUuid,
          lastMessageId ?? undefined,
          lastMessageSentAt ?? undefined,
        );

        if (!res.nextCursor) {
          setHasMoreMessages(false);
          return;
        }

        setCursor(
          res.nextCursor.lastMessageUuid,
          res.nextCursor.lastMessageSentAt,
        );

        const fetchedMessages = Array.isArray(res) ? res : res.items || [];

        if (fetchedMessages.length === 0) {
          setHasMoreMessages(false);
          return;
        }

        const scrollElement = chatWindowRef.current;
        const prevScrollHeight = scrollElement?.scrollHeight || 0;

        fetchedMessages.forEach((msg: ChatMessageType) =>
          addMessage(msg, true),
        );

        if (initial && scrollElement) {
          setTimeout(() => {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }, 50);
        } else if (scrollElement && !initial) {
          setTimeout(() => {
            const newScrollHeight = scrollElement.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;
            scrollElement.scrollTop = heightDiff;
          }, 50);
        }
      } catch {
        setError('메시지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      hasMoreMessages,
      chatRoomUuid,
      lastMessageId,
      lastMessageSentAt,
      setCursor,
      setHasMoreMessages,
      addMessage,
      chatWindowRef,
    ],
  );

  const { loadTriggerRef } = useChatInfiniteScroll({
    loading,
    hasMore: hasMoreMessages,
    onLoadMore: () => fetchMessages(false),
    containerRef: chatWindowRef,
    enabled: enableInfinityScroll && isInitialScrollDone,
  });

  const {
    isConnected,
    connect: connectSocket,
    disconnect: disconnectSocket,
    sendMessage: sendSocketMessage,
    sendImage: sendSocketImage,
    sendReadAck,
  } = useChatConnection({
    memberUuid,
    chatRoomUuid,
    onMessageReceived: (msg: ChatMessageType) => {
      const wasMatched = handleRealMessageReceived(msg);

      if (!wasMatched) {
        addMessage(msg);
      }

      if (msg.senderUuid !== memberUuid || msg.messageType === 'SYSTEM') {
        sendReadAck(msg.sentAt);
      }
    },
    onReadAckReceived: (data: ReadAckData) => {
      updateLastReadTime(new Date(data.lastReadMessageSentAt));
    },
    onError: setError,
    onMessageError: handleStompError,
  });

  // 액션 관련 로직
  const {
    messageInput,
    setMessageInput,
    isSending,
    sendMessage,
    sendImage,
    handleRetryMessage,
    handleDeleteMessage,
  } = useChatActions({
    isConnected,
    createOptimisticMessage,
    addMessage,
    startTimeout,
    handleSendFailure,
    sendSocketMessage,
    sendSocketImage,
    retryMessage,
    deleteMessage,
  });

  const connect = useCallback(() => {
    if (!memberUuid || !chatRoomUuid || !opponentUuid) {
      setError('UUID들을 모두 입력하세요.');
      return;
    }

    clearMessages();
    setError(null);
    connectSocket();
    fetchOpponentCheckPoint();
    fetchMessages(true);
  }, [
    memberUuid,
    chatRoomUuid,
    opponentUuid,
    clearMessages,
    connectSocket,
    fetchOpponentCheckPoint,
    fetchMessages,
  ]);

  const disconnect = useCallback(async () => {
    if (!chatRoomUuid || !memberUuid) {
      setError('roomUuid 또는 memberUuid가 비어 있습니다.');
      return;
    }

    try {
      await exitChatRoom(chatRoomUuid);
      disconnectSocket();
      clearMessages();
      cleanupOptimistic();
      setError(null);
    } catch {
      setError('채팅방 퇴장 중 오류가 발생했습니다.');
    }
  }, [
    chatRoomUuid,
    memberUuid,
    disconnectSocket,
    clearMessages,
    cleanupOptimistic,
  ]);

  const retryFetchMessages = useCallback(() => {
    setError(null);
    fetchMessages(false);
  }, [fetchMessages]);

  useEffect(() => {
    let mounted = true;

    if (initialMessages.length > 0 && mounted) {
      clearMessages();
      initialMessages.forEach((msg) => addMessage(msg, true));

      if (initialNextCursor) {
        setCursor(
          initialNextCursor.lastMessageUuid,
          initialNextCursor.lastMessageSentAt,
        );
      } else {
        setHasMoreMessages(false);
      }
    }

    if (autoConnect && memberUuid && chatRoomUuid && opponentUuid && mounted) {
      connectSocket();
      fetchOpponentCheckPoint();
      if (initialMessages.length === 0) {
        fetchMessages(true);
      }
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      cleanupOptimistic();
    };
  }, [cleanupOptimistic]);

  return {
    messageInput,
    setMessageInput,
    isConnected,
    messages,
    loading,
    error,
    hasMoreMessages,
    lastReadTimeByOpponent,
    isSending,

    connect,
    disconnect,
    sendMessage,
    sendImage,
    sendReadAck,
    isMessageUnread,
    retryFetchMessages,
    handleRetryMessage,
    handleDeleteMessage,

    // Refs
    loadTriggerRef,
  };
};

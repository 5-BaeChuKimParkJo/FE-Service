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

export interface UseChatParams {
  memberUuid: string;
  chatRoomUuid: string;
  opponentUuid: string;
  chatWindowRef: RefObject<HTMLDivElement | null>;
  maxMessages?: number;
  enableInfinityScroll?: boolean;
  initialMessages?: ChatMessageType[];
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
  autoConnect = false,
}: UseChatParams) => {
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    messages,
    hasMoreMessages,
    lastMessageId,
    lastMessageSentAt,
    addMessage: addMessageToState,
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

  // 스크롤을 맨 아래로
  const scrollToBottom = useCallback(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatWindowRef]);

  // 메시지 추가 (스크롤 포함)
  const addMessage = useCallback(
    (message: ChatMessageType, prepend = false) => {
      addMessageToState(message, prepend);

      if (!prepend) {
        // 새로운 메시지가 추가될 때 스크롤을 아래로
        setTimeout(scrollToBottom, 100);
      }
    },
    [addMessageToState, scrollToBottom],
  );

  // 메시지 불러오기
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

        // 스크롤 위치 저장 (새 메시지 로드 시)
        const scrollElement = chatWindowRef.current;
        const prevScrollHeight = scrollElement?.scrollHeight || 0;

        fetchedMessages.forEach((msg: ChatMessageType) =>
          addMessage(msg, true),
        );

        // 스크롤 위치 복원 (개선된 버전)
        if (initial && scrollElement) {
          // 초기 로드 시 맨 아래로
          setTimeout(() => {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }, 50);
        } else if (scrollElement && !initial) {
          // 이전 메시지 로드 시 위치 유지
          setTimeout(() => {
            const newScrollHeight = scrollElement.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;
            scrollElement.scrollTop = heightDiff;
          }, 50);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
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
    enabled: enableInfinityScroll,
  });

  const {
    isConnected,
    connect: connectSocket,
    disconnect: disconnectSocket,
    sendMessage: sendSocketMessage,
    sendImage,
    sendReadAck,
  } = useChatConnection({
    memberUuid,
    chatRoomUuid,
    onMessageReceived: (msg: ChatMessageType) => {
      addMessage(msg);
      if (msg.senderUuid !== memberUuid || msg.messageType === 'SYSTEM') {
        sendReadAck(msg.sentAt);
      }
    },
    onReadAckReceived: (data: ReadAckData) => {
      updateLastReadTime(new Date(data.lastReadMessageSentAt));
    },
    onError: setError,
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
      console.log('퇴장 처리 완료');

      disconnectSocket();
      clearMessages();
      setError(null);
    } catch (error) {
      console.error('Failed to exit chat room:', error);
      setError('채팅방 퇴장 중 오류가 발생했습니다.');
    }
  }, [chatRoomUuid, memberUuid, disconnectSocket, clearMessages]);

  const sendMessage = useCallback(() => {
    const message = messageInput.trim();
    if (!message) return;

    const success = sendSocketMessage(message);
    if (success) {
      setMessageInput('');
    }
  }, [messageInput, sendSocketMessage]);

  const retryFetchMessages = useCallback(() => {
    setError(null);
    fetchMessages(false);
  }, [fetchMessages]);

  useEffect(() => {
    let mounted = true;

    if (initialMessages.length > 0 && mounted) {
      clearMessages();
      initialMessages.forEach((msg) => addMessage(msg, true));

      const lastMsg = initialMessages[0];
      if (lastMsg) {
        setCursor(lastMsg.messageUuid, lastMsg.sentAt);
      }

      setTimeout(() => {
        if (mounted && chatWindowRef.current) {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
      }, 100);
    }

    if (autoConnect && memberUuid && chatRoomUuid && opponentUuid && mounted) {
      connectSocket();
      fetchOpponentCheckPoint();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    messageInput,
    setMessageInput,
    isConnected,
    messages,
    loading,
    error,
    hasMoreMessages,
    lastReadTimeByOpponent,

    connect,
    disconnect,
    sendMessage,
    sendImage,
    sendReadAck,
    isMessageUnread,
    retryFetchMessages,

    // Refs
    loadTriggerRef,
  };
};

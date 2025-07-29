'use client';

import { useCallback, useRef, useState } from 'react';
import type { ChatMessageType } from '@/types/chat';

export interface UseChatActionsParams {
  isConnected: boolean;
  createOptimisticMessage: (
    message: string,
    messageType: 'TEXT' | 'IMAGE',
  ) => ChatMessageType;
  addMessage: (message: ChatMessageType, prepend?: boolean) => void;
  startTimeout: (messageUuid: string, messageType: 'TEXT' | 'IMAGE') => void;
  handleSendFailure: (messageUuid: string) => void;
  sendSocketMessage: (
    message: string,
  ) => Promise<{ success: boolean; error?: string }>;
  sendSocketImage: (
    file: File,
  ) => Promise<{ success: boolean; error?: string }>;
  retryMessage: (messageUuid: string) => ChatMessageType | null;
  deleteMessage: (messageUuid: string) => void;
}

export const useChatActions = ({
  isConnected,
  createOptimisticMessage,
  addMessage,
  startTimeout,
  handleSendFailure,
  sendSocketMessage,
  sendSocketImage,
  retryMessage,
  deleteMessage,
}: UseChatActionsParams) => {
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messageInputBackupRef = useRef<string>('');

  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() || !isConnected || isSending) {
      return;
    }

    const messageText = messageInput.trim();
    setIsSending(true);

    messageInputBackupRef.current = messageText;
    setMessageInput('');

    const optimisticMessage = createOptimisticMessage(messageText, 'TEXT');

    addMessage(optimisticMessage);

    startTimeout(optimisticMessage.messageUuid, 'TEXT');

    try {
      const result = await sendSocketMessage(messageText);

      if (result.success) {
        messageInputBackupRef.current = '';
      } else {
        handleSendFailure(optimisticMessage.messageUuid);
        setMessageInput(messageInputBackupRef.current);
      }
    } catch {
      handleSendFailure(optimisticMessage.messageUuid);
      setMessageInput(messageInputBackupRef.current);
    } finally {
      setIsSending(false);
    }
  }, [
    messageInput,
    isConnected,
    isSending,
    createOptimisticMessage,
    addMessage,
    startTimeout,
    sendSocketMessage,
    handleSendFailure,
  ]);

  const sendImage = useCallback(
    async (file: File) => {
      if (!isConnected || isSending || !file) {
        return;
      }

      setIsSending(true);

      const tempImageUrl = URL.createObjectURL(file);

      const optimisticMessage = createOptimisticMessage(tempImageUrl, 'IMAGE');

      addMessage(optimisticMessage);

      startTimeout(optimisticMessage.messageUuid, 'IMAGE');

      try {
        const result = await sendSocketImage(file);

        if (result.success) {
        } else {
          handleSendFailure(optimisticMessage.messageUuid);
          URL.revokeObjectURL(tempImageUrl);
        }
      } catch {
        handleSendFailure(optimisticMessage.messageUuid);
        URL.revokeObjectURL(tempImageUrl);
      } finally {
        setIsSending(false);
      }
    },
    [
      isConnected,
      isSending,
      createOptimisticMessage,
      addMessage,
      startTimeout,
      sendSocketImage,
      handleSendFailure,
    ],
  );

  const handleRetryMessage = useCallback(
    async (messageUuid: string) => {
      const message = retryMessage(messageUuid);
      if (!message) return;

      if (message.messageType === 'TEXT') {
        try {
          const result = await sendSocketMessage(message.message);
          if (!result.success) {
            handleSendFailure(messageUuid);
          }
        } catch {
          handleSendFailure(messageUuid);
        }
      }
    },
    [retryMessage, sendSocketMessage, handleSendFailure],
  );

  const handleDeleteMessage = useCallback(
    (messageUuid: string) => {
      deleteMessage(messageUuid);
    },
    [deleteMessage],
  );

  return {
    messageInput,
    setMessageInput,
    isSending,
    sendMessage,
    sendImage,
    handleRetryMessage,
    handleDeleteMessage,
  };
};

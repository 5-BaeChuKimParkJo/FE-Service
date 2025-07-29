'use client';

import { useCallback, useRef } from 'react';
import type { ChatMessageType } from '@/types/chat';
import { ErrorResponse } from '@/types/api';

export interface OptimisticMessageConfig {
  textTimeout: number;
  imageTimeout: number;
}

export interface UseOptimisticMessagingParams {
  memberUuid: string;
  onMessageUpdate: (
    messageUuid: string,
    updates: Partial<ChatMessageType>,
  ) => void;
  onMessageAdd: (message: ChatMessageType) => void;
  onMessageRemove: (messageUuid: string) => void;
  config?: Partial<OptimisticMessageConfig>;
}

export const useOptimisticMessaging = ({
  memberUuid,
  onMessageUpdate,
  onMessageAdd,
  onMessageRemove,
  config = {},
}: UseOptimisticMessagingParams) => {
  const defaultConfig: OptimisticMessageConfig = {
    textTimeout: 5000,
    imageTimeout: 10000,
    ...config,
  };

  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const messageQueue = useRef<Map<string, ChatMessageType>>(new Map());

  const startTimeout = useCallback(
    (messageUuid: string, messageType: 'TEXT' | 'IMAGE') => {
      const timeoutDuration =
        messageType === 'TEXT'
          ? defaultConfig.textTimeout
          : defaultConfig.imageTimeout;

      const timeoutId = setTimeout(() => {
        const message = messageQueue.current.get(messageUuid);
        if (
          message &&
          message.messageType === 'IMAGE' &&
          message.message.startsWith('blob:')
        ) {
          URL.revokeObjectURL(message.message);
        }

        onMessageUpdate(messageUuid, {
          sendingStatus: 'failed',
        });

        timeoutRefs.current.delete(messageUuid);
      }, timeoutDuration);

      timeoutRefs.current.set(messageUuid, timeoutId);
    },
    [defaultConfig.textTimeout, defaultConfig.imageTimeout, onMessageUpdate],
  );

  const clearMessageTimeout = useCallback((messageUuid: string) => {
    const timeoutId = timeoutRefs.current.get(messageUuid);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(messageUuid);
    }
  }, []);

  const createOptimisticMessage = useCallback(
    (
      message: string,
      messageType: 'TEXT' | 'IMAGE' = 'TEXT',
    ): ChatMessageType => {
      const messageUuid = `optimistic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const optimisticMessage: ChatMessageType = {
        messageUuid,
        senderNickname: '',
        senderUuid: memberUuid,
        message,
        messageType,
        sentAt: new Date().toISOString(),
        isOptimistic: true,
        sendingStatus: 'sending',
      };

      messageQueue.current.set(messageUuid, optimisticMessage);

      return optimisticMessage;
    },
    [memberUuid],
  );

  const handleSendSuccess = useCallback(
    (messageUuid: string, realMessage?: ChatMessageType) => {
      clearMessageTimeout(messageUuid);

      if (realMessage) {
        onMessageRemove(messageUuid);
        onMessageAdd(realMessage);
      } else {
        onMessageUpdate(messageUuid, {
          sendingStatus: 'sent',
          isOptimistic: false,
        });
      }

      messageQueue.current.delete(messageUuid);
    },
    [clearMessageTimeout, onMessageUpdate, onMessageRemove, onMessageAdd],
  );

  const handleSendFailure = useCallback(
    (messageUuid: string) => {
      clearMessageTimeout(messageUuid);

      const message = messageQueue.current.get(messageUuid);
      if (
        message &&
        message.messageType === 'IMAGE' &&
        message.message.startsWith('blob:')
      ) {
        URL.revokeObjectURL(message.message);
      }

      onMessageUpdate(messageUuid, {
        sendingStatus: 'failed',
      });
    },
    [clearMessageTimeout, onMessageUpdate],
  );

  const retryMessage = useCallback(
    (messageUuid: string) => {
      const message = messageQueue.current.get(messageUuid);
      if (!message) return null;

      onMessageUpdate(messageUuid, {
        sendingStatus: 'sending',
      });

      if (message.messageType === 'TEXT' || message.messageType === 'IMAGE') {
        startTimeout(messageUuid, message.messageType);
      }

      return message;
    },
    [onMessageUpdate, startTimeout],
  );

  const deleteMessage = useCallback(
    (messageUuid: string) => {
      clearMessageTimeout(messageUuid);

      const message = messageQueue.current.get(messageUuid);
      if (
        message &&
        message.messageType === 'IMAGE' &&
        message.message.startsWith('blob:')
      ) {
        URL.revokeObjectURL(message.message);
      }

      messageQueue.current.delete(messageUuid);
      onMessageRemove(messageUuid);
    },
    [clearMessageTimeout, onMessageRemove],
  );

  const handleRealMessageReceived = useCallback(
    (realMessage: ChatMessageType): boolean => {
      if (realMessage.senderUuid !== memberUuid) return false;

      if (realMessage.messageType === 'IMAGE') {
        const realMessageTime = new Date(realMessage.sentAt).getTime();

        for (const [messageUuid, optimisticMessage] of messageQueue.current) {
          if (
            optimisticMessage.messageType === 'IMAGE' &&
            optimisticMessage.sendingStatus === 'sending'
          ) {
            const optimisticTime = new Date(optimisticMessage.sentAt).getTime();
            const timeDiff = Math.abs(realMessageTime - optimisticTime);

            if (timeDiff <= 5000) {
              if (optimisticMessage.message.startsWith('blob:')) {
                URL.revokeObjectURL(optimisticMessage.message);
              }

              handleSendSuccess(messageUuid, realMessage);
              return true;
            }
          }
        }

        return false;
      }

      for (const [messageUuid, optimisticMessage] of messageQueue.current) {
        if (
          optimisticMessage.messageType === 'TEXT' &&
          optimisticMessage.message === realMessage.message &&
          optimisticMessage.sendingStatus === 'sending'
        ) {
          handleSendSuccess(messageUuid, realMessage);
          return true;
        }
      }

      return false;
    },
    [memberUuid, handleSendSuccess],
  );

  const handleStompError = useCallback(
    (errorData: ErrorResponse) => {
      const errorCode = parseInt(errorData.code);
      const messageFailureCodes = [5200, 5201, 5202, 5903];

      if (!messageFailureCodes.includes(errorCode)) {
        return;
      }

      const sendingMessages = Array.from(messageQueue.current.entries())
        .filter(([_, msg]) => msg.sendingStatus === 'sending')
        .sort(
          ([_, a], [__, b]) =>
            new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
        );

      if (sendingMessages.length > 0) {
        const [messageUuid, _] = sendingMessages[0];
        clearMessageTimeout(messageUuid);

        onMessageUpdate(messageUuid, {
          sendingStatus: 'failed',
        });
      }
    },
    [clearMessageTimeout, onMessageUpdate],
  );
  const cleanup = useCallback(() => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current.clear();

    messageQueue.current.forEach((message) => {
      if (
        message.messageType === 'IMAGE' &&
        message.message.startsWith('blob:')
      ) {
        URL.revokeObjectURL(message.message);
      }
    });

    messageQueue.current.clear();
  }, []);

  return {
    createOptimisticMessage,
    startTimeout,
    clearTimeout: clearMessageTimeout,
    handleSendSuccess,
    handleSendFailure,
    handleStompError,
    retryMessage,
    deleteMessage,
    handleRealMessageReceived,
    cleanup,
  };
};

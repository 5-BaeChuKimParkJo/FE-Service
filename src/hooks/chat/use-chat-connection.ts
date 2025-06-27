'use client';

import { useState, useRef, useCallback } from 'react';
import { ChatService, type ChatServiceConfig } from '@/services/chat.service';
import type { ChatMessageType, ReadAckData } from '@/types/chat';

export interface UseChatConnectionParams {
  memberUuid: string;
  chatRoomUuid: string;
  onMessageReceived: (message: ChatMessageType) => void;
  onReadAckReceived: (data: ReadAckData) => void;
  onError: (error: string) => void;
}

export const useChatConnection = ({
  memberUuid,
  chatRoomUuid,
  onMessageReceived,
  onReadAckReceived,
  onError,
}: UseChatConnectionParams) => {
  const [isConnected, setIsConnected] = useState(false);
  const chatServiceRef = useRef<ChatService | null>(null);

  const connect = useCallback(() => {
    const config: ChatServiceConfig = {
      memberUuid,
      chatRoomUuid,
      onMessageReceived,
      onReadAckReceived,
      onError,
      onConnectionStatusChange: setIsConnected,
    };

    chatServiceRef.current = new ChatService(config);
    chatServiceRef.current.connect();
  }, [memberUuid, chatRoomUuid, onMessageReceived, onReadAckReceived, onError]);

  const disconnect = useCallback(() => {
    if (chatServiceRef.current) {
      chatServiceRef.current.disconnect();
      chatServiceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: string) => {
    return chatServiceRef.current?.sendTextMessage(message) ?? false;
  }, []);

  const sendImage = useCallback(async (file: File) => {
    if (chatServiceRef.current) {
      await chatServiceRef.current.sendImageMessage(file);
    }
  }, []);

  const sendReadAck = useCallback((sentAt: string) => {
    if (chatServiceRef.current) {
      chatServiceRef.current.sendReadAck(sentAt);
    }
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendImage,
    sendReadAck,
  };
};

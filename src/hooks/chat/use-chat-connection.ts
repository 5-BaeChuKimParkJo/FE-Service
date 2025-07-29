'use client';

import { useState, useRef, useCallback } from 'react';
import { ChatService, type ChatServiceConfig } from '@/services/chat.service';
import type { ChatMessageType, ReadAckData } from '@/types/chat';
import { ErrorResponse } from '@/types/api';

export interface UseChatConnectionParams {
  memberUuid: string;
  chatRoomUuid: string;
  onMessageReceived: (message: ChatMessageType) => void;
  onReadAckReceived: (data: ReadAckData) => void;
  onError: (error: string) => void;
  onMessageError?: (errorData: ErrorResponse) => void;
}

export const useChatConnection = ({
  memberUuid,
  chatRoomUuid,
  onMessageReceived,
  onReadAckReceived,
  onError,
  onMessageError,
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
      onMessageError,
      onConnectionStatusChange: setIsConnected,
    };

    chatServiceRef.current = new ChatService(config);
    chatServiceRef.current.connect();
  }, [
    memberUuid,
    chatRoomUuid,
    onMessageReceived,
    onReadAckReceived,
    onError,
    onMessageError,
  ]);

  const disconnect = useCallback(() => {
    if (chatServiceRef.current) {
      chatServiceRef.current.disconnect();
      chatServiceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!chatServiceRef.current) {
      return { success: false, error: '채팅 서비스가 초기화되지 않았습니다' };
    }
    return await chatServiceRef.current.sendTextMessage(message);
  }, []);

  const sendImage = useCallback(async (file: File) => {
    if (!chatServiceRef.current) {
      return { success: false, error: '채팅 서비스가 초기화되지 않았습니다' };
    }
    return await chatServiceRef.current.sendImageMessage(file);
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

'use client';

import { useCallback, useReducer } from 'react';
import type { ChatMessageType } from '@/types/chat';

interface MessageState {
  messages: ChatMessageType[];
  hasMoreMessages: boolean;
  lastMessageId: string | null;
  lastMessageSentAt: string | null;
}

type MessageAction =
  | { type: 'ADD_MESSAGE'; message: ChatMessageType; prepend?: boolean }
  | { type: 'SET_MESSAGES'; messages: ChatMessageType[] }
  | { type: 'CLEAR_MESSAGES' }
  | {
      type: 'SET_CURSOR';
      lastMessageId: string | null;
      lastMessageSentAt: string | null;
    }
  | { type: 'SET_HAS_MORE'; hasMore: boolean }
  | {
      type: 'UPDATE_MESSAGE';
      messageUuid: string;
      updates: Partial<ChatMessageType>;
    }
  | { type: 'REMOVE_MESSAGE'; messageUuid: string };

const messageReducer = (
  state: MessageState,
  action: MessageAction,
): MessageState => {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessages = action.prepend
        ? [action.message, ...state.messages]
        : [...state.messages, action.message];
      return { ...state, messages: newMessages };
    }

    case 'SET_MESSAGES':
      return { ...state, messages: action.messages };

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        lastMessageId: null,
        lastMessageSentAt: null,
        hasMoreMessages: true,
      };

    case 'SET_CURSOR':
      return {
        ...state,
        lastMessageId: action.lastMessageId,
        lastMessageSentAt: action.lastMessageSentAt,
      };

    case 'SET_HAS_MORE':
      return { ...state, hasMoreMessages: action.hasMore };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.messageUuid === action.messageUuid
            ? { ...msg, ...action.updates }
            : msg,
        ),
      };

    case 'REMOVE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(
          (msg) => msg.messageUuid !== action.messageUuid,
        ),
      };

    default:
      return state;
  }
};

export const useChatMessages = (_maxMessages = 500) => {
  const [state, dispatch] = useReducer(messageReducer, {
    messages: [],
    hasMoreMessages: true,
    lastMessageId: null,
    lastMessageSentAt: null,
  });

  const addMessage = useCallback(
    (message: ChatMessageType, prepend = false) => {
      dispatch({ type: 'ADD_MESSAGE', message, prepend });
    },
    [],
  );

  const updateMessage = useCallback(
    (messageUuid: string, updates: Partial<ChatMessageType>) => {
      dispatch({ type: 'UPDATE_MESSAGE', messageUuid, updates });
    },
    [],
  );

  const removeMessage = useCallback((messageUuid: string) => {
    dispatch({ type: 'REMOVE_MESSAGE', messageUuid });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const setCursor = useCallback(
    (lastMessageId: string | null, lastMessageSentAt: string | null) => {
      dispatch({ type: 'SET_CURSOR', lastMessageId, lastMessageSentAt });
    },
    [],
  );

  const setHasMoreMessages = useCallback((hasMore: boolean) => {
    dispatch({ type: 'SET_HAS_MORE', hasMore });
  }, []);

  return {
    messages: state.messages,
    hasMoreMessages: state.hasMoreMessages,
    lastMessageId: state.lastMessageId,
    lastMessageSentAt: state.lastMessageSentAt,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    setCursor,
    setHasMoreMessages,
  };
};

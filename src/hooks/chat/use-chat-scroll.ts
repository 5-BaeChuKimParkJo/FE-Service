'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';
import type { ChatMessageType } from '@/types/chat';

export interface UseChatScrollParams {
  chatWindowRef: RefObject<HTMLDivElement | null>;
  messages: ChatMessageType[];
}

export const useChatScroll = ({
  chatWindowRef,
  messages,
}: UseChatScrollParams) => {
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatWindowRef]);

  const addMessage = useCallback(
    (message: ChatMessageType, prepend = false) => {
      if (!prepend) {
        setTimeout(scrollToBottom, 100);
      }
    },
    [scrollToBottom],
  );

  // 초기 스크롤 처리
  useEffect(() => {
    if (messages.length > 0 && !isInitialScrollDone && chatWindowRef.current) {
      const scrollToBottomSafely = () => {
        const element = chatWindowRef.current;
        if (element) {
          element.scrollTop = element.scrollHeight;
          setTimeout(() => {
            if (
              element &&
              element.scrollTop <
                element.scrollHeight - element.clientHeight - 10
            ) {
              element.scrollTop = element.scrollHeight;
            }
          }, 50);
        }
      };

      scrollToBottomSafely();
      setTimeout(scrollToBottomSafely, 100);

      setIsInitialScrollDone(true);
    }
  }, [messages, isInitialScrollDone, chatWindowRef]);

  return {
    isInitialScrollDone,
    scrollToBottom,
    addMessage,
  };
};

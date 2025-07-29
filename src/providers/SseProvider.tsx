'use client';

import { useConnectSSE } from '@/hooks/use-connect-sse';
import { useChatUnreadStore } from '@/stores/use-chat-unread-store';
import { getUnreadChatCount } from '@/actions/chat-service/get-unread-chat-count';
import { useEffect } from 'react';

export const SseProvider = ({ children }: { children: React.ReactNode }) => {
  const { sseMessage } = useConnectSSE();
  const { setUnreadCount, incrementUnreadCount } = useChatUnreadStore();

  useEffect(() => {
    getUnreadChatCount().then((count) => {
      if (typeof count === 'number') {
        setUnreadCount(count);
      }
    });
  }, [setUnreadCount]);

  useEffect(() => {
    if (sseMessage?.type === 'MESSAGE_UPDATE') {
      incrementUnreadCount();
    }
  }, [sseMessage, incrementUnreadCount]);

  return <>{children}</>;
};

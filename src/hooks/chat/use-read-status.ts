'use client';

import { useState, useCallback, useRef } from 'react';
import { getReadCheckPoint } from '@/actions/chat-service';

export const useReadStatus = (
  chatRoomUuid: string,
  opponentUuid: string,
  memberUuid: string,
) => {
  const [lastReadTimeByOpponent, setLastReadTimeByOpponent] = useState<Date>(
    new Date(0),
  );
  const lastReadTimeRef = useRef<Date>(new Date(0));

  const fetchOpponentCheckPoint = useCallback(async () => {
    try {
      const response = await getReadCheckPoint(chatRoomUuid, opponentUuid);
      const parsed = new Date(response.lastReadMessageSentAt);
      const readTime = isNaN(parsed.getTime()) ? new Date(0) : parsed;

      setLastReadTimeByOpponent(readTime);
      lastReadTimeRef.current = readTime;
    } catch (error) {
      console.error('Failed to fetch read checkpoint:', error);
      setLastReadTimeByOpponent(new Date(0));
      lastReadTimeRef.current = new Date(0);
    }
  }, [chatRoomUuid, opponentUuid]);

  const updateLastReadTime = useCallback((readTime: Date) => {
    setLastReadTimeByOpponent(readTime);
    lastReadTimeRef.current = readTime;
  }, []);

  const isMessageUnread = useCallback(
    (sentAt: string, senderUuid: string) => {
      if (senderUuid !== memberUuid) return false;
      const sentDate = new Date(sentAt);
      return sentDate > lastReadTimeByOpponent;
    },
    [memberUuid, lastReadTimeByOpponent],
  );

  return {
    lastReadTimeByOpponent,
    fetchOpponentCheckPoint,
    updateLastReadTime,
    isMessageUnread,
  };
};

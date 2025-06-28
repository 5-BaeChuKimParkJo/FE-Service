'use client';

import { useMemo } from 'react';
import type { ChatMessageType } from '@/types/chat';
import type { MemberSummary } from '@/types/member';

export interface OptimizedMessage {
  msg: ChatMessageType;
  index: number;
  isFromMe: boolean;
  isUnread: boolean;
  profileVisible: boolean;
  profileUrl: string;
  senderName: string;
  showTime: boolean;
  showDateDivider: boolean;
  curDate: Date;
}

export const useOptimizedMessages = (
  messages: ChatMessageType[],
  memberUuid: string,
  isMessageUnread: (sentAt: string, senderUuid: string) => boolean,
  opponentInfo?: MemberSummary,
): OptimizedMessage[] => {
  return useMemo(() => {
    return messages.map((msg, index) => {
      const isFromMe = msg.senderUuid === memberUuid;
      const isUnread = isMessageUnread(msg.sentAt, msg.senderUuid);

      let profileVisible = false;
      if (!isFromMe) {
        if (index === 0 || messages[index - 1].senderUuid !== msg.senderUuid) {
          profileVisible = true;
        }
      }

      const profileUrl = isFromMe
        ? '/placeholder.svg?height=32&width=32' // 내 프로필은 기본 이미지
        : opponentInfo?.profileImageUrl ||
          '/placeholder.svg?height=32&width=32';
      const senderName = isFromMe
        ? '나' // 내 메시지는 '나'로 표시
        : opponentInfo?.nickname || '상대방';

      // 시간 표시 여부
      const nextMsg = messages[index + 1];
      let showTime = false;
      if (!nextMsg) {
        showTime = true;
      } else {
        const curDate = new Date(msg.sentAt);
        const nextDate = new Date(nextMsg.sentAt);
        showTime =
          msg.senderUuid !== nextMsg.senderUuid ||
          curDate.getHours() !== nextDate.getHours() ||
          curDate.getMinutes() !== nextDate.getMinutes();
      }

      // 날짜 라벨 표시 여부
      let showDateDivider = false;
      const curDate = new Date(msg.sentAt);
      if (index === 0) {
        showDateDivider = true;
      } else {
        const prevDate = new Date(messages[index - 1].sentAt);
        showDateDivider =
          curDate.getFullYear() !== prevDate.getFullYear() ||
          curDate.getMonth() !== prevDate.getMonth() ||
          curDate.getDate() !== prevDate.getDate();
      }

      return {
        msg,
        index,
        isFromMe,
        isUnread,
        profileVisible,
        profileUrl,
        senderName,
        showTime,
        showDateDivider,
        curDate,
      };
    });
  }, [messages, memberUuid, isMessageUnread, opponentInfo]);
};

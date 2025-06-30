import type { MemberSummary } from '../member';

export type ReplyPreview = {
  senderUuid: string;
  senderNickname: string;
  message: string;
  messageType: 'TEXT' | 'IMAGE';
};

export interface ChatImage {
  imageUrl: string;
  thumbnailUrl: string;
}

export interface ReadAckData {
  chatRoomUuid: string;
  lastReadMessageSentAt: string;
}

export interface ChatRoomSummary {
  chatRoomUuid: string;
  opponentUuid: string;
  lastMessage: string;
  messageType: 'TEXT' | 'IMAGE' | 'SYSTEM';
  lastMessageSentAt: string;
  unreadCount: number;
}

export interface ChatMessageType {
  messageUuid: string;
  senderNickname: string;
  senderUuid: string;
  message: string;
  messageType: 'TEXT' | 'IMAGE' | 'SYSTEM';
  sentAt: string;
  replyToMessageUuid?: string;
}

export interface ChatMessageResponseType {
  nextCursor: {
    lastMessageUuid: string;
    lastMessageSentAt: string;
  } | null;
  items: ChatMessageType[];
}

export interface ChatRoomMember {
  memberUuid: string;
  role: 'SELLER' | 'BUYER';
}

export interface ChatroomInfoResponse {
  chatRoomUuid: string;
  postUuid: string;
  chatRoomType: string;
  members: ChatRoomMember[];
}

export type NextCursorType = {
  lastMessageUuid: string;
  lastMessageSentAt: string;
};

export interface ChatConnectResponse {
  type: 'ENTER' | 'EXIT';
  chatRoomUuid: string;
  lastMessage: string;
  messageType: 'TEXT' | 'IMAGE' | 'SYSTEM';
  lastMessageSentAt: string;
  unreadCount: number;
  opponentMemberInfo: MemberSummary;
}

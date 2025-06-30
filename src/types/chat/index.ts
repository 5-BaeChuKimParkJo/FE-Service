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

export interface ChatroomInfoResponse {
  chatRoomUuid: string;
  productInfo: {
    productUuid: string;
    thumbnail: string;
    title: string;
    price: number;
    status: 'SELLING' | 'RESERVED' | 'SOLD';
  };
  members: {
    memberUuid: string;
    nickname: string;
    profileImageUrl: string;
    lastReadMessageSentAt: string;
  }[];
}

export type NextCursorType = {
  lastMessageUuid: string;
  lastMessageSentAt: string;
};

export type ChatRoomMember = {
  memberUuid: string;
  role: 'SELLER' | 'BUYER';
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

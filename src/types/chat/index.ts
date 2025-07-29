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
  postUuid?: string; // 상품 UUID 추가
}

export interface ChatMessageType {
  messageUuid: string;
  senderNickname: string;
  senderUuid: string;
  message: string;
  messageType: 'TEXT' | 'IMAGE' | 'SYSTEM';
  sentAt: string;
  replyToMessageUuid?: string;

  isOptimistic?: boolean;
  sendingStatus?: 'sending' | 'sent' | 'failed';
  serverErrorType?:
    | 'server_overload'
    | 'network_issue'
    | 'database_error'
    | 'message_format_error'
    | 'unknown_error';
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
  chatRoomType: 'NORMAL_PRIVATE' | 'AUCTION_PRIVATE';
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

export interface ChatRoomThumbnail {
  type: 'auction';
  id: string;
  thumbnailUrl: string;
}

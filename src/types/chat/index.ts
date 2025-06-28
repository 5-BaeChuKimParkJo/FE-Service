export type ReplyPreview = {
  senderUuid: string;
  message: string;
  messageType: 'TEXT' | 'IMAGE';
};

export interface ChatRoomSummary {
  chatRoomUuid: string;
  opponentUuid: string;
  lastMessage: string;
  messageType: 'TEXT' | 'IMAGE';
  lastMessageSentAt: string;
  unreadCount: number;
}

export type NextCursorType = {
  lastMessageUuid: string;
  lastMessageSentAt: string;
};

export type ChatroomInfoResponse = {
  chatRoomUuid: string;
  postUuid: string;
  chatRoomType: string;
  members: ChatRoomMember[];
};
export type ChatRoomMember = {
  memberUuid: string;
  role: 'SELLER' | 'BUYER';
};

export interface ChatMessageResponseType {
  items: ChatMessageType[];
  nextCursor: NextCursor;
}
export interface ChatMessageType {
  messageUuid: string;
  chatRoomUuid: string;
  senderUuid: string;
  message: string;
  messageType: 'TEXT' | 'IMAGE';
  sentAt: string;
  replyToMessageUuid?: string; // 선택적
  replyPreview?: ReplyPreview; // 선택적
}
export type NextCursor = {
  lastMessageUuid: string;
  lastMessageSentAt: string;
};

export interface ReadAckData {
  lastReadMessageSentAt: string;
}

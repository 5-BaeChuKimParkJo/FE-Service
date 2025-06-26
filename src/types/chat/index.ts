export interface ChatMessage {
  messageUuid: string;
  chatRoomUuid: string;
  senderUuid: string;
  message: string;
  messageType: 'TEXT' | 'IMAGE';
  sentAt: string;
  replyToMessageUuid?: string;
  replyPreview?: ReplyPreview;
}

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

export type GetChatHistoryResponse = {
  items: ChatMessage[];
  nextCursor: NextCursorType;
};

export type NextCursorType = {
  lastMessageUuid: string;
  lastMessageSentAt: string;
};

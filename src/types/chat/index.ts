export interface ChatMessage {
  messageId?: string;
  senderUuid: string;
  message: string;
  sentAt: string;
  messageType: 'TEXT' | 'IMAGE';
}

export interface ChatRoomSummary {
  chatRoomUuid: string;
  opponentUuid: string;
  lastMessage: string;
  messageType: 'TEXT' | 'IMAGE';
  lastMessageSentAt: string;
  unreadCount: number;
}

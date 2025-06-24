export interface ChatMessage {
  messageId?: string;
  senderUuid: string;
  message: string;
  sentAt: string;
  messageType: 'TEXT' | 'IMAGE';
}

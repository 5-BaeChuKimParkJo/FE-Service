export interface ChatMessageResponse {
  items: ChatMessage[];
  nextCursor: NextCursor;
}

export type NextCursor = {
  lastMessageUuid: string;
  lastMessageSentAt: string;
};

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

export interface ReplyPreview {
  senderUuid: string;
  message: string;
  messageType: string;
}

export interface ReadAckData {
  lastReadMessageSentAt: string;
}

export interface ErrorMessage {
  code: string;
  message: string;
}

export interface PreSignedUrlResponse {
  url: string;
  fields: Record<string, string>;
}

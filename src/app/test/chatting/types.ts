export interface ReplyPreview {
  senderUuid: string;
  message: string;
  messageType: string;
}

export interface ErrorMessage {
  code: string;
  message: string;
}

export interface PreSignedUrlResponse {
  url: string;
  fields: Record<string, string>;
}

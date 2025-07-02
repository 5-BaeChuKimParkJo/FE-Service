import { Client } from '@stomp/stompjs';
import { getChatPresignedUrl } from '@/actions/chat-service';
import { ChatMessageType, ReadAckData } from '@/types/chat';

export interface ChatServiceConfig {
  memberUuid: string;
  chatRoomUuid: string;
  onMessageReceived: (message: ChatMessageType) => void;
  onReadAckReceived: (data: ReadAckData) => void;
  onError: (error: string) => void;
  onConnectionStatusChange: (connected: boolean) => void;
}

export class ChatService {
  private stompClient: Client | null = null;
  private subscription: { unsubscribe: () => void } | null = null;
  private config: ChatServiceConfig;

  constructor(config: ChatServiceConfig) {
    this.config = config;
  }

  connect(): void {
    const { memberUuid, chatRoomUuid } = this.config;

    this.stompClient = new Client({
      brokerURL: `wss://api.cabbage-secondhand.shop/chat-service/ws/chat?memberUuid=${memberUuid}&chatRoomUuid=${chatRoomUuid}`,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    console.log('채팅방 입장 성공', memberUuid, chatRoomUuid);

    this.stompClient.onConnect = () => {
      this.config.onConnectionStatusChange(true);

      if (!this.stompClient) return;

      this.subscription = this.stompClient.subscribe(
        `/topic/chatroom/${chatRoomUuid}`,
        (message) => {
          const msg = JSON.parse(message.body);
          this.config.onMessageReceived(msg);
        },
      );

      this.stompClient.subscribe('/user/queue/chatroom/read', (message) => {
        const data = JSON.parse(message.body);
        this.config.onReadAckReceived(data);
      });

      this.stompClient.subscribe('/user/queue/errors', (message) => {
        const errorData = JSON.parse(message.body);
        this.config.onError(`에러 (${errorData.code}): ${errorData.message}`);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error', frame);
      this.config.onError(
        '채팅방 입장 실패: 유저 UUID 또는 채팅방 UUID가 잘못되었습니다.',
      );
      this.config.onConnectionStatusChange(false);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.stompClient?.active) {
      this.stompClient.deactivate();
    }

    this.stompClient = null;
    this.config.onConnectionStatusChange(false);
  }

  sendTextMessage(message: string): boolean {
    if (!message.trim() || !this.stompClient?.connected) return false;

    this.stompClient.publish({
      destination: '/pub/chat/send',
      body: JSON.stringify({
        chatRoomUuid: this.config.chatRoomUuid,
        senderUuid: this.config.memberUuid,
        message,
        messageType: 'TEXT',
      }),
    });

    return true;
  }

  async sendImageMessage(file: File): Promise<boolean> {
    if (!file || !this.stompClient?.connected) return false;

    try {
      const contentType = file.type;
      const response = await getChatPresignedUrl(contentType);
      const { url, fields } = response;

      const formData = new FormData();
      for (const key in fields) {
        formData.append(key, fields[key]);
      }
      formData.append('file', file);

      await fetch(url, {
        method: 'POST',
        body: formData,
      });

      this.stompClient.publish({
        destination: '/pub/chat/send',
        body: JSON.stringify({
          chatRoomUuid: this.config.chatRoomUuid,
          senderUuid: this.config.memberUuid,
          message: fields.key,
          messageType: 'IMAGE',
        }),
      });

      return true;
    } catch (error) {
      console.error('이미지 업로드 실패', error);
      this.config.onError('이미지 업로드에 실패했습니다.');
      return false;
    }
  }

  sendReadAck(sentAt: string): void {
    if (!this.stompClient?.connected) {
      console.warn('STOMP 연결이 없어서 읽음 확인을 보낼 수 없습니다.');
      return;
    }

    this.stompClient.publish({
      destination: '/pub/chat/read',
      body: JSON.stringify({
        chatRoomUuid: this.config.chatRoomUuid,
        memberUuid: this.config.memberUuid,
        lastReadMessageSentAt: sentAt,
      }),
    });
    console.log(
      'sendReadAck',
      this.config.chatRoomUuid,
      this.config.memberUuid,
      sentAt,
    );
  }

  isConnected(): boolean {
    return this.stompClient?.connected ?? false;
  }

  updateConfig(config: ChatServiceConfig): void {
    this.config = config;
  }
}

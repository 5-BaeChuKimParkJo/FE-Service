'use client';

import { useState, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import type {
  ChatMessage as ChatMessageType,
  ReadAckData,
  ErrorMessage,
  PreSignedUrlResponse,
} from './types';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';

export default function TestChatRoom() {
  // 상태 관리
  const [memberUuid, setMemberUuid] = useState('test-seller-uuid');
  const [chatRoomUuid, setChatRoomUuid] = useState(
    '37950a2c-ca44-403f-a237-ce0c791b5d73',
  );
  const [opponentUuid, setOpponentUuid] = useState('test-buyer-uuid');
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);

  // Refs
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const lastMessageSentAtRef = useRef<string | null>(null);
  const lastReadTimeByOpponentRef = useRef<Date>(new Date(0));
  const messageElementsRef = useRef<Record<string, boolean>>({});

  // 스크롤을 맨 아래로
  const scrollToBottom = useCallback(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, []);

  // 메시지 추가
  const addMessage = useCallback(
    (
      senderUuid: string,
      message: string,
      sentAt: string,
      prepend = false,
      messageType: 'TEXT' | 'IMAGE' = 'TEXT',
    ) => {
      const newMessage: ChatMessageType = {
        messageUuid: '',
        chatRoomUuid: '',
        senderUuid,
        message,
        sentAt,
        messageType,
      };

      setMessages((prev) => {
        if (prepend) {
          return [newMessage, ...prev];
        } else {
          return [...prev, newMessage];
        }
      });

      messageElementsRef.current[sentAt] = senderUuid === memberUuid;

      if (!prepend) {
        setTimeout(scrollToBottom, 100);
      }
    },
    [memberUuid, scrollToBottom],
  );

  // 읽음 확인 전송
  const sendReadAck = useCallback(
    (sentAt: string) => {
      if (stompClientRef.current?.active) {
        stompClientRef.current.publish({
          destination: '/pub/chat/read',
          body: JSON.stringify({
            chatRoomUuid,
            memberUuid,
            lastReadMessageSentAt: sentAt,
          }),
        });
      }
    },
    [chatRoomUuid, memberUuid],
  );

  // 상대방 마지막 읽은 시간 가져오기
  const fetchOpponentCheckPoint = useCallback(async () => {
    try {
      const url = `https://api.cabbage-secondhand.shop/chat-service/api/v1/chat/messages/read-check-point?chatRoomUuid=${chatRoomUuid}&memberUuid=${opponentUuid}`;
      const response = await fetch(url);
      const data = await response.json();
      const timeStr = data.lastReadMessageSentAt;
      const parsed = new Date(timeStr);
      lastReadTimeByOpponentRef.current = isNaN(parsed.getTime())
        ? new Date(0)
        : parsed;
    } catch (error) {
      console.log(error);
      lastReadTimeByOpponentRef.current = new Date(0);
    }
  }, [chatRoomUuid, opponentUuid]);

  // 메시지 불러오기
  const fetchMessages = useCallback(
    async (initial = false) => {
      if (loading) return;
      setLoading(true);

      try {
        let url = `https://api.cabbage-secondhand.shop/chat-service/api/v1/chat/messages/history?chatRoomUuid=${chatRoomUuid}&limit=20`;
        if (lastMessageIdRef.current !== null) {
          url += `&lastMessageUuid=${lastMessageIdRef.current}&lastMessageSentAt=${lastMessageSentAtRef.current}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Member-Uuid': memberUuid,
          },
        });

        const fetched = await response.json();
        lastMessageIdRef.current = fetched.nextCursor.lastMessageUuid;
        lastMessageSentAtRef.current = fetched.nextCursor.lastMessageSentAt;
        const fetchedMessages: ChatMessageType[] = Array.isArray(fetched)
          ? fetched
          : fetched.items || [];

        if (fetchedMessages.length === 0) return;

        // 스크롤 위치 저장 (새 메시지 로드 시)
        const scrollElement = chatWindowRef.current;
        const prevScrollHeight = scrollElement?.scrollHeight || 0;
        const prevScrollTop = scrollElement?.scrollTop || 0;

        fetchedMessages.forEach((msg) => {
          const type = (msg.messageType || 'TEXT') as 'TEXT' | 'IMAGE';
          addMessage(msg.senderUuid, msg.message, msg.sentAt, true, type);
        });

        // 스크롤 위치 복원 (이전 메시지 로드 시)
        if (initial && scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        } else if (scrollElement) {
          requestAnimationFrame(() => {
            const newScrollHeight = scrollElement.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;
            scrollElement.scrollTop = prevScrollTop + heightDiff;
          });
        }
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      chatRoomUuid,
      memberUuid,
      addMessage,
      scrollToBottom,
      sendReadAck,
    ],
  );

  // 연결 초기화
  const initConnection = useCallback(() => {
    const stompClient = new Client({
      brokerURL: `ws://api.cabbage-secondhand.shop/chat-service/ws/chat?memberUuid=${memberUuid}&chatRoomUuid=${chatRoomUuid}`,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    stompClientRef.current = stompClient;

    stompClient.onConnect = () => {
      setIsConnected(true);
      //alert('채팅방 입장 성공');

      // 채팅 메시지 구독
      subscriptionRef.current = stompClient.subscribe(
        `/topic/chatroom/${chatRoomUuid}`,
        (message) => {
          const msg: ChatMessageType = JSON.parse(message.body);
          const type = (msg.messageType || 'TEXT').toUpperCase() as
            | 'TEXT'
            | 'IMAGE';
          addMessage(msg.senderUuid, msg.message, msg.sentAt, false, type);
          if (msg.senderUuid !== memberUuid) {
            sendReadAck(msg.sentAt);
          }
        },
      );

      // 읽음 확인 구독
      stompClient.subscribe('/user/queue/chatroom/read', (message) => {
        const data: ReadAckData = JSON.parse(message.body);
        lastReadTimeByOpponentRef.current = new Date(
          data.lastReadMessageSentAt,
        );
      });

      // 에러 구독
      stompClient.subscribe('/user/queue/errors', (message) => {
        const error: ErrorMessage = JSON.parse(message.body);
        alert(`에러 (${error.code}): ${error.message}`);
      });

      fetchOpponentCheckPoint();
      fetchMessages(true);
    };

    stompClient.onStompError = (frame) => {
      console.error('STOMP error', frame);
      alert('채팅방 입장 실패: 유저 UUID 또는 채팅방 UUID가 잘못되었습니다.');
      setIsConnected(false);
    };

    stompClient.activate();
  }, [
    memberUuid,
    chatRoomUuid,
    addMessage,
    sendReadAck,
    fetchOpponentCheckPoint,
    fetchMessages,
  ]);

  // 채팅방 입장
  const connect = useCallback(() => {
    if (!memberUuid || !chatRoomUuid || !opponentUuid) {
      alert('UUID들을 모두 입력하세요.');
      return;
    }

    setMessages([]);
    lastMessageIdRef.current = null;

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    if (stompClientRef.current?.connected) {
      stompClientRef.current.deactivate();
      initConnection();
    } else {
      initConnection();
    }
  }, [memberUuid, chatRoomUuid, opponentUuid, initConnection]);

  // 채팅방 나가기
  const disconnect = useCallback(async () => {
    if (!chatRoomUuid || !memberUuid) {
      alert('roomUuid 또는 memberUuid가 비어 있습니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.cabbage-secondhand.shop/chat-service/api/v1/chatroom/exit/${chatRoomUuid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Member-Uuid': memberUuid,
          },
        },
      );

      if (!response.ok) {
        throw new Error('퇴장 요청 실패');
      }

      console.log('퇴장 처리 완료');

      // WebSocket 연결 정리
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      // 상태 초기화
      setMessages([]);
      setIsConnected(false);
      stompClientRef.current = null;
      lastMessageIdRef.current = null;
      lastReadTimeByOpponentRef.current = new Date(0);
      setLoading(false);
      messageElementsRef.current = {};

      alert('채팅방을 나갔습니다.');
    } catch (error) {
      console.error('퇴장 실패:', error);
      alert('채팅방 퇴장 중 오류가 발생했습니다.');
    }
  }, [chatRoomUuid, memberUuid]);

  // 텍스트 메시지 전송
  const sendMessage = useCallback(() => {
    const message = messageInput.trim();
    if (!message || !stompClientRef.current?.connected) return;

    stompClientRef.current.publish({
      destination: '/pub/chat/send',
      body: JSON.stringify({
        chatRoomUuid,
        senderUuid: memberUuid,
        message,
        messageType: 'TEXT',
      }),
    });

    setMessageInput('');
  }, [messageInput, chatRoomUuid, memberUuid]);

  // 이미지 전송
  const sendImage = useCallback(
    async (file: File) => {
      if (!file || !stompClientRef.current?.connected) return;

      try {
        const contentType = file.type;

        // Pre-signed URL 가져오기
        const response = await fetch(
          `https://api.cabbage-secondhand.shop/chat-service/api/v1/pre-signed-url?contentType=${encodeURIComponent(
            contentType,
          )}`,
          {
            method: 'GET',
            headers: {
              'X-Member-UUid': memberUuid,
            },
          },
        );

        const { url, fields }: PreSignedUrlResponse = await response.json();

        // 파일 업로드
        const formData = new FormData();
        for (const key in fields) {
          formData.append(key, fields[key]);
        }
        formData.append('file', file);

        await fetch(url, {
          method: 'POST',
          body: formData,
        });

        // 이미지 메시지 전송
        stompClientRef.current.publish({
          destination: '/pub/chat/send',
          body: JSON.stringify({
            chatRoomUuid,
            senderUuid: memberUuid,
            message: fields.key,
            messageType: 'IMAGE',
          }),
        });
      } catch (error) {
        console.error('이미지 업로드 실패', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    },
    [chatRoomUuid, memberUuid],
  );

  // 스크롤 처리 (더 많은 메시지 로드)
  const handleScroll = useCallback(() => {
    if (
      chatWindowRef.current &&
      chatWindowRef.current.scrollTop <= 10 &&
      !loading
    ) {
      fetchMessages(false);
    }
  }, [loading, fetchMessages]);

  // 읽지 않은 메시지 확인
  const isMessageUnread = useCallback(
    (sentAt: string, senderUuid: string) => {
      if (senderUuid !== memberUuid) return false;
      const sentDate = new Date(sentAt);
      return sentDate > lastReadTimeByOpponentRef.current;
    },
    [memberUuid],
  );

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>채팅 테스트</h1>

      {/* 설정 영역 */}
      <div className='bg-white border rounded-lg p-6 mb-4 shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              유저 UUID
            </label>
            <input
              type='text'
              value={memberUuid}
              onChange={(e) => setMemberUuid(e.target.value)}
              disabled={isConnected}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              채팅방 UUID
            </label>
            <input
              type='text'
              value={chatRoomUuid}
              onChange={(e) => setChatRoomUuid(e.target.value)}
              disabled={isConnected}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              상대방 UUID
            </label>
            <input
              type='text'
              value={opponentUuid}
              onChange={(e) => setOpponentUuid(e.target.value)}
              disabled={isConnected}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
            />
          </div>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={connect}
            disabled={isConnected}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            채팅방 입장
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            채팅방 나가기
          </button>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className='bg-white border rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)]'>
        {/* 채팅 창 */}
        <div
          ref={chatWindowRef}
          onScroll={handleScroll}
          className='flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4'
        >
          {loading && (
            <div className='text-center text-gray-500 text-sm'>
              메시지를 불러오는 중...
            </div>
          )}
          {messages.map((msg, index) => {
            const isFromMe = msg.senderUuid === memberUuid;
            const isUnread = isMessageUnread(msg.sentAt, msg.senderUuid);
            let profileVisible = false;
            if (!isFromMe) {
              if (
                index === 0 ||
                messages[index - 1].senderUuid !== msg.senderUuid
              ) {
                profileVisible = true;
              }
            }
            const profileUrl =
              msg.senderUuid === 'test-buyer-uuid'
                ? '/images/dummy/airpods.png'
                : '/images/dummy/airpods.png';
            const senderName =
              msg.senderUuid === 'test-buyer-uuid' ? '구매자' : '판매자';

            // 시간 표시 여부: 다음 메시지가 없거나, 다음 메시지의 보낸 사람이 다르거나, 분이 다르면 표시
            const nextMsg = messages[index + 1];
            let showTime = false;
            if (!nextMsg) {
              showTime = true;
            } else {
              const curDate = new Date(msg.sentAt);
              const nextDate = new Date(nextMsg.sentAt);
              showTime =
                msg.senderUuid !== nextMsg.senderUuid ||
                curDate.getHours() !== nextDate.getHours() ||
                curDate.getMinutes() !== nextDate.getMinutes();
            }

            return (
              <ChatMessage
                key={`${msg.sentAt}-${index}`}
                message={msg}
                isFromMe={isFromMe}
                isUnread={isUnread}
                profileVisible={profileVisible}
                profileUrl={profileUrl}
                senderName={senderName}
                showTime={showTime}
              />
            );
          })}
        </div>

        {/* 메시지 입력 영역 */}
        <ChatInput
          message={messageInput}
          onMessageChange={setMessageInput}
          onSendMessage={sendMessage}
          onSendImage={sendImage}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
}

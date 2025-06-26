'use client';

import React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import type { ChatMessageType, ReadAckData } from './types';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';
import { formatChatDateDivider } from '@/utils/date';
import {
  exitChatRoom,
  getChatPresignedUrl,
  getReadCheckPoint,
  getChatHistory,
} from '@/actions/chat-service';

function ChatDateDivider({ date }: { date: Date }) {
  return (
    <div className='flex justify-center my-4 select-none'>
      <div className='bg-primary-100/15 text-primary-100 text-sm px-4 py-1 rounded-full'>
        <span className='inline-flex items-center gap-1'>
          {formatChatDateDivider(date)}
        </span>
      </div>
    </div>
  );
}

// 로딩 스피너 컴포넌트
function LoadingSpinner() {
  return (
    <div className='flex justify-center py-4'>
      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
    </div>
  );
}

export default function TestChatRoom() {
  // 상태 관리
  const [memberUuid, setMemberUuid] = useState(
    'f47efbd1-b1b4-4cb5-93ad-c023c689587e',
  );
  const [chatRoomUuid, setChatRoomUuid] = useState(
    '76789c53-b38d-4681-a562-03490f154295',
  );
  const [opponentUuid, setOpponentUuid] = useState(
    'ff10d154-9f8a-47b5-a884-45be3568a66d',
  );
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [lastReadTimeByOpponent, setLastReadTimeByOpponent] = useState<Date>(
    new Date(0),
  );

  // Refs
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const lastMessageSentAtRef = useRef<string | null>(null);
  const lastReadTimeByOpponentRef = useRef<Date>(new Date(0));
  const messageElementsRef = useRef<Record<string, boolean>>({});
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 메시지 최대 개수 제한 (메모리 최적화)
  const MAX_MESSAGES = 500;

  // 스크롤을 맨 아래로
  const scrollToBottom = useCallback(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, []);

  // 메시지 추가 (메모리 최적화 포함)
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
        let newMessages;
        if (prepend) {
          newMessages = [newMessage, ...prev];
        } else {
          newMessages = [...prev, newMessage];
        }

        // 메시지 개수 제한 (메모리 최적화)
        if (newMessages.length > MAX_MESSAGES) {
          if (prepend) {
            newMessages = newMessages.slice(0, MAX_MESSAGES);
          } else {
            newMessages = newMessages.slice(-MAX_MESSAGES);
          }
        }

        return newMessages;
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
        console.log('sendReadAck', chatRoomUuid, memberUuid, sentAt);
      }
    },
    [chatRoomUuid, memberUuid],
  );

  // 상대방 마지막 읽은 시간 가져오기
  const fetchOpponentCheckPoint = useCallback(async () => {
    try {
      const response = await getReadCheckPoint(chatRoomUuid, opponentUuid);

      const parsed = new Date(response.lastReadMessageSentAt);
      setLastReadTimeByOpponent(isNaN(parsed.getTime()) ? new Date(0) : parsed);
      lastReadTimeByOpponentRef.current = isNaN(parsed.getTime())
        ? new Date(0)
        : parsed;
    } catch (error) {
      console.log(error);
      setLastReadTimeByOpponent(new Date(0));
      lastReadTimeByOpponentRef.current = new Date(0);
    }
  }, [chatRoomUuid, opponentUuid]);

  // 메시지 불러오기 (개선된 버전)
  const fetchMessages = useCallback(
    async (initial = false) => {
      if (loading || !hasMoreMessages) return;

      setLoading(true);
      setError(null);

      try {
        const lastMessageUuid = lastMessageIdRef.current;
        const lastMessageSentAt = lastMessageSentAtRef.current;
        const res = await getChatHistory(
          chatRoomUuid,
          lastMessageUuid ?? undefined,
          lastMessageSentAt ?? undefined,
        );
        lastMessageIdRef.current = res.nextCursor?.lastMessageUuid ?? null;
        lastMessageSentAtRef.current =
          res.nextCursor?.lastMessageSentAt ?? null;
        if (!res.nextCursor) {
          setHasMoreMessages(false);
          return;
        }
        const fetchedMessages: ChatMessageType[] = Array.isArray(res)
          ? res
          : res.items || [];

        if (fetchedMessages.length === 0) {
          setHasMoreMessages(false);
          return;
        }

        // 스크롤 위치 저장 (새 메시지 로드 시)
        const scrollElement = chatWindowRef.current;
        const prevScrollHeight = scrollElement?.scrollHeight || 0;

        fetchedMessages.forEach((msg) => {
          const type = (msg.messageType || 'TEXT') as 'TEXT' | 'IMAGE';
          addMessage(msg.senderUuid, msg.message, msg.sentAt, true, type);
        });

        // 스크롤 위치 복원 (개선된 버전)
        if (initial && scrollElement) {
          // 초기 로드 시 맨 아래로
          setTimeout(() => {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }, 50);
        } else if (scrollElement && !initial) {
          // 이전 메시지 로드 시 위치 유지
          setTimeout(() => {
            const newScrollHeight = scrollElement.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;
            scrollElement.scrollTop = heightDiff;
          }, 50);
        }
        console.log('fetchMessages');
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
        //setError('메시지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMoreMessages, chatRoomUuid, memberUuid, addMessage],
  );

  useEffect(() => {
    if (!loadTriggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMoreMessages) {
          fetchMessages(false);
        }
      },
      {
        root: chatWindowRef.current,
        rootMargin: '20px',
        threshold: 0.1,
      },
    );

    observerRef.current.observe(loadTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchMessages, loading, hasMoreMessages]);

  // 연결 초기화
  const initConnection = useCallback(() => {
    const stompClient = new Client({
      brokerURL: `ws://api.cabbage-secondhand.shop/chat-service/ws/chat?memberUuid=${memberUuid}&chatRoomUuid=${chatRoomUuid}`,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });
    console.log('채팅방 입장 성공', memberUuid, chatRoomUuid);

    stompClientRef.current = stompClient;

    stompClient.onConnect = () => {
      setIsConnected(true);
      setError(null);

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
        const readTime = new Date(data.lastReadMessageSentAt);
        setLastReadTimeByOpponent(readTime);
        lastReadTimeByOpponentRef.current = readTime;
        console.log('읽음 확인 구독', data.lastReadMessageSentAt);
      });

      // 에러 구독
      stompClient.subscribe('/user/queue/errors', (message) => {
        const errorData = JSON.parse(message.body);
        setError(`에러 (${errorData.code}): ${errorData.message}`);
      });

      fetchOpponentCheckPoint();
      fetchMessages(true);
    };

    stompClient.onStompError = (frame) => {
      console.error('STOMP error', frame);
      setError(
        '채팅방 입장 실패: 유저 UUID 또는 채팅방 UUID가 잘못되었습니다.',
      );
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
      setError('UUID들을 모두 입력하세요.');
      return;
    }

    setMessages([]);
    setError(null);
    setHasMoreMessages(true);
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
      setError('roomUuid 또는 memberUuid가 비어 있습니다.');
      return;
    }

    try {
      await exitChatRoom(chatRoomUuid);

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
      setError(null);
      setHasMoreMessages(true);
      stompClientRef.current = null;
      lastMessageIdRef.current = null;
      setLastReadTimeByOpponent(new Date(0));
      lastReadTimeByOpponentRef.current = new Date(0);
      setLoading(false);
      messageElementsRef.current = {};
    } catch (error) {
      console.error('퇴장 실패:', error);
      setError('채팅방 퇴장 중 오류가 발생했습니다.');
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

        const response = await getChatPresignedUrl(contentType);

        const { url, fields } = response;

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
        setError('이미지 업로드에 실패했습니다.');
      }
    },
    [chatRoomUuid, memberUuid],
  );

  // 읽지 않은 메시지 확인
  const isMessageUnread = useCallback(
    (sentAt: string, senderUuid: string) => {
      if (senderUuid !== memberUuid) return false;
      const sentDate = new Date(sentAt);
      return sentDate > lastReadTimeByOpponent;
    },
    [memberUuid, lastReadTimeByOpponent],
  );

  // 에러 재시도
  const retryFetchMessages = useCallback(() => {
    setError(null);
    fetchMessages(false);
  }, [fetchMessages]);

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>개선된 채팅 테스트</h1>

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

        {/* 연결 상태 표시 */}
        <div className='mt-4 flex items-center gap-2'>
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          ></div>
          <span className='text-sm text-gray-600'>
            {isConnected ? '연결됨' : '연결 안됨'}
          </span>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className='bg-white border rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)]'>
        {/* 채팅 창 */}
        <div
          ref={chatWindowRef}
          className='flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4'
        >
          {/* 무한스크롤 트리거 (상단) */}
          <div ref={loadTriggerRef} className='h-1'></div>

          {/* 로딩 및 에러 표시 */}
          {loading && <LoadingSpinner />}
          {error && (
            <div className='flex flex-col items-center py-4 text-red-500'>
              <p className='text-sm mb-2'>{error}</p>
              <button
                onClick={retryFetchMessages}
                className='text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded'
              >
                다시 시도
              </button>
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
                ? '/placeholder.svg?height=32&width=32'
                : '/placeholder.svg?height=32&width=32';
            const senderName = msg.senderUuid;

            // 시간 표시 여부
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

            // 날짜 라벨 표시 여부
            let showDateDivider = false;
            const curDate = new Date(msg.sentAt);
            if (index === 0) {
              showDateDivider = true;
            } else {
              const prevDate = new Date(messages[index - 1].sentAt);
              showDateDivider =
                curDate.getFullYear() !== prevDate.getFullYear() ||
                curDate.getMonth() !== prevDate.getMonth() ||
                curDate.getDate() !== prevDate.getDate();
            }

            return (
              <React.Fragment key={`${msg.sentAt}-${index}`}>
                {showDateDivider && <ChatDateDivider date={curDate} />}
                <ChatMessage
                  message={msg}
                  isFromMe={isFromMe}
                  isUnread={isUnread}
                  profileVisible={profileVisible}
                  profileUrl={profileUrl}
                  senderName={senderName}
                  showTime={showTime}
                />
              </React.Fragment>
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

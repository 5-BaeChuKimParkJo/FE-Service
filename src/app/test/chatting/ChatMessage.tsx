import React, { useState } from 'react';
import type { ChatMessage as ChatMessageType } from './types';
import Image from 'next/image';
import ProfileImage from './ProfileImage';
import ImageModal from './ImageModal';

interface ChatMessageProps {
  message: ChatMessageType;
  isFromMe: boolean;
  isUnread: boolean;
  profileVisible?: boolean;
  profileUrl?: string;
  senderName?: string;
  showTime?: boolean;
}

export function ChatMessage(props: ChatMessageProps) {
  const {
    message,
    isFromMe,
    isUnread,
    profileVisible = false,
    profileUrl = '',
    senderName = '',
    showTime = true,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const imageUrl = process.env.NEXT_PUBLIC_S3_HOSTNAME + `/${message.message}`;

  // 공통 시간 표시 컴포넌트
  const TimeStamp = () =>
    showTime ? (
      <div className='flex-shrink-0 text-xs text-gray-400 self-end'>
        {isUnread && isFromMe && (
          <div className='text-primary-200 pl-1'>읽지 않음</div>
        )}
        {new Date(message.sentAt).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    ) : (
      <div className='flex-shrink-0 text-xs text-gray-400 self-end'>
        {isUnread && isFromMe && (
          <div className='text-primary-200 pl-1'>읽지 않음</div>
        )}
      </div>
    );

  // 텍스트 메시지 컴포넌트
  const TextMessage = () => (
    <div
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words ${
        isFromMe
          ? 'bg-primary-100 text-white rounded-br-none'
          : 'bg-white rounded-bl-none'
      }`}
    >
      <div className='whitespace-pre-wrap'>{message.message}</div>
    </div>
  );

  // 이미지 메시지 컴포넌트
  const ImageMessage = () => (
    <>
      <div
        className={`max-w-xs lg:max-w-md px-2 py-2 rounded-2xl ${
          isFromMe ? '' : 'bg-white rounded-bl-none'
        }`}
        onClick={() => setModalOpen(true)}
      >
        <Image
          src={imageUrl}
          alt={isFromMe ? '보낸 이미지' : '받은 이미지'}
          width={180}
          height={180}
          className='rounded-lg object-cover max-w-[180px] max-h-[180px]'
        />
      </div>
      <ImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={imageUrl}
      />
    </>
  );

  // 메시지 내용 (텍스트 또는 이미지)
  const MessageContent = () =>
    message.messageType === 'TEXT' ? <TextMessage /> : <ImageMessage />;

  // 내가 보낸 메시지 레이아웃
  if (isFromMe) {
    return (
      <div className='flex flex-col items-end'>
        <div className='flex items-end gap-2 flex-row-reverse'>
          <MessageContent />
          <TimeStamp />
        </div>
      </div>
    );
  }

  // 상대방이 보낸 메시지 레이아웃
  return (
    <div className='flex flex-row items-start gap-2'>
      <div className='w-10 h-10 flex-shrink-0'>
        {profileVisible && (
          <ProfileImage src={profileUrl} alt={senderName} size={40} />
        )}
      </div>
      <div className='flex flex-col items-start'>
        {profileVisible && senderName && (
          <div className='text-xs text-gray-500 mb-1'>{senderName}</div>
        )}
        <div className='flex items-end gap-2 flex-row'>
          <MessageContent />
          <TimeStamp />
        </div>
      </div>
    </div>
  );
}

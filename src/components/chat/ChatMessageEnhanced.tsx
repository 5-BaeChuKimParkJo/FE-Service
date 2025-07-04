'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import type { ChatMessageType } from '@/types/chat';
import ProfileImage from '@/components/chat/ProfileImage';
import ImageModal from '@/components/chat/ImageModal';

interface ChatMessageEnhancedProps {
  message: ChatMessageType;
  isFromMe: boolean;
  isUnread: boolean;
  profileVisible?: boolean;
  profileUrl?: string;
  senderName?: string;
  showTime?: boolean;
  onRetry?: (messageUuid: string) => void;
  onDelete?: (messageUuid: string) => void;
}

export const ChatMessageEnhanced = memo<ChatMessageEnhancedProps>((props) => {
  const {
    message,
    isFromMe,
    isUnread,
    profileVisible = false,
    profileUrl = '',
    senderName = '',
    showTime = true,
    onRetry,
    onDelete,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);

  const imageUrl = message.message.startsWith('http')
    ? message.message
    : `${process.env.NEXT_PUBLIC_S3_HOSTNAME}/${message.message}`;

  const getMessageStatus = () => {
    if (!message.isOptimistic) return 'sent';

    switch (message.sendingStatus) {
      case 'sending':
        return 'sending';
      case 'sent':
        return 'sent';
      case 'failed':
        return 'failed';
      default:
        return 'sent';
    }
  };

  const messageStatus = getMessageStatus();

  const StatusIcon = () => {
    if (messageStatus === 'sending') {
      return <div className='rotate-180 text-primary-200 text-xs'>➣</div>;
    }

    if (messageStatus === 'failed') {
      return (
        <div className='flex items-center gap-1'>
          {message.messageType === 'TEXT' && (
            <button
              onClick={() => onRetry?.(message.messageUuid)}
              className='text-primary-200 text-xs p-1'
              title={getRetryButtonTitle()}
            >
              ↻
            </button>
          )}
          <button
            onClick={() => onDelete?.(message.messageUuid)}
            className='text-red-500 hover:text-red-700 text-xs p-1'
            title='삭제'
          >
            ✕
          </button>
        </div>
      );
    }

    return null;
  };

  const getRetryButtonTitle = () => {
    if (!message.serverErrorType) return '재시도';

    switch (message.serverErrorType) {
      case 'server_overload':
        return '서버 과부하 - 재시도 권장';
      case 'network_issue':
        return '네트워크 오류 - 연결 확인 후 재시도';
      case 'database_error':
        return '일시적 오류 - 잠시 후 재시도';
      case 'message_format_error':
        return '메시지 형식 오류 - 다시 작성하여 전송';
      default:
        return '재시도';
    }
  };

  const getErrorMessage = () => {
    if (
      messageStatus !== 'failed' ||
      !message.serverErrorType ||
      message.messageType === 'IMAGE'
    ) {
      return null;
    }

    const errorMessages = {
      server_overload: '🔥 서버가 혼잡합니다',
      network_issue: '📶 네트워크 연결을 확인해주세요',
      database_error: '💾 일시적 오류가 발생했습니다',
      message_format_error: '📝 메시지를 다시 작성해주세요',
      unknown_error: '❌ 전송에 실패했습니다',
    };

    return (
      <div className='text-xs text-red-600 mt-1 px-2'>
        {errorMessages[message.serverErrorType]}
      </div>
    );
  };

  const TimeStamp = () => (
    <div className='flex flex-col items-end gap-1'>
      <StatusIcon />
      {showTime && messageStatus === 'sent' && (
        <div className='text-xs text-gray-400'>
          {new Date(message.sentAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
      {isUnread && isFromMe && messageStatus === 'sent' && (
        <div className='text-primary-200 text-xs'>읽지 않음</div>
      )}
    </div>
  );

  const TextMessage = () => {
    const baseClasses = `max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words transition-all duration-200`;

    let messageClasses = '';
    if (isFromMe) {
      messageClasses = `${baseClasses} bg-primary-100 text-white rounded-br-none`;

      if (messageStatus === 'sending' || messageStatus === 'failed') {
        messageClasses += ' opacity-60';
      }
    } else {
      messageClasses = `${baseClasses} bg-white rounded-bl-none`;
    }

    return (
      <div className={messageClasses}>
        <div className='whitespace-pre-wrap'>{message.message}</div>
      </div>
    );
  };

  const ImageMessage = () => {
    const baseClasses = `max-w-xs lg:max-w-md px-2 py-2 rounded-2xl transition-all duration-200`;

    let containerClasses = '';
    if (isFromMe) {
      containerClasses = baseClasses;

      if (messageStatus === 'sending' || messageStatus === 'failed') {
        containerClasses += ' opacity-60';
      }
    } else {
      containerClasses = `${baseClasses} bg-white rounded-bl-none`;
    }

    return (
      <>
        <div className={containerClasses}>
          <div onClick={() => setModalOpen(true)} className='cursor-pointer'>
            <Image
              src={message.isOptimistic ? message.message : imageUrl}
              alt={isFromMe ? '보낸 이미지' : '받은 이미지'}
              width={180}
              height={180}
              className='rounded-lg object-cover max-w-[180px] max-h-[180px]'
            />
          </div>
        </div>
        <ImageModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          imageUrl={message.isOptimistic ? message.message : imageUrl}
        />
      </>
    );
  };

  const MessageContent = () =>
    message.messageType === 'TEXT' ? <TextMessage /> : <ImageMessage />;

  if (isFromMe) {
    return (
      <div className='flex flex-col items-end'>
        <div className='flex items-end gap-2 flex-row-reverse'>
          <MessageContent />
          <TimeStamp />
        </div>
        {getErrorMessage()}
      </div>
    );
  }

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
});

ChatMessageEnhanced.displayName = 'ChatMessageEnhanced';

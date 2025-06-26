'use client';
import { ImageUpIcon } from 'lucide-react';
import React, { useRef } from 'react';
import SendIcon from '@/assets/icons/common/send.svg';

interface ChatInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onSendImage: (file: File) => void;
  disabled?: boolean;
}

export function ChatInput({
  message,
  onMessageChange,
  onSendMessage,
  onSendImage,
  disabled = false,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendImage(file);
      e.target.value = '';
    }
  };

  return (
    <footer className='p-2 border-t bg-white'>
      <form
        className='flex gap-2 mb-2'
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
      >
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className='px-2  text-primary-200 rounded-full disabled:cursor-not-allowed'
          aria-label='이미지 업로드'
        >
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleFileChange}
            aria-label='이미지 파일 선택'
          />
          <ImageUpIcon className='w-4 h-4' />
        </button>
        <input
          type='text'
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='메시지 입력'
          disabled={disabled}
          className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
          aria-label='메시지 입력창'
        />
        <button
          type='submit'
          disabled={disabled || !message.trim()}
          className='  text-primary-200    disabled:cursor-not-allowed'
          aria-label='메시지 전송'
        >
          <SendIcon className='w-5 h-5 text-primary-200' />
        </button>
      </form>
    </footer>
  );
}

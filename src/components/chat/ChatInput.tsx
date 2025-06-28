'use client';
import { ImageUpIcon } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24;
      const maxHeight = lineHeight * 4;

      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  const handleSendClick = () => {
    onSendMessage();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendImage(file);
      e.target.value = '';
    }
  };

  return (
    <div className='p-2 border-t bg-white'>
      <form className='flex gap-2 items-end' onSubmit={handleSubmit}>
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className='px-2 text-primary-200 rounded-full disabled:cursor-not-allowed mb-2'
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
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder='메시지 입력'
          disabled={disabled}
          rows={1}
          className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none leading-6 min-h-[2.5rem] max-h-24 overflow-y-auto'
          aria-label='메시지 입력창'
        />
        <button
          type='button'
          onClick={handleSendClick}
          disabled={disabled || !message.trim()}
          className='text-primary-200 disabled:cursor-not-allowed mb-2'
          aria-label='메시지 전송'
        >
          <SendIcon className='w-5 h-5 text-primary-200' />
        </button>
      </form>
    </div>
  );
}

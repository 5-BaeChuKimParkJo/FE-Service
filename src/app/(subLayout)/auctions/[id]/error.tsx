'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Penguin from '@/assets/icons/common/penguin.svg';

interface AuctionErrorProps {
  error: Error & { digest?: string };
}

export default function AuctionError({ error }: AuctionErrorProps) {
  useEffect(() => {
    console.error('Auction Page Error:', error);
  }, [error]);

  const getErrorContent = (error: Error) => {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return {
        title: '경매를 찾을 수 없어요',
        message:
          '요청하신 경매가 존재하지 않거나 삭제되었을 수 있어요.\n다른 경매를 찾아보시는 건 어떨까요?',
        showRetry: false,
      };
    }

    if (
      errorMessage.includes('500') ||
      errorMessage.includes('internal server')
    ) {
      return {
        title: '경매 정보를 불러올 수 없어요',
        message:
          '서버에서 일시적인 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
        showRetry: true,
      };
    }

    if (errorMessage.includes('timeout')) {
      return {
        title: '요청 시간이 초과되었어요',
        message: '네트워크 상태를 확인하고\n다시 시도해주세요.',
        showRetry: true,
      };
    }

    if (errorMessage.includes('network')) {
      return {
        title: '네트워크 연결에 문제가 있어요',
        message: '인터넷 연결을 확인하고\n다시 시도해주세요.',
        showRetry: true,
      };
    }

    return {
      title: '경매 정보를 불러올 수 없어요',
      message: '예상치 못한 문제가 발생했어요.\n잠시 후 다시 시도해주세요.',
      showRetry: true,
    };
  };

  const errorContent = getErrorContent(error);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='flex flex-col items-center justify-center  px-8'>
          <div className='w-36 h-36  rounded-full flex items-center justify-center mb-6'>
            <motion.div
              className='flex justify-center'
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            >
              <Penguin className='w-32 h-32' />
            </motion.div>
          </div>

          <h1 className='text-xl font-semibold text-gray-700 mb-3'>
            {errorContent.title}
          </h1>

          <p className='text-sm text-gray-500 text-center mb-8 whitespace-pre-line leading-relaxed'>
            {errorContent.message}
          </p>
        </div>
      </div>
    </div>
  );
}

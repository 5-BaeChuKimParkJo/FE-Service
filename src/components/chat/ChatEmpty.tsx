'use client';
import Penguin from '@/assets/icons/common/penguin.svg';
import { motion } from 'framer-motion';

interface ChatEmptyProps {
  title?: string;
  description?: string;
}

export function ChatEmpty({
  title = '활성화된 채팅이 없습니다',
  description = '경매 및 상품 거래를 통해 새로운 채팅을 시작해보세요!',
}: ChatEmptyProps) {
  return (
    <div className='flex flex-col items-center justify-center py-50 px-4'>
      <div className='w-30 h-30 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
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
          <Penguin className='w-30 h-30' />
        </motion.div>
      </div>
      <h3 className='text-lg font-semibold text-gray-700 mb-2'>{title}</h3>
      <p className='text-sm text-gray-500 text-center'>{description}</p>
    </div>
  );
}

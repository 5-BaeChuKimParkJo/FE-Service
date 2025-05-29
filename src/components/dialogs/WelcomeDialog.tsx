'use client';

import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Whale from '@/assets/icons/common/whale.svg';

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  userName?: string;
}

export function WelcomeDialog({
  isOpen,
  onClose,
  onGoToLogin,
  userName,
}: WelcomeDialogProps) {
  const handleGoToLogin = () => {
    onClose();
    onGoToLogin();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size='md'
      closeOnBackdropClick={false}
      closeOnEscape={false}
      className='text-center'
    >
      <section className='p-8 py-12' aria-labelledby='welcome-title'>
        {/* 상어 아이콘 with 애니메이션 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className='flex justify-center mb-8'
        >
          <div className='w-24 h-24 flex items-center justify-center bg-blue-50 rounded-full'>
            <Whale className='w-16 h-16 text-blue-500' />
          </div>
        </motion.div>

        {/* 메인 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='mb-6'
        >
          <h1
            id='welcome-title'
            className='text-2xl font-bold text-gray-900 mb-2'
          >
            가입을 축하합니다{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className='inline-block'
            >
              👍
            </motion.span>
          </h1>

          {userName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className='text-gray-600 mb-2'
            >
              <span className='font-medium'>{userName}</span>님
            </motion.p>
          )}
        </motion.div>

        {/* Welcome 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className='mb-8'
        >
          <p className='text-lg text-gray-700 mb-2'>Welcome</p>
          <p className='text-xl font-semibold text-blue-600'>찰낙찰낙</p>
        </motion.div>

        {/* 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            label='로그인페이지로'
            width='full'
            size='xl'
            onClick={handleGoToLogin}
            className='bg-blue-600 hover:bg-blue-700 text-white font-medium'
          />
        </motion.div>

        {/* 추가 안내 메시지 (선택사항) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className='text-sm text-gray-500 mt-4'
        >
          이제 찰낙찰낙과 함께 즐거운 여행을 시작해보세요!
        </motion.p>
      </section>
    </Dialog>
  );
}

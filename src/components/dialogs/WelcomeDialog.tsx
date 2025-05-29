'use client';
import { useState } from 'react';
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGoToLogin = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      onGoToLogin();
    }, 400);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size='md'
      closeOnBackdropClick={false}
      className='text-center'
    >
      <section className='p-8 py-12' aria-labelledby='welcome-title'>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: isTransitioning ? 0.8 : 1,
            rotate: isTransitioning ? 360 : 0,
            opacity: isTransitioning ? 0.5 : 1,
          }}
          transition={{
            delay: isTransitioning ? 0 : 0.2,
            duration: isTransitioning ? 0.4 : 0.6,
            type: isTransitioning ? 'easeInOut' : 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className='flex justify-center mb-8'
        >
          <div className='w-24 h-24 flex items-center justify-center bg-blue-50 rounded-full'>
            <Whale className='w-16 h-16 text-blue-500' />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isTransitioning ? 0 : 1,
            y: isTransitioning ? -20 : 0,
          }}
          transition={{
            delay: isTransitioning ? 0 : 0.4,
            duration: isTransitioning ? 0.3 : 0.5,
          }}
          className='mb-6'
        >
          <h1
            id='welcome-title'
            className='text-2xl font-bold text-gray-900 mb-2'
          >
            가입을 축하합니다{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isTransitioning ? 0 : 1,
                scale: isTransitioning ? 0 : 1,
              }}
              transition={{
                delay: isTransitioning ? 0 : 0.8,
                duration: isTransitioning ? 0.2 : 0.3,
              }}
              className='inline-block'
            >
              👍
            </motion.span>
          </h1>

          {userName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: isTransitioning ? 0 : 1,
              }}
              transition={{
                delay: isTransitioning ? 0 : 0.6,
                duration: isTransitioning ? 0.2 : 0.5,
              }}
              className='text-gray-600 mb-2'
            >
              <span className='font-medium'>{userName}</span>님
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isTransitioning ? 0 : 1,
            y: isTransitioning ? -10 : 0,
          }}
          transition={{
            delay: isTransitioning ? 0 : 0.7,
            duration: isTransitioning ? 0.3 : 0.5,
          }}
          className='mb-8'
        >
          <p className='text-lg text-gray-700 mb-2'>Welcome</p>
          <p className='text-xl font-semibold text-blue-600'>찰낙찰낙</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isTransitioning ? 0 : 1,
            y: isTransitioning ? 20 : 0,
            scale: isTransitioning ? 0.9 : 1,
          }}
          transition={{
            delay: isTransitioning ? 0 : 0.9,
            duration: isTransitioning ? 0.4 : 0.5,
          }}
        >
          <Button
            label={isTransitioning ? '연결 중...' : '로그인페이지로'}
            width='full'
            size='xl'
            onClick={handleGoToLogin}
            disabled={isTransitioning}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: isTransitioning ? 0 : 1,
          }}
          transition={{
            delay: isTransitioning ? 0 : 1.1,
            duration: isTransitioning ? 0.2 : 0.5,
          }}
          className='text-sm text-gray-500 mt-4'
        >
          {isTransitioning
            ? '🐋 헤엄쳐서 이동 중...'
            : '찰낙찰낙 파도처럼 쏟아지는 경매'}
        </motion.p>
      </section>
    </Dialog>
  );
}

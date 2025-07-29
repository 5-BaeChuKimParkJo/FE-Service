'use client';

import { motion } from 'framer-motion';
import Whale from '@/assets/icons/common/whale.svg';
import { SwimmingWhaleProps } from './types';
import { WHALE_SIZES, ANIMATION_SPEEDS, COLOR_THEMES } from './constants';

export function SwimmingWhale({
  variants,
  size = 'md',
  color,
  speed = 'normal',
}: SwimmingWhaleProps) {
  const whaleSize = WHALE_SIZES[size];
  const animationSpeed = ANIMATION_SPEEDS[speed];
  const whaleColor = color || COLOR_THEMES.blue.whale;

  return (
    <motion.div
      variants={variants}
      initial='hidden'
      animate='visible'
      exit='exit'
      className='relative'
    >
      <motion.div
        animate={{
          y: [0, -20, 0, 15, 0],
          rotate: [0, 3, 0, -2, 0],
        }}
        transition={{
          duration: animationSpeed.duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={whaleColor}
      >
        <Whale className={`${whaleSize.width} ${whaleSize.height}`} />

        {/* Water splash effect behind whale */}
        <motion.div
          className='absolute -right-10 top-1/2 transform -translate-y-1/2'
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.3, 0.8],
            x: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className='flex space-x-2'>
            <motion.div
              className='w-3 h-3 bg-blue-300/60 rounded-full'
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className='w-2.5 h-2.5 bg-blue-300/50 rounded-full'
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className='w-2 h-2 bg-blue-300/40 rounded-full'
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
            <motion.div
              className='w-1.5 h-1.5 bg-blue-300/30 rounded-full'
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Tail wave effect */}
        <motion.div
          className='absolute -right-16 top-1/2 transform -translate-y-1/2'
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleX: [0.8, 1.2, 0.8],
            x: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        >
          <svg
            width='20'
            height='8'
            viewBox='0 0 20 8'
            className='text-blue-300/30'
          >
            <path
              d='M0,4 Q5,0 10,4 Q15,8 20,4'
              stroke='currentColor'
              strokeWidth='2'
              fill='none'
              strokeLinecap='round'
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

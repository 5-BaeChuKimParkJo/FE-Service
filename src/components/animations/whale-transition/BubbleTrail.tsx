'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BubbleTrailProps } from './types';
import { ANIMATION_SPEEDS } from './constants';

export function BubbleTrail({
  count = 8,
  color = 'bg-blue-200/50',
  size = 'md',
  speed = 'normal',
}: BubbleTrailProps) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const animationSpeed = ANIMATION_SPEEDS[speed];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getBubbleSize = () => {
    switch (size) {
      case 'sm':
        return 'w-1.5 h-1.5';
      case 'md':
        return 'w-2 h-2';
      case 'lg':
        return 'w-3 h-3';
      default:
        return 'w-2 h-2';
    }
  };

  const bubbleSize = getBubbleSize();

  if (windowDimensions.width === 0 || windowDimensions.height === 0) {
    return null;
  }

  return (
    <div className='absolute inset-0'>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className={`absolute ${bubbleSize} ${color} rounded-full`}
          initial={{
            x: -50,
            y: windowDimensions.height / 2 + (Math.random() - 0.5) * 100,
          }}
          animate={{
            x: [
              -50,
              windowDimensions.width * 0.3 + (Math.random() - 0.5) * 200,
              windowDimensions.width + 50,
            ],
            y: [
              windowDimensions.height / 2 + (Math.random() - 0.5) * 100,
              windowDimensions.height / 2 + (Math.random() - 0.5) * 150,
              windowDimensions.height / 2 + (Math.random() - 0.5) * 100,
            ],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.2, 0.3],
          }}
          transition={{
            duration: animationSpeed.duration + Math.random() * 2,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { WaveEffectProps } from './types';
import { ANIMATION_SPEEDS } from './constants';

export function WaveEffect({
  intensity = 'medium',
  speed = 'normal',
  colorTheme = 'blue',
  customColor,
}: WaveEffectProps) {
  const animationSpeed = ANIMATION_SPEEDS[speed];

  const getOpacity = () => {
    switch (intensity) {
      case 'low':
        return { primary: 0.05, secondary: 0.02 };
      case 'medium':
        return { primary: 0.1, secondary: 0.05 };
      case 'high':
        return { primary: 0.2, secondary: 0.1 };
      default:
        return { primary: 0.1, secondary: 0.05 };
    }
  };

  const opacity = getOpacity();
  const color =
    customColor ||
    (colorTheme === 'ocean' ? 'rgba(6, 182, 212, 1)' : 'rgba(59, 130, 246, 1)');

  const waveVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: opacity.primary,
      transition: {
        duration: animationSpeed.duration / 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  return (
    <svg
      className='absolute inset-0 w-full h-full'
      viewBox='0 0 100 100'
      preserveAspectRatio='none'
    >
      <motion.path
        d='M0,60 Q25,50 50,60 T100,60 L100,100 L0,100 Z'
        fill={color.replace('1)', `${opacity.primary})`)}
        variants={waveVariants}
        initial='hidden'
        animate='visible'
      />
      <motion.path
        d='M0,70 Q25,60 50,70 T100,70 L100,100 L0,100 Z'
        fill={color.replace('1)', `${opacity.secondary})`)}
        variants={waveVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: animationSpeed.delay }}
      />
    </svg>
  );
}

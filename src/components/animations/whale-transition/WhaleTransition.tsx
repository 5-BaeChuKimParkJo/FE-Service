'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { WhaleTransitionProps } from './types';
import { DEFAULT_PROPS, WHALE_VARIANTS, COLOR_THEMES } from './constants';
import { SwimmingWhale } from './SwimmingWhale';
import { BubbleTrail } from './BubbleTrail';
import { OceanBackground } from './OceanBackground';
import { WaveEffect } from './WaveEffect';

export function WhaleTransition({
  isActive,
  onComplete,
  title = DEFAULT_PROPS.title,
  subtitle = DEFAULT_PROPS.subtitle,
  whaleSize = DEFAULT_PROPS.whaleSize,
  animationSpeed = DEFAULT_PROPS.animationSpeed,
  colorTheme = DEFAULT_PROPS.colorTheme,
  showBackground = DEFAULT_PROPS.showBackground,
  showWaves = DEFAULT_PROPS.showWaves,
  showBubbles = DEFAULT_PROPS.showBubbles,
  showText = DEFAULT_PROPS.showText,
  pausePosition = DEFAULT_PROPS.pausePosition,
  exitDirection = DEFAULT_PROPS.exitDirection,
  customColors,
}: WhaleTransitionProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);

      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const theme = customColors
    ? {
        whale: 'text-blue-500',
        bubbles: 'bg-blue-200/50',
        text: 'text-white',
        subtext: 'text-blue-200',
        ...customColors,
      }
    : colorTheme !== 'custom'
      ? COLOR_THEMES[colorTheme]
      : COLOR_THEMES.blue;

  const whaleVariants = {
    ...WHALE_VARIANTS,
    visible: {
      x: windowWidth * pausePosition - 60,
      opacity: 1,
      scale: 1,
      transition: {
        duration:
          animationSpeed === 'slow' ? 2.5 : animationSpeed === 'fast' ? 1 : 1.5,
        ease: 'easeOut',
      },
    },
    exit:
      exitDirection === 'right'
        ? {
            x: windowWidth + 200,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 1.2, ease: 'easeIn' },
          }
        : exitDirection === 'left'
          ? {
              x: -200,
              opacity: 0,
              scale: 0.9,
              transition: { duration: 1.2, ease: 'easeIn' },
            }
          : exitDirection === 'up'
            ? {
                y: -200,
                opacity: 0,
                scale: 0.9,
                transition: { duration: 1.2, ease: 'easeIn' },
              }
            : {
                y: windowWidth + 200,
                opacity: 0,
                scale: 0.9,
                transition: { duration: 1.2, ease: 'easeIn' },
              },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4, delay: 0.8 },
    },
  };

  if (!isActive || windowWidth === 0) return null;

  return (
    <motion.div
      className='fixed inset-0 z-[60] pointer-events-none'
      variants={overlayVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      onAnimationComplete={() => {
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }}
    >
      {/* Background */}
      {showBackground && <OceanBackground customColors={customColors} />}

      {/* Wave Effects */}
      {showWaves && (
        <WaveEffect
          speed={animationSpeed}
          colorTheme={colorTheme}
          customColor={customColors?.primary}
        />
      )}

      {/* Swimming Whale */}
      <div className='absolute inset-0 flex items-center justify-start overflow-hidden'>
        <SwimmingWhale
          variants={whaleVariants}
          size={whaleSize}
          color={theme.whale}
          speed={animationSpeed}
        />
      </div>

      {/* Bubble Trail */}
      {showBubbles && (
        <BubbleTrail
          count={DEFAULT_PROPS.bubbleCount}
          color={theme.bubbles}
          speed={animationSpeed}
        />
      )}

      {/* Loading Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className='absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center'
        >
          <motion.p
            className={`${theme.text} font-medium text-lg tracking-wide mb-2`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {title}
          </motion.p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`${theme.subtext} text-sm`}
          >
            {subtitle}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

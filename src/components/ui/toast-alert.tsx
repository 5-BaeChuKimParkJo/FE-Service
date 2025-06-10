'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/libs/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastAlertProps {
  isOpen: boolean;
  type: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  position?: 'top' | 'bottom';
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-primary-100/20',
    iconColor: 'text-primary-200',
    textColor: 'text-primary-200',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-100',
    iconColor: 'text-white',
    textColor: 'text-white',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-300',
    iconColor: 'text-white',
    textColor: 'text-white',
  },
  info: {
    icon: Info,
    bgColor: 'bg-primary-100',
    iconColor: 'text-white',
    textColor: 'text-white',
  },
};

export function ToastAlert({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 1500,
  position = 'top',
}: ToastAlertProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, handleClose]);

  const config = toastConfig[type];
  const Icon = config.icon;

  const slideVariants = {
    initial: {
      y: position === 'top' ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      y: position === 'top' ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className={cn(
            'fixed left-4 right-4 z-50 flex justify-center',
            position === 'top' ? 'top-4' : 'bottom-4',
          )}
        >
          <motion.div
            variants={slideVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
            }}
            className={cn(
              'w-full max-w-sm mx-auto',
              'px-4 py-3 rounded-2xl shadow-lg',
              'backdrop-blur-md bg-opacity-95',
              'touch-manipulation select-none',
              config.bgColor,
            )}
            onClick={handleClose}
          >
            <div className='flex items-center space-x-3'>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                className='flex-shrink-0'
              >
                <Icon className={cn('w-6 h-6', config.iconColor)} />
              </motion.div>

              <div className='flex-1 min-w-0'>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    'font-semibold text-sm leading-5',
                    config.textColor,
                  )}
                >
                  {title}
                </motion.p>

                {message && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                      'text-xs leading-4 mt-0.5 opacity-90',
                      config.textColor,
                    )}
                  >
                    {message}
                  </motion.p>
                )}
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className={cn(
                  'flex-shrink-0 p-1 rounded-full',
                  'hover:bg-white/20 active:bg-white/30',
                  'transition-colors duration-200',
                  'touch-manipulation',
                )}
                aria-label='토스트 닫기'
              >
                <X className={cn('w-4 h-4', config.iconColor)} />
              </motion.button>
            </div>

            {/* Progress bar for auto-close */}
            {autoClose && (
              <div className='mt-2 h-1 bg-white/20 rounded-full overflow-hidden'>
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: duration / 1000, ease: 'linear' }}
                  className='h-full bg-white/60 rounded-full'
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

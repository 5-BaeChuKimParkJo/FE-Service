'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/libs/cn';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  showCloseButton?: boolean;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    titleColor: 'text-green-900',
    messageColor: 'text-green-700',
    borderColor: 'border-green-200',
    progressColor: 'bg-green-400',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-100',
    titleColor: 'text-red-900',
    messageColor: 'text-red-700',
    borderColor: 'border-red-200',
    progressColor: 'bg-red-100',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-200/20',
    iconColor: 'text-yellow-300',
    titleColor: 'text-yellow-800',
    messageColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    progressColor: 'bg-yellow-300',
  },
  info: {
    icon: Info,
    bgColor: 'bg-primary-100/10',
    iconColor: 'text-primary-200',
    titleColor: 'text-primary-300',
    messageColor: 'text-primary-200',
    borderColor: 'border-primary-100',
    progressColor: 'bg-primary-100',
  },
};

export function CustomAlert({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
  showCloseButton = true,
}: CustomAlertProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // 애니메이션 완료 후 실행
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

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/20 backdrop-blur-sm'
            onClick={handleClose}
          />

          {/* Alert Container */}
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className={cn(
                'w-full max-w-sm pointer-events-auto',
                'bg-white rounded-2xl border-2 shadow-xl',
                'overflow-hidden',
                config.borderColor,
              )}
            >
              {/* Header with gradient background */}
              <div className={cn('px-6 py-4', config.bgColor)}>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start space-x-3'>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        'bg-white/80 backdrop-blur-sm',
                      )}
                    >
                      <Icon className={cn('w-5 h-5', config.iconColor)} />
                    </motion.div>

                    <div className='flex-1 min-w-0'>
                      <motion.h3
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={cn(
                          'text-lg font-semibold leading-6',
                          config.titleColor,
                        )}
                      >
                        {title}
                      </motion.h3>

                      {message && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className={cn(
                            'mt-1 text-sm leading-5',
                            config.messageColor,
                          )}
                        >
                          {message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {showCloseButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleClose}
                      className={cn(
                        'flex-shrink-0 ml-4 p-1 rounded-full',
                        'hover:bg-white/50 active:bg-white/70',
                        'transition-colors duration-200',
                        'touch-manipulation select-none',
                      )}
                      aria-label='알림 닫기'
                    >
                      <X className={cn('w-4 h-4', config.iconColor)} />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Progress bar for auto-close */}
              {autoClose && (
                <div className='h-1 bg-gray-200 overflow-hidden'>
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                    className={cn('h-full', config.progressColor)}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShoppingCart,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/libs/cn';

export type ConfirmType = 'success' | 'error' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  type: ConfirmType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const confirmConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    titleColor: 'text-green-900',
    messageColor: 'text-green-700',
    borderColor: 'border-green-200',
    buttonColor: 'bg-green-500 hover:bg-green-600',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    titleColor: 'text-red-900',
    messageColor: 'text-red-700',
    borderColor: 'border-red-200',
    buttonColor: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    buttonColor: 'bg-yellow-500 ',
  },
  info: {
    icon: ShoppingCart,
    bgColor: 'bg-primary-100/15',
    iconColor: 'text-primary-200',
    titleColor: 'text-primary-100',
    messageColor: 'text-primary-100',
    borderColor: '',
    buttonColor: 'bg-primary-100 ',
  },
};

export function ConfirmDialog({
  isOpen,
  type,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const config = confirmConfig[type];
  const Icon = config.icon;

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-60 bg-black/40 backdrop-blur-sm'
            onClick={onCancel}
          />

          <div className='fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none'>
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
              <div className={cn('px-6 py-4', config.bgColor)}>
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
              </div>

              {/* Buttons */}
              <div className='px-6 py-4 bg-white'>
                <div className='flex space-x-3'>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={onCancel}
                    className={cn(
                      'flex-1 px-4 py-2.5 text-sm font-medium',
                      'bg-gray-100 text-gray-700 rounded-lg',
                      'hover:bg-gray-200 active:bg-gray-300',
                      'transition-colors duration-200',
                      'touch-manipulation select-none',
                    )}
                  >
                    {cancelText}
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={onConfirm}
                    className={cn(
                      'flex-1 px-4 py-2.5 text-sm font-medium',
                      'text-white rounded-lg',
                      config.buttonColor,
                      'transition-colors duration-200',
                      'touch-manipulation select-none',
                    )}
                  >
                    {confirmText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

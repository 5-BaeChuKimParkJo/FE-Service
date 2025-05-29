'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Dialog({
  isOpen,
  onClose,
  children,
  className = '',
  size = 'md',
  showCloseButton = false,
  closeOnBackdropClick = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center'
          role='dialog'
          aria-modal='true'
          aria-labelledby='dialog-title'
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={handleBackdropClick}
          />

          {/* Dialog Content */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              relative w-full mx-4 bg-white rounded-2xl shadow-xl overflow-hidden
              ${sizeClasses[size]}
              ${className}
            `}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className='absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors'
                aria-label='닫기'
              >
                <svg
                  className='w-5 h-5 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

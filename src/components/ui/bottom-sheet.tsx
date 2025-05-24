'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  height?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  height = 'auto',
}: BottomSheetProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className='fixed inset-0  z-40'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg',
              className,
            )}
            style={{ height }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className='w-16 h-1 bg-gray-300 rounded-full mx-auto my-2' />
            {showCloseButton && (
              <div className='flex justify-end p-2'>
                <button
                  onClick={onClose}
                  className='p-2 rounded-full hover:bg-gray-100'
                  aria-label='닫기'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
            )}
            <div className='px-4 pb-6'>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

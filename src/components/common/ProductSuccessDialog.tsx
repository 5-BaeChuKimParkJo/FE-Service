'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Penguin from '@/assets/icons/common/penguin.svg';

export function ProductSuccessDialog({
  isOpen,
  onClose,
  onGoToDetail,
  productTitle,
  motionType = 'default',
}: {
  isOpen: boolean;
  onClose: () => void;
  onGoToDetail: () => void;
  productTitle?: string;
  motionType?: 'default' | 'welcome';
}) {
  // WelcomeDialog 스타일 애니메이션
  const sectionVariants =
    motionType === 'welcome'
      ? {
          initial: { opacity: 0, scale: 0.95, y: 40 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.8, y: 80, rotate: 30 },
        }
      : {
          initial: { opacity: 0, scale: 0.95, y: 40 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 40 },
        };

  const penguinVariants =
    motionType === 'welcome'
      ? {
          initial: { scale: 0, rotate: -180 },
          animate: { scale: 1, rotate: 0 },
          exit: { scale: 0, rotate: 180 },
        }
      : {
          initial: { scale: 0 },
          animate: { scale: 1 },
          exit: { scale: 0 },
        };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size='md'
      closeOnBackdropClick={false}
      className='text-center'
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className='p-8 py-12 flex flex-col items-center gap-4'
            initial={sectionVariants.initial}
            animate={sectionVariants.animate}
            exit={sectionVariants.exit}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className='w-24 h-24 flex items-center justify-center bg-blue-50 rounded-full mb-4'
              initial={penguinVariants.initial}
              animate={penguinVariants.animate}
              exit={penguinVariants.exit}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <Penguin className='w-full h-full' />
            </motion.div>
            <motion.h1
              className='text-2xl font-bold text-gray-900 mb-2'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              상품 등록 완료!
            </motion.h1>
            {productTitle && (
              <motion.div
                className='font-bold text-primary mb-1'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {productTitle}
              </motion.div>
            )}
            <motion.div
              className='text-gray-700 mb-4'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              상품이 성공적으로 등록되었습니다.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className='w-full'
            >
              <Button className='mt-2 w-full' onClick={onGoToDetail}>
                상세 페이지로 이동
              </Button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

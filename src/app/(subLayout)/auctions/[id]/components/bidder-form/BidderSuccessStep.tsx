'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

type BidderSuccessStepProps = {
  onClose: () => void;
};

export function BidderSuccessStep({ onClose }: BidderSuccessStepProps) {
  return (
    <motion.div
      key='success'
      variants={{
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
      }}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ duration: 0.3 }}
      className='flex flex-col items-center gap-6 px-4 pb-6'
    >
      <div className='text-center text-primary-100 text-xl font-bold mb-2'>
        입찰이 완료되었습니다!
      </div>
      <Button width='full' size='lg' onClick={onClose}>
        닫기
      </Button>
    </motion.div>
  );
}

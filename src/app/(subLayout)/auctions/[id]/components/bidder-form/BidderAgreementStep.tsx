'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

type BidderAgreementStepProps = {
  onClose: () => void;
  onAgree: () => void;
};

export function BidderAgreementStep({
  onClose,
  onAgree,
}: BidderAgreementStepProps) {
  return (
    <motion.div
      key='step1'
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
      <div className='text-center text-gray-700 text-base mb-2'>
        입찰은 <span className='font-bold text-primary-100'>취소가 불가능</span>
        하며,
        <br />
        거래 거부 시 서비스 이용이{' '}
        <span className='font-bold text-primary-100'>제한</span>될 수 있습니다.
      </div>
      <div className='flex gap-4 w-full'>
        <Button className='flex-1' variant='outline' onClick={onClose}>
          나가기
        </Button>
        <Button className='flex-1' onClick={onAgree}>
          동의
        </Button>
      </div>
    </motion.div>
  );
}

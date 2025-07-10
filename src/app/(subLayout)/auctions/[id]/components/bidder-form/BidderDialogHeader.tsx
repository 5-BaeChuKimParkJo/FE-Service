'use client';

import { motion } from 'framer-motion';
import Penguin from '@/assets/icons/common/penguin.svg';

type BidderDialogHeaderProps = {
  title: string;
};

export function BidderDialogHeader({ title }: BidderDialogHeaderProps) {
  return (
    <div className='flex flex-col items-center pt-6 pb-2'>
      <Penguin className='w-24 h-24 mb-2' />
      <motion.h2
        className='text-2xl font-bold text-primary-100 mb-2'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h2>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

interface ScrollableHeaderProps {
  children: React.ReactNode;
}

export function ScrollableHeader({ children }: ScrollableHeaderProps) {
  const { isVisible } = useScrollDirection({ threshold: 15 });

  return (
    <motion.div
      className='mobile-fixed top-0 z-50'
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : '-100%',
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 35,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
}

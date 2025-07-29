'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

import Ray from '@/assets/icons/common/ray.svg';

export function SignupLink() {
  return (
    <>
      <section className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          계정을 아직 가지고 있지 않으세요?
          <Link href='/sign-up' className='text-gray-900 font-black ml-2'>
            회원가입
          </Link>
        </p>
      </section>
      <motion.div
        className='flex justify-center'
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      >
        <Ray className='text-primary-100 scale-50' />
      </motion.div>
    </>
  );
}

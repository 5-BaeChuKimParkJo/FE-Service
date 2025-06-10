'use client';
import { motion } from 'framer-motion';

interface AuctionWarningsProps {
  animationDelay?: number;
}

const warningItems = [
  '경매 등록 후 상품 정보 수정이 제한됩니다.',
  '허위 상품이나 금지 품목은 제재 대상입니다.',
  '낙찰 후 거래를 성실히 완료해야 합니다.',
] as const;

export function AuctionWarnings({
  animationDelay = 0.4,
}: AuctionWarningsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className='border border-amber-200 bg-amber-50 rounded-xl p-6'
      aria-labelledby='warnings-title'
      role='region'
    >
      <header className='font-semibold text-amber-800 mb-3 flex items-center space-x-2'>
        <span className='text-lg' role='img' aria-label='경고'>
          ⚠️
        </span>
        <h4 id='warnings-title'>경매 등록 전 확인사항</h4>
      </header>

      <ul className='text-sm text-amber-700 space-y-2' role='list'>
        {warningItems.map((warning, index) => (
          <li
            key={index}
            className='flex items-start space-x-2'
            role='listitem'
          >
            <span className='text-amber-500 mt-1' aria-hidden='true'>
              •
            </span>
            <span>{warning}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

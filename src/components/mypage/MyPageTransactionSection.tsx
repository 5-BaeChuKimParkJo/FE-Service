'use client';

import Link from 'next/link';
import { ShoppingBag, ShoppingCart, ChevronRight } from 'lucide-react';

export function MyPageTransactionSection() {
  const transactionSummary = [
    {
      id: 'sales',
      title: '판매한 경매상품',
      href: '/mypage/sales',
      icon: <ShoppingBag className='w-6 h-6' />,
    },
    {
      id: 'purchases',
      title: '참여한 거래',
      href: '/mypage/purchases',
      icon: <ShoppingCart className='w-6 h-6' />,
    },
  ];

  return (
    <div className='space-y-4 mb-4'>
      <h2 className='m-4 text-lg font-bold text-gray-900'>거래 내역</h2>

      <div className='space-y-3'>
        {transactionSummary.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className='flex items-center justify-between px-4 py-6 border-b border-gray-300'
          >
            <div className='flex items-center gap-3'>
              <div className='text-gray-600'>{item.icon}</div>
              <h3 className='font-medium text-lg text-gray-900'>
                {item.title}
              </h3>
            </div>

            <div className='flex items-center gap-2'>
              <ChevronRight className='w-5 h-5 text-gray-400' />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

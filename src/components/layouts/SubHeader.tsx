'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/libs/cn';
import Bell from '@/assets/icons/common/bell.svg';
import Search from '@/assets/icons/common/search.svg';
import Arrow from '@/assets/icons/common/arrow.svg';
import Link from 'next/link';

export function SubHeader() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <header
      className={cn('mobile-fixed top-0 z-50 h-14 bg-white')}
      role='banner'
    >
      <nav
        className='h-full flex items-center justify-between px-4 sm:px-6'
        role='navigation'
        aria-label='메인 헤더'
      >
        <div className='flex items-center ml-2 mt-2'>
          <button onClick={handleBack} aria-label='뒤로 가기'>
            <Arrow className='w-6 h-6 text-primary-100' aria-hidden='true' />
          </button>
        </div>

        <div
          className='flex items-center gap-3'
          role='toolbar'
          aria-label='사용자 액션'
        >
          <Link
            href='/search'
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              'hover:bg-white/20 active:scale-95',
            )}
            aria-label='검색하기'
            type='button'
          >
            <Search className='w-6 h-6 text-white' aria-hidden='true' />
          </Link>

          <button
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              'hover:bg-white/20 active:scale-95',
            )}
            aria-label='알림 보기'
            type='button'
          >
            <Bell className='w-6 h-6 text-white' aria-hidden='true' />
          </button>
        </div>
      </nav>
    </header>
  );
}

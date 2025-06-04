'use client';
import Link from 'next/link';

import Logo from '@/assets/icons/common/logo.svg';
import Bell from '@/assets/icons/common/bell.svg';
import Search from '@/assets/icons/common/search.svg';
import { cn } from '@/lib/cn';

export function TopNavigation() {
  return (
    <header
      className={cn('w-full h-16 bg-white border-b border-gray-200')}
      role='banner'
    >
      <nav
        className='h-full flex items-center justify-between px-4 sm:px-6'
        role='navigation'
        aria-label='메인 헤더'
      >
        <div className='flex items-center gap-2 '>
          <Link href='/' aria-label='홈으로 이동'>
            <Logo />
          </Link>
        </div>

        <div
          className='flex items-center gap-3'
          role='toolbar'
          aria-label='사용자 액션'
        >
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

          <button
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              'hover:bg-white/20 active:scale-95',
            )}
            aria-label='검색하기'
            type='button'
          >
            <Search className='w-6 h-6 text-white' aria-hidden='true' />
          </button>
        </div>
      </nav>
    </header>
  );
}

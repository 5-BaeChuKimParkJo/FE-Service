'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Gavel, Search, User } from 'lucide-react';

import { cn } from '@/libs/cn';
import { primaryNavigation } from '@/config/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const icons = { '/': Home, '/auctions': Gavel, '/search': Search, '/mypage': User } as const;
const navItems: NavItem[] = primaryNavigation.map((item) => ({ ...item, icon: icons[item.href] }));

export function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        'mobile-fixed bottom-0 z-50',
        'h-16 border-t border-gray-200/20',
      )}
    >
      <div className='bg-primary-100 h-full flex items-center justify-around px-2 sm:px-4 rounded-t-xl'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 px-2 sm:px-3 py-2 rounded-lg',
                'transition-all duration-200 min-w-0 flex-1',
                'hover:bg-white/20 active:scale-95',
              )}
              aria-label={item.label}
            >
              <Icon
                className={cn(
                  'w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 flex-shrink-0',
                  isActive ? 'text-white' : 'text-white/50',
                )}
              />
              <span
                className={cn(
                  'text-[10px] sm:text-xs font-medium transition-colors duration-200',
                  'truncate w-full text-center leading-tight',
                  isActive ? 'text-white' : 'text-white/50',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

'use client';

import { useScrollDirection } from '@/hooks/useScrollDirection';

interface ScrollableHeaderProps {
  children: React.ReactNode;
}

export function ScrollableHeader({ children }: ScrollableHeaderProps) {
  const { isVisible } = useScrollDirection({ threshold: 15 });

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {children}
    </div>
  );
}

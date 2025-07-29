import { BottomNavigation } from './BottomNavigation';
import { TopNavigation } from './TopNavigation';
import { ScrollableHeader } from './ScrollableHeader';
import { CreateProductFAB } from '@/components/common';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      <ScrollableHeader>
        <TopNavigation />
      </ScrollableHeader>

      <main className='mobile-container flex-1 pt-12 pb-20 bg-gray-100 overflow-y-scroll scrollbar-hidden'>
        {children}
      </main>

      <CreateProductFAB />
      <BottomNavigation />
    </div>
  );
}

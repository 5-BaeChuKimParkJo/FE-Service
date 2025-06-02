import { BottomNavigation } from './BottomNavigation';
import { TopNavigation } from './TopNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <TopNavigation />

      <main className='pt-16 pb-24'>{children}</main>

      <BottomNavigation />
    </>
  );
}

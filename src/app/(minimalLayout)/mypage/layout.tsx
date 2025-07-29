import { BottomNavigation, SubHeader } from '@/components/layouts';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mobile-container min-h-screen flex flex-col relative'>
      <SubHeader />
      <main className='flex-1 pt-14 pb-20 bg-gray-50 overflow-y-scroll scrollbar-hidden'>
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}

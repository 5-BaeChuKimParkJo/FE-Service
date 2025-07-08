import { BottomNavigation, SubHeader } from '@/components/layouts';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubHeader />
      <main className='flex-1 pt-14 pb-20 bg-gray-50overflow-y-scroll scrollbar-hidden'>
        {children}
      </main>
      <BottomNavigation />
    </>
  );
}

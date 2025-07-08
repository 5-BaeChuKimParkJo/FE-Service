import { MainLayout } from '@/components/layouts';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col '>
      <MainLayout>
        <div className='px-4 py-6'>{children}</div>
      </MainLayout>
    </div>
  );
}

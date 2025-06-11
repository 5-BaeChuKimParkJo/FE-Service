import { SubHeader } from '@/components/layouts';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <SubHeader />
      <main className='flex-1 pt-16 bg-gray-100 overflow-y-scroll scrollbar-hidden'>
        {children}
      </main>
    </div>
  );
}

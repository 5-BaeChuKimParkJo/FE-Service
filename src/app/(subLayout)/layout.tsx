import { SubHeader } from '@/components/layouts';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <SubHeader />
      <main className='mobile-container flex-1 pt-14 bg-gray-100'>
        {children}
      </main>
    </div>
  );
}

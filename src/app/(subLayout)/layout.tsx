import { SubHeader } from '@/components/layouts';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubHeader />
      {children}
    </>
  );
}

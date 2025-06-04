import React from 'react';

import { MainLayout } from '@/components/layouts';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainLayout>{children}</MainLayout>
    </>
  );
}

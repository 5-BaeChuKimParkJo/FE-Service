import { AuthHeader } from '@/components/layouts';
import React from 'react';

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
}

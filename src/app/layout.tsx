import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: '중고 경매 플랫폼 찰낙찰낙',
  description: '중고물품 팔 땐 찰낙찰낙, 중고물품 경매할 땐 찰낙찰낙.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <QueryProvider>
          <div className='w-full min-w-[320px] max-w-[480px] mx-auto pb-safe pt-safe overflow-y-auto scrollbar-hidden'>
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

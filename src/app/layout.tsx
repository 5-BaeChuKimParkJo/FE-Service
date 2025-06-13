import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { AlertProvider } from '@/contexts/AlertContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { GlobalTimerProvider } from '@/contexts/GlobalTimerContext';
import { QueryClient } from '@tanstack/react-query';
import { getCategories } from '@/actions/category-service/getCategories';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <html lang='ko'>
      <body className='w-full min-w-[320px] max-w-[480px] mx-auto pb-safe pt-safe overflow-y-auto scrollbar-hidden'>
        <QueryProvider>
          <AlertProvider>
            <ToastProvider>
              <GlobalTimerProvider>{children}</GlobalTimerProvider>
            </ToastProvider>
          </AlertProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

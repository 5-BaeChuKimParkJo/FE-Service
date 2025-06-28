import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { AlertProvider } from '@/contexts/AlertContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { GlobalTimerProvider } from '@/contexts/GlobalTimerContext';
import { QueryClient } from '@tanstack/react-query';
import { getCategories } from '@/actions/category-service/get-categories';
import { SseProvider } from '@/providers/SseProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cabbage-secondhand.shop'),
  title: '중고 경매 플랫폼 찰낙찰낙',
  description: '중고물품 팔 땐 찰낙찰낙, 중고물품 경매할 땐 찰낙찰낙.',
  icons: {
    icon: '/assets/icons/common/logo.svg',
  },
  openGraph: {
    url: 'https://www.cabbage-secondhand.shop',
    title: '중고 경매 플랫폼 찰낙찰낙',
    description: '중고물품 팔 땐 찰낙찰낙, 중고물품 경매할 땐 찰낙찰낙.',
    images: [{ url: '/assets/images/logo.png' }],
    type: 'website',
    siteName: '중고 경매 플랫폼 찰낙찰낙',
    locale: 'ko_KR',
    countryName: 'KR',
  },
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
              <SseProvider>
                <GlobalTimerProvider>{children}</GlobalTimerProvider>
              </SseProvider>
            </ToastProvider>
          </AlertProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

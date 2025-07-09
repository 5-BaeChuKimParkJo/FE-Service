'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logError } from '@/utils/error-handler';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    logError(error, 'GlobalError');
  }, [error]);

  const getErrorTitle = (error: Error) => {
    if (error.message.includes('ChunkLoadError')) {
      return '애플리케이션 로딩 오류';
    }
    if (error.message.includes('Network')) {
      return '네트워크 연결 오류';
    }
    return '시스템 오류';
  };

  const getErrorMessage = (error: Error) => {
    if (error.message.includes('ChunkLoadError')) {
      return '새로운 업데이트가 있습니다. 페이지를 새로고침해주세요.';
    }
    if (error.message.includes('Network')) {
      return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
    }
    return '시스템에서 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <html lang='ko'>
      <body>
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
          <div className='max-w-md w-full text-center'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='flex justify-center mb-4'>
                <AlertTriangle className='h-16 w-16 text-orange-500' />
              </div>

              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                {getErrorTitle(error)}
              </h1>

              <p className='text-gray-600 mb-6'>{getErrorMessage(error)}</p>

              <div className='space-y-3'>
                <Button
                  onClick={reset}
                  className='w-full flex items-center justify-center gap-2'
                  variant='default'
                >
                  <RefreshCw className='h-4 w-4' />
                  다시 시도
                </Button>

                <Button
                  onClick={handleReload}
                  variant='outline'
                  className='w-full'
                >
                  페이지 새로고침
                </Button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

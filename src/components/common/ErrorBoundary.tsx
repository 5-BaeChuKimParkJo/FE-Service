'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { logError } from '@/utils/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, 'ErrorBoundary');

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex items-center justify-center min-h-[400px] p-6'>
          <div className='max-w-md w-full text-center'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='flex justify-center mb-4'>
                <AlertCircle className='h-12 w-12 text-red-500' />
              </div>

              <h2 className='text-xl font-bold text-gray-900 mb-2'>
                문제가 발생했습니다
              </h2>

              <p className='text-gray-600 mb-6'>
                컴포넌트를 로딩하는 중 오류가 발생했습니다.
              </p>

              <div className='space-y-3'>
                <Button
                  onClick={this.handleReset}
                  className='w-full flex items-center justify-center gap-2'
                  variant='default'
                >
                  <RefreshCw className='h-4 w-4' />
                  다시 시도
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant='outline'
                  className='w-full'
                >
                  페이지 새로고침
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className='mt-6 text-left'>
                  <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                    개발자 정보
                  </summary>
                  <pre className='mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto'>
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 함수형 컴포넌트로 래핑하여 사용하기 쉽게 만든 버전
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const ErrorBoundaryWrapper = ({
  children,
  fallback,
  onError,
}: ErrorBoundaryWrapperProps) => {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

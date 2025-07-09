import { ErrorResponse } from '@/types/api';

export interface ErrorInfo {
  title: string;
  message: string;
  code?: string;
  shouldRetry: boolean;
  shouldRedirect?: string;
}

export const handleApiError = (error: unknown): ErrorInfo => {
  // instance.ts에서 오는 ErrorResponse 타입 체크
  if (isErrorResponse(error)) {
    const title = '알림';
    const message = error.message;

    // instance.ts에서 오는 에러 코드별 처리
    switch (error.code) {
      case 'HTTP_ERROR_401':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: false,
          shouldRedirect: '/sign-in',
        };

      case 'HTTP_ERROR_403':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: false,
        };

      case 'HTTP_ERROR_404':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: false,
        };

      case 'HTTP_ERROR_429':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: true,
        };

      case 'HTTP_ERROR_500':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: true,
        };

      case 'TIMEOUT_ERROR':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: true,
        };

      case 'NETWORK_ERROR':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: true,
        };

      case 'PARSE_ERROR':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: true,
        };

      case 'FETCH_ERROR':
        return {
          title,
          message,
          code: error.code,
          shouldRetry: true,
        };

      default:
        return {
          title,
          message,
          code: error.code,
          shouldRetry: true,
        };
    }
  }

  // 일반 Error 객체 처리 (instance.ts 외부에서 발생하는 에러)
  if (error instanceof Error) {
    if (error.message.includes('ChunkLoadError')) {
      return {
        title: '애플리케이션 로딩 오류',
        message: '새로운 업데이트가 있습니다. 페이지를 새로고침해주세요.',
        shouldRetry: false,
      };
    }

    return {
      title: '오류가 발생했습니다',
      message: error.message || '예상치 못한 오류가 발생했습니다.',
      shouldRetry: true,
    };
  }

  // 기타 모든 에러
  return {
    title: '알 수 없는 오류',
    message: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    shouldRetry: true,
  };
};

export const isErrorResponse = (error: unknown): error is ErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ErrorResponse).code === 'string' &&
    typeof (error as ErrorResponse).message === 'string'
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isErrorResponse(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
};

export const shouldRetryError = (error: unknown): boolean => {
  if (isErrorResponse(error)) {
    const nonRetryableCodes = [
      'HTTP_ERROR_401',
      'HTTP_ERROR_403',
      'HTTP_ERROR_404',
    ];
    return !nonRetryableCodes.includes(error.code);
  }

  return true;
};

export const logError = (error: unknown, context?: string) => {
  const errorInfo = handleApiError(error);

  console.error('Error occurred:', {
    context,
    title: errorInfo.title,
    message: errorInfo.message,
    code: errorInfo.code,
    originalError: error,
    timestamp: new Date().toISOString(),
  });

  // 운영 환경에서는 에러 추적 서비스로 전송
  // if (process.env.NODE_ENV === 'production') {
  //   trackError(error, context);
  // }
};

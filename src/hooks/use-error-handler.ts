import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { handleApiError, logError, ErrorInfo } from '@/utils/error-handler';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  redirectOnAuth?: boolean;
  customHandler?: (errorInfo: ErrorInfo) => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const router = useRouter();
  const { error: showErrorToast } = useToast();
  const { showToast = false, redirectOnAuth = true, customHandler } = options;

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      logError(error, context);
      const errorInfo = handleApiError(error);

      // 커스텀 핸들러가 있으면 실행
      if (customHandler) {
        customHandler(errorInfo);
        return errorInfo;
      }

      // 토스트 메시지 표시 (명시적으로 활성화된 경우만)
      if (showToast) {
        showErrorToast(errorInfo.title, errorInfo.message);
      }

      // 인증 에러 시 리다이렉트
      if (redirectOnAuth && errorInfo.shouldRedirect) {
        router.push(errorInfo.shouldRedirect);
      }

      return errorInfo;
    },
    [customHandler, showToast, redirectOnAuth, router, showErrorToast],
  );

  return { handleError };
};

// API 요청과 함께 사용하기 위한 래퍼 함수
export const useApiErrorHandler = () => {
  const { handleError } = useErrorHandler();

  const executeWithErrorHandling = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      context?: string,
    ): Promise<T | null> => {
      try {
        return await apiCall();
      } catch (error) {
        handleError(error, context);
        return null;
      }
    },
    [handleError],
  );

  return { executeWithErrorHandling, handleError };
};

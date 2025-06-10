'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { ToastAlert, ToastType } from '@/components/ui/toast-alert';

interface ToastState {
  isOpen: boolean;
  type: ToastType;
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
  position?: 'top' | 'bottom';
}

interface ToastContextValue {
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    options?: {
      autoClose?: boolean;
      duration?: number;
      position?: 'top' | 'bottom';
    },
  ) => void;
  success: (
    title: string,
    message?: string,
    options?: { duration?: number; position?: 'top' | 'bottom' },
  ) => void;
  error: (
    title: string,
    message?: string,
    options?: {
      duration?: number;
      position?: 'top' | 'bottom';
      autoClose?: boolean;
    },
  ) => void;
  warning: (
    title: string,
    message?: string,
    options?: { duration?: number; position?: 'top' | 'bottom' },
  ) => void;
  info: (
    title: string,
    message?: string,
    options?: { duration?: number; position?: 'top' | 'bottom' },
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    autoClose: true,
    duration: 1500,
    position: 'top',
  });

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      options?: {
        autoClose?: boolean;
        duration?: number;
        position?: 'top' | 'bottom';
      },
    ) => {
      setToast({
        isOpen: true,
        type,
        title,
        message,
        autoClose: options?.autoClose ?? true,
        duration: options?.duration ?? 1500,
        position: options?.position ?? 'top',
      });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 편의 메서드들
  const success = useCallback(
    (
      title: string,
      message?: string,
      options?: { duration?: number; position?: 'top' | 'bottom' },
    ) => {
      showToast('success', title, message, options);
    },
    [showToast],
  );

  const error = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        duration?: number;
        position?: 'top' | 'bottom';
        autoClose?: boolean;
      },
    ) => {
      showToast('error', title, message, options);
    },
    [showToast],
  );

  const warning = useCallback(
    (
      title: string,
      message?: string,
      options?: { duration?: number; position?: 'top' | 'bottom' },
    ) => {
      showToast('warning', title, message, options);
    },
    [showToast],
  );

  const info = useCallback(
    (
      title: string,
      message?: string,
      options?: { duration?: number; position?: 'top' | 'bottom' },
    ) => {
      showToast('info', title, message, options);
    },
    [showToast],
  );

  const contextValue: ToastContextValue = {
    showToast,
    success,
    error,
    warning,
    info,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast 컴포넌트는 여기서 한 번만 렌더링 */}
      <ToastAlert
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
        autoClose={toast.autoClose}
        duration={toast.duration}
        position={toast.position}
      />
    </ToastContext.Provider>
  );
}

// Custom hook for using toast context
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

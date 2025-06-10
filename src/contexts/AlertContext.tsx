'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { CustomAlert, AlertType } from '@/components/ui/custom-alert';

interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

interface AlertContextValue {
  showAlert: (
    type: AlertType,
    title: string,
    message?: string,
    options?: {
      autoClose?: boolean;
      duration?: number;
    },
  ) => void;
  showSuccess: (
    title: string,
    message?: string,
    options?: { autoClose?: boolean; duration?: number },
  ) => void;
  showError: (
    title: string,
    message?: string,
    options?: { autoClose?: boolean; duration?: number },
  ) => void;
  showWarning: (
    title: string,
    message?: string,
    options?: { autoClose?: boolean; duration?: number },
  ) => void;
  showInfo: (
    title: string,
    message?: string,
    options?: { autoClose?: boolean; duration?: number },
  ) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    autoClose: true,
    duration: 4000,
  });

  const showAlert = useCallback(
    (
      type: AlertType,
      title: string,
      message?: string,
      options?: {
        autoClose?: boolean;
        duration?: number;
      },
    ) => {
      setAlert({
        isOpen: true,
        type,
        title,
        message,
        autoClose: options?.autoClose ?? true,
        duration: options?.duration ?? 4000,
      });
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 편의 메서드들
  const showSuccess = useCallback(
    (
      title: string,
      message?: string,
      options?: { autoClose?: boolean; duration?: number },
    ) => {
      showAlert('success', title, message, options);
    },
    [showAlert],
  );

  const showError = useCallback(
    (
      title: string,
      message?: string,
      options?: { autoClose?: boolean; duration?: number },
    ) => {
      showAlert('error', title, message, options);
    },
    [showAlert],
  );

  const showWarning = useCallback(
    (
      title: string,
      message?: string,
      options?: { autoClose?: boolean; duration?: number },
    ) => {
      showAlert('warning', title, message, options);
    },
    [showAlert],
  );

  const showInfo = useCallback(
    (
      title: string,
      message?: string,
      options?: { autoClose?: boolean; duration?: number },
    ) => {
      showAlert('info', title, message, options);
    },
    [showAlert],
  );

  const contextValue: AlertContextValue = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      {/* Alert 컴포넌트는 여기서 한 번만 렌더링 */}
      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={hideAlert}
        autoClose={alert.autoClose}
        duration={alert.duration}
      />
    </AlertContext.Provider>
  );
}

// Custom hook for using alert context
export function useAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

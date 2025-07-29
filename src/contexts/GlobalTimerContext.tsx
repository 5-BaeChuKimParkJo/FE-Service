'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

// 글로벌 타이머 Context
const GlobalTimerContext = createContext<{
  now: number;
  subscribe: (callback: () => void) => () => void;
} | null>(null);

// 글로벌 타이머 Provider
export function GlobalTimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [now, setNow] = useState(() => Date.now());
  const listenersRef = useRef(new Set<() => void>());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 구독자 관리
  const subscribe = (callback: () => void) => {
    listenersRef.current.add(callback);

    // 첫 번째 구독자가 생기면 타이머 시작
    if (listenersRef.current.size === 1 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        const newTime = Date.now();
        setNow(newTime);
        // 구독자들에게 알림
        listenersRef.current.forEach((cb) => cb());
      }, 1000);
    }

    // cleanup 함수 반환
    return () => {
      listenersRef.current.delete(callback);
      // 마지막 구독자가 사라지면 타이머 정리
      if (listenersRef.current.size === 0 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <GlobalTimerContext.Provider value={{ now, subscribe }}>
      {children}
    </GlobalTimerContext.Provider>
  );
}

// 최적화된 글로벌 타이머 훅
export const useGlobalTimer = () => {
  const context = useContext(GlobalTimerContext);
  if (!context) {
    throw new Error('useGlobalTimer must be used within GlobalTimerProvider');
  }

  const [localNow, setLocalNow] = useState(context.now);

  useEffect(() => {
    // 현재 시간으로 초기화
    setLocalNow(context.now);

    // 구독 시작
    const unsubscribe = context.subscribe(() => {
      setLocalNow(context.now);
    });

    return unsubscribe;
  }, [context]);

  return localNow;
};

// 선택적 사용을 위한 개별 타이머 훅
export const useLocalTimer = (intervalMs: number = 1000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [intervalMs]);

  return now;
};

'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// 글로벌 타이머 Context
const GlobalTimerContext = createContext<number>(0);

// 글로벌 타이머 Provider (App.tsx나 최상위에서 사용)
export function GlobalTimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // 항상 1초마다 업데이트 (UI 일관성을 위해)
    // 개별 컴포넌트에서 24시간 이상일 때는 분 단위로만 표시하므로
    // 실제로는 초 단위 변화가 UI에 반영되지 않음
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <GlobalTimerContext.Provider value={now}>
      {children}
    </GlobalTimerContext.Provider>
  );
}

// 글로벌 타이머 훅
export const useGlobalTimer = () => {
  const now = useContext(GlobalTimerContext);
  if (now === undefined) {
    throw new Error('useGlobalTimer must be used within GlobalTimerProvider');
  }
  return now;
};

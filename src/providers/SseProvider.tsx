'use client';

import { useConnectSSE } from '@/hooks/use-connect-sse';

export const SseProvider = ({ children }: { children: React.ReactNode }) => {
  useConnectSSE();
  return <>{children}</>;
};

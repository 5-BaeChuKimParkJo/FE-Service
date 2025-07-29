'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/actions/auth';

export const useConnectSSE = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sseMessage, setSSEMessage] = useState<any>(null);

  useEffect(() => {
    let sse: EventSource | null = null;

    const connectSSE = async () => {
      try {
        const authData = await auth();
        const accessToken = authData?.user?.accessToken;

        if (!authData?.user?.accessToken) {
          throw new Error('No access token found');
        }

        sse = new EventSource(
          `${process.env.NEXT_PUBLIC_API_URL}/notification-service/api/sse?token=${accessToken}`,
          { withCredentials: true },
        );

        sse.onopen = () => {
          // console.log('SSE connected');
          setIsConnected(true);
          setError(null);
        };

        sse.onmessage = (event) => {
          // console.log('SSE message received:', event.data);
          const message = JSON.parse(event.data);
          setSSEMessage(message);
        };

        sse.onerror = (event) => {
          console.error('SSE error:', event);
          setIsConnected(false);
          setError('SSE connection error');
        };
      } catch (err) {
        console.error('Failed to connect SSE:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    connectSSE();

    return () => {
      if (sse) {
        sse.close();
        setIsConnected(false);
      }
    };
  }, []);

  return { isConnected, error, sseMessage };
};

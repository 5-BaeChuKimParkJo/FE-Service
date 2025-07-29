import { useCallback, useRef } from 'react';

/**
 * 디바운스 훅 - 연속적인 함수 호출을 지연시켜 마지막 호출만 실행
 * @returns 디바운스 함수 생성기
 */
export default function useDebounce() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends (...args: any[]) => any>(callback: T, delay: number = 500) => {
      return (...args: Parameters<T>) => {
        if (timer.current) {
          clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
          callback(...args);
        }, delay);
      };
    },
    [],
  );
}

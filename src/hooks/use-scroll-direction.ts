'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  element?: HTMLElement | null;
}

export function useScrollDirection({
  threshold = 10,
  element,
}: UseScrollDirectionOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = useCallback(() => {
    const scrollY = element ? element.scrollTop : window.scrollY;
    const direction = scrollY > lastScrollY.current ? 'down' : 'up';

    if (Math.abs(scrollY - lastScrollY.current) < threshold) {
      ticking.current = false;
      return;
    }

    if (scrollY <= 0) {
      setIsVisible(true);
    } else if (direction === 'down') {
      setIsVisible(false);
    } else if (direction === 'up') {
      setIsVisible(true);
    }

    lastScrollY.current = scrollY > 0 ? scrollY : 0;
    ticking.current = false;
  }, [threshold, element]);

  const requestTick = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollDirection);
      ticking.current = true;
    }
  }, [updateScrollDirection]);

  useEffect(() => {
    const initialScrollY = element ? element.scrollTop : window.scrollY;
    lastScrollY.current = initialScrollY;

    if (element) {
      element.addEventListener('scroll', requestTick, { passive: true });
    } else {
      window.addEventListener('scroll', requestTick, { passive: true });
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', requestTick);
      } else {
        window.removeEventListener('scroll', requestTick);
      }
    };
  }, [element, requestTick]);

  return { isVisible };
}

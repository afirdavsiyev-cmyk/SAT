import { useRef, useState, useLayoutEffect, useCallback } from 'react';

/**
 * Tracks the bounding rect of the currently active tab button
 * so a positioned pill can glide to it with spring physics.
 */
export const useSlidingPill = (activeIndex: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLElement>('[data-tab-item]');
    const btn = buttons[activeIndex];
    if (!btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [activeIndex]);

  // Re-measure on active index change and on mount
  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return { containerRef, pill };
};

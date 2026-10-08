import React, { useState, useCallback } from 'react';
import { useSlidingPill } from '../../hooks/useSlidingPill';

interface Tab {
  label: string;
  icon?: React.ReactNode;
}

interface SlidingTabGroupProps {
  tabs: Tab[];
  activeIndex: number;
  onChange: (index: number) => void;
  /** Extra classes for the outer container */
  className?: string;
  /** Pill color variant */
  variant?: 'emerald' | 'teal';
  /** Size variant */
  size?: 'sm' | 'md';
}

/**
 * A self-contained tab group with an animated CSS sliding pill indicator
 * and an iOS / iPadOS-style "lupa" (liquid glass magnifying lens) hover effect.
 */
export const SlidingTabGroup: React.FC<SlidingTabGroupProps> = ({
  tabs,
  activeIndex,
  onChange,
  className = '',
  variant = 'emerald',
  size = 'md',
}) => {
  const { containerRef, pill } = useSlidingPill(activeIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPill, setHoverPill] = useState<{ left: number; width: number } | null>(null);

  const measureHover = useCallback((idx: number | null) => {
    if (idx === null) return;
    const container = containerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLElement>('[data-tab-item]');
    const btn = buttons[idx];
    if (!btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setHoverPill({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [containerRef]);

  const handleMouseEnter = (idx: number) => {
    setHoveredIndex(idx);
    measureHover(idx);
  };

  const handleMouseLeaveContainer = () => {
    setHoveredIndex(null);
  };

  const pillBg =
    variant === 'teal'
      ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25 dark:bg-teal-500 dark:border dark:border-teal-300/40 dark:shadow-[0_0_18px_rgba(45,212,191,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
      : 'bg-emerald-600 text-white border border-emerald-400/40 shadow-md shadow-emerald-500/25 dark:bg-emerald-500 dark:border-emerald-300/40 dark:shadow-[0_0_18px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]';

  const px = size === 'sm' ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-xs';

  return (
    <div
      className={`rounded-full p-1.5 border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-sm ${className}`}
    >
      <div
        ref={containerRef}
        onMouseLeave={handleMouseLeaveContainer}
        className="relative flex items-center"
      >
      {/* ─── Active Route Solid Pill ─── */}
      {pill && (
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 rounded-full pointer-events-none shadow-sm shadow-emerald-600/20 ${pillBg}`}
          style={{
            left: 0,
            width: pill.width,
            transform: `translate3d(${pill.left}px, 0, 0)`,
            transition: 'transform 380ms cubic-bezier(0.16,1,0.3,1), width 380ms cubic-bezier(0.16,1,0.3,1)',
            willChange: 'transform, width',
          }}
        />
      )}

      {/* ─── iOS / iPadOS Liquid Glass "Lupa" Magnifier Hover Capsule ─── */}
      {hoverPill && (
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 rounded-full pointer-events-none bg-emerald-500/10 dark:bg-white/10 border border-emerald-500/20 dark:border-white/15 ${
            hoveredIndex !== null && hoveredIndex !== activeIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
          style={{
            left: 0,
            width: hoverPill.width,
            transform: `translate3d(${hoverPill.left}px, 0, 0)`,
            transition: 'transform 250ms cubic-bezier(0.16,1,0.3,1), width 250ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease',
            willChange: 'transform, width, opacity',
          }}
        />
      )}

      {/* ─── Tab buttons ─── */}
      {tabs.map((tab, idx) => {
        const isActive = idx === activeIndex;
        const isHovered = idx === hoveredIndex;

        return (
          <button
            key={tab.label}
            data-tab-item
            onClick={() => onChange(idx)}
            onMouseEnter={() => handleMouseEnter(idx)}
            className={`relative z-10 flex items-center space-x-2 ${px} rounded-full select-none whitespace-nowrap transition-colors duration-200 ${
              isActive
                ? 'text-white dark:text-slate-950 font-bold'
                : 'text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 font-semibold'
            }`}
          >
            {tab.icon && (
              <span
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'text-white dark:text-slate-950 opacity-100'
                    : isHovered
                    ? 'text-emerald-600 dark:text-emerald-400 opacity-100'
                    : 'text-slate-500 dark:text-slate-400 opacity-80'
                }`}
              >
                {tab.icon}
              </span>
            )}
            <span className="transition-colors">{tab.label}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
};

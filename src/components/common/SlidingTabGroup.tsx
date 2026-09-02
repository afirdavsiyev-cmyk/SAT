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
      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 dark:bg-teal-500 dark:border dark:border-teal-300/40 dark:shadow-[0_0_18px_rgba(45,212,191,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
      : 'bg-orange-600 text-white border border-orange-400/40 shadow-md shadow-orange-500/25 dark:bg-emerald-500 dark:border-emerald-300/40 dark:shadow-[0_0_18px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]';

  const px = size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2 text-xs';

  return (
    <div
      ref={containerRef}
      onMouseLeave={handleMouseLeaveContainer}
      className={`relative flex items-center bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-amber-900/15 dark:border-slate-800 hover:border-orange-500/30 dark:hover:border-emerald-500/35 shadow-sm rounded-full p-1.5 transition-colors ${className}`}
    >
      {/* ─── Active Route Solid Pill ─── */}
      {pill && (
        <span
          aria-hidden="true"
          className={`absolute top-1.5 bottom-1.5 rounded-full pointer-events-none ${pillBg}`}
          style={{
            left: pill.left,
            width: pill.width,
            transition: 'left 380ms cubic-bezier(0.16,1,0.3,1), width 380ms cubic-bezier(0.16,1,0.3,1)',
            willChange: 'left, width',
          }}
        />
      )}

      {/* ─── iOS / iPadOS Liquid Glass "Lupa" Magnifier Hover Capsule ─── */}
      {hoverPill && (
        <span
          aria-hidden="true"
          className={`absolute top-1.5 bottom-1.5 rounded-full pointer-events-none bg-orange-100/60 dark:bg-white/15 backdrop-blur-md border border-orange-200/80 dark:border-white/20 shadow-[0_4px_16px_rgba(234,88,12,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] ${
            hoveredIndex !== null && hoveredIndex !== activeIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
          style={{
            left: hoverPill.left,
            width: hoverPill.width,
            transition: 'left 250ms cubic-bezier(0.16,1,0.3,1), width 250ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease, transform 250ms cubic-bezier(0.16,1,0.3,1)',
            willChange: 'left, width, opacity, transform',
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
            className={`relative z-10 flex items-center space-x-1.5 ${px} rounded-full select-none whitespace-nowrap transition-transform duration-200 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${
              isActive
                ? 'text-white dark:text-slate-950 font-black'
                : 'text-slate-700 hover:text-orange-600 dark:text-slate-300 dark:hover:text-emerald-400 font-semibold'
            }`}
          >
            {tab.icon && (
              <span
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'text-white dark:text-slate-950 opacity-100'
                    : isHovered
                    ? 'text-orange-600 dark:text-emerald-400 opacity-100'
                    : 'text-slate-600 group-hover:text-orange-600 dark:text-slate-400 dark:group-hover:text-white opacity-80'
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
  );
};

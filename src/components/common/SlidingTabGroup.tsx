import React from 'react';
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
 * A self-contained tab group with an animated CSS sliding pill indicator.
 *
 * The active pill glides between tabs using a spring-like cubic-bezier transition
 * without any external animation library.
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

  const pillBg =
    variant === 'teal'
      ? 'bg-teal-500/90 border border-teal-300/30 shadow-[0_0_18px_rgba(45,212,191,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]'
      : 'bg-emerald-500/90 border border-emerald-300/30 shadow-[0_0_18px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]';

  const px = size === 'sm' ? 'px-3 py-1.5 text-[11px]' : 'px-5 py-2.5 text-xs';

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center backdrop-blur-xl bg-white/[0.05] border border-white/[0.10] rounded-full p-1 ${className}`}
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.3)' }}
    >
      {/* Sliding liquid pill — absolutely positioned */}
      {pill && (
        <span
          aria-hidden="true"
          className={`absolute top-1 bottom-1 rounded-full backdrop-blur-xl pointer-events-none ${pillBg}`}
          style={{
            left: pill.left,
            width: pill.width,
            transition: 'left 380ms cubic-bezier(0.16,1,0.3,1), width 380ms cubic-bezier(0.16,1,0.3,1)',
            willChange: 'left, width',
          }}
        />
      )}

      {/* Tab buttons — rendered on top of the pill */}
      {tabs.map((tab, idx) => (
        <button
          key={tab.label}
          data-tab-item
          onClick={() => onChange(idx)}
          className={`relative z-10 flex items-center space-x-1.5 ${px} rounded-full font-bold transition-colors duration-200 select-none whitespace-nowrap ${
            idx === activeIndex
              ? variant === 'teal'
                ? 'text-slate-950'
                : 'text-slate-950'
              : 'text-slate-400 hover:text-slate-100'
          }`}
          style={{ transition: 'color 200ms ease' }}
        >
          {tab.icon && (
            <span className={`flex-shrink-0 ${idx === activeIndex ? 'opacity-100' : 'opacity-60'}`}>
              {tab.icon}
            </span>
          )}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

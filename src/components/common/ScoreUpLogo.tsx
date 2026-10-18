import React, { useRef } from 'react';

interface ScoreUpLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const ScoreUpLogo: React.FC<ScoreUpLogoProps> = ({
  className = '',
  showSubtitle = true,
  size = 'md',
  onClick,
}) => {
  const tapHistoryRef = useRef<number[]>([]);

  const handleContainerClick = (e: React.MouseEvent) => {
    const now = Date.now();
    // Keep taps occurring within the last 1200ms
    const recentTaps = tapHistoryRef.current.filter((t) => now - t < 1200);
    recentTaps.push(now);
    tapHistoryRef.current = recentTaps;

    if (recentTaps.length >= 3) {
      tapHistoryRef.current = [];
      // Dual-Factor Stealth Trigger: 3-tap gesture completed on app logo
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scoreup_trigger_admin_stealth'));
      }
      return;
    }

    onClick?.();
  };

  const sizeClasses = {
    sm: {
      badge: 'w-8 h-8 rounded-lg p-0.5',
      text: 'text-lg',
      subtitle: 'text-[10px]',
    },
    md: {
      badge: 'w-10 h-10 rounded-xl p-1',
      text: 'text-xl',
      subtitle: 'text-[11px]',
    },
    lg: {
      badge: 'w-12 h-12 rounded-2xl p-1.5',
      text: 'text-2xl',
      subtitle: 'text-xs',
    },
  }[size];

  return (
    <div
      onClick={handleContainerClick}
      className={`relative group cursor-pointer flex items-center gap-3 select-none ${className}`}
    >
      {/* ─── ScoreUp Emblem Badge ─── */}
      <div
        className={`relative ${sizeClasses.badge} bg-white border border-slate-200/90 dark:border-white/10 shadow-sm group-hover:shadow-[0_0_18px_rgba(245,158,11,0.3)] dark:group-hover:border-amber-400/50 flex items-center justify-center transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        {/* Subtle internal animated ambient glow sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

        {/* Brand Emblem Image */}
        <img
          src="/scoreup-logo.png"
          alt="ScoreUp Logo"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
        />
      </div>

      {/* ─── Platform Branding Text ─── */}
      <div className="flex flex-col text-left">
        <span
          className={`${sizeClasses.text} font-black tracking-tight leading-none text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors`}
        >
          Score<span className="text-emerald-600 dark:text-emerald-400">Up</span>
        </span>
        {showSubtitle && (
          <span className={`${sizeClasses.subtitle} font-semibold text-slate-500 dark:text-slate-400 mt-1`}>
            Digital Bluebook Platform
          </span>
        )}
      </div>
    </div>
  );
};

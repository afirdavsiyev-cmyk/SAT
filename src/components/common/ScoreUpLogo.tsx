import React from 'react';

interface ScoreUpLogoProps {
  className?: string;
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const ScoreUpLogo: React.FC<ScoreUpLogoProps> = ({
  className = '',
  showSubtitle = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer flex items-center gap-3 select-none ${className}`}
    >
      {/* ─── Animated 'S' Monogram Badge ─── */}
      <div className="relative w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 group-hover:border-emerald-500/70 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:group-hover:border-emerald-500/70 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.3)] dark:group-hover:shadow-[0_0_18px_rgba(16,185,129,0.35)] overflow-hidden flex-shrink-0">
        
        {/* Subtle internal animated ambient glow sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 dark:via-emerald-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

        {/* Monogram 'S' */}
        <span className="relative font-black text-2xl tracking-tighter text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(16,185,129,0.25)] dark:drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
          S
        </span>
      </div>

      {/* ─── Platform Branding Text ─── */}
      <div className="flex flex-col text-left">
        <span className="text-xl font-black tracking-tight leading-none text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
          Score<span className="text-emerald-600 dark:text-emerald-400">Up</span>
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Digital Bluebook Platform
          </span>
        )}
      </div>
    </div>
  );
};

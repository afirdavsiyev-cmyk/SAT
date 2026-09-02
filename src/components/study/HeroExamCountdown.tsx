import React, { useState, useEffect } from 'react';

interface HeroExamCountdownProps {
  targetDate?: string;
  className?: string;
}

const KNOWN_EXAM_DATES: Record<string, string> = {
  'October 2026': '2026-10-03T08:00:00',
  'November 2026': '2026-11-07T08:00:00',
  'December 2026': '2026-12-05T08:00:00',
  'March 2027': '2027-03-13T08:00:00',
  'May 2027': '2027-05-01T08:00:00',
  'June 2027': '2027-06-05T08:00:00',
};

const resolveExamDate = (rawDate?: string | null): Date => {
  if (!rawDate) return new Date('2026-10-03T08:00:00');

  if (KNOWN_EXAM_DATES[rawDate]) {
    return new Date(KNOWN_EXAM_DATES[rawDate]);
  }

  const parsed = new Date(rawDate);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return new Date('2026-10-03T08:00:00');
};

export const HeroExamCountdown: React.FC<HeroExamCountdownProps> = ({ targetDate: propTargetDate, className = '' }) => {
  const [activeTargetDate, setActiveTargetDate] = useState<string>(() => {
    if (propTargetDate) return propTargetDate;
    try {
      const stored = localStorage.getItem('study_planner_target_date');
      if (stored) return stored;
    } catch {
      // ignore
    }
    return '2026-10-03T08:00:00';
  });

  useEffect(() => {
    if (propTargetDate) {
      setActiveTargetDate(propTargetDate);
    }
  }, [propTargetDate]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'study_planner_target_date' && e.newValue) {
        setActiveTargetDate(e.newValue);
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveTargetDate(customEvent.detail);
      } else {
        try {
          const stored = localStorage.getItem('study_planner_target_date');
          if (stored) setActiveTargetDate(stored);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('study_planner_target_date_changed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('study_planner_target_date_changed', handleCustomEvent);
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const examDate = resolveExamDate(activeTargetDate);

    const updateTimer = () => {
      const diff = Math.max(0, examDate.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeTargetDate]);

  return (
    <div className={`flex items-center gap-2 sm:gap-3 bg-amber-500/10 dark:bg-slate-950/70 p-3 sm:p-3.5 rounded-2xl border border-amber-500/30 dark:border-emerald-500/30 shadow-inner select-none ${className}`}>
      {/* Days */}
      <div className="flex flex-col items-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-amber-500/30 dark:border-emerald-500/20 shadow-sm">
        <span className="font-mono text-2xl sm:text-3xl font-black text-amber-600 dark:text-emerald-400">
          {timeLeft.days}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900/70 dark:text-slate-400 mt-0.5">Days</span>
      </div>

      <span className="text-xl font-black text-amber-500/50 dark:text-emerald-500/40">:</span>

      {/* Hours */}
      <div className="flex flex-col items-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-amber-500/30 dark:border-emerald-500/20 shadow-sm">
        <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900/70 dark:text-slate-400 mt-0.5">Hours</span>
      </div>

      <span className="text-xl font-black text-amber-500/50 dark:text-emerald-500/40">:</span>

      {/* Mins */}
      <div className="flex flex-col items-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-amber-500/30 dark:border-emerald-500/20 shadow-sm">
        <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {String(timeLeft.mins).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900/70 dark:text-slate-400 mt-0.5">Mins</span>
      </div>

      <span className="text-xl font-black text-amber-500/50 dark:text-emerald-500/40">:</span>

      {/* Secs */}
      <div className="flex flex-col items-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-amber-500/30 dark:border-emerald-500/20 shadow-sm">
        <span className="font-mono text-2xl sm:text-3xl font-black text-amber-600 dark:text-emerald-400 w-8 sm:w-10 text-center">
          {String(timeLeft.secs).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900/70 dark:text-slate-400 mt-0.5">Secs</span>
      </div>
    </div>
  );
};
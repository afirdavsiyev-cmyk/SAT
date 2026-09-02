import React, { useState, useEffect } from 'react';

interface ExamCountdownPillProps {
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

  // Check known exam administration name mapping
  if (KNOWN_EXAM_DATES[rawDate]) {
    return new Date(KNOWN_EXAM_DATES[rawDate]);
  }

  const parsed = new Date(rawDate);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  // Fallback: first Saturday of October 2026 at 8:00 AM
  return new Date('2026-10-03T08:00:00');
};

export const ExamCountdownPill: React.FC<ExamCountdownPillProps> = ({ targetDate: propTargetDate, className = '' }) => {
  // Sync with prop, localStorage, or fallback
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

  // Keep local state synced if prop changes
  useEffect(() => {
    if (propTargetDate) {
      setActiveTargetDate(propTargetDate);
    }
  }, [propTargetDate]);

  // Reactive listener for storage updates or custom events from Study Planner
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
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-emerald-500/10 border border-amber-500/30 dark:border-emerald-500/30 text-amber-900 dark:text-emerald-400 select-none shadow-[0_0_12px_rgba(245,158,11,0.12)] dark:shadow-[0_0_12px_rgba(16,185,129,0.15)] ${className}`}>
      {/* Pulsing clock icon */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-emerald-500"></span>
      </span>

      <span className="text-[11px] font-bold tracking-wide uppercase text-amber-900/70 dark:text-slate-400">Exam In:</span>

      <div className="flex items-center gap-1 font-mono font-bold text-xs text-slate-900 dark:text-white">
        <span>{timeLeft.days}<span className="text-amber-600 dark:text-emerald-400 font-sans text-[10px] ml-0.5">d</span></span>
        <span className="text-amber-500/60 dark:text-emerald-500/60">:</span>
        <span>{String(timeLeft.hours).padStart(2, '0')}<span className="text-amber-600 dark:text-emerald-400 font-sans text-[10px] ml-0.5">h</span></span>
        <span className="text-amber-500/60 dark:text-emerald-500/60">:</span>
        <span>{String(timeLeft.mins).padStart(2, '0')}<span className="text-amber-600 dark:text-emerald-400 font-sans text-[10px] ml-0.5">m</span></span>
        <span className="text-amber-500/60 dark:text-emerald-500/60">:</span>
        <span className="text-amber-600 dark:text-emerald-400 w-5 inline-block text-left">{String(timeLeft.secs).padStart(2, '0')}s</span>
      </div>
    </div>
  );
};
import React from 'react';
import { Clock, AlertTriangle, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

export interface SessionTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onExtend: () => void;
  onLogout: () => void;
  isExpired?: boolean;
  onCloseExpired?: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  remainingSeconds,
  onExtend,
  onLogout,
  isExpired = false,
  onCloseExpired,
}) => {
  if (!isOpen && !isExpired) {
    return null;
  }

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Expiration modal view
  if (isExpired) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      >
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h3
              id="session-expired-title"
              className="text-xl font-bold text-slate-900 dark:text-white mb-2"
            >
              Session Expired
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Your session has ended due to inactivity to protect your account. Please sign in again to continue where you left off.
            </p>

            <button
              type="button"
              onClick={onCloseExpired || onLogout}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Warning modal view
  const isUrgent = remainingSeconds <= 30;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Top ambient progress bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300 ${
            isUrgent
              ? 'bg-gradient-to-r from-red-500 to-rose-600 animate-pulse'
              : 'bg-gradient-to-r from-amber-500 to-indigo-500'
          }`}
        />

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
              isUrgent
                ? 'bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                : 'bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isUrgent ? (
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            ) : (
              <Clock className="w-7 h-7" />
            )}
          </div>

          <h3
            id="session-warning-title"
            className="text-xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Session Expiring Soon
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            You have been inactive for a while. For your security, you will be signed out in:
          </p>

          {/* Large Countdown Display */}
          <div
            className={`py-3 px-6 rounded-2xl border font-mono text-3xl font-extrabold tracking-wider mb-6 flex items-center gap-2 ${
              isUrgent
                ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
            }`}
          >
            <Clock className="w-6 h-6 opacity-75" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onExtend}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Stay Signed In
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="py-3 px-4 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;

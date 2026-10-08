import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeContainer = size === 'sm' ? 'rounded-xl' : 'rounded-full';
  const sizeClasses = size === 'sm' ? 'p-1.5 text-xs' : 'p-2 text-sm';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300 active:scale-95 shadow-sm ${sizeContainer} ${sizeClasses} ${
        isDark
          ? 'bg-slate-900/90 text-emerald-400 hover:bg-slate-800'
          : 'bg-white/90 text-emerald-600 hover:bg-slate-50'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};

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

  const sizeClasses = size === 'sm' ? 'p-1.5 rounded-lg text-xs' : 'p-2 rounded-xl text-sm';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center transition-all duration-300 active:scale-95 border ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/80 text-amber-300 hover:text-amber-200 shadow-sm'
          : 'bg-white/90 hover:bg-white border-slate-200 text-indigo-600 hover:text-indigo-700 shadow-sm'
      } ${sizeClasses} ${className}`}
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

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { HoverBorderGradient } from '../ui/hover-border-gradient';

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
    <HoverBorderGradient
      as="button"
      type="button"
      onClick={toggleTheme}
      containerClassName={`${sizeContainer} ${className}`}
      className={`inline-flex items-center justify-center transition-all duration-300 active:scale-95 ${sizeClasses} ${
        isDark
          ? 'bg-slate-900/90 text-emerald-400'
          : 'bg-white/90 text-emerald-600'
      }`}
      innerMaskClassName={isDark ? 'bg-slate-900/90' : 'bg-white/90'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </HoverBorderGradient>
  );
};

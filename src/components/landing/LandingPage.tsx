import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { HeroSection } from './HeroSection';
import { StatsBar } from './StatsBar';
import { BentoGrid } from './BentoGrid';
import { HowItWorks } from './HowItWorks';
import { YouTubeBanner } from './YouTubeBanner';
import { ScoreComparisonWidget } from './ScoreComparisonWidget';
import { CtaBanner } from './CtaBanner';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full overflow-x-hidden relative bg-transparent">
      {/* Shared Ambient Glow Contours */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-0 bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="relative z-10">
        <HeroSection />
        <StatsBar />
        <BentoGrid />
        <YouTubeBanner />
        <HowItWorks />
        <ScoreComparisonWidget />
        <CtaBanner />
      </div>
    </div>
  );
};

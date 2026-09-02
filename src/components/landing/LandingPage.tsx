import React from 'react';
import { HeroSection } from './HeroSection';
import { StatsBar } from './StatsBar';
import { BentoGrid } from './BentoGrid';
import { HowItWorks } from './HowItWorks';
import { YouTubeBanner } from './YouTubeBanner';
import { ScoreComparisonWidget } from './ScoreComparisonWidget';
import { CtaBanner } from './CtaBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden relative bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,146,60,0.18),rgba(255,255,255,0.9))] dark:bg-none bg-[#FAF7F2] dark:bg-transparent">
      {/* Subtle warm dot-grid contours */}
      <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-0 bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

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

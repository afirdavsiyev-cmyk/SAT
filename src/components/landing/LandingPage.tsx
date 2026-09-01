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
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <StatsBar />
      <BentoGrid />
      <YouTubeBanner />
      <HowItWorks />
      <ScoreComparisonWidget />
      <CtaBanner />
    </div>
  );
};

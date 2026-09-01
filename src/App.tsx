import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MathBackground } from './components/common/MathBackground';
import { LandingPage } from './components/landing/LandingPage';
import { StudyPlanWizard } from './components/onboarding/StudyPlanWizard';
import { DashboardView } from './components/dashboard/DashboardView';
import { ExamInterface } from './components/exam/ExamInterface';
import { ResultsReviewView } from './components/review/ResultsReviewView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 relative">
      {/* Ambient Math Visual Background (Cartesian Grid & Floating Geometry) */}
      <MathBackground />

      {/* Show Global Navbar on landing, onboarding, leaderboard, review (hidden on study hub workspace & exam) */}
      {currentView !== 'exam' && currentView !== 'dashboard' && <Navbar />}

      <main className="flex-1 relative z-10">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'onboarding' && <StudyPlanWizard />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'exam' && <ExamInterface />}
        {currentView === 'review' && <ResultsReviewView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* Render Footer EXCLUSIVELY on root Landing/Welcome page */}
      {currentView === 'landing' && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

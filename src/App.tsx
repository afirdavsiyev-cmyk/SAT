import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
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
import { OnboardingWizardModal } from './components/auth/OnboardingWizardModal';
import { AuthModal } from './components/auth/AuthModal';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  useEffect(() => {
    const handleLoginSuccess = (e: Event) => {
      const customEvent = e as CustomEvent<{ view?: string }>;
      if (customEvent.detail?.view) {
        setCurrentView(customEvent.detail.view as any);
      }
    };
    window.addEventListener('scoreup_login_success', handleLoginSuccess);
    return () => window.removeEventListener('scoreup_login_success', handleLoginSuccess);
  }, [setCurrentView]);

  return (
    <div className="bg-[#FAF7F2] text-slate-900 dark:bg-[#070b12] dark:text-slate-100 min-h-screen flex flex-col justify-between transition-colors duration-200 relative">
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

      {/* Interactive Onboarding Wizard Modal */}
      <OnboardingWizardModal />

      {/* Global Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

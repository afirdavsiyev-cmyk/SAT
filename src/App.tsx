import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { SessionTimeoutModal } from './components/auth/SessionTimeoutModal';
import { useSessionTimeout } from './hooks/useSessionTimeout';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const { isAuthenticated, logout, openAuthModal } = useAuth();
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const {
    isWarningOpen,
    remainingSeconds,
    extendSession,
    logoutNow,
  } = useSessionTimeout({
    enabled: isAuthenticated,
    onTimeout: () => {
      logout();
      setShowExpiredModal(true);
    },
  });

  const handleCloseExpired = () => {
    setShowExpiredModal(false);
    openAuthModal('login');
  };

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

  // Ensure view resets to beginning on mount / navigation to landing
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView]);

  return (
    <div className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-slate-100 min-h-screen flex flex-col justify-between transition-colors duration-200 relative">
      {/* Ambient Math & Interactive Aceternity Background */}
      <MathBackground />

      {/* Show Global Navbar on landing, onboarding, leaderboard, review (hidden on study hub workspace & exam) */}
      {currentView !== 'exam' && currentView !== 'dashboard' && <Navbar />}

      <main className={`flex-1 relative z-10 ${currentView !== 'landing' && currentView !== 'exam' && currentView !== 'dashboard' ? 'pt-16' : ''}`}>
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

      {/* Session Inactivity Timeout Warning & Expiration Modal */}
      <SessionTimeoutModal
        isOpen={isWarningOpen}
        remainingSeconds={remainingSeconds}
        onExtend={extendSession}
        onLogout={() => {
          logoutNow();
          logout();
        }}
        isExpired={showExpiredModal}
        onCloseExpired={handleCloseExpired}
      />
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

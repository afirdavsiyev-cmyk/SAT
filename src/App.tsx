import React, { useEffect, useState, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MathBackground } from './components/common/MathBackground';
import { LandingPage } from './components/landing/LandingPage';
import { StudyPlanWizard } from './components/onboarding/StudyPlanWizard';
import { DashboardView } from './components/dashboard/DashboardView';
import { ResultsReviewView } from './components/review/ResultsReviewView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { OnboardingWizardModal } from './components/auth/OnboardingWizardModal';
import { AuthModal } from './components/auth/AuthModal';
import { SessionTimeoutModal } from './components/auth/SessionTimeoutModal';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { ViewSkeleton } from './components/common/ViewSkeleton';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Code-split heavy views with React.lazy
const ExamView = lazy(() => import('./components/exam/ExamView'));
const PracticeRoomView = lazy(() => import('./components/study/PracticeRoomView'));
const SatBooksLibraryView = lazy(() => import('./components/study/SatBooksLibraryView'));
const ScoreUpAITutorView = lazy(() => import('./components/study/ScoreUpAITutorView'));
const AdminDashboardView = lazy(() => import('./components/admin/AdminDashboardView'));
import { QuestionDisputeModal } from './components/common/QuestionDisputeModal';
import { AdminPasskeyModal } from './components/admin/AdminPasskeyModal';
import { logoutAdmin, isAdminAuthenticated } from './services/adminService';

const MainContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isDisputeModalOpen,
    disputeTargetQuestion,
    closeDisputeModal,
    isAdminPasskeyModalOpen,
    openAdminPasskeyModal,
    closeAdminPasskeyModal,
    armStealthShortcut,
  } = useApp();
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

  // Dual-Factor Stealth Trigger:
  // Step 1: Ctrl+Shift+A arms the sequence. Step 2 requires double-clicking footer version OR 3-tap app logo.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        // Arms the sequence; does NOT open modal directly
        armStealthShortcut();
      }
    };

    const handleTriggerStealth = () => {
      openAdminPasskeyModal();
    };

    const handleHashCheck = () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#/admin' || hash === '#admin') {
        setCurrentView('admin');
      }
    };

    // Check hash on mount
    handleHashCheck();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashCheck);
    window.addEventListener('scoreup_trigger_admin_stealth', handleTriggerStealth);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashCheck);
      window.removeEventListener('scoreup_trigger_admin_stealth', handleTriggerStealth);
    };
  }, [setCurrentView, armStealthShortcut, openAdminPasskeyModal]);

  // Ensure admin session does NOT linger when user navigates away from admin view
  useEffect(() => {
    if (currentView !== 'admin') {
      logoutAdmin();
    }
  }, [currentView]);

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

      {/* Show Global Navbar on landing, onboarding, leaderboard, review (hidden on study hub workspace, exam, & admin) */}
      {currentView !== 'exam' && currentView !== 'dashboard' && currentView !== 'admin' && <Navbar />}

      <main className={`flex-1 relative z-10 ${currentView !== 'landing' && currentView !== 'exam' && currentView !== 'dashboard' && currentView !== 'admin' ? 'pt-16' : ''}`}>
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'onboarding' && <StudyPlanWizard />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'exam' && (
          <Suspense fallback={<ViewSkeleton title="Loading Bluebook Exam Interface..." />}>
            <ExamView />
          </Suspense>
        )}
        {currentView === 'practice' && (
          <Suspense fallback={<ViewSkeleton title="Loading Practice Room..." />}>
            <PracticeRoomView questions={[]} selectedTopicName="SAT Math Practice" onGoBack={() => setCurrentView('dashboard')} />
          </Suspense>
        )}
        {currentView === 'books' && (
          <Suspense fallback={<ViewSkeleton title="Loading SAT Math Digital Library..." />}>
            <SatBooksLibraryView />
          </Suspense>
        )}
        {currentView === 'ai_tutor' && (
          <Suspense fallback={<ViewSkeleton title="Loading ScoreUP AI Tutor..." />}>
            <ErrorBoundary name="ScoreUp AI Tutor">
              <ScoreUpAITutorView />
            </ErrorBoundary>
          </Suspense>
        )}
        {currentView === 'admin' && (
          <Suspense fallback={<ViewSkeleton title="Loading ScoreUp Admin & AI Studio..." />}>
            <AdminDashboardView initialAuthenticated={isAdminAuthenticated()} />
          </Suspense>
        )}
        {currentView === 'review' && <ResultsReviewView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* Global Question Dispute Reporting Modal */}
      <QuestionDisputeModal
        isOpen={isDisputeModalOpen}
        onClose={closeDisputeModal}
        question={disputeTargetQuestion}
      />

      {/* Render Footer EXCLUSIVELY on root Landing/Welcome page */}
      {currentView === 'landing' && <Footer />}

      {/* Interactive Onboarding Wizard Modal */}
      <OnboardingWizardModal />

      {/* Global Authentication Modal */}
      <AuthModal />

      {/* Dual-Factor Stealth Admin Passkey Gate Modal */}
      <AdminPasskeyModal
        isOpen={isAdminPasskeyModalOpen}
        onClose={closeAdminPasskeyModal}
        onUnlocked={() => {
          closeAdminPasskeyModal();
          setCurrentView('admin');
        }}
      />

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

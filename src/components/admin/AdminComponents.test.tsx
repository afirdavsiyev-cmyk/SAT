import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { QuestionDisputeModal } from '../common/QuestionDisputeModal';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminPasskeyModal } from './AdminPasskeyModal';
import { StudySidebar } from '../study/StudySidebar';
import { ScoreUpLogo } from '../common/ScoreUpLogo';
import { Footer } from '../common/Footer';
import {
  clearAdminPasskeyFailures,
  getAdminSessionState,
  isAdminAuthenticated,
  verifyAdminPasskey,
  changeAdminPasskey,
  resetAdminPasskeyToDefault,
} from '../../services/adminService';
import { Question } from '../../types';

const sampleQuestion: Question = {
  id: 'pt1-m1-q01',
  number: 1,
  section: 'math',
  module: 1,
  domain: 'Algebra',
  difficulty: 'Easy',
  prompt: 'If $4x + 12 = 36$, what is the value of $x$?',
  type: 'multiple_choice',
  options: [
    { id: 'A', text: '$4$' },
    { id: 'B', text: '$6$' },
    { id: 'C', text: '$8$' },
    { id: 'D', text: '$12$' },
  ],
  correctAnswer: 'B',
  explanation: 'Subtract 12 then divide by 4.',
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>{ui}</AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('QuestionDisputeModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders correctly when open and displays question prompt', () => {
    renderWithProviders(
      <QuestionDisputeModal
        isOpen={true}
        onClose={vi.fn()}
        question={sampleQuestion}
      />
    );

    expect(screen.getByText('Report Question Dispute')).toBeDefined();
    expect(screen.getByText(/Question #1/i)).toBeDefined();
    expect(screen.getByText('Incorrect Answer Key')).toBeDefined();
    expect(screen.getByText('Broken Formula / KaTeX')).toBeDefined();
  });

  it('validates description and submits dispute report', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    renderWithProviders(
      <QuestionDisputeModal
        isOpen={true}
        onClose={handleClose}
        question={sampleQuestion}
        onSubmitSuccess={handleSuccess}
      />
    );

    // Try submitting without description -> shows validation error
    const submitBtn = screen.getByRole('button', { name: /Submit Dispute/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Please describe the problem you noticed.')).toBeDefined();

    // Fill in description
    const textarea = screen.getByPlaceholderText(/Explain what is incorrect/i);
    fireEvent.change(textarea, { target: { value: 'Formula has typo in choice B' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Dispute Report Submitted!')).toBeDefined();
    });
    expect(handleSuccess).toHaveBeenCalled();
  });
});

describe('AdminDashboardView', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('displays lock screen when unauthenticated', () => {
    renderWithProviders(<AdminDashboardView />);

    expect(screen.getByText('Admin & AI Studio Access')).toBeDefined();
    expect(screen.getByPlaceholderText(/Enter administrative passkey/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Unlock Admin Studio/i })).toBeDefined();
  });

  it('rejects invalid passkey with error message', async () => {
    renderWithProviders(<AdminDashboardView />);

    const input = screen.getByPlaceholderText(/Enter administrative passkey/i);
    const button = screen.getByRole('button', { name: /Unlock Admin Studio/i });

    fireEvent.change(input, { target: { value: 'invalid-passkey-xyz' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Invalid admin passkey/i)).toBeDefined();
    });
  });

  it('unlocks studio with valid passkey and displays tabs', async () => {
    renderWithProviders(<AdminDashboardView />);

    const input = screen.getByPlaceholderText(/Enter administrative passkey/i);
    const button = screen.getByRole('button', { name: /Unlock Admin Studio/i });

    fireEvent.change(input, { target: { value: 'scoreup2026' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('ScoreUp Admin & AI Studio')).toBeDefined();
    });

    expect(screen.getByText('Cohort Analytics')).toBeDefined();
    expect(screen.getByText('Users & Disputes')).toBeDefined();
    expect(screen.getByText('AI Question Studio')).toBeDefined();
    expect(screen.getByText('Practice Test Studio')).toBeDefined();
  });

  it('renders dashboard immediately without duplicate lock screen if already authenticated via session or modal', async () => {
    // 1. Simulate authentication from AdminPasskeyModal
    const success = await verifyAdminPasskey('scoreup2026');
    expect(success).toBe(true);
    expect(isAdminAuthenticated()).toBe(true);

    // 2. Render AdminDashboardView without initialAuthenticated prop
    renderWithProviders(<AdminDashboardView />);

    // 3. Must immediately render authenticated Admin Studio, bypassing passkey gate completely
    await waitFor(() => {
      expect(screen.getByText('ScoreUp Admin & AI Studio')).toBeDefined();
    });
    expect(screen.queryByText('Admin & AI Studio Access')).toBeNull();
    expect(screen.queryByPlaceholderText(/Enter administrative passkey/i)).toBeNull();
  });

  it('switches tabs when clicked', async () => {
    renderWithProviders(<AdminDashboardView initialAuthenticated={true} />);

    expect(screen.getByText('ScoreUp Admin & AI Studio')).toBeDefined();

    // Click Practice Test Studio tab
    const testBuilderTabBtn = screen.getByRole('button', { name: /Practice Test Studio/i });
    fireEvent.click(testBuilderTabBtn);

    await waitFor(() => {
      expect(screen.getByText(/Full-Length Digital SAT Practice Test Generator/i)).toBeDefined();
    });

    // Click AI Question Studio tab
    const questionGenTabBtn = screen.getByRole('button', { name: /AI Question Studio/i });
    fireEvent.click(questionGenTabBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/AI Question Studio/i).length).toBeGreaterThanOrEqual(1);
    });

    // Click Security & Passkey tab
    const securityTabBtn = screen.getByRole('button', { name: /Security & Passkey/i });
    fireEvent.click(securityTabBtn);

    await waitFor(() => {
      expect(screen.getByText('Security & Passkey Settings')).toBeDefined();
      expect(screen.getByText(/Update Administrative Passkey/i)).toBeDefined();
    });
  });

  it('toggles Manual Question Creator mode and renders all required input fields and split preview', async () => {
    renderWithProviders(<AdminDashboardView initialAuthenticated={true} />);

    // Navigate to Question Studio
    fireEvent.click(screen.getByRole('button', { name: /AI Question Studio/i }));

    // Switch to Manual Question Creator
    const manualBtn = await screen.findByRole('button', { name: /Manual Question Creator/i });
    fireEvent.click(manualBtn);

    await waitFor(() => {
      expect(screen.getByText('Manual Question Authoring Studio')).toBeDefined();
      expect(screen.getByText('Live KaTeX Split Preview')).toBeDefined();
      expect(screen.getByRole('button', { name: /Save to Question Bank/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Copy Question JSON/i })).toBeDefined();
    });
  });

  it('toggles Manual / JSON Test Importer mode and supports sample loading and validation', async () => {
    renderWithProviders(<AdminDashboardView initialAuthenticated={true} />);

    // Navigate to Practice Test Studio
    fireEvent.click(screen.getByRole('button', { name: /Practice Test Studio/i }));

    // Switch to Manual / JSON Test Importer
    const importerBtn = await screen.findByRole('button', { name: /Manual \/ JSON Test Importer/i });
    fireEvent.click(importerBtn);

    await waitFor(() => {
      expect(screen.getByText('Manual / JSON Practice Test Importer')).toBeDefined();
      expect(screen.getByRole('button', { name: /Load Sample JSON Template/i })).toBeDefined();
    });

    // Click load sample
    fireEvent.click(screen.getByRole('button', { name: /Load Sample JSON Template/i }));

    // Click validate
    fireEvent.click(screen.getByRole('button', { name: /Validate & Sort Questions/i }));

    await waitFor(() => {
      expect(screen.getByText(/Validated 3 total questions/i)).toBeDefined();
      expect(screen.getByText(/Calibrated Test Blueprint Preview/i)).toBeDefined();
    });
  });

  it('hides all visible admin entry points from regular student sidebar navigation', () => {
    renderWithProviders(
      <StudySidebar
        activeTab="home"
        onSelectTab={vi.fn()}
        isCollapsed={false}
        onToggleCollapse={vi.fn()}
      />
    );

    // Verify student sidebar has NO visible admin buttons or links
    expect(screen.queryByText(/Admin & Studio/i)).toBeNull();
    expect(screen.queryByText(/Admin & Content Studio/i)).toBeNull();
    expect(screen.queryByText(/Curriculum Staff/i)).toBeNull();
  });

  it('always requires authentication on open and automatically logs out when unmounted', async () => {
    // 1. Render AdminDashboardView with default props -> must show Passkey Gate screen
    const { unmount } = renderWithProviders(<AdminDashboardView />);
    expect(screen.getByText('Admin & AI Studio Access')).toBeDefined();

    // 2. Unlock with valid passkey
    const input = screen.getByPlaceholderText(/Enter administrative passkey/i);
    const unlockBtn = screen.getByRole('button', { name: /Unlock Admin Studio/i });
    fireEvent.change(input, { target: { value: 'scoreup2026' } });
    fireEvent.click(unlockBtn);

    await waitFor(() => {
      expect(screen.getByText('ScoreUp Admin & AI Studio')).toBeDefined();
    });

    // 3. Unmount view (simulates navigating away)
    unmount();

    // 4. Verify admin session was logged out automatically
    expect(getAdminSessionState().isAuthenticated).toBe(false);
  });
});

describe('AdminPasskeyModal & Dual-Factor Stealth Gateway', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearAdminPasskeyFailures();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearAdminPasskeyFailures();
  });

  it('renders modal when open and handles failed attempts and remaining count', async () => {
    const handleClose = vi.fn();
    const handleUnlocked = vi.fn();

    renderWithProviders(
      <AdminPasskeyModal
        isOpen={true}
        onClose={handleClose}
        onUnlocked={handleUnlocked}
      />
    );

    expect(screen.getByText('Staff Access Verification')).toBeDefined();
    expect(screen.getByText(/5 attempts remaining/i)).toBeDefined();

    const input = screen.getByPlaceholderText(/Enter administrative passkey/i);
    const submitBtn = screen.getByRole('button', { name: /Unlock Admin Studio/i });

    // Enter wrong passkey
    fireEvent.change(input, { target: { value: 'incorrect-pass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid administrative passkey/i)).toBeDefined();
      expect(screen.getAllByText(/4 attempts remaining/i).length).toBeGreaterThanOrEqual(1);
    });
    expect(handleUnlocked).not.toHaveBeenCalled();

    // Enter correct passkey
    fireEvent.change(input, { target: { value: 'scoreup2026' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleUnlocked).toHaveBeenCalled();
    });
  });

  it('triggers stealth gateway on 3-tap gesture on ScoreUpLogo', () => {
    const stealthHandler = vi.fn();
    window.addEventListener('scoreup_trigger_admin_stealth', stealthHandler);

    renderWithProviders(<ScoreUpLogo size="md" />);

    const logo = screen.getByAltText('ScoreUp Logo');

    // 1st click
    fireEvent.click(logo);
    expect(stealthHandler).not.toHaveBeenCalled();

    // 2nd click
    fireEvent.click(logo);
    expect(stealthHandler).not.toHaveBeenCalled();

    // 3rd click within threshold -> triggers stealth event
    fireEvent.click(logo);
    expect(stealthHandler).toHaveBeenCalledTimes(1);

    window.removeEventListener('scoreup_trigger_admin_stealth', stealthHandler);
  });

  it('triggers stealth gateway on double-clicking footer version with shortcut modifier', () => {
    const stealthHandler = vi.fn();
    window.addEventListener('scoreup_trigger_admin_stealth', stealthHandler);

    renderWithProviders(<Footer />);

    const versionElem = screen.getByTestId('footer-version');

    // Double-click without shortcut -> does not trigger
    fireEvent.doubleClick(versionElem);
    expect(stealthHandler).not.toHaveBeenCalled();

    // Double-click with Ctrl+Shift modifiers -> triggers stealth event
    fireEvent.doubleClick(versionElem, { ctrlKey: true, shiftKey: true });
    expect(stealthHandler).toHaveBeenCalledTimes(1);

    window.removeEventListener('scoreup_trigger_admin_stealth', stealthHandler);
  });

  it('updates the single passkey everywhere when changed via AdminSecuritySettingsTab', async () => {
    // 1. Initial state: scoreup2026 works
    expect(await verifyAdminPasskey('scoreup2026', false)).toBe(true);

    // 2. Change passkey to custom
    const changed = await changeAdminPasskey('scoreup2026', 'customPass2026');
    expect(changed).toBe(true);

    // 3. Old passkey fails in verifyAdminPasskey (used by both modal and view)
    expect(await verifyAdminPasskey('scoreup2026', false)).toBe(false);

    // 4. New passkey succeeds in verifyAdminPasskey
    expect(await verifyAdminPasskey('customPass2026', false)).toBe(true);

    // 5. Test AdminPasskeyModal with the new passkey
    const handleUnlocked = vi.fn();
    renderWithProviders(
      <AdminPasskeyModal
        isOpen={true}
        onClose={vi.fn()}
        onUnlocked={handleUnlocked}
      />
    );

    const input = screen.getByPlaceholderText(/Enter administrative passkey/i);
    const submitBtn = screen.getByRole('button', { name: /Unlock Admin Studio/i });

    // Enter old passkey -> fails
    fireEvent.change(input, { target: { value: 'scoreup2026' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid administrative passkey/i)).toBeDefined();
    });
    expect(handleUnlocked).not.toHaveBeenCalled();

    // Enter new custom passkey -> unlocks
    fireEvent.change(input, { target: { value: 'customPass2026' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleUnlocked).toHaveBeenCalled();
    });

    // Reset back to default
    resetAdminPasskeyToDefault();
  });
});


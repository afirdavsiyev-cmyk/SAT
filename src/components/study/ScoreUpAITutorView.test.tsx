import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ScoreUpAITutorView } from './ScoreUpAITutorView';
import { ThemeProvider } from '../../context/ThemeContext';
import * as aiTutorService from '../../services/aiTutor';
import * as geminiService from '../../services/geminiService';

vi.mock('../../services/aiTutor', () => ({
  hasGroqApiKey: vi.fn(),
  getTutorReplyDetailed: vi.fn(),
  getTutorReply: vi.fn(),
}));

vi.mock('../../services/geminiService', () => ({
  sendSocraticChatMessage: vi.fn(),
  generateInstantHint: vi.fn(),
  generateStepByStepSolution: vi.fn(),
}));

describe('ScoreUpAITutorView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  it('renders the AI Tutor initial welcome state with starter questions', () => {
    renderWithProviders(<ScoreUpAITutorView />);

    expect(screen.getByText('ScoreUP AI Tutor')).toBeDefined();
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByText('Quiz me on high-yield Desmos shortcuts')).toBeDefined();
    expect(screen.getByPlaceholderText(/Ask ScoreUP AI anything about SAT Math/i)).toBeDefined();
  });

  it('handles successful API calls with KaTeX math equation rendering', async () => {
    vi.mocked(aiTutorService.hasGroqApiKey).mockReturnValue(true);
    vi.mocked(aiTutorService.getTutorReplyDetailed).mockResolvedValue({
      content: 'Here is the quadratic solution: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$ for $y = 0$.',
      modelUsed: 'llama-3.3-70b-versatile',
    });

    renderWithProviders(<ScoreUpAITutorView />);

    const input = screen.getByPlaceholderText(/Ask ScoreUP AI anything about SAT Math/i);
    fireEvent.change(input, { target: { value: 'How do I solve quadratics?' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('How do I solve quadratics?')).toBeDefined();
    });

    await waitFor(() => {
      // Check that KaTeX rendered the math elements
      expect(document.querySelector('.katex')).not.toBeNull();
      expect(document.querySelector('.katex-display')).not.toBeNull();
    });
  });

  it('handles API errors gracefully without crashing the UI and displays fallback notice with retry', async () => {
    vi.mocked(aiTutorService.hasGroqApiKey).mockReturnValue(true);
    vi.mocked(aiTutorService.getTutorReplyDetailed).mockRejectedValue(new Error('Rate limit exceeded (429)'));
    vi.mocked(geminiService.sendSocraticChatMessage).mockRejectedValue(new Error('Network connection timeout'));

    renderWithProviders(<ScoreUpAITutorView />);

    const input = screen.getByPlaceholderText(/Ask ScoreUP AI anything about SAT Math/i);
    fireEvent.change(input, { target: { value: 'Explain circle equations' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/AI Service Notice/i)).toBeDefined();
      expect(screen.getByText(/Network connection timeout/i)).toBeDefined();
    });

    // Verify Retry button is provided
    expect(screen.getByRole('button', { name: /retry question/i })).toBeDefined();
  });

  it('safely handles malformed KaTeX in AI responses through MathErrorBoundary without crashing', async () => {
    vi.mocked(aiTutorService.hasGroqApiKey).mockReturnValue(true);
    vi.mocked(aiTutorService.getTutorReplyDetailed).mockResolvedValue({
      content: 'Here is broken math: $\\frac{broken$ and $$unclosed block',
      modelUsed: 'llama-3.3-70b-versatile',
    });

    renderWithProviders(<ScoreUpAITutorView />);

    const input = screen.getByPlaceholderText(/Ask ScoreUP AI anything about SAT Math/i);
    fireEvent.change(input, { target: { value: 'Give me complex math' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/Here is broken math/i)).toBeDefined();
    });
  });
});

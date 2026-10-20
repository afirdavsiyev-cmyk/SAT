import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AITutorDrawer } from './AITutorDrawer';
import { ThemeProvider } from '../../context/ThemeContext';
import * as geminiService from '../../services/geminiService';

vi.mock('../../services/geminiService', () => ({
  sendSocraticChatMessage: vi.fn(),
  generateInstantHint: vi.fn(),
  generateStepByStepSolution: vi.fn(),
}));

describe('AITutorDrawer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderDrawer = (props = {}) => {
    return render(
      <ThemeProvider>
        <AITutorDrawer
          isOpen={true}
          onClose={vi.fn()}
          isGeneralMode={true}
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders drawer header and default welcome message', () => {
    renderDrawer();

    expect(screen.getByText('ScoreUP AI Tutor')).toBeDefined();
    expect(screen.getByPlaceholderText(/Ask any SAT Math question/i)).toBeDefined();
  });

  it('renders KaTeX math formulas in response safely', async () => {
    vi.mocked(geminiService.sendSocraticChatMessage).mockResolvedValue({
      success: true,
      data: 'The vertex formula is $f(x) = a(x - h)^2 + k$ with maximum value $k$.',
      usedModel: 'gemini-3.6-flash',
      latencyMs: 120,
    });

    renderDrawer();

    const input = screen.getByPlaceholderText(/Ask any SAT Math question/i);
    fireEvent.change(input, { target: { value: 'What is vertex form?' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('What is vertex form?')).toBeDefined();
    });

    await waitFor(() => {
      expect(document.querySelector('.katex')).not.toBeNull();
    });
  });

  it('handles API exceptions gracefully with friendly error notice', async () => {
    vi.mocked(geminiService.sendSocraticChatMessage).mockRejectedValue(new Error('Connection dropped'));

    renderDrawer();

    const input = screen.getByPlaceholderText(/Ask any SAT Math question/i);
    fireEvent.change(input, { target: { value: 'Help me' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/AI Service Notice/i)).toBeDefined();
      expect(screen.getByText(/Connection dropped/i)).toBeDefined();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary, MathErrorBoundary } from './ErrorBoundary';

// Helper component that throws on demand
const FaultyComponent: React.FC<{ shouldThrow?: boolean; message?: string }> = ({
  shouldThrow = true,
  message = 'Simulated rendering crash'
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>Healthy Component Output</div>;
};

describe('ErrorBoundary Component', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary name="Test Boundary">
        <div>Safe Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Content')).toBeDefined();
  });

  it('catches render errors and displays default fallback with retry button', () => {
    // Suppress console.error in test output for clean reporting
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary name="AI Tutor Widget">
        <FaultyComponent shouldThrow={true} message="Failed to parse math model" />
      </ErrorBoundary>
    );

    expect(screen.getByText('AI Tutor Widget encountered an issue')).toBeDefined();
    expect(screen.getByText('Failed to parse math model')).toBeDefined();
    expect(screen.getByRole('button', { name: /retry/i })).toBeDefined();

    spy.mockRestore();
  });

  it('supports custom fallback function and reset callback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onResetMock = vi.fn();

    const { rerender } = render(
      <ErrorBoundary
        fallback={(err, reset) => (
          <div>
            <span>Custom Fallback: {err.message}</span>
            <button onClick={reset}>Try Again</button>
          </div>
        )}
        onReset={onResetMock}
      >
        <FaultyComponent shouldThrow={true} message="Math syntax explosion" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Fallback: Math syntax explosion')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onResetMock).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });
});

describe('MathErrorBoundary Component', () => {
  it('catches math rendering errors and displays fallback formula text', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MathErrorBoundary fallbackText="$$\frac{1}{0}$$">
        <FaultyComponent shouldThrow={true} message="KaTeX parse failure" />
      </MathErrorBoundary>
    );

    expect(screen.getByText('$$\\frac{1}{0}$$')).toBeDefined();

    spy.mockRestore();
  });
});

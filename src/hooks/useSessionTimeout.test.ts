import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionTimeout } from './useSessionTimeout';

describe('useSessionTimeout Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('stays idle when enabled is false (e.g. unauthenticated)', () => {
    const { result } = renderHook(() =>
      useSessionTimeout({
        enabled: false,
        timeoutMs: 5000,
        warningThresholdMs: 2000,
      })
    );

    expect(result.current.status).toBe('idle');
    expect(result.current.isWarningOpen).toBe(false);
    expect(result.current.isTimedOut).toBe(false);
  });

  it('starts monitoring when enabled is true', () => {
    const { result } = renderHook(() =>
      useSessionTimeout({
        enabled: true,
        timeoutMs: 10000,
        warningThresholdMs: 3000,
      })
    );

    expect(result.current.status).toBe('active');
    expect(result.current.isWarningOpen).toBe(false);
    expect(result.current.remainingMs).toBeGreaterThan(0);
  });

  it('opens warning modal when approaching timeout threshold', () => {
    const onWarning = vi.fn();
    const { result } = renderHook(() =>
      useSessionTimeout({
        enabled: true,
        timeoutMs: 10000,
        warningThresholdMs: 3000,
        checkIntervalMs: 500,
        onWarning,
      })
    );

    expect(result.current.isWarningOpen).toBe(false);

    // Advance 7.5 seconds (in the 3-second warning window)
    act(() => {
      vi.advanceTimersByTime(7500);
    });

    expect(result.current.status).toBe('warning');
    expect(result.current.isWarningOpen).toBe(true);
    expect(result.current.remainingSeconds).toBeLessThanOrEqual(3);
    expect(onWarning).toHaveBeenCalled();
  });

  it('allows extending the session via extendSession()', () => {
    const { result } = renderHook(() =>
      useSessionTimeout({
        enabled: true,
        timeoutMs: 10000,
        warningThresholdMs: 3000,
        checkIntervalMs: 500,
      })
    );

    // Advance to warning state
    act(() => {
      vi.advanceTimersByTime(7500);
    });
    expect(result.current.isWarningOpen).toBe(true);

    // User clicks extend session
    act(() => {
      result.current.extendSession();
    });

    expect(result.current.status).toBe('active');
    expect(result.current.isWarningOpen).toBe(false);
    expect(result.current.remainingMs).toBe(10000);
  });

  it('triggers onTimeout and sets isTimedOut when session expires', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useSessionTimeout({
        enabled: true,
        timeoutMs: 10000,
        warningThresholdMs: 3000,
        checkIntervalMs: 500,
        onTimeout,
      })
    );

    // Advance past total timeout
    act(() => {
      vi.advanceTimersByTime(10500);
    });

    expect(result.current.status).toBe('expired');
    expect(result.current.isTimedOut).toBe(true);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('listens to DOM user activity events and keeps session active', () => {
    const { result } = renderHook(() =>
      useSessionTimeout({
        enabled: true,
        timeoutMs: 10000,
        warningThresholdMs: 3000,
        checkIntervalMs: 500,
      })
    );

    // Advance 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Fire mousemove event
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'));
    });

    // Advance another 3 seconds (total 8s from start, but only 3s since activity)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should still be active, NOT warning, because activity reset the timer!
    expect(result.current.status).toBe('active');
    expect(result.current.isWarningOpen).toBe(false);
  });

  it('supports logoutNow() to trigger timeout immediately', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useSessionTimeout({
        enabled: true,
        timeoutMs: 10000,
        warningThresholdMs: 3000,
        onTimeout,
      })
    );

    act(() => {
      result.current.logoutNow();
    });

    expect(result.current.status).toBe('expired');
    expect(result.current.isTimedOut).toBe(true);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('cleans up event listeners and intervals on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useSessionTimeout({
        enabled: true,
        timeoutMs: 10000,
        warningThresholdMs: 3000,
      })
    );

    expect(result.current.status).toBe('active');

    unmount();

    // After unmount, advancing timers should not throw or cause state updates
    act(() => {
      vi.advanceTimersByTime(15000);
    });
  });
});

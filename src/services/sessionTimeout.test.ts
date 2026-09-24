import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  SessionTimeoutManager,
  SessionStatus,
  SessionTimeoutConfig,
} from './sessionTimeout';

// Mock storage implementation for isolation
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('SessionTimeoutManager', () => {
  let mockStorage: MockStorage;
  let currentTime: number;
  const mockNow = () => currentTime;

  beforeEach(() => {
    vi.useFakeTimers();
    mockStorage = new MockStorage();
    currentTime = 1000000;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initialization and Configuration', () => {
    it('initializes with default config values (15m timeout, 2m warning)', () => {
      const manager = new SessionTimeoutManager({
        storage: mockStorage,
        now: mockNow,
      });

      expect(manager.timeoutMs).toBe(15 * 60 * 1000);
      expect(manager.warningThresholdMs).toBe(2 * 60 * 1000);
      expect(manager.getStatus()).toBe('idle');
    });

    it('accepts custom timeout and warning thresholds', () => {
      const manager = new SessionTimeoutManager({
        timeoutMs: 5 * 60 * 1000,
        warningThresholdMs: 60 * 1000,
        storage: mockStorage,
        now: mockNow,
      });

      expect(manager.timeoutMs).toBe(5 * 60 * 1000);
      expect(manager.warningThresholdMs).toBe(60 * 1000);
    });

    it('sets status to active and records activity when started', () => {
      const manager = new SessionTimeoutManager({
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      expect(manager.getStatus()).toBe('active');
      expect(manager.getLastActivity()).toBe(currentTime);
      expect(mockStorage.getItem('scoreup_last_activity')).toBe(String(currentTime));
      manager.stop();
    });

    it('restores existing lastActivity from storage if still valid', () => {
      const priorActivity = currentTime - 60000; // 1 minute ago
      mockStorage.setItem('scoreup_last_activity', String(priorActivity));

      const manager = new SessionTimeoutManager({
        timeoutMs: 15 * 60 * 1000,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      expect(manager.getLastActivity()).toBe(priorActivity);
      expect(manager.getStatus()).toBe('active');
      manager.stop();
    });

    it('resets to current time if stored lastActivity is expired or corrupt', () => {
      mockStorage.setItem('scoreup_last_activity', 'invalid-timestamp');

      const manager = new SessionTimeoutManager({
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      expect(manager.getLastActivity()).toBe(currentTime);
      manager.stop();
    });
  });

  describe('Remaining Time Calculation', () => {
    it('calculates remaining time until timeout correctly', () => {
      const timeoutMs = 10 * 60 * 1000;
      const manager = new SessionTimeoutManager({
        timeoutMs,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      expect(manager.getRemainingTime()).toBe(timeoutMs);

      // Advance time by 3 minutes
      currentTime += 3 * 60 * 1000;
      expect(manager.getRemainingTime()).toBe(7 * 60 * 1000);

      manager.stop();
    });

    it('clamps remaining time to 0 when expired', () => {
      const timeoutMs = 5 * 60 * 1000;
      const manager = new SessionTimeoutManager({
        timeoutMs,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      currentTime += 6 * 60 * 1000;
      expect(manager.getRemainingTime()).toBe(0);
      manager.stop();
    });

    it('calculates warning remaining time correctly during warning phase', () => {
      const timeoutMs = 10 * 60 * 1000;
      const warningThresholdMs = 2 * 60 * 1000;
      const manager = new SessionTimeoutManager({
        timeoutMs,
        warningThresholdMs,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      // At 8.5 minutes (30 seconds into warning phase, 90 seconds left before timeout)
      currentTime += 8.5 * 60 * 1000;
      manager.checkSession();

      expect(manager.getStatus()).toBe('warning');
      expect(manager.getRemainingWarningTime()).toBe(90 * 1000);
      manager.stop();
    });
  });

  describe('Activity Recording and Throttling', () => {
    it('updates last activity timestamp when activity is recorded', () => {
      const manager = new SessionTimeoutManager({
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      currentTime += 5000;
      manager.recordActivity();

      expect(manager.getLastActivity()).toBe(currentTime);
      expect(mockStorage.getItem('scoreup_last_activity')).toBe(String(currentTime));
      manager.stop();
    });

    it('throttles rapid activity updates to avoid high-frequency storage writes', () => {
      const setItemSpy = vi.spyOn(mockStorage, 'setItem');
      const manager = new SessionTimeoutManager({
        activityThrottleMs: 1000,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      setItemSpy.mockClear();

      // Trigger multiple activities within 500ms
      currentTime += 100;
      manager.recordActivity();
      currentTime += 100;
      manager.recordActivity();
      currentTime += 100;
      manager.recordActivity();

      // First one records, subsequent rapid ones are throttled
      expect(setItemSpy).toHaveBeenCalledTimes(1);

      // Advance past throttle window
      currentTime += 1500;
      manager.recordActivity();
      expect(setItemSpy).toHaveBeenCalledTimes(2);

      manager.stop();
    });

    it('invokes onActivity callback when activity is accepted', () => {
      const onActivity = vi.fn();
      const manager = new SessionTimeoutManager({
        onActivity,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      currentTime += 2000;
      manager.recordActivity();

      expect(onActivity).toHaveBeenCalledWith(currentTime);
      manager.stop();
    });
  });

  describe('State Transitions & Callbacks', () => {
    it('transitions to warning when idle reaches warning threshold and triggers onWarning', () => {
      const onWarning = vi.fn();
      const onStateChange = vi.fn();
      const timeoutMs = 10 * 60 * 1000; // 10 minutes
      const warningThresholdMs = 2 * 60 * 1000; // 2 minutes

      const manager = new SessionTimeoutManager({
        timeoutMs,
        warningThresholdMs,
        onWarning,
        onStateChange,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      expect(manager.getStatus()).toBe('active');

      // Advance time to 8 minutes (exactly at warning threshold)
      currentTime += 8 * 60 * 1000;
      manager.checkSession();

      expect(manager.getStatus()).toBe('warning');
      expect(onWarning).toHaveBeenCalledTimes(1);
      expect(onWarning).toHaveBeenCalledWith({
        remainingMs: 2 * 60 * 1000,
        timeoutMs,
      });
      expect(onStateChange).toHaveBeenCalledWith('warning');

      manager.stop();
    });

    it('transitions to expired when idle exceeds timeout and triggers onTimeout', () => {
      const onTimeout = vi.fn();
      const onStateChange = vi.fn();
      const timeoutMs = 5 * 60 * 1000;

      const manager = new SessionTimeoutManager({
        timeoutMs,
        warningThresholdMs: 1 * 60 * 1000,
        onTimeout,
        onStateChange,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();

      // Advance time past timeout
      currentTime += 5 * 60 * 1000 + 1;
      manager.checkSession();

      expect(manager.getStatus()).toBe('expired');
      expect(onTimeout).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith('expired');

      // Subsequent checks should NOT re-trigger onTimeout
      manager.checkSession();
      expect(onTimeout).toHaveBeenCalledTimes(1);

      manager.stop();
    });

    it('resets from warning back to active when session is extended', () => {
      const onStateChange = vi.fn();
      const timeoutMs = 10 * 60 * 1000;
      const warningThresholdMs = 2 * 60 * 1000;

      const manager = new SessionTimeoutManager({
        timeoutMs,
        warningThresholdMs,
        onStateChange,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      currentTime += 9 * 60 * 1000; // in warning zone
      manager.checkSession();
      expect(manager.getStatus()).toBe('warning');

      // User clicks "Stay logged in" -> extendSession()
      manager.extendSession();

      expect(manager.getStatus()).toBe('active');
      expect(manager.getLastActivity()).toBe(currentTime);
      expect(manager.getRemainingTime()).toBe(timeoutMs);
      expect(onStateChange).toHaveBeenCalledWith('active');

      manager.stop();
    });

    it('automatically checks session status on periodic heartbeat', () => {
      const onWarning = vi.fn();
      const onTimeout = vi.fn();

      const manager = new SessionTimeoutManager({
        timeoutMs: 10000,
        warningThresholdMs: 3000,
        checkIntervalMs: 1000,
        onWarning,
        onTimeout,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();

      // Advance by 7000ms (reaches warning threshold 10000 - 3000 = 7000)
      currentTime += 7000;
      vi.advanceTimersByTime(7000);
      expect(manager.getStatus()).toBe('warning');
      expect(onWarning).toHaveBeenCalledTimes(1);

      // Advance another 3000ms (reaches timeout 10000)
      currentTime += 3000;
      vi.advanceTimersByTime(3000);
      expect(manager.getStatus()).toBe('expired');
      expect(onTimeout).toHaveBeenCalledTimes(1);

      manager.stop();
    });
  });

  describe('Cross-Tab Synchronization', () => {
    it('synchronizes last activity when another tab updates storage', () => {
      const onStateChange = vi.fn();
      const timeoutMs = 10 * 60 * 1000;
      const warningThresholdMs = 2 * 60 * 1000;

      const manager = new SessionTimeoutManager({
        timeoutMs,
        warningThresholdMs,
        onStateChange,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();

      // Advance into warning phase
      currentTime += 8.5 * 60 * 1000;
      manager.checkSession();
      expect(manager.getStatus()).toBe('warning');

      // Activity occurred in Tab B at currentTime
      const tabBTime = currentTime;
      mockStorage.setItem('scoreup_last_activity', String(tabBTime));
      manager.handleStorageEvent({
        key: 'scoreup_last_activity',
        newValue: String(tabBTime),
      });

      expect(manager.getLastActivity()).toBe(tabBTime);
      expect(manager.getStatus()).toBe('active');
      expect(onStateChange).toHaveBeenCalledWith('active');

      manager.stop();
    });

    it('ignores storage events for unrelated keys or null values', () => {
      const manager = new SessionTimeoutManager({
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      const initialActivity = manager.getLastActivity();

      manager.handleStorageEvent({
        key: 'some_other_key',
        newValue: '123456',
      });
      expect(manager.getLastActivity()).toBe(initialActivity);

      manager.handleStorageEvent({
        key: 'scoreup_last_activity',
        newValue: null,
      });
      expect(manager.getLastActivity()).toBe(initialActivity);

      manager.stop();
    });
  });

  describe('Stop and Teardown', () => {
    it('clears intervals and sets status to idle on stop', () => {
      const manager = new SessionTimeoutManager({
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      expect(manager.getStatus()).toBe('active');

      manager.stop();
      expect(manager.getStatus()).toBe('idle');

      // Timers should not trigger after stop
      currentTime += 20 * 60 * 1000;
      vi.advanceTimersByTime(20 * 60 * 1000);
      expect(manager.getStatus()).toBe('idle');
    });

    it('removes storage key when clearStorageOnStop is true', () => {
      const manager = new SessionTimeoutManager({
        storage: mockStorage,
        now: mockNow,
        clearStorageOnStop: true,
      });

      manager.start();
      expect(mockStorage.getItem('scoreup_last_activity')).toBe(String(currentTime));

      manager.stop();
      expect(mockStorage.getItem('scoreup_last_activity')).toBeNull();
    });
  });

  describe('Edge Cases & Defensive Handling', () => {
    it('handles warningThresholdMs >= timeoutMs safely by warning immediately', () => {
      const onWarning = vi.fn();
      const manager = new SessionTimeoutManager({
        timeoutMs: 5000,
        warningThresholdMs: 6000, // warning threshold larger than timeout
        onWarning,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();
      manager.checkSession();

      expect(manager.getStatus()).toBe('warning');
      expect(onWarning).toHaveBeenCalledTimes(1);

      manager.stop();
    });

    it('handles sudden time jumps (e.g. system sleep/wake)', () => {
      const onTimeout = vi.fn();
      const manager = new SessionTimeoutManager({
        timeoutMs: 10 * 60 * 1000,
        onTimeout,
        storage: mockStorage,
        now: mockNow,
      });

      manager.start();

      // Jump 2 hours forward (laptop lid opened after hours of sleep)
      currentTime += 2 * 60 * 60 * 1000;
      manager.checkSession();

      expect(manager.getStatus()).toBe('expired');
      expect(onTimeout).toHaveBeenCalledTimes(1);

      manager.stop();
    });
  });
});

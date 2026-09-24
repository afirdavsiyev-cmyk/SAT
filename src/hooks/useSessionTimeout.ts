import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SessionTimeoutManager,
  SessionStatus,
  WarningInfo,
  SessionTimeoutConfig,
} from '../services/sessionTimeout';

export interface UseSessionTimeoutOptions {
  /**
   * Whether session tracking is active (e.g., true when user is authenticated).
   * Default: true
   */
  enabled?: boolean;

  /**
   * Timeout in milliseconds before session expires.
   * Default: 15 minutes (900,000 ms)
   */
  timeoutMs?: number;

  /**
   * Inactivity warning threshold before timeout in milliseconds.
   * Default: 2 minutes (120,000 ms)
   */
  warningThresholdMs?: number;

  /**
   * Check interval in milliseconds.
   * Default: 1000 ms
   */
  checkIntervalMs?: number;

  /**
   * Throttle duration for activity events in milliseconds.
   * Default: 1000 ms
   */
  activityThrottleMs?: number;

  /**
   * Storage key for cross-tab synchronization.
   */
  storageKey?: string;

  /**
   * DOM events to listen to for user activity.
   */
  events?: string[];

  /**
   * Callback fired when session times out.
   */
  onTimeout?: () => void;

  /**
   * Callback fired when warning is triggered.
   */
  onWarning?: (info: WarningInfo) => void;

  /**
   * Callback fired when user activity is detected.
   */
  onActivity?: (timestamp: number) => void;
}

export interface UseSessionTimeoutResult {
  status: SessionStatus;
  remainingMs: number;
  remainingSeconds: number;
  isWarningOpen: boolean;
  isTimedOut: boolean;
  extendSession: () => void;
  dismissWarning: () => void;
  logoutNow: () => void;
}

const DEFAULT_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

export function useSessionTimeout(
  options: UseSessionTimeoutOptions = {}
): UseSessionTimeoutResult {
  const {
    enabled = true,
    timeoutMs,
    warningThresholdMs,
    checkIntervalMs,
    activityThrottleMs,
    storageKey,
    events = DEFAULT_EVENTS,
    onTimeout,
    onWarning,
    onActivity,
  } = options;

  const [status, setStatus] = useState<SessionStatus>('idle');
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  // Keep callback refs fresh
  const onTimeoutRef = useRef(onTimeout);
  const onWarningRef = useRef(onWarning);
  const onActivityRef = useRef(onActivity);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onWarningRef.current = onWarning;
    onActivityRef.current = onActivity;
  }, [onTimeout, onWarning, onActivity]);

  const managerRef = useRef<SessionTimeoutManager | null>(null);

  // Initialize manager
  if (!managerRef.current) {
    const config: SessionTimeoutConfig = {
      timeoutMs,
      warningThresholdMs,
      checkIntervalMs,
      activityThrottleMs,
      storageKey,
      onWarning: (info) => {
        setIsWarningOpen(true);
        setStatus('warning');
        setRemainingMs(info.remainingMs);
        onWarningRef.current?.(info);
      },
      onTimeout: () => {
        setStatus('expired');
        setIsTimedOut(true);
        setIsWarningOpen(false);
        setRemainingMs(0);
        onTimeoutRef.current?.();
      },
      onActivity: (timestamp) => {
        onActivityRef.current?.(timestamp);
      },
      onStateChange: (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'active') {
          setIsWarningOpen(false);
        } else if (newStatus === 'warning') {
          setIsWarningOpen(true);
        } else if (newStatus === 'expired') {
          setIsTimedOut(true);
          setIsWarningOpen(false);
        }
      },
    };

    managerRef.current = new SessionTimeoutManager(config);
  }

  const manager = managerRef.current;

  // React to enabled prop
  useEffect(() => {
    if (!enabled) {
      manager.stop();
      setStatus('idle');
      setIsWarningOpen(false);
      setIsTimedOut(false);
      setRemainingMs(0);
      return;
    }

    manager.start();
    setStatus(manager.getStatus());
    setRemainingMs(manager.getRemainingTime());

    // Update remaining timer periodically
    const syncTimer = setInterval(() => {
      if (manager.getStatus() !== 'idle') {
        const rem = manager.getRemainingTime();
        setRemainingMs(rem);
      }
    }, checkIntervalMs ?? 1000);

    return () => {
      clearInterval(syncTimer);
      manager.stop();
    };
  }, [enabled, manager, checkIntervalMs]);

  // Attach DOM activity listeners
  useEffect(() => {
    if (!enabled) return;

    const handleUserActivity = () => {
      if (manager.getStatus() !== 'expired') {
        manager.recordActivity();
        setRemainingMs(manager.getRemainingTime());
      }
    };

    const handleStorage = (event: StorageEvent) => {
      manager.handleStorageEvent(event);
      setRemainingMs(manager.getRemainingTime());
    };

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleUserActivity, { passive: true });
    });

    window.addEventListener('storage', handleStorage);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserActivity);
      });
      window.removeEventListener('storage', handleStorage);
    };
  }, [enabled, events, manager]);

  const extendSession = useCallback(() => {
    manager.extendSession();
    setIsWarningOpen(false);
    setStatus('active');
    setRemainingMs(manager.getRemainingTime());
  }, [manager]);

  const dismissWarning = useCallback(() => {
    setIsWarningOpen(false);
  }, []);

  const logoutNow = useCallback(() => {
    manager.stop();
    setStatus('expired');
    setIsTimedOut(true);
    setIsWarningOpen(false);
    setRemainingMs(0);
    onTimeoutRef.current?.();
  }, [manager]);

  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  return {
    status,
    remainingMs,
    remainingSeconds,
    isWarningOpen,
    isTimedOut,
    extendSession,
    dismissWarning,
    logoutNow,
  };
}

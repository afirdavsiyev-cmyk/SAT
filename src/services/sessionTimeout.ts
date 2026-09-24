export type SessionStatus = 'idle' | 'active' | 'warning' | 'expired';

export interface WarningInfo {
  remainingMs: number;
  timeoutMs: number;
}

export interface SessionTimeoutConfig {
  /**
   * Inactivity duration in milliseconds before timing out the session.
   * Default: 15 minutes (900,000 ms)
   */
  timeoutMs?: number;

  /**
   * Time in milliseconds before timeout to trigger the warning state.
   * Default: 2 minutes (120,000 ms)
   */
  warningThresholdMs?: number;

  /**
   * Polling interval for heartbeat timer check in milliseconds.
   * Default: 1000 ms
   */
  checkIntervalMs?: number;

  /**
   * Throttle duration for user activity events in milliseconds.
   * Default: 1000 ms
   */
  activityThrottleMs?: number;

  /**
   * Storage key used to coordinate across tabs in localStorage.
   * Default: 'scoreup_last_activity'
   */
  storageKey?: string;

  /**
   * Whether to remove the activity storage key when stop() is called.
   * Default: false
   */
  clearStorageOnStop?: boolean;

  /**
   * Storage instance (e.g. localStorage or a mock storage).
   */
  storage?: Storage | null;

  /**
   * Injectable timestamp supplier for deterministic testing.
   */
  now?: () => number;

  /**
   * Callback fired when session enters the warning phase.
   */
  onWarning?: (info: WarningInfo) => void;

  /**
   * Callback fired when session times out.
   */
  onTimeout?: () => void;

  /**
   * Callback fired when user activity is detected and accepted.
   */
  onActivity?: (timestamp: number) => void;

  /**
   * Callback fired when session status changes.
   */
  onStateChange?: (status: SessionStatus) => void;
}

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_WARNING_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes
const DEFAULT_CHECK_INTERVAL_MS = 1000; // 1 second
const DEFAULT_THROTTLE_MS = 1000; // 1 second
const DEFAULT_STORAGE_KEY = 'scoreup_last_activity';

export class SessionTimeoutManager {
  public readonly timeoutMs: number;
  public readonly warningThresholdMs: number;
  public readonly checkIntervalMs: number;
  public readonly activityThrottleMs: number;
  public readonly storageKey: string;
  public readonly clearStorageOnStop: boolean;

  private readonly storage: Storage | null;
  private readonly now: () => number;
  private readonly onWarning?: (info: WarningInfo) => void;
  private readonly onTimeout?: (info: { remainingMs: number; timeoutMs: number } | void) => void;
  private readonly onActivity?: (timestamp: number) => void;
  private readonly onStateChange?: (status: SessionStatus) => void;

  private status: SessionStatus = 'idle';
  private lastActivity: number = 0;
  private lastThrottledRecordTime: number = 0;
  private intervalTimerId: ReturnType<typeof setInterval> | null = null;

  constructor(config: SessionTimeoutConfig = {}) {
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.warningThresholdMs = config.warningThresholdMs ?? DEFAULT_WARNING_THRESHOLD_MS;
    this.checkIntervalMs = config.checkIntervalMs ?? DEFAULT_CHECK_INTERVAL_MS;
    this.activityThrottleMs = config.activityThrottleMs ?? DEFAULT_THROTTLE_MS;
    this.storageKey = config.storageKey ?? DEFAULT_STORAGE_KEY;
    this.clearStorageOnStop = config.clearStorageOnStop ?? false;

    this.now = config.now ?? (() => Date.now());
    this.onWarning = config.onWarning;
    this.onTimeout = config.onTimeout;
    this.onActivity = config.onActivity;
    this.onStateChange = config.onStateChange;

    if (config.storage !== undefined) {
      this.storage = config.storage;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
    } else {
      this.storage = null;
    }
  }

  public getStatus(): SessionStatus {
    return this.status;
  }

  public getLastActivity(): number {
    return this.lastActivity;
  }

  public getRemainingTime(): number {
    const elapsed = this.now() - this.lastActivity;
    return Math.max(0, this.timeoutMs - elapsed);
  }

  public getRemainingWarningTime(): number {
    return this.getRemainingTime();
  }

  public start(): void {
    const currentTime = this.now();
    let initialActivity = currentTime;

    // Check if valid last activity exists in storage
    if (this.storage) {
      const stored = this.storage.getItem(this.storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > 0 && currentTime - parsed < this.timeoutMs) {
          initialActivity = parsed;
        }
      }
    }

    this.lastActivity = initialActivity;
    this.lastThrottledRecordTime = 0;
    this.persistActivity(initialActivity);

    this.setStatus('active');

    // Run immediate check in case restored time is already in warning
    this.checkSession();

    // Start heartbeat interval
    this.stopHeartbeat();
    this.intervalTimerId = setInterval(() => {
      this.checkSession();
    }, this.checkIntervalMs);
  }

  public stop(): void {
    this.stopHeartbeat();
    this.setStatus('idle');

    if (this.clearStorageOnStop && this.storage) {
      try {
        this.storage.removeItem(this.storageKey);
      } catch {}
    }
  }

  public recordActivity(timestamp?: number): void {
    const time = timestamp ?? this.now();

    // Throttle checks
    if (time - this.lastThrottledRecordTime < this.activityThrottleMs) {
      return;
    }

    this.lastThrottledRecordTime = time;
    this.lastActivity = time;
    this.persistActivity(time);

    if (this.status === 'warning') {
      this.setStatus('active');
    }

    if (this.onActivity) {
      this.onActivity(time);
    }
  }

  public extendSession(): void {
    const time = this.now();
    this.lastThrottledRecordTime = time;
    this.lastActivity = time;
    this.persistActivity(time);

    if (this.status === 'warning') {
      this.setStatus('active');
    }

    if (this.onActivity) {
      this.onActivity(time);
    }
  }

  public checkSession(): void {
    if (this.status === 'idle' || this.status === 'expired') {
      return;
    }

    const elapsed = this.now() - this.lastActivity;

    if (elapsed >= this.timeoutMs) {
      this.setStatus('expired');
      if (this.onTimeout) {
        this.onTimeout();
      }
    } else if (elapsed >= this.timeoutMs - this.warningThresholdMs) {
      if (this.status !== 'warning') {
        this.setStatus('warning');
        if (this.onWarning) {
          this.onWarning({
            remainingMs: this.getRemainingTime(),
            timeoutMs: this.timeoutMs,
          });
        }
      }
    } else {
      if (this.status !== 'active') {
        this.setStatus('active');
      }
    }
  }

  public handleStorageEvent(event: { key: string | null; newValue: string | null }): void {
    if (!event.key || event.key !== this.storageKey || !event.newValue) {
      return;
    }

    const newTime = parseInt(event.newValue, 10);
    if (isNaN(newTime) || newTime <= 0) {
      return;
    }

    if (newTime > this.lastActivity) {
      this.lastActivity = newTime;
      this.lastThrottledRecordTime = newTime;

      if (this.status === 'warning') {
        this.setStatus('active');
      }
    }
  }

  private setStatus(newStatus: SessionStatus): void {
    if (this.status !== newStatus) {
      this.status = newStatus;
      if (this.onStateChange) {
        this.onStateChange(newStatus);
      }
    }
  }

  private persistActivity(timestamp: number): void {
    if (this.storage) {
      try {
        this.storage.setItem(this.storageKey, String(timestamp));
      } catch (err) {
        console.warn('Failed to persist session activity timestamp', err);
      }
    }
  }

  private stopHeartbeat(): void {
    if (this.intervalTimerId !== null) {
      clearInterval(this.intervalTimerId);
      this.intervalTimerId = null;
    }
  }
}

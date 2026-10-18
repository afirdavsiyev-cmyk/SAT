import {
  AdminSessionState,
  AdminCohortAnalytics,
  StudentAdminProfile,
  SystemDiagnosticDump,
} from '../types/admin';
import { MathDomain } from '../types';
import { getDisputes, getPendingDisputesCount } from './disputeService';
import { getAllCustomPracticeTests } from './customPracticeTestsService';

const ADMIN_SESSION_KEY = 'scoreup_admin_session';

/**
 * Pre-computed SHA-256 hashes of standard admin passkeys:
 * - 'admin800'
 * - 'scoreup2026'
 * - 'scoreup-admin'
 * - 'admin'
 */
const DEFAULT_PASSKEY_HASHES: string[] = [
  '742df7eb5416fe9a250df1cdc283fae60777aed1e17df3e994028e159bbd9113', // admin800
  'c0be38d9d11f2d3b432b509c1b300a06c8b192328de42de11ffc6cb90f17b9dc', // scoreup2026
  '545471a6e8a9f70d7b61f3b4f0bdc192bc29d4369328eaffd5f592d7d52c2c19', // scoreup-admin
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin
];

/**
 * Computes the SHA-256 hex digest of a string using the Web Crypto API.
 */
export async function computePasskeyHash(passkey: string): Promise<string> {
  const trimmed = (passkey || '').trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(trimmed);

  const subtle =
    (typeof window !== 'undefined' && window.crypto?.subtle) ||
    (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle);

  if (!subtle) {
    throw new Error('Web Crypto API (crypto.subtle) is unavailable in this environment.');
  }

  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const CUSTOM_PASSKEY_STORAGE_KEY = 'scoreup_admin_custom_passkey';

/**
 * Returns stored custom passkey SHA-256 hash from localStorage, if one has been set.
 */
export function getCustomAdminPasskeyHash(): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(CUSTOM_PASSKEY_STORAGE_KEY);
      return stored && stored.trim() ? stored.trim().toLowerCase() : null;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

/**
 * Checks whether a custom admin passkey is currently configured.
 */
export function hasCustomAdminPasskey(): boolean {
  return Boolean(getCustomAdminPasskeyHash());
}

/**
 * Resets the admin passkey back to system default (scoreup2026).
 */
export function resetAdminPasskeyToDefault(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(CUSTOM_PASSKEY_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}

export const ADMIN_MAX_PASSKEY_ATTEMPTS = 5;
export const ADMIN_LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export const ADMIN_LOCKOUT_UNTIL_KEY = 'scoreup_admin_lockout_until';
export const ADMIN_FAILED_ATTEMPTS_KEY = 'scoreup_admin_failed_attempts';

export interface AdminLockoutStatus {
  isLockedOut: boolean;
  failedAttempts: number;
  remainingAttempts: number;
  lockoutSeconds: number;
}

/**
 * Returns current admin lockout status (failed attempts, lockout state, and seconds remaining).
 */
export function getAdminLockoutStatus(): AdminLockoutStatus {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return { isLockedOut: false, failedAttempts: 0, remainingAttempts: ADMIN_MAX_PASSKEY_ATTEMPTS, lockoutSeconds: 0 };
    }

    const lockoutUntilRaw = window.sessionStorage.getItem(ADMIN_LOCKOUT_UNTIL_KEY);
    const failedRaw = window.sessionStorage.getItem(ADMIN_FAILED_ATTEMPTS_KEY);
    const failedAttempts = failedRaw ? parseInt(failedRaw, 10) : 0;

    if (lockoutUntilRaw) {
      const lockoutUntil = parseInt(lockoutUntilRaw, 10);
      const now = Date.now();
      if (now < lockoutUntil) {
        const lockoutSeconds = Math.ceil((lockoutUntil - now) / 1000);
        return {
          isLockedOut: true,
          failedAttempts,
          remainingAttempts: 0,
          lockoutSeconds,
        };
      } else {
        // Lockout expired, clear lockout timestamp
        window.sessionStorage.removeItem(ADMIN_LOCKOUT_UNTIL_KEY);
      }
    }

    const remainingAttempts = Math.max(0, ADMIN_MAX_PASSKEY_ATTEMPTS - failedAttempts);
    return {
      isLockedOut: false,
      failedAttempts,
      remainingAttempts,
      lockoutSeconds: 0,
    };
  } catch {
    return { isLockedOut: false, failedAttempts: 0, remainingAttempts: ADMIN_MAX_PASSKEY_ATTEMPTS, lockoutSeconds: 0 };
  }
}

/**
 * Records an invalid passkey attempt. Triggers a 30-second lockout when threshold is reached.
 */
export function recordAdminPasskeyFailure(): AdminLockoutStatus {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const current = getAdminLockoutStatus();
      const newFailed = current.failedAttempts + 1;
      window.sessionStorage.setItem(ADMIN_FAILED_ATTEMPTS_KEY, String(newFailed));

      if (newFailed >= ADMIN_MAX_PASSKEY_ATTEMPTS) {
        const lockoutUntil = Date.now() + ADMIN_LOCKOUT_DURATION_MS;
        window.sessionStorage.setItem(ADMIN_LOCKOUT_UNTIL_KEY, String(lockoutUntil));
        return {
          isLockedOut: true,
          failedAttempts: newFailed,
          remainingAttempts: 0,
          lockoutSeconds: Math.ceil(ADMIN_LOCKOUT_DURATION_MS / 1000),
        };
      }

      return {
        isLockedOut: false,
        failedAttempts: newFailed,
        remainingAttempts: Math.max(0, ADMIN_MAX_PASSKEY_ATTEMPTS - newFailed),
        lockoutSeconds: 0,
      };
    }
  } catch {
    // Ignore
  }
  return { isLockedOut: false, failedAttempts: 1, remainingAttempts: ADMIN_MAX_PASSKEY_ATTEMPTS - 1, lockoutSeconds: 0 };
}

/**
 * Clears failed attempts and resets any active lockout timer.
 */
export function clearAdminPasskeyFailures(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(ADMIN_LOCKOUT_UNTIL_KEY);
      window.sessionStorage.removeItem(ADMIN_FAILED_ATTEMPTS_KEY);
    }
  } catch {
    // Ignore
  }
}

/**
 * Verifies if an admin passkey matches via SHA-256 hash comparison.
 * Checks custom passkey first (stored in localStorage under 'scoreup_admin_custom_passkey').
 * Falls back to default dev passkeys ('scoreup2026') only if no custom passkey has been set.
 */
export async function verifyAdminPasskey(passkey: string, recordSession: boolean = true): Promise<boolean> {
  if (!passkey || typeof passkey !== 'string') return false;

  const trimmed = passkey.trim();
  if (!trimmed) return false;

  const lockout = getAdminLockoutStatus();
  if (lockout.isLockedOut) {
    return false;
  }

  try {
    const computedHash = await computePasskeyHash(trimmed);
    const customHash = getCustomAdminPasskeyHash();

    // 1. If custom passkey is configured, authenticate strictly against it
    if (customHash) {
      if (computedHash.toLowerCase() === customHash) {
        clearAdminPasskeyFailures();
        if (recordSession) persistAdminSession();
        return true;
      }
      return false;
    }

    // 2. Otherwise fall back to environment variable overrides
    const envHash = import.meta.env?.VITE_ADMIN_PASSKEY_HASH;
    if (envHash && computedHash.toLowerCase() === envHash.trim().toLowerCase()) {
      clearAdminPasskeyFailures();
      if (recordSession) persistAdminSession();
      return true;
    }

    const envPasskey = import.meta.env?.VITE_ADMIN_PASSKEY;
    if (envPasskey) {
      const targetEnvHash = await computePasskeyHash(envPasskey);
      if (computedHash === targetEnvHash) {
        clearAdminPasskeyFailures();
        if (recordSession) persistAdminSession();
        return true;
      }
    }

    // 3. Fall back to default dev passkeys ('scoreup2026', 'admin800', etc.)
    if (DEFAULT_PASSKEY_HASHES.includes(computedHash.toLowerCase())) {
      clearAdminPasskeyFailures();
      if (recordSession) persistAdminSession();
      return true;
    }

    return false;
  } catch (err) {
    console.error('Failed to verify admin passkey:', err);
    return false;
  }
}

/**
 * Changes the admin passkey by validating the old passkey and saving the new hashed passkey
 * in localStorage under 'scoreup_admin_custom_passkey'.
 */
export async function changeAdminPasskey(oldPasskey: string, newPasskey: string): Promise<boolean> {
  if (!oldPasskey || !newPasskey) return false;

  const isOldValid = await verifyAdminPasskey(oldPasskey, false);
  if (!isOldValid) {
    return false;
  }

  const trimmedNew = newPasskey.trim();
  if (trimmedNew.length < 4) {
    throw new Error('New passkey must be at least 4 characters long.');
  }

  const newHash = await computePasskeyHash(trimmedNew);
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(CUSTOM_PASSKEY_STORAGE_KEY, newHash);
  }
  return true;
}

/**
 * Helper to record active admin session in sessionStorage.
 */
function persistAdminSession(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionState: AdminSessionState = {
        isAuthenticated: true,
        authenticatedAt: Date.now(),
        lastActive: Date.now(),
        role: 'admin',
      };
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionState));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get current admin session state.
 */
export function getAdminSessionState(): AdminSessionState {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // Ignore storage errors
  }
  return { isAuthenticated: false };
}

/**
 * Checks if the admin is currently authenticated in the active session.
 */
export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminSessionState()?.isAuthenticated);
}

/**
 * End admin session.
 */
export function logoutAdmin(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Retrieves all student profiles by scanning localStorage for registered users,
 * active user profiles, and associated attempt stats.
 */
export function getAllStudentProfiles(): StudentAdminProfile[] {
  const profilesMap = new Map<string, StudentAdminProfile>();

  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    // 1. Registered users table
    const registeredRaw = window.localStorage.getItem('scoreup_registered_users');
    if (registeredRaw) {
      const registered = JSON.parse(registeredRaw) as Record<string, any>;
      Object.values(registered).forEach((user) => {
        if (!user || !user.email) return;
        const email = user.email.toLowerCase();
        profilesMap.set(email, {
          id: user.id || email,
          email,
          firstName: user.name ? user.name.split(' ')[0] : 'Student',
          targetScore: user.onboardingProfile?.targetScore || '780+',
          baselineScore: user.onboardingProfile?.latestScore
            ? parseInt(user.onboardingProfile.latestScore, 10) || 650
            : 650,
          currentEstimatedMath: 650,
          streakDays: 1,
          totalQuestionsSolved: 0,
          totalQuestionsCorrect: 0,
          accuracy: 0,
          joinedAt: user.createdAt || Date.now(),
          provider: user.provider || 'email',
          onboardingCompleted: user.onboardingCompleted ?? false,
        });
      });
    }

    // 2. Current active user
    const activeRaw = window.localStorage.getItem('scoreup_active_user');
    if (activeRaw) {
      const active = JSON.parse(activeRaw);
      const email = (active.email || 'student@scoreup.app').toLowerCase();
      const existing = profilesMap.get(email);

      profilesMap.set(email, {
        id: existing?.id || 'active_user',
        email,
        firstName: active.firstName || existing?.firstName || 'Student',
        targetScore: active.targetScore || existing?.targetScore || '780+',
        baselineScore: active.baselineScore || existing?.baselineScore || 650,
        currentEstimatedMath: active.currentEstimatedMath || existing?.currentEstimatedMath || 650,
        streakDays: active.streakDays || existing?.streakDays || 1,
        totalQuestionsSolved: existing?.totalQuestionsSolved || 0,
        totalQuestionsCorrect: existing?.totalQuestionsCorrect || 0,
        accuracy: existing?.accuracy || 0,
        joinedAt: existing?.joinedAt || Date.now(),
        provider: existing?.provider || 'email',
        onboardingCompleted: active.onboardingCompleted ?? existing?.onboardingCompleted ?? true,
      });
    }

    // 3. User progress / questions solved stats
    const solvedRaw = window.localStorage.getItem('scoreup_solved_questions');
    if (solvedRaw) {
      const solved = JSON.parse(solvedRaw) as Record<string, any>;
      const attempts = Object.values(solved);
      const solvedCount = attempts.length;
      const correctCount = attempts.filter((a) => a.isCorrect).length;
      const accuracy = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;

      // Assign to active user or default profile
      const activeEmail = (
        JSON.parse(window.localStorage.getItem('scoreup_active_user') || '{}').email ||
        'student@scoreup.app'
      ).toLowerCase();

      if (profilesMap.has(activeEmail)) {
        const student = profilesMap.get(activeEmail)!;
        student.totalQuestionsSolved = solvedCount;
        student.totalQuestionsCorrect = correctCount;
        student.accuracy = accuracy;
      }
    }

    // 4. Fallback if no student data exists yet (provide starter student profile)
    if (profilesMap.size === 0) {
      profilesMap.set('demo.student@scoreup.app', {
        id: 'student_demo_1',
        email: 'demo.student@scoreup.app',
        firstName: 'Alex',
        targetScore: '780+',
        baselineScore: 660,
        currentEstimatedMath: 730,
        streakDays: 4,
        totalQuestionsSolved: 28,
        totalQuestionsCorrect: 24,
        accuracy: 86,
        joinedAt: Date.now() - 7 * 86400000,
        provider: 'email',
        onboardingCompleted: true,
      });
    }
  } catch (err) {
    console.error('Failed to parse student profiles from storage:', err);
  }

  return Array.from(profilesMap.values());
}

/**
 * Computes cohort analytics across all active and registered students.
 */
export async function getAdminCohortAnalytics(): Promise<AdminCohortAnalytics> {
  const students = getAllStudentProfiles();
  const totalStudents = students.length;

  const totalQuestionsAttempted = students.reduce((sum, s) => sum + (s.totalQuestionsSolved || 0), 0);
  const totalQuestionsCorrect = students.reduce((sum, s) => sum + (s.totalQuestionsCorrect || 0), 0);
  const averageAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
      : Math.round(
          students.reduce((sum, s) => sum + (s.accuracy || 0), 0) / (totalStudents || 1)
        );

  const averageScore = Math.round(
    students.reduce((sum, s) => sum + (s.currentEstimatedMath || s.baselineScore || 650), 0) /
      (totalStudents || 1)
  );

  const averageStreak =
    Math.round(
      (students.reduce((sum, s) => sum + (s.streakDays || 1), 0) / (totalStudents || 1)) * 10
    ) / 10;

  const activeToday = students.filter((s) => (s.streakDays || 0) >= 1).length;

  // Domain mastery breakdown
  const domainMasteryAverages: { domain: MathDomain; averageMastery: number }[] = [
    { domain: 'Algebra', averageMastery: 78 },
    { domain: 'Advanced Math', averageMastery: 71 },
    { domain: 'Problem-Solving & Data Analysis', averageMastery: 84 },
    { domain: 'Geometry & Trigonometry', averageMastery: 69 },
  ];

  // If sat_user_progress_state has real domain mastery, blend it in
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stateRaw = window.localStorage.getItem('sat_user_progress_state');
      if (stateRaw) {
        const parsed = JSON.parse(stateRaw);
        if (parsed.stats?.domainMastery) {
          const dm = parsed.stats.domainMastery;
          if (typeof dm.algebra === 'number') domainMasteryAverages[0].averageMastery = dm.algebra;
          if (typeof dm.advancedMath === 'number') domainMasteryAverages[1].averageMastery = dm.advancedMath;
          if (typeof dm.problemSolving === 'number') domainMasteryAverages[2].averageMastery = dm.problemSolving;
          if (typeof dm.geometryTrig === 'number') domainMasteryAverages[3].averageMastery = dm.geometryTrig;
        }
      }
    }
  } catch {
    // Ignore error
  }

  // Score distribution buckets
  const scoreDistribution = [
    { range: '400-490', count: 0 },
    { range: '500-590', count: 0 },
    { range: '600-690', count: 0 },
    { range: '700-740', count: 0 },
    { range: '750-800', count: 0 },
  ];

  students.forEach((s) => {
    const score = s.currentEstimatedMath || s.baselineScore || 650;
    if (score < 500) scoreDistribution[0].count++;
    else if (score < 600) scoreDistribution[1].count++;
    else if (score < 700) scoreDistribution[2].count++;
    else if (score < 750) scoreDistribution[3].count++;
    else scoreDistribution[4].count++;
  });

  const pendingDisputesCount = await getPendingDisputesCount();
  const customTests = await getAllCustomPracticeTests();

  return {
    totalStudents,
    activeToday,
    averageScore,
    averageStreak,
    totalQuestionsAttempted,
    averageAccuracy,
    domainMasteryAverages,
    scoreDistribution,
    pendingDisputesCount,
    totalCustomTests: customTests.length,
  };
}

/**
 * Resets student progress.
 * If studentEmail is provided, resets progress for that specific student.
 * If studentEmail is omitted or 'all', resets all student question progress across the platform.
 */
export async function resetStudentProgress(studentEmail?: string): Promise<boolean> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return true;

    if (studentEmail && studentEmail !== 'all') {
      const email = studentEmail.toLowerCase();
      window.localStorage.removeItem(`sat_user_progress_${email}`);
      window.localStorage.removeItem(`scoreup_attendance_${email}`);
      window.localStorage.removeItem(`scoreup_claimed_quests_${email}`);

      // If matches active user, clear active progress
      const activeRaw = window.localStorage.getItem('scoreup_active_user');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active.email?.toLowerCase() === email) {
          window.localStorage.removeItem('scoreup_solved_questions');
          window.localStorage.removeItem('scoreup_bookmarked_questions');
        }
      }
    } else {
      // Reset all progress
      window.localStorage.removeItem('scoreup_solved_questions');
      window.localStorage.removeItem('scoreup_bookmarked_questions');
      window.localStorage.removeItem('sat_user_progress_state');

      // Clear all keys matching sat_user_progress_* or scoreup_attendance_*
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (
          key &&
          (key.startsWith('sat_user_progress_') ||
            key.startsWith('scoreup_attendance_') ||
            key.startsWith('scoreup_claimed_quests_'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    }

    // Dispatch global events for UI components
    window.dispatchEvent(new Event('scoreup_progress_updated'));
    window.dispatchEvent(new Event('scoreup_bookmarks_updated'));
    window.dispatchEvent(new Event('scoreup_attendance_updated'));

    return true;
  } catch (err) {
    console.error('Failed to reset student progress:', err);
    return false;
  }
}

/**
 * Exports a full system diagnostic dump for administrative auditing and telemetry.
 */
export async function exportSystemDiagnosticDump(): Promise<SystemDiagnosticDump> {
  const analytics = await getAdminCohortAnalytics();
  const allDisputes = await getDisputes();
  const allCustomTests = await getAllCustomPracticeTests();

  let localStorageKeyCount = 0;
  let scoreupKeysCount = 0;
  let estimatedSizeBytes = 0;

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorageKeyCount = window.localStorage.length;
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          if (key.startsWith('scoreup_') || key.startsWith('sat_')) {
            scoreupKeysCount++;
          }
          const val = window.localStorage.getItem(key) || '';
          estimatedSizeBytes += (key.length + val.length) * 2;
        }
      }
    }
  } catch {
    // Ignore storage query errors
  }

  const disputesSummary = {
    total: allDisputes.length,
    pending: allDisputes.filter((d) => d.status === 'pending').length,
    inReview: allDisputes.filter((d) => d.status === 'in_review').length,
    resolved: allDisputes.filter((d) => d.status === 'resolved').length,
    rejected: allDisputes.filter((d) => d.status === 'rejected').length,
  };

  // Strip heavy question arrays from custom tests for compact metadata dump
  const customTestsSummary = allCustomTests.map((t) => {
    const { module1Questions, module2Questions, ...rest } = t;
    return rest;
  });

  return {
    timestamp: new Date().toISOString(),
    appVersion: '1.0.0',
    environment: import.meta.env?.MODE || 'production',
    storageUsage: {
      localStorageKeyCount,
      scoreupKeysCount,
      estimatedSizeBytes,
    },
    analytics,
    disputesSummary,
    customTestsCount: allCustomTests.length,
    browser: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/JSDOM',
      language: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
      onLine: typeof navigator !== 'undefined' ? navigator.onLine : true,
      hasIndexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
    },
    disputes: allDisputes,
    customTests: customTestsSummary,
  };
}

/**
 * Unified Attendance & Streak Tracking Service for ScoreUP SAT
 */

const ATTENDANCE_STORAGE_KEY = 'scoreup_attendance_data';

export interface AttendanceData {
  streakDays: number;
  attendedDates: string[]; // YYYY-MM-DD
  lastAttendedDate: string; // YYYY-MM-DD
  todayCheckedIn: boolean;
}

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAttendanceStorageKey = (): string => {
  try {
    const authRaw = localStorage.getItem('scoreup_auth_user');
    if (authRaw) {
      const u = JSON.parse(authRaw);
      if (u.email) return `scoreup_attendance_${u.email.toLowerCase().trim()}`;
    }
    const activeRaw = localStorage.getItem('scoreup_active_user');
    if (activeRaw) {
      const a = JSON.parse(activeRaw);
      if (a.email && a.email !== 'student@scoreup.app') {
        return `scoreup_attendance_${a.email.toLowerCase().trim()}`;
      }
      if (a.firstName && a.firstName !== 'Student') {
        return `scoreup_attendance_${a.firstName.toLowerCase().trim()}`;
      }
    }
  } catch {}
  return 'scoreup_attendance_data';
};

export const resetAttendanceForNewUser = (): AttendanceData => {
  const today = getTodayDateString();
  const freshData: AttendanceData = {
    streakDays: 1,
    attendedDates: [today],
    lastAttendedDate: today,
    todayCheckedIn: true,
  };
  saveAttendanceData(freshData);
  return freshData;
};

export const getAttendanceData = (): AttendanceData => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const storageKey = getAttendanceStorageKey();

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const attendedDates: string[] = Array.isArray(parsed.attendedDates) ? parsed.attendedDates : [today];
      const todayCheckedIn = attendedDates.includes(today);
      let streakDays = typeof parsed.streakDays === 'number' ? parsed.streakDays : 1;

      // If last attended was before yesterday and not today, streak resets
      if (parsed.lastAttendedDate && parsed.lastAttendedDate !== today && parsed.lastAttendedDate !== yesterday) {
        streakDays = 1;
      }

      return {
        streakDays,
        attendedDates,
        lastAttendedDate: parsed.lastAttendedDate || today,
        todayCheckedIn,
      };
    }
  } catch (err) {
    console.error('Failed to parse attendance data', err);
  }

  // Initial default state for a new user: 1st day attendance
  const initialData: AttendanceData = {
    streakDays: 1,
    attendedDates: [today],
    lastAttendedDate: today,
    todayCheckedIn: true,
  };

  saveAttendanceData(initialData);
  return initialData;
};

export const saveAttendanceData = (data: AttendanceData): void => {
  const storageKey = getAttendanceStorageKey();
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    // Also synchronize active_user and sat_user_progress_state
    try {
      const activeRaw = localStorage.getItem('scoreup_active_user');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        active.streakDays = data.streakDays;
        localStorage.setItem('scoreup_active_user', JSON.stringify(active));
      }
    } catch {}

    try {
      const stateRaw = localStorage.getItem('sat_user_progress_state');
      if (stateRaw) {
        const state = JSON.parse(stateRaw);
        if (state.stats) {
          state.stats.streakDays = data.streakDays;
          localStorage.setItem('sat_user_progress_state', JSON.stringify(state));
        }
      }
    } catch {}

    window.dispatchEvent(new CustomEvent('scoreup_attendance_updated', { detail: data }));
  } catch (err) {
    console.error('Failed to save attendance data', err);
  }
};

export const recordDailyAttendance = (): AttendanceData => {
  const current = getAttendanceData();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (current.attendedDates.includes(today)) {
    return current;
  }

  const newAttendedDates = [...current.attendedDates, today];
  let newStreak = current.streakDays;

  if (current.lastAttendedDate === yesterday) {
    newStreak += 1;
  } else if (!current.lastAttendedDate || current.lastAttendedDate === today) {
    // Keep current streak
  } else {
    // Gap in attendance - set to current streak or 1
    newStreak = Math.max(1, current.streakDays);
  }

  const updated: AttendanceData = {
    streakDays: newStreak,
    attendedDates: newAttendedDates,
    lastAttendedDate: today,
    todayCheckedIn: true,
  };

  saveAttendanceData(updated);
  return updated;
};

export const setAttendanceStreak = (days: number): AttendanceData => {
  const current = getAttendanceData();
  const updated: AttendanceData = {
    ...current,
    streakDays: Math.max(1, days),
  };
  saveAttendanceData(updated);
  return updated;
};

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

export const hasSolvedQuestionToday = (): boolean => {
  try {
    const raw = localStorage.getItem('scoreup_solved_questions');
    if (!raw) return false;
    const progress = JSON.parse(raw);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

    return Object.values(progress).some((att: any) => {
      if (!att || typeof att.attemptedAt !== 'number') return false;
      return att.attemptedAt >= startOfToday && att.attemptedAt < endOfToday;
    });
  } catch {
    return false;
  }
};

export const resetAttendanceForNewUser = (): AttendanceData => {
  const freshData: AttendanceData = {
    streakDays: 0,
    attendedDates: [],
    lastAttendedDate: '',
    todayCheckedIn: false,
  };
  saveAttendanceData(freshData);
  return freshData;
};

export const getAttendanceData = (): AttendanceData => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const storageKey = getAttendanceStorageKey();
  const solvedToday = hasSolvedQuestionToday();

  // Check existing active user streak and progress state to ensure consistency across pages
  let existingStreak = 0;
  try {
    const activeRaw = localStorage.getItem('scoreup_active_user');
    if (activeRaw) {
      const active = JSON.parse(activeRaw);
      if (typeof active.streakDays === 'number' && active.streakDays > existingStreak) {
        existingStreak = active.streakDays;
      }
    }
  } catch {}
  try {
    const stateRaw = localStorage.getItem('sat_user_progress_state');
    if (stateRaw) {
      const state = JSON.parse(stateRaw);
      if (typeof state?.stats?.streakDays === 'number' && state.stats.streakDays > existingStreak) {
        existingStreak = state.stats.streakDays;
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      let attendedDates: string[] = Array.isArray(parsed.attendedDates) ? parsed.attendedDates : [];

      // Attendance is ONLY verified for today if user has solved at least one question today!
      if (!solvedToday) {
        attendedDates = attendedDates.filter((d) => d !== today);
      } else if (!attendedDates.includes(today)) {
        attendedDates = [...attendedDates, today];
      }

      const todayCheckedIn = solvedToday && attendedDates.includes(today);
      let streakDays = typeof parsed.streakDays === 'number' ? parsed.streakDays : 0;

      // Reconcile with existing user streak if parsed is lower or default 0/1
      if (existingStreak > streakDays) {
        streakDays = existingStreak;
      }

      // Check if streak was broken before yesterday
      const lastAttended = todayCheckedIn
        ? today
        : (parsed.lastAttendedDate === today
            ? (solvedToday ? today : yesterday)
            : parsed.lastAttendedDate);

      if (lastAttended && lastAttended !== today && lastAttended !== yesterday) {
        streakDays = 0;
      }

      const result: AttendanceData = {
        streakDays,
        attendedDates,
        lastAttendedDate: lastAttended || (todayCheckedIn ? today : (streakDays > 0 ? yesterday : '')),
        todayCheckedIn,
      };

      return result;
    }
  } catch (err) {
    console.error('Failed to parse attendance data', err);
  }

  // Initial default state when user has no stored attendance
  const initialStreak = existingStreak > 0 ? existingStreak : (solvedToday ? 1 : 0);
  const initialData: AttendanceData = {
    streakDays: initialStreak,
    attendedDates: solvedToday ? [today] : [],
    lastAttendedDate: solvedToday ? today : (initialStreak > 0 ? yesterday : ''),
    todayCheckedIn: solvedToday,
  };

  saveAttendanceData(initialData);
  return initialData;
};

export const saveAttendanceData = (data: AttendanceData): void => {
  const storageKey = getAttendanceStorageKey();
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    localStorage.setItem('scoreup_attendance_data', JSON.stringify(data));

    // Also synchronize active_user
    try {
      const activeRaw = localStorage.getItem('scoreup_active_user');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        active.streakDays = data.streakDays;
        localStorage.setItem('scoreup_active_user', JSON.stringify(active));
      }
    } catch {}

    // Synchronize both sat_user_progress_state AND all userKey variants
    try {
      const keysToUpdate = ['sat_user_progress_state'];
      const activeRaw = localStorage.getItem('scoreup_active_user');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active.email) keysToUpdate.push(`sat_user_progress_${active.email.toLowerCase().trim()}`);
        if (active.firstName) keysToUpdate.push(`sat_user_progress_${active.firstName.toLowerCase().trim()}`);
      }
      for (const k of keysToUpdate) {
        const stateRaw = localStorage.getItem(k);
        if (stateRaw) {
          const state = JSON.parse(stateRaw);
          if (state.stats) {
            state.stats.streakDays = data.streakDays;
            localStorage.setItem(k, JSON.stringify(state));
          }
        }
      }
    } catch {}

    window.dispatchEvent(new CustomEvent('scoreup_attendance_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('study_planner_updated'));
    window.dispatchEvent(new Event('scoreup_progress_updated'));
  } catch (err) {
    console.error('Failed to save attendance data', err);
  }
};

export const recordDailyAttendance = (): AttendanceData => {
  const current = getAttendanceData();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (current.todayCheckedIn && current.attendedDates.includes(today)) {
    return current;
  }

  const newAttendedDates = current.attendedDates.includes(today)
    ? current.attendedDates
    : [...current.attendedDates, today];

  let newStreak = current.streakDays;

  if (current.lastAttendedDate === yesterday) {
    newStreak = Math.max(1, current.streakDays + 1);
  } else if (!current.lastAttendedDate || current.streakDays === 0) {
    newStreak = 1;
  } else if (current.lastAttendedDate === today) {
    newStreak = Math.max(1, current.streakDays);
  } else {
    // Gap in attendance
    newStreak = 1;
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
    streakDays: Math.max(0, days),
  };
  saveAttendanceData(updated);
  return updated;
};

export interface WeekDayAttendance {
  label: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  shortName: string; // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  fullName: string; // 'Monday', 'Tuesday', ...
  dayNumber: number; // 1 to 31
  dateStr: string; // 'YYYY-MM-DD'
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isAttended: boolean;
  status: 'today_attended' | 'today_pending' | 'attended' | 'missed' | 'upcoming';
}

export const getWeekAttendanceData = (customDate?: Date): WeekDayAttendance[] => {
  const now = customDate || new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  // Days offset to Monday: Sunday is 6 days after Monday (-6), Monday is 0, etc.
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const monday = new Date(year, month, date + diffToMonday);

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const shortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const attendance = getAttendanceData();
  const attendedSet = new Set(attendance.attendedDates || []);

  if (attendance.todayCheckedIn) {
    attendedSet.add(todayStr);
  } else {
    attendedSet.delete(todayStr);
  }

  // Backfill streak dates up to yesterday / lastAttendedDate (or today if checked in)
  const streak = attendance.streakDays || 0;
  if (streak > 0) {
    const baseDate = attendance.todayCheckedIn
      ? new Date(year, month, date)
      : new Date(year, month, date - 1);

    for (let i = 0; i < streak; i++) {
      const prev = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - i);
      const pYear = prev.getFullYear();
      const pMonth = String(prev.getMonth() + 1).padStart(2, '0');
      const pDate = String(prev.getDate()).padStart(2, '0');
      attendedSet.add(`${pYear}-${pMonth}-${pDate}`);
    }
  }

  return dayLabels.map((label, idx) => {
    const cur = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + idx);
    const cYear = cur.getFullYear();
    const cMonth = String(cur.getMonth() + 1).padStart(2, '0');
    const cDate = cur.getDate();
    const dateStr = `${cYear}-${cMonth}-${String(cDate).padStart(2, '0')}`;

    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;
    const isFuture = dateStr > todayStr;
    const isAttended = isToday ? attendance.todayCheckedIn : attendedSet.has(dateStr);

    let status: WeekDayAttendance['status'];
    if (isToday) {
      status = isAttended ? 'today_attended' : 'today_pending';
    } else if (isPast) {
      status = isAttended ? 'attended' : 'missed';
    } else {
      status = 'upcoming';
    }

    return {
      label,
      shortName: shortNames[idx],
      fullName: fullNames[idx],
      dayNumber: cDate,
      dateStr,
      isToday,
      isPast,
      isFuture,
      isAttended,
      status,
    };
  });
};

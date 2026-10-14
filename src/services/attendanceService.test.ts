import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAttendanceData,
  recordDailyAttendance,
  getWeekAttendanceData,
  resetAttendanceForNewUser,
  setAttendanceStreak,
  hasSolvedQuestionToday,
} from './attendanceService';
import { recordAttempt } from './userProgress';

describe('attendanceService & getWeekAttendanceData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly initializes attendance data with today pending if no question solved', () => {
    const data = resetAttendanceForNewUser();
    expect(data.streakDays).toBe(0);
    expect(data.todayCheckedIn).toBe(false);
    expect(hasSolvedQuestionToday()).toBe(false);
  });

  it('does NOT tick attendance for today if user has not solved at least 1 question', () => {
    const testDate = new Date(2026, 9, 14); // Wednesday
    const weekData = getWeekAttendanceData(testDate);
    const today = weekData.find((d) => d.isToday);

    expect(today).toBeDefined();
    expect(today?.isAttended).toBe(false);
    expect(today?.status).toBe('today_pending');
  });

  it('ticks attendance for today as verified once user solves at least 1 question', () => {
    // Record a question attempt
    recordAttempt({
      questionId: 'test_q_1',
      selectedAnswer: 'A',
      isCorrect: true,
      attemptedAt: Date.now(),
    });

    expect(hasSolvedQuestionToday()).toBe(true);
    const attendance = getAttendanceData();
    expect(attendance.todayCheckedIn).toBe(true);
    expect(attendance.streakDays).toBeGreaterThanOrEqual(1);

    const weekData = getWeekAttendanceData();
    const today = weekData.find((d) => d.isToday);
    expect(today?.isAttended).toBe(true);
    expect(today?.status).toBe('today_attended');
  });

  it('generates 7 days for the current week starting on Monday', () => {
    // Test on a fixed Wednesday: 2026-10-14
    const testDate = new Date(2026, 9, 14); // Oct 14, 2026 is Wednesday
    const weekData = getWeekAttendanceData(testDate);

    expect(weekData).toHaveLength(7);
    expect(weekData.map((d) => d.label)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
    expect(weekData.map((d) => d.shortName)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    // Monday should be Oct 12, Wednesday should be Oct 14, Sunday should be Oct 18
    expect(weekData[0].dayNumber).toBe(12);
    expect(weekData[0].dateStr).toBe('2026-10-12');
    expect(weekData[2].dayNumber).toBe(14);
    expect(weekData[2].dateStr).toBe('2026-10-14');
    expect(weekData[6].dayNumber).toBe(18);
    expect(weekData[6].dateStr).toBe('2026-10-18');
  });

  it('distinguishes between attended, today, missed, and upcoming days', () => {
    // Oct 14, 2026 is Wednesday (index 2)
    const testDate = new Date(2026, 9, 14);
    const weekData = getWeekAttendanceData(testDate);

    const wednesday = weekData[2];
    expect(wednesday.isToday).toBe(true);
    expect(wednesday.isPast).toBe(false);
    expect(wednesday.isFuture).toBe(false);

    // Thursday (index 3), Friday (4), Saturday (5), Sunday (6) should be upcoming
    for (let i = 3; i < 7; i++) {
      expect(weekData[i].isFuture).toBe(true);
      expect(weekData[i].status).toBe('upcoming');
    }

    // Monday and Tuesday should be past
    expect(weekData[0].isPast).toBe(true);
    expect(weekData[1].isPast).toBe(true);
  });

  it('preserves and reconciles streak from active user when loading attendance', () => {
    // Simulate user having streakDays: 13 in scoreup_active_user
    localStorage.setItem(
      'scoreup_active_user',
      JSON.stringify({ firstName: 'Alex', email: 'alex@test.com', streakDays: 13 })
    );

    const attendance = getAttendanceData();
    expect(attendance.streakDays).toBe(13);
  });

  it('synchronizes streak across active_user and sat_user_progress when saving attendance', () => {
    localStorage.setItem(
      'scoreup_active_user',
      JSON.stringify({ firstName: 'Alex', email: 'alex@test.com', streakDays: 1 })
    );
    localStorage.setItem(
      'sat_user_progress_alex@test.com',
      JSON.stringify({ stats: { streakDays: 1 } })
    );

    setAttendanceStreak(15);

    const activeUser = JSON.parse(localStorage.getItem('scoreup_active_user') || '{}');
    expect(activeUser.streakDays).toBe(15);

    const progress = JSON.parse(localStorage.getItem('sat_user_progress_alex@test.com') || '{}');
    expect(progress.stats.streakDays).toBe(15);
  });
});

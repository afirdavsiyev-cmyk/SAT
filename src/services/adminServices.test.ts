import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  logDispute,
  getDisputes,
  getDisputeById,
  updateDisputeStatus,
  deleteDispute,
  getPendingDisputesCount,
  DISPUTES_FALLBACK_KEY,
} from './disputeService';
import {
  sortQuestionsByDifficulty,
  saveCustomPracticeTest,
  getAllCustomPracticeTests,
  getCustomPracticeTestById,
  deleteCustomPracticeTest,
  exportTestToTypeScript,
  CUSTOM_TESTS_FALLBACK_KEY,
  saveQuestionToBank,
  getSavedQuestionBank,
  deleteQuestionFromBank,
  ADMIN_QUESTION_BANK_KEY,
} from './customPracticeTestsService';
import {
  verifyAdminPasskey,
  getAdminCohortAnalytics,
  getAllStudentProfiles,
  resetStudentProgress,
  exportSystemDiagnosticDump,
  computePasskeyHash,
  changeAdminPasskey,
  hasCustomAdminPasskey,
  resetAdminPasskeyToDefault,
  CUSTOM_PASSKEY_STORAGE_KEY,
} from './adminService';
import { Question } from '../types';
import { CustomPracticeTest } from '../types/admin';

describe('disputeService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('logs a new dispute and saves it', async () => {
    const report = await logDispute({
      questionId: 'pt1-m1-q01',
      studentEmail: 'student@example.com',
      studentName: 'Alex Test',
      reason: 'typo_or_formatting',
      description: 'The variable is mislabeled as y instead of x.',
    });

    expect(report.id).toBeDefined();
    expect(report.status).toBe('pending');
    expect(report.createdAt).toBeGreaterThan(0);
    expect(report.questionId).toBe('pt1-m1-q01');

    const fetched = await getDisputeById(report.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(report.id);
    expect(fetched?.description).toBe('The variable is mislabeled as y instead of x.');
  });

  it('filters disputes by status and questionId', async () => {
    await logDispute({
      id: 'd1',
      questionId: 'q10',
      reason: 'incorrect_answer',
      description: 'Answer should be C not B',
      status: 'pending',
    });

    await logDispute({
      id: 'd2',
      questionId: 'q20',
      reason: 'broken_latex',
      description: 'Latex formula is unrendered',
      status: 'resolved',
    });

    const all = await getDisputes();
    expect(all.length).toBe(2);

    const pending = await getDisputes({ status: 'pending' });
    expect(pending.length).toBe(1);
    expect(pending[0].id).toBe('d1');

    const q20Disputes = await getDisputes({ questionId: 'q20' });
    expect(q20Disputes.length).toBe(1);
    expect(q20Disputes[0].id).toBe('d2');

    const pendingCount = await getPendingDisputesCount();
    expect(pendingCount).toBe(1);
  });

  it('updates dispute status and sets resolvedAt', async () => {
    const created = await logDispute({
      questionId: 'q1',
      reason: 'explanation_unclear',
      description: 'Step 2 misses the quadratic formula step',
    });

    const updated = await updateDisputeStatus(created.id, 'resolved', 'Fixed in DB');
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('resolved');
    expect(updated?.adminNotes).toBe('Fixed in DB');
    expect(updated?.resolvedAt).toBeDefined();

    const fetched = await getDisputeById(created.id);
    expect(fetched?.status).toBe('resolved');
  });

  it('deletes a dispute', async () => {
    const created = await logDispute({
      questionId: 'q_del',
      reason: 'other',
      description: 'Test delete',
    });

    const result = await deleteDispute(created.id);
    expect(result).toBe(true);

    const fetched = await getDisputeById(created.id);
    expect(fetched).toBeNull();
  });
});

describe('customPracticeTestsService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const dummyQuestions: Question[] = [
    {
      id: 'q_hard_1',
      number: 1,
      section: 'math',
      module: 1,
      domain: 'Advanced Math',
      difficulty: 'Hard',
      prompt: 'Hard prompt 1',
      type: 'multiple_choice',
      correctAnswer: 'A',
      explanation: 'Explanation',
    },
    {
      id: 'q_easy_1',
      number: 2,
      section: 'math',
      module: 1,
      domain: 'Algebra',
      difficulty: 'Easy',
      prompt: 'Easy prompt 1',
      type: 'multiple_choice',
      correctAnswer: 'B',
      explanation: 'Explanation',
    },
    {
      id: 'q_med_1',
      number: 3,
      section: 'math',
      module: 1,
      domain: 'Algebra',
      difficulty: 'Medium',
      prompt: 'Medium prompt 1',
      type: 'multiple_choice',
      correctAnswer: 'C',
      explanation: 'Explanation',
    },
    {
      id: 'q_easy_2',
      number: 4,
      section: 'math',
      module: 1,
      domain: 'Geometry & Trigonometry',
      difficulty: 'Easy',
      prompt: 'Easy prompt 2',
      type: 'multiple_choice',
      correctAnswer: 'D',
      explanation: 'Explanation',
    },
  ];

  it('sortQuestionsByDifficulty sorts Easy -> Medium -> Hard with sequential numbering', () => {
    const sorted = sortQuestionsByDifficulty(dummyQuestions);
    expect(sorted.length).toBe(4);
    expect(sorted[0].difficulty).toBe('Easy');
    expect(sorted[0].number).toBe(1);
    expect(sorted[1].difficulty).toBe('Easy');
    expect(sorted[1].number).toBe(2);
    expect(sorted[2].difficulty).toBe('Medium');
    expect(sorted[2].number).toBe(3);
    expect(sorted[3].difficulty).toBe('Hard');
    expect(sorted[3].number).toBe(4);
  });

  it('saves, queries, and deletes custom practice tests', async () => {
    const test: CustomPracticeTest = {
      id: 'test_custom_01',
      title: 'Spring 2026 Prediction Mock',
      difficulty: '750+',
      durationMinutes: 70,
      moduleTimeMinutes: 35,
      totalQuestions: 2,
      module1Questions: [dummyQuestions[1]], // Easy
      module2Questions: [dummyQuestions[0]], // Hard
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const saved = await saveCustomPracticeTest(test);
    expect(saved.id).toBe('test_custom_01');
    expect(saved.totalQuestions).toBe(2);

    const all = await getAllCustomPracticeTests();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('test_custom_01');

    const single = await getCustomPracticeTestById('test_custom_01');
    expect(single).not.toBeNull();
    expect(single?.title).toBe('Spring 2026 Prediction Mock');

    const deleted = await deleteCustomPracticeTest('test_custom_01');
    expect(deleted).toBe(true);

    const allAfter = await getAllCustomPracticeTests();
    expect(allAfter.length).toBe(0);
  });

  it('exportTestToTypeScript generates valid TypeScript code', () => {
    const test: CustomPracticeTest = {
      id: 'test_oct_2026',
      title: 'October 2026 High Yield Diagnostic',
      difficulty: 'Standard',
      durationMinutes: 70,
      moduleTimeMinutes: 35,
      totalQuestions: 2,
      module1Questions: [dummyQuestions[1]],
      module2Questions: [dummyQuestions[0]],
      createdAt: 1776500000000,
      updatedAt: 1776500000000,
    };

    const tsOutput = exportTestToTypeScript(test);
    expect(tsOutput).toContain("import { Question } from '../types';");
    expect(tsOutput).toContain('OCTOBER_2026_HIGH_YIELD_DIAGNOSTIC_QUESTIONS: Question[] =');
    expect(tsOutput).toContain('OCTOBER_2026_HIGH_YIELD_DIAGNOSTIC_META =');
    expect(tsOutput).toContain('October 2026 High Yield Diagnostic');
  });
});

describe('adminService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('verifies valid admin passkeys and rejects invalid ones', async () => {
    // Valid defaults: admin800, scoreup2026, scoreup-admin
    const isValid1 = await verifyAdminPasskey('admin800');
    expect(isValid1).toBe(true);

    const isValid2 = await verifyAdminPasskey('scoreup2026');
    expect(isValid2).toBe(true);

    const isValid3 = await verifyAdminPasskey('scoreup-admin');
    expect(isValid3).toBe(true);

    const isInvalid = await verifyAdminPasskey('wrong-password-999');
    expect(isInvalid).toBe(false);

    const isInvalidEmpty = await verifyAdminPasskey('');
    expect(isInvalidEmpty).toBe(false);
  });

  it('computes sha256 passkey hash properly', async () => {
    const hash = await computePasskeyHash('admin800');
    expect(hash).toBe('742df7eb5416fe9a250df1cdc283fae60777aed1e17df3e994028e159bbd9113');
  });

  it('retrieves student profiles and cohorts analytics', async () => {
    // Seed localStorage with a registered user and an active user
    localStorage.setItem(
      'scoreup_registered_users',
      JSON.stringify({
        'student1@test.com': {
          id: 's1',
          name: 'Sarah Connor',
          email: 'student1@test.com',
          createdAt: Date.now(),
          onboardingProfile: {
            targetScore: '800',
            latestScore: '720',
          },
        },
      })
    );

    localStorage.setItem(
      'scoreup_active_user',
      JSON.stringify({
        firstName: 'Sarah',
        email: 'student1@test.com',
        streakDays: 5,
        targetScore: '800',
        baselineScore: 720,
        currentEstimatedMath: 750,
      })
    );

    const profiles = getAllStudentProfiles();
    expect(profiles.length).toBeGreaterThan(0);
    const sarah = profiles.find((p) => p.email === 'student1@test.com');
    expect(sarah).toBeDefined();
    expect(sarah?.firstName).toBe('Sarah');
    expect(sarah?.currentEstimatedMath).toBe(750);

    const analytics = await getAdminCohortAnalytics();
    expect(analytics.totalStudents).toBeGreaterThan(0);
    expect(analytics.averageScore).toBeGreaterThanOrEqual(600);
    expect(analytics.domainMasteryAverages.length).toBe(4);
    expect(analytics.scoreDistribution.length).toBe(5);
  });

  it('resets student progress safely', async () => {
    localStorage.setItem('scoreup_solved_questions', JSON.stringify({ q1: { isCorrect: true } }));
    localStorage.setItem('sat_user_progress_student1@test.com', JSON.stringify({ score: 700 }));

    const resetOne = await resetStudentProgress('student1@test.com');
    expect(resetOne).toBe(true);
    expect(localStorage.getItem('sat_user_progress_student1@test.com')).toBeNull();

    localStorage.setItem('scoreup_solved_questions', JSON.stringify({ q2: { isCorrect: true } }));
    const resetAll = await resetStudentProgress('all');
    expect(resetAll).toBe(true);
    expect(localStorage.getItem('scoreup_solved_questions')).toBeNull();
  });

  it('exports system diagnostic dump with all required sections', async () => {
    const dump = await exportSystemDiagnosticDump();
    expect(dump.timestamp).toBeDefined();
    expect(dump.appVersion).toBe('1.0.0');
    expect(dump.analytics).toBeDefined();
    expect(dump.storageUsage).toBeDefined();
    expect(dump.disputesSummary).toBeDefined();
    expect(dump.browser).toBeDefined();
  });

  it('manages dynamic passkeys, stores custom hash, and falls back to default when cleared', async () => {
    // 1. Initially no custom passkey is set
    expect(hasCustomAdminPasskey()).toBe(false);
    expect(await verifyAdminPasskey('scoreup2026')).toBe(true);

    // 2. Changing passkey with invalid old passkey fails
    const failedChange = await changeAdminPasskey('wrong-old-pass', 'newSecret2027');
    expect(failedChange).toBe(false);

    // 3. Changing passkey with valid old passkey succeeds
    const successChange = await changeAdminPasskey('scoreup2026', 'newSecret2027');
    expect(successChange).toBe(true);
    expect(hasCustomAdminPasskey()).toBe(true);
    expect(localStorage.getItem(CUSTOM_PASSKEY_STORAGE_KEY)).not.toBeNull();

    // 4. Authenticates with new passkey
    expect(await verifyAdminPasskey('newSecret2027')).toBe(true);

    // 5. Default passkey scoreup2026 should NO LONGER work once a custom passkey is set
    expect(await verifyAdminPasskey('scoreup2026')).toBe(false);

    // 6. Reset to default passkey
    resetAdminPasskeyToDefault();
    expect(hasCustomAdminPasskey()).toBe(false);
    expect(localStorage.getItem(CUSTOM_PASSKEY_STORAGE_KEY)).toBeNull();

    // 7. Falls back to scoreup2026
    expect(await verifyAdminPasskey('scoreup2026')).toBe(true);
    expect(await verifyAdminPasskey('newSecret2027')).toBe(false);
  });
});

describe('Question Bank Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('saves, retrieves, and deletes questions from admin question bank', () => {
    const sample: Question = {
      id: 'qb-q1',
      number: 1,
      section: 'math',
      module: 1,
      domain: 'Algebra',
      topic: 'Linear Functions',
      difficulty: 'Easy',
      prompt: 'If $x + 2 = 10$, what is $x$?',
      type: 'multiple_choice',
      options: [
        { id: 'A', text: '$6$' },
        { id: 'B', text: '$8$' },
        { id: 'C', text: '$10$' },
        { id: 'D', text: '$12$' },
      ],
      correctAnswer: 'B',
      explanation: 'Subtract 2 from both sides.',
      calculatorTip: 'Not needed for basic linear algebra.',
    };

    saveQuestionToBank(sample);

    const bank = getSavedQuestionBank();
    expect(bank.length).toBe(1);
    expect(bank[0].id).toBe('qb-q1');
    expect(bank[0].prompt).toBe('If $x + 2 = 10$, what is $x$?');
    expect(bank[0].topic).toBe('Linear Functions');
    expect(bank[0].calculatorTip).toBe('Not needed for basic linear algebra.');

    // Update existing question
    const updated: Question = { ...sample, prompt: 'If $x + 3 = 10$, what is $x$?' };
    saveQuestionToBank(updated);
    const bankAfterUpdate = getSavedQuestionBank();
    expect(bankAfterUpdate.length).toBe(1);
    expect(bankAfterUpdate[0].prompt).toBe('If $x + 3 = 10$, what is $x$?');

    // Delete question
    const deleted = deleteQuestionFromBank('qb-q1');
    expect(deleted).toBe(true);
    expect(getSavedQuestionBank().length).toBe(0);
  });
});

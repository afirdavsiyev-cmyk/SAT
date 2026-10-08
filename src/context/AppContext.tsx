import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AppView, UserProgress, UserProgressState, ExamHistoryEntry, MockExamResult, StudyPlan, Question, MathDomain } from '../types';
import { initialUserProgress, mockQuestions } from '../data/mockData';
import {
  OFFICIAL_PRACTICE_TEST_1_QUESTIONS,
  getPracticeTest1Module1,
  getPracticeTest1Module2,
} from '../data/officialPracticeTest1';
import {
  OFFICIAL_PRACTICE_TEST_2_QUESTIONS,
  getPracticeTest2Module1,
  getPracticeTest2Module2,
} from '../data/officialPracticeTest2';
import {
  OFFICIAL_PRACTICE_TEST_3_QUESTIONS,
  getPracticeTest3Module1,
  getPracticeTest3Module2,
} from '../data/officialPracticeTest3';
import {
  OFFICIAL_PRACTICE_TEST_4_QUESTIONS,
  getPracticeTest4Module1,
  getPracticeTest4Module2,
} from '../data/officialPracticeTest4';
import {
  OFFICIAL_PRACTICE_TEST_5_QUESTIONS,
  getPracticeTest5Module1,
  getPracticeTest5Module2,
} from '../data/officialPracticeTest5';
import {
  OFFICIAL_PRACTICE_TEST_6_QUESTIONS,
  getPracticeTest6Module1,
  getPracticeTest6Module2,
} from '../data/officialPracticeTest6';
import {
  OFFICIAL_PRACTICE_TEST_7_QUESTIONS,
  getPracticeTest7Module1,
  getPracticeTest7Module2,
} from '../data/officialPracticeTest7';
import {
  OFFICIAL_PRACTICE_TEST_8_QUESTIONS,
  getPracticeTest8Module1,
  getPracticeTest8Module2,
} from '../data/officialPracticeTest8';
import {
  OFFICIAL_PRACTICE_TEST_9_QUESTIONS,
  getPracticeTest9Module1,
  getPracticeTest9Module2,
} from '../data/officialPracticeTest9';
import {
  OFFICIAL_PRACTICE_TEST_10_QUESTIONS,
  getPracticeTest10Module1,
  getPracticeTest10Module2,
} from '../data/officialPracticeTest10';
import {
  OFFICIAL_PRACTICE_TEST_11_QUESTIONS,
  getPracticeTest11Module1,
  getPracticeTest11Module2,
} from '../data/officialPracticeTest11';
import { generatePrescriptiveStudyPlan } from '../utils/studyPlanGenerator';
import { isAnswerEquivalent } from '../utils/answerVerification';

const STORAGE_KEY = 'sat_user_progress_state';
const PLAN_STORAGE_KEY = 'sat_user_study_plan';
const MOCK_RESULTS_STORAGE_KEY = 'sat_mock_exam_results';

const DEFAULT_USER_PROGRESS_STATE: UserProgressState = {
  planner: {
    targetExamDate: 'October 2026',
    targetScore: 800,
    baselineScore: 720,
    dailyGoalMinutes: 45,
    weakDomains: ['Advanced Math', 'Geometry & Trigonometry'],
    currentDay: 1,
  },
  stats: {
    streakDays: 4,
    totalQuestionsSolved: 142,
    totalQuestionsCorrect: 125,
    globalXP: 1450,
    completedExamsCount: 2,
    domainMastery: {
      algebra: 88,
      advancedMath: 74,
      problemSolving: 82,
      geometryTrig: 68,
    },
    examHistory: [
      {
        date: '2026-08-28',
        score: 720,
        module1Correct: 18,
        module2Correct: 17,
        module2Type: 'hard',
      },
      {
        date: '2026-09-01',
        score: 740,
        module1Correct: 19,
        module2Correct: 18,
        module2Type: 'hard',
      }
    ],
  },
};

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userProgressState: UserProgressState;
  setUserProgressState: React.Dispatch<React.SetStateAction<UserProgressState>>;
  updatePlanner: (updates: Partial<UserProgressState['planner']>) => void;
  recordPracticeQuestion: (domain: MathDomain, isCorrect: boolean) => void;
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  studyPlan: StudyPlan | null;
  setStudyPlan: (plan: StudyPlan) => void;
  questions: Question[];
  currentExamAnswers: Record<string, string>;
  markedForReview: string[];
  setAnswer: (questionId: string, answer: string) => void;
  toggleMark: (questionId: string) => void;
  finishExam: () => void;
  resetExam: () => void;
  examFinished: boolean;
  activeExamMode: 'full' | 'module1' | 'module2';
  activeExamId: string;
  setActiveExamId: (id: string) => void;
  currentModule: 1 | 2;
  setCurrentModule: (mod: 1 | 2) => void;
  startExam: (mode?: 'full' | 'module1' | 'module2', customQuestions?: Question[], testId?: string) => void;
  proceedToModule2: () => void;
  mockExamResults: Record<string, MockExamResult>;
  reviewExam: (mode?: 'full' | 'module1' | 'module2', testId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Unified persistent UserProgressState
  const [userProgressState, setUserProgressState] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const targetDateFromStorage = localStorage.getItem('study_planner_target_date');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (targetDateFromStorage && (!parsed.planner || !parsed.planner.targetExamDate)) {
          parsed.planner = { ...parsed.planner, targetExamDate: targetDateFromStorage };
        }
        return parsed;
      }
      if (targetDateFromStorage) {
        return {
          ...DEFAULT_USER_PROGRESS_STATE,
          planner: {
            ...DEFAULT_USER_PROGRESS_STATE.planner,
            targetExamDate: targetDateFromStorage,
          },
        };
      }
    } catch (e) {
      console.error('Failed to load user progress state from localStorage', e);
    }
    return DEFAULT_USER_PROGRESS_STATE;
  });

  // Sync userProgressState and study_planner_target_date to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgressState));
      if (userProgressState.planner?.targetExamDate) {
        localStorage.setItem('study_planner_target_date', userProgressState.planner.targetExamDate);
      }
    } catch (e) {
      console.error('Failed to save user progress state to localStorage', e);
    }
  }, [userProgressState]);

  // Persistent StudyPlan
  const [studyPlan, setStudyPlanState] = useState<StudyPlan | null>(() => {
    try {
      const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
      if (savedPlan) {
        return JSON.parse(savedPlan);
      }
    } catch (e) {
      console.error('Failed to load study plan from localStorage', e);
    }
    return generatePrescriptiveStudyPlan({
      targetDate: userProgressState.planner.targetExamDate || 'October 2026',
      targetScore: userProgressState.planner.targetScore || 800,
      currentScore: userProgressState.planner.baselineScore || 720,
      baselineBand: '630–700 (Proficient)',
      weakAreas: userProgressState.planner.weakDomains || ['Advanced Math', 'Geometry & Trigonometry'],
      dailyMinutes: userProgressState.planner.dailyGoalMinutes || 45,
      pacePreference: 'balanced',
    });
  });

  // Sync studyPlan to localStorage
  useEffect(() => {
    if (studyPlan) {
      try {
        localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(studyPlan));
      } catch (e) {
        console.error('Failed to save study plan to localStorage', e);
      }
    }
  }, [studyPlan]);

  // Dynamically compute UserProgress
  const userProgress: UserProgress = useMemo(() => {
    const history = userProgressState.stats.examHistory;
    const latestExam = history && history.length > 0 ? history[history.length - 1] : null;
    const mathScore = latestExam ? latestExam.score : userProgressState.planner.baselineScore;

    const totalSolved = userProgressState.stats.totalQuestionsSolved;
    const totalCorrect = userProgressState.stats.totalQuestionsCorrect;
    const accuracyRate = totalSolved > 0
      ? Number(((totalCorrect / totalSolved) * 100).toFixed(1))
      : 0;

    return {
      estimatedScore: mathScore,
      mathScore,
      streakDays: userProgressState.stats.streakDays,
      xp: userProgressState.stats.globalXP,
      totalQuestionsSolved: totalSolved,
      accuracyRate,
      completedTests: userProgressState.stats.completedExamsCount,
      skillBreakdown: [
        { domain: 'Algebra', mastery: userProgressState.stats.domainMastery.algebra },
        { domain: 'Advanced Math', mastery: userProgressState.stats.domainMastery.advancedMath },
        { domain: 'Problem-Solving & Data Analysis', mastery: userProgressState.stats.domainMastery.problemSolving },
        { domain: 'Geometry & Trigonometry', mastery: userProgressState.stats.domainMastery.geometryTrig },
      ],
    };
  }, [userProgressState]);

  // Backward compatibility setter
  const setUserProgress = React.useCallback<React.Dispatch<React.SetStateAction<UserProgress>>>(
    (valOrFn) => {
      setUserProgressState((prev) => {
        const nextUserProgress = typeof valOrFn === 'function' ? valOrFn(userProgress) : valOrFn;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            streakDays: nextUserProgress.streakDays,
            globalXP: nextUserProgress.xp,
            totalQuestionsSolved: nextUserProgress.totalQuestionsSolved,
            completedExamsCount: nextUserProgress.completedTests,
          },
        };
      });
    },
    [userProgress]
  );

  const [examQuestions, setExamQuestions] = useState<Question[]>(OFFICIAL_PRACTICE_TEST_1_QUESTIONS);
  const [activeExamMode, setActiveExamMode] = useState<'full' | 'module1' | 'module2'>('full');
  const [activeExamId, setActiveExamId] = useState<string>('pt1');
  const [currentModule, setCurrentModule] = useState<1 | 2>(1);
  const [currentExamAnswers, setCurrentExamAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [examFinished, setExamFinished] = useState<boolean>(false);

  // Persistent completed mock exam results
  const [mockExamResults, setMockExamResults] = useState<Record<string, MockExamResult>>(() => {
    try {
      const saved = localStorage.getItem(MOCK_RESULTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load mock exam results from localStorage', e);
    }
    return {};
  });

  const getTestQuestions = (testId: string = 'pt1', mode: 'full' | 'module1' | 'module2' = 'full'): Question[] => {
    if (testId === 'pt2') {
      if (mode === 'module1') return getPracticeTest2Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest2Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_2_QUESTIONS;
    }
    if (testId === 'pt3') {
      if (mode === 'module1') return getPracticeTest3Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest3Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_3_QUESTIONS;
    }
    if (testId === 'pt4') {
      if (mode === 'module1') return getPracticeTest4Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest4Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_4_QUESTIONS;
    }
    if (testId === 'pt5') {
      if (mode === 'module1') return getPracticeTest5Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest5Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_5_QUESTIONS;
    }
    if (testId === 'pt6') {
      if (mode === 'module1') return getPracticeTest6Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest6Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_6_QUESTIONS;
    }
    if (testId === 'pt7') {
      if (mode === 'module1') return getPracticeTest7Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest7Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_7_QUESTIONS;
    }
    if (testId === 'pt8') {
      if (mode === 'module1') return getPracticeTest8Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest8Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_8_QUESTIONS;
    }
    if (testId === 'pt9') {
      if (mode === 'module1') return getPracticeTest9Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest9Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_9_QUESTIONS;
    }
    if (testId === 'pt10') {
      if (mode === 'module1') return getPracticeTest10Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest10Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_10_QUESTIONS;
    }
    if (testId === 'pt11') {
      if (mode === 'module1') return getPracticeTest11Module1().map((q, i) => ({ ...q, number: i + 1 }));
      if (mode === 'module2') return getPracticeTest11Module2().map((q, i) => ({ ...q, number: i + 1 }));
      return OFFICIAL_PRACTICE_TEST_11_QUESTIONS;
    }
    // Default pt1
    if (mode === 'module1') return getPracticeTest1Module1().map((q, i) => ({ ...q, number: i + 1 }));
    if (mode === 'module2') return getPracticeTest1Module2().map((q, i) => ({ ...q, number: i + 1 }));
    return OFFICIAL_PRACTICE_TEST_1_QUESTIONS;
  };

  const reviewExam = (mode: 'full' | 'module1' | 'module2' = 'full', testId: string = 'pt1') => {
    const key = `${testId}_${mode}`;
    const result = mockExamResults[key] || mockExamResults[testId] || (testId === 'pt1' ? mockExamResults[mode] : undefined);
    if (result) {
      setActiveExamMode(mode);
      setActiveExamId(testId);
      if (mode === 'module2') {
        setCurrentModule(2);
      } else {
        setCurrentModule(1);
      }
      const qs = getTestQuestions(testId, mode);
      setExamQuestions(qs);
      setCurrentExamAnswers(result.answers || {});
      setMarkedForReview(result.markedForReview || []);
      setExamFinished(true);
      setCurrentView('review');
    } else {
      // If no stored result yet, start fresh
      startExam(mode, undefined, testId);
    }
  };

  const startExam = (
    mode: 'full' | 'module1' | 'module2' = 'full',
    customQuestions?: Question[],
    testId: string = 'pt1'
  ) => {
    setCurrentExamAnswers({});
    setMarkedForReview([]);
    setExamFinished(false);
    setActiveExamMode(mode);
    setActiveExamId(testId);

    if (mode === 'module2') {
      setCurrentModule(2);
    } else {
      setCurrentModule(1);
    }

    const qs = customQuestions || getTestQuestions(testId, mode);
    setExamQuestions(qs);
    setCurrentView('exam');
  };

  const proceedToModule2 = () => {
    setCurrentModule(2);
  };

  const setAnswer = (questionId: string, answer: string) => {
    setCurrentExamAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleMark = (questionId: string) => {
    setMarkedForReview((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const updatePlanner = (updates: Partial<UserProgressState['planner']>) => {
    if (updates.targetExamDate) {
      try {
        localStorage.setItem('study_planner_target_date', updates.targetExamDate);
        window.dispatchEvent(new CustomEvent('study_planner_target_date_changed', { detail: updates.targetExamDate }));
      } catch (e) {
        console.error('Failed to sync study_planner_target_date', e);
      }
    }
    setUserProgressState((prev) => ({
      ...prev,
      planner: {
        ...prev.planner,
        ...updates,
      },
    }));
  };

  const recordPracticeQuestion = (domain: MathDomain, isCorrect: boolean) => {
    setUserProgressState((prev) => {
      const xpEarned = isCorrect ? 10 : 2;
      const keyMap: Record<MathDomain, keyof UserProgressState['stats']['domainMastery']> = {
        'Algebra': 'algebra',
        'Advanced Math': 'advancedMath',
        'Problem-Solving & Data Analysis': 'problemSolving',
        'Geometry & Trigonometry': 'geometryTrig',
      };
      const masteryKey = keyMap[domain];
      const currentMastery = prev.stats.domainMastery[masteryKey];
      const newMastery = isCorrect
        ? Math.min(100, currentMastery + 1)
        : Math.max(0, currentMastery - 1);

      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalQuestionsSolved: prev.stats.totalQuestionsSolved + 1,
          totalQuestionsCorrect: prev.stats.totalQuestionsCorrect + (isCorrect ? 1 : 0),
          globalXP: prev.stats.globalXP + xpEarned,
          domainMastery: {
            ...prev.stats.domainMastery,
            [masteryKey]: newMastery,
          },
        },
      };
    });
  };

  const setStudyPlan = (plan: StudyPlan) => {
    setStudyPlanState(plan);
    if (plan.targetDate) {
      try {
        localStorage.setItem('study_planner_target_date', plan.targetDate);
        window.dispatchEvent(new CustomEvent('study_planner_target_date_changed', { detail: plan.targetDate }));
      } catch (e) {
        console.error('Failed to sync study_planner_target_date', e);
      }
    }
    updatePlanner({
      targetExamDate: plan.targetDate,
      targetScore: plan.targetScore,
      baselineScore: plan.currentScore,
      dailyGoalMinutes: plan.dailyTimeMinutes,
      weakDomains: plan.weakAreas,
    });
  };

  const finishExam = () => {
    setExamFinished(true);

    let correctCount = 0;
    const answeredCount = Object.keys(currentExamAnswers).length;
    const totalExamQuestions = examQuestions.length;

    // Track domain and module performance
    const domainCounts: Record<string, { total: number; correct: number }> = {};
    let module1Correct = 0;
    let module2Correct = 0;

    examQuestions.forEach((q, idx) => {
      if (!domainCounts[q.domain]) {
        domainCounts[q.domain] = { total: 0, correct: 0 };
      }
      domainCounts[q.domain].total += 1;

      const isCorrect = isAnswerEquivalent(currentExamAnswers[q.id], q.correctAnswer, q);
      if (isCorrect) {
        correctCount += 1;
        domainCounts[q.domain].correct += 1;

        if (activeExamMode === 'full') {
          if (idx < 22) module1Correct += 1;
          else module2Correct += 1;
        } else if (activeExamMode === 'module1') {
          module1Correct += 1;
        } else {
          module2Correct += 1;
        }
      }
    });

    // Authentic Digital SAT Math scoring (scaled to 800)
    let scaledScore = 700;
    if (totalExamQuestions > 0) {
      if (activeExamMode === 'full') {
        // Digital SAT 44 Questions Conversion table
        if (correctCount === 44) scaledScore = 800;
        else if (correctCount >= 42) scaledScore = 790;
        else if (correctCount >= 40) scaledScore = 770;
        else if (correctCount >= 38) scaledScore = 740;
        else if (correctCount >= 35) scaledScore = 710;
        else if (correctCount >= 32) scaledScore = 680;
        else if (correctCount >= 28) scaledScore = 640;
        else if (correctCount >= 24) scaledScore = 590;
        else if (correctCount >= 20) scaledScore = 540;
        else if (correctCount >= 16) scaledScore = 490;
        else scaledScore = Math.max(200, Math.round((200 + (correctCount / 44) * 600) / 10) * 10);
      } else {
        // 22 Question Module Scaling
        const pct = correctCount / 22;
        if (correctCount === 22) scaledScore = 800;
        else if (correctCount >= 20) scaledScore = 770;
        else if (correctCount >= 18) scaledScore = 730;
        else if (correctCount >= 16) scaledScore = 690;
        else if (correctCount >= 14) scaledScore = 650;
        else if (correctCount >= 12) scaledScore = 600;
        else scaledScore = Math.max(200, Math.round((200 + pct * 600) / 10) * 10);
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: ExamHistoryEntry = {
      date: todayStr,
      score: scaledScore,
      module1Correct: activeExamMode === 'full' ? module1Correct : (activeExamMode === 'module1' ? correctCount : 18),
      module2Correct: activeExamMode === 'full' ? module2Correct : (activeExamMode === 'module2' ? correctCount : 17),
      module2Type: (activeExamMode === 'module2' || module1Correct >= 15) ? 'hard' : 'easy',
    };

    setUserProgressState((prev) => {
      // Recalculate domain masteries
      const updatedMastery = { ...prev.stats.domainMastery };
      if (domainCounts['Algebra'] && domainCounts['Algebra'].total > 0) {
        const algPct = Math.round((domainCounts['Algebra'].correct / domainCounts['Algebra'].total) * 100);
        updatedMastery.algebra = Math.round((updatedMastery.algebra * 2 + algPct) / 3);
      }
      if (domainCounts['Advanced Math'] && domainCounts['Advanced Math'].total > 0) {
        const advPct = Math.round((domainCounts['Advanced Math'].correct / domainCounts['Advanced Math'].total) * 100);
        updatedMastery.advancedMath = Math.round((updatedMastery.advancedMath * 2 + advPct) / 3);
      }
      if (domainCounts['Problem-Solving & Data Analysis'] && domainCounts['Problem-Solving & Data Analysis'].total > 0) {
        const psPct = Math.round((domainCounts['Problem-Solving & Data Analysis'].correct / domainCounts['Problem-Solving & Data Analysis'].total) * 100);
        updatedMastery.problemSolving = Math.round((updatedMastery.problemSolving * 2 + psPct) / 3);
      }
      if (domainCounts['Geometry & Trigonometry'] && domainCounts['Geometry & Trigonometry'].total > 0) {
        const geoPct = Math.round((domainCounts['Geometry & Trigonometry'].correct / domainCounts['Geometry & Trigonometry'].total) * 100);
        updatedMastery.geometryTrig = Math.round((updatedMastery.geometryTrig * 2 + geoPct) / 3);
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalQuestionsSolved: prev.stats.totalQuestionsSolved + (answeredCount || totalExamQuestions),
          totalQuestionsCorrect: prev.stats.totalQuestionsCorrect + correctCount,
          globalXP: prev.stats.globalXP + (activeExamMode === 'full' ? 500 : 250),
          completedExamsCount: prev.stats.completedExamsCount + 1,
          domainMastery: updatedMastery,
          examHistory: [...prev.stats.examHistory, newEntry],
        },
      };
    });

    // Save completed mock exam result for card badges and review/retake
    const resultEntry: MockExamResult = {
      mode: activeExamMode,
      testId: activeExamId,
      date: todayStr,
      score: scaledScore,
      totalQuestions: totalExamQuestions,
      correctCount,
      module1Correct: activeExamMode === 'full' ? module1Correct : (activeExamMode === 'module1' ? correctCount : 0),
      module1Total: activeExamMode === 'full' ? 22 : (activeExamMode === 'module1' ? 22 : 0),
      module2Correct: activeExamMode === 'full' ? module2Correct : (activeExamMode === 'module2' ? correctCount : 0),
      module2Total: activeExamMode === 'full' ? 22 : (activeExamMode === 'module2' ? 22 : 0),
      answers: { ...currentExamAnswers },
      markedForReview: [...markedForReview],
    };

    setMockExamResults((prev) => {
      const updated = {
        ...prev,
        [activeExamId]: resultEntry,
        [`${activeExamId}_${activeExamMode}`]: resultEntry,
        ...(activeExamId === 'pt1' ? { [activeExamMode]: resultEntry } : {}),
      };
      try {
        localStorage.setItem(MOCK_RESULTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save mock exam results to localStorage', e);
      }
      return updated;
    });

    setCurrentView('review');
  };

  const resetExam = () => {
    setCurrentExamAnswers({});
    setMarkedForReview([]);
    setExamFinished(false);
    setCurrentModule(activeExamMode === 'module2' ? 2 : 1);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userProgressState,
        setUserProgressState,
        updatePlanner,
        recordPracticeQuestion,
        userProgress,
        setUserProgress,
        studyPlan,
        setStudyPlan,
        questions: examQuestions,
        currentExamAnswers,
        markedForReview,
        setAnswer,
        toggleMark,
        finishExam,
        resetExam,
        examFinished,
        activeExamMode,
        activeExamId,
        setActiveExamId,
        currentModule,
        setCurrentModule,
        startExam,
        proceedToModule2,
        mockExamResults,
        reviewExam,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

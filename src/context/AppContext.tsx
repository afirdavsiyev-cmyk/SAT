import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AppView, UserProgress, UserProgressState, ExamHistoryEntry, StudyPlan, Question, MathDomain } from '../types';
import { initialUserProgress, mockQuestions } from '../data/mockData';
import { generatePrescriptiveStudyPlan } from '../utils/studyPlanGenerator';

const STORAGE_KEY = 'sat_user_progress_state';
const PLAN_STORAGE_KEY = 'sat_user_study_plan';

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

  const [currentExamAnswers, setCurrentExamAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [examFinished, setExamFinished] = useState<boolean>(false);

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

    // Compute actual exam statistics
    let correctCount = 0;
    const answeredCount = Object.keys(currentExamAnswers).length;
    const totalExamQuestions = mockQuestions.length;

    // Track domain performance
    const domainCounts: Record<string, { total: number; correct: number }> = {};

    mockQuestions.forEach((q) => {
      if (!domainCounts[q.domain]) {
        domainCounts[q.domain] = { total: 0, correct: 0 };
      }
      domainCounts[q.domain].total += 1;

      if (currentExamAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
        domainCounts[q.domain].correct += 1;
      }
    });

    // Score calculation (scaling to 800)
    let scaledScore = 750;
    if (totalExamQuestions > 0) {
      const pct = correctCount / totalExamQuestions;
      if (pct === 1) scaledScore = 800;
      else if (pct >= 0.9) scaledScore = 780;
      else if (pct >= 0.8) scaledScore = 740;
      else if (pct >= 0.7) scaledScore = 700;
      else if (pct >= 0.6) scaledScore = 650;
      else scaledScore = Math.max(480, Math.round((200 + pct * 600) / 10) * 10);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: ExamHistoryEntry = {
      date: todayStr,
      score: scaledScore,
      module1Correct: Math.min(22, correctCount),
      module2Correct: Math.max(0, correctCount - 1),
      module2Type: correctCount >= 3 ? 'hard' : 'easy',
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
          globalXP: prev.stats.globalXP + 450,
          completedExamsCount: prev.stats.completedExamsCount + 1,
          domainMastery: updatedMastery,
          examHistory: [...prev.stats.examHistory, newEntry],
        },
      };
    });

    setCurrentView('review');
  };

  const resetExam = () => {
    setCurrentExamAnswers({});
    setMarkedForReview([]);
    setExamFinished(false);
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
        questions: mockQuestions,
        currentExamAnswers,
        markedForReview,
        setAnswer,
        toggleMark,
        finishExam,
        resetExam,
        examFinished,
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

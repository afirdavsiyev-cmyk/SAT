import React, { createContext, useContext, useState } from 'react';
import { AppView, UserProgress, StudyPlan, Question } from '../types';
import { initialUserProgress, mockQuestions } from '../data/mockData';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
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
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [studyPlan, setStudyPlanState] = useState<StudyPlan | null>({
    targetDate: 'October 2026',
    targetScore: 800,
    currentScore: 750,
    weakAreas: ['Advanced Math', 'Geometry & Trigonometry'],
    dailyTimeMinutes: 45,
    weeklyRoadmap: [
      { week: 1, title: 'Diagnostic & Quadratic Vertex Form', focus: 'Advanced Math', estimatedHrs: 5, completed: true },
      { week: 2, title: 'Systems of Equations & Desmos Shortcuts', focus: 'Algebra', estimatedHrs: 6, completed: true },
      { week: 3, title: 'Non-Right Triangle Trigonometry & Radians', focus: 'Geometry & Trigonometry', estimatedHrs: 5, completed: false },
      { week: 4, title: 'Full Length Timed Bluebook Math Test', focus: 'Full Adaptive Exam', estimatedHrs: 4, completed: false }
    ]
  });

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

  const setStudyPlan = (plan: StudyPlan) => {
    setStudyPlanState(plan);
  };

  const finishExam = () => {
    setExamFinished(true);
    // Calculate new XP & score
    setUserProgress((prev) => ({
      ...prev,
      xp: prev.xp + 450,
      totalQuestionsSolved: prev.totalQuestionsSolved + Object.keys(currentExamAnswers).length,
      completedTests: prev.completedTests + 1
    }));
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
        examFinished
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

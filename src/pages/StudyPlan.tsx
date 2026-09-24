import React, { useState } from 'react';
import { DailyPlanRoadmapView } from '../components/study/DailyPlanRoadmapView';
import { StudyPlanWizard } from '../components/onboarding/StudyPlanWizard';
import { PracticeRoomView } from '../components/study/PracticeRoomView';
import { useApp } from '../context/AppContext';
import { getStoredAdaptiveData } from '../utils/adaptivePlannerEngine';

export const StudyPlanPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [practiceSession, setPracticeSession] = useState<{
    questions: any[];
    topicName: string;
  } | null>(null);

  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(() => {
    try {
      const data = getStoredAdaptiveData();
      return !data || !data.profile;
    } catch {
      return false;
    }
  });

  if (practiceSession && practiceSession.questions.length > 0) {
    return (
      <PracticeRoomView
        questions={practiceSession.questions}
        selectedTopicName={practiceSession.topicName}
        onGoBack={() => setPracticeSession(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isWizardOpen ? (
          <StudyPlanWizard onComplete={() => setIsWizardOpen(false)} />
        ) : (
          <DailyPlanRoadmapView
            onReconfigureWizard={() => setIsWizardOpen(true)}
            onStartDrill={(params) => {
              if (params.type === 'mock') {
                setCurrentView('exam');
              } else if (params.customQuestions && params.customQuestions.length > 0) {
                setPracticeSession({
                  questions: params.customQuestions,
                  topicName: params.title || "Today's Daily Sprint",
                });
              } else {
                setCurrentView('exam');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StudyPlanPage;

import React, { useState } from 'react';
import { DailyPlanRoadmapView } from '../components/study/DailyPlanRoadmapView';
import { StudyPlanWizard } from '../components/onboarding/StudyPlanWizard';
import { useApp } from '../context/AppContext';
import { getStoredAdaptiveData } from '../utils/adaptivePlannerEngine';

export const StudyPlanPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(() => {
    try {
      const data = getStoredAdaptiveData();
      return !data || !data.profile;
    } catch {
      return false;
    }
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isWizardOpen ? (
          <StudyPlanWizard onComplete={() => setIsWizardOpen(false)} />
        ) : (
          <DailyPlanRoadmapView
            onReconfigureWizard={() => setIsWizardOpen(true)}
            onStartDrill={() => setCurrentView('exam')}
          />
        )}
      </div>
    </div>
  );
};

export default StudyPlanPage;

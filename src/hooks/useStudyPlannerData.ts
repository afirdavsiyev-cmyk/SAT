import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Target, Calculator, Zap, Flame, BookOpen, Clock, Brain } from 'lucide-react';
import {
  getStoredAdaptiveData,
  getRankedPrioritySkills,
  ADAPTIVE_STORAGE_KEY
} from '../utils/adaptivePlannerEngine';
import { StoredAdaptivePlannerData, SATDomain, SubtopicSkill } from '../types/planner';

export interface TodayDrillItem {
  id: string;
  title: string;
  questionCount: number;
  subtopicName: string;
  subtopicId?: string;
  domain: string;
  estimatedMinutes: number;
  difficulty: string;
  icon: React.ReactNode;
  type: string;
}

export interface DomainMasteryScores {
  algebra: number;
  advancedMath: number;
  problemSolving: number;
  geometryTrig: number;
}

export interface StudyPlannerDataResult {
  currentEstimatedMath: number;
  targetMath: number;
  targetExamDate: string;
  domainMastery: DomainMasteryScores;
  todaysDrills: TodayDrillItem[];
  totalSolved: number;
  totalCorrect: number;
  globalXP: number;
  testsCompleted: number;
  streakDays: number;
  refetch: () => void;
  rawPlannerData: StoredAdaptivePlannerData;
}

export function useStudyPlannerData(): StudyPlannerDataResult {
  const [plannerData, setPlannerData] = useState<StoredAdaptivePlannerData>(() => getStoredAdaptiveData());

  const [legacyState, setLegacyState] = useState(() => {
    try {
      const saved = localStorage.getItem('sat_user_progress_state');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const reloadData = useCallback(() => {
    try {
      const latest = getStoredAdaptiveData();
      setPlannerData(latest);

      const savedLegacy = localStorage.getItem('sat_user_progress_state');
      if (savedLegacy) {
        setLegacyState(JSON.parse(savedLegacy));
      }
    } catch (err) {
      console.error('Error reloading study planner data:', err);
    }
  }, []);

  useEffect(() => {
    reloadData();

    const handlePlannerUpdate = () => {
      reloadData();
    };

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === ADAPTIVE_STORAGE_KEY ||
        e.key === 'scoreup_planner_state' ||
        e.key === 'scoreup_user_roadmap' ||
        e.key === 'sat_user_progress_state' ||
        e.key === 'study_planner_target_date'
      ) {
        reloadData();
      }
    };

    window.addEventListener('study_planner_updated', handlePlannerUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('study_planner_updated', handlePlannerUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [reloadData]);

  // 1. Calculate dynamic Domain Mastery directly from the 18 Subtopic Skills
  const domainMastery = useMemo<DomainMasteryScores>(() => {
    const skills = plannerData?.skills || [];
    if (skills.length === 0) {
      return {
        algebra: legacyState?.stats?.domainMastery?.algebra ?? 88,
        advancedMath: legacyState?.stats?.domainMastery?.advancedMath ?? 74,
        problemSolving: legacyState?.stats?.domainMastery?.problemSolving ?? 82,
        geometryTrig: legacyState?.stats?.domainMastery?.geometryTrig ?? 68,
      };
    }

    const computeDomainAvg = (domain: SATDomain): number => {
      const domainSkills = skills.filter((s) => s.domain === domain);
      if (domainSkills.length === 0) return 70;
      const sum = domainSkills.reduce((acc, s) => acc + s.mastery, 0);
      return Math.round(sum / domainSkills.length);
    };

    return {
      algebra: computeDomainAvg('Algebra'),
      advancedMath: computeDomainAvg('Advanced Math'),
      problemSolving: computeDomainAvg('Problem Solving'),
      geometryTrig: computeDomainAvg('Geometry & Trig'),
    };
  }, [plannerData?.skills, legacyState?.stats?.domainMastery]);

  // 2. Compute Current Estimated Math & Target Score
  const currentEstimatedMath = useMemo(() => {
    const history = legacyState?.stats?.examHistory;
    const latestExam = history && history.length > 0 ? history[history.length - 1] : null;
    if (latestExam && latestExam.score) return latestExam.score;
    if (plannerData?.profile?.baselineScore) return plannerData.profile.baselineScore;
    return legacyState?.planner?.baselineScore || 740;
  }, [plannerData?.profile?.baselineScore, legacyState]);

  const targetMath = plannerData?.profile?.targetScore || legacyState?.planner?.targetScore || 800;
  const targetExamDate = plannerData?.profile?.targetExamDate || legacyState?.planner?.targetExamDate || 'October 2026';

  // 3. Compute 3 Today's Drills with #1 targeting the user's #1 priority weak subtopic
  const todaysDrills = useMemo<TodayDrillItem[]>(() => {
    const skills = plannerData?.skills || [];
    const ranked = getRankedPrioritySkills(skills, targetMath, currentEstimatedMath);
    const topWeak = ranked[0]?.skill || skills[0] || {
      id: 'alg-linear-one',
      name: 'Linear Equations in One Variable',
      domain: 'Algebra'
    };

    const secondaryHighYield = ranked[1]?.skill || skills[1] || {
      id: 'adv-nonlinear-funcs',
      name: 'Nonlinear Functions & Vertex Form',
      domain: 'Advanced Math'
    };

    const todayBlocks = plannerData?.todayPlan?.blocks || [];
    const block1 = todayBlocks.find((b) => b.type === 'targeted_drills');
    const block2 = todayBlocks.find((b) => b.type === 'concept_deepdive');
    const block3 = todayBlocks.find((b) => b.type === 'mixed_timed' || b.type === 'error_review');

    return [
      {
        id: 'drill-priority-weakness',
        title: `Priority Focus: ${block1?.subtopicName || topWeak.name}`,
        questionCount: block1?.questionCount || 10,
        subtopicName: block1?.subtopicName || topWeak.name,
        subtopicId: block1?.subtopicId || topWeak.id,
        domain: (topWeak.domain as string) || 'Algebra',
        estimatedMinutes: block1?.durationMinutes || 15,
        difficulty: 'Adaptive 650–780',
        icon: React.createElement(Target, { className: "w-4 h-4" }),
        type: 'targeted_weakness',
      },
      {
        id: 'drill-high-yield',
        title: `Desmos High-Speed Shortcuts`,
        questionCount: block2?.questionCount || 10,
        subtopicName: block2?.subtopicName || secondaryHighYield.name,
        subtopicId: block2?.subtopicId || secondaryHighYield.id,
        domain: (secondaryHighYield.domain as string) || 'Advanced Math',
        estimatedMinutes: block2?.durationMinutes || 15,
        difficulty: 'Medium to Hard',
        icon: React.createElement(Calculator, { className: "w-4 h-4" }),
        type: 'concept_deepdive',
      },
      {
        id: 'drill-timed-mixed',
        title: `Timed Speed Sprint`,
        questionCount: block3?.questionCount || 8,
        subtopicName: 'Mixed Official Domains',
        domain: 'All Domains',
        estimatedMinutes: block3?.durationMinutes || 10,
        difficulty: 'Module 2 Pace',
        icon: React.createElement(Zap, { className: "w-4 h-4" }),
        type: 'mixed_timed',
      },
    ];
  }, [plannerData, targetMath, currentEstimatedMath]);

  // 4. Lifetime Stats from history & attempts
  const attemptsCount = plannerData?.attempts?.length || 0;
  const attemptsCorrect = plannerData?.attempts?.filter((a) => a.correct).length || 0;

  const totalSolved = Math.max(
    legacyState?.stats?.totalQuestionsSolved || 142,
    attemptsCount
  );

  const totalCorrect = Math.max(
    legacyState?.stats?.totalQuestionsCorrect || 125,
    attemptsCorrect
  );

  const globalXP = legacyState?.stats?.globalXP || 1450;
  const testsCompleted = legacyState?.stats?.completedExamsCount || 2;
  const streakDays = legacyState?.stats?.streakDays || 4;

  return {
    currentEstimatedMath,
    targetMath,
    targetExamDate,
    domainMastery,
    todaysDrills,
    totalSolved,
    totalCorrect,
    globalXP,
    testsCompleted,
    streakDays,
    refetch: reloadData,
    rawPlannerData: plannerData,
  };
}

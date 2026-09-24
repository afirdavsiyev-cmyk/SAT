import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Target,
  Calculator,
  Sparkles,
  BarChart3,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Zap,
  Play
} from 'lucide-react';
import { QuestionItem } from '../../types/questionBank';
import { ALL_QUESTIONS } from '../../data/questions';

export interface DomainSkillAccordionProps {
  onStartPractice?: (questions: QuestionItem[], topicName: string) => void;
  domainMastery?: {
    algebra: number;
    advancedMath: number;
    problemSolving: number;
    geometryTrig: number;
  };
}

interface SubtopicData {
  id: string;
  name: string;
  mastery: number;
  accuracyEasy: number;
  accuracyMed: number;
  accuracyHard: number;
  avgTimeSec: number;
  officialWeight: string;
  searchKeywords: string[];
}

interface DomainSectionData {
  id: string;
  domainName: string;
  examShare: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  accentBg: string;
  borderClass: string;
  subtopics: SubtopicData[];
}

export const DomainSkillAccordion: React.FC<DomainSkillAccordionProps> = ({
  onStartPractice,
  domainMastery = {
    algebra: 88,
    advancedMath: 74,
    problemSolving: 82,
    geometryTrig: 68,
  },
}) => {
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    algebra: true,
    advanced_math: true,
    problem_solving: false,
    geometry_trig: false,
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'needs_drill' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleDomain = (domainId: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  const collapseAll = () => {
    setExpandedDomains({
      algebra: false,
      advanced_math: false,
      problem_solving: false,
      geometry_trig: false,
    });
  };

  const expandAll = () => {
    setExpandedDomains({
      algebra: true,
      advanced_math: true,
      problem_solving: true,
      geometry_trig: true,
    });
  };

  const domainsData: DomainSectionData[] = useMemo(() => [
    {
      id: 'algebra',
      domainName: 'Algebra',
      examShare: '~35% of Exam',
      icon: Calculator,
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      borderClass: 'border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60',
      subtopics: [
        {
          id: 'alg-linear-one',
          name: 'Linear Equations in One Variable',
          mastery: Math.min(100, Math.round(domainMastery.algebra * 1.04)),
          accuracyEasy: 95,
          accuracyMed: 88,
          accuracyHard: 72,
          avgTimeSec: 42,
          officialWeight: 'High Yield',
          searchKeywords: ['linear', 'one variable', 'equations', 'algebra'],
        },
        {
          id: 'alg-linear-two',
          name: 'Linear Equations in Two Variables',
          mastery: Math.min(100, Math.round(domainMastery.algebra * 0.98)),
          accuracyEasy: 92,
          accuracyMed: 80,
          accuracyHard: 64,
          avgTimeSec: 54,
          officialWeight: 'High Yield',
          searchKeywords: ['two variables', 'slope', 'y-intercept'],
        },
        {
          id: 'alg-systems',
          name: 'Systems of Two Linear Equations',
          mastery: Math.min(100, Math.round(domainMastery.algebra * 0.92)),
          accuracyEasy: 88,
          accuracyMed: 75,
          accuracyHard: 55,
          avgTimeSec: 68,
          officialWeight: 'Critical',
          searchKeywords: ['systems', 'elimination', 'substitution', 'no solution', 'infinite solutions'],
        },
        {
          id: 'alg-functions',
          name: 'Linear Functions & Models',
          mastery: Math.min(100, Math.round(domainMastery.algebra * 1.01)),
          accuracyEasy: 94,
          accuracyMed: 85,
          accuracyHard: 70,
          avgTimeSec: 48,
          officialWeight: 'Medium',
          searchKeywords: ['functions', 'models', 'rate of change'],
        },
        {
          id: 'alg-inequalities',
          name: 'Linear Inequalities in 1 or 2 Variables',
          mastery: Math.min(100, Math.round(domainMastery.algebra * 0.88)),
          accuracyEasy: 86,
          accuracyMed: 68,
          accuracyHard: 52,
          avgTimeSec: 52,
          officialWeight: 'Needs Drill',
          searchKeywords: ['inequalities', 'shading', 'boundary line'],
        },
      ],
    },
    {
      id: 'advanced_math',
      domainName: 'Advanced Math',
      examShare: '~35% of Exam',
      icon: Sparkles,
      colorClass: 'text-teal-700 dark:text-teal-400',
      accentBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/60',
      borderClass: 'border-teal-500/30 dark:border-teal-500/40 hover:border-teal-500/60',
      subtopics: [
        {
          id: 'adv-equivalent-expr',
          name: 'Equivalent Expressions & Factoring',
          mastery: Math.min(100, Math.round(domainMastery.advancedMath * 1.05)),
          accuracyEasy: 90,
          accuracyMed: 78,
          accuracyHard: 60,
          avgTimeSec: 58,
          officialWeight: 'High Yield',
          searchKeywords: ['factoring', 'expressions', 'polynomials', 'binomial'],
        },
        {
          id: 'adv-nonlinear-equations',
          name: 'Nonlinear Equations in 1 Variable (Quadratics)',
          mastery: Math.min(100, Math.round(domainMastery.advancedMath * 0.92)),
          accuracyEasy: 82,
          accuracyMed: 65,
          accuracyHard: 48,
          avgTimeSec: 74,
          officialWeight: 'Needs Drill',
          searchKeywords: ['quadratics', 'quadratic formula', 'discriminant', 'zeros', 'roots'],
        },
        {
          id: 'adv-nonlinear-functions',
          name: 'Nonlinear Functions & Vertex Form Parabolas',
          mastery: Math.min(100, Math.round(domainMastery.advancedMath * 0.86)),
          accuracyEasy: 78,
          accuracyMed: 60,
          accuracyHard: 42,
          avgTimeSec: 82,
          officialWeight: 'Critical Drill',
          searchKeywords: ['vertex form', 'parabolas', 'extrema', 'exponential functions'],
        },
      ],
    },
    {
      id: 'problem_solving',
      domainName: 'Problem-Solving & Data Analysis',
      examShare: '~15% of Exam',
      icon: BarChart3,
      colorClass: 'text-cyan-700 dark:text-cyan-400',
      accentBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
      borderClass: 'border-cyan-500/30 dark:border-cyan-500/40 hover:border-cyan-500/60',
      subtopics: [
        {
          id: 'ps-percentages',
          name: 'Percentages, Ratios & Rates',
          mastery: Math.min(100, Math.round(domainMastery.problemSolving * 1.06)),
          accuracyEasy: 96,
          accuracyMed: 85,
          accuracyHard: 72,
          avgTimeSec: 44,
          officialWeight: 'High Yield',
          searchKeywords: ['percentages', 'ratios', 'proportions', 'rates'],
        },
        {
          id: 'ps-units',
          name: 'Unit Conversions & Dimensional Analysis',
          mastery: Math.min(100, Math.round(domainMastery.problemSolving * 0.95)),
          accuracyEasy: 92,
          accuracyMed: 78,
          accuracyHard: 62,
          avgTimeSec: 50,
          officialWeight: 'Moderate',
          searchKeywords: ['units', 'conversions', 'metric', 'dimensional analysis'],
        },
        {
          id: 'ps-probability',
          name: 'Probability & Conditional Tables',
          mastery: Math.min(100, Math.round(domainMastery.problemSolving * 0.90)),
          accuracyEasy: 88,
          accuracyMed: 72,
          accuracyHard: 54,
          avgTimeSec: 58,
          officialWeight: 'Needs Drill',
          searchKeywords: ['probability', 'two-way tables', 'conditional'],
        },
        {
          id: 'ps-stats',
          name: 'Statistics: Mean, Median, Standard Deviation & Spread',
          mastery: Math.min(100, Math.round(domainMastery.problemSolving * 1.02)),
          accuracyEasy: 94,
          accuracyMed: 82,
          accuracyHard: 68,
          avgTimeSec: 56,
          officialWeight: 'High Yield',
          searchKeywords: ['statistics', 'mean', 'median', 'standard deviation', 'range'],
        },
        {
          id: 'ps-scatterplots',
          name: 'Scatterplots & Line-of-Best-Fit Models',
          mastery: Math.min(100, Math.round(domainMastery.problemSolving * 0.98)),
          accuracyEasy: 90,
          accuracyMed: 80,
          accuracyHard: 65,
          avgTimeSec: 62,
          officialWeight: 'Moderate',
          searchKeywords: ['scatterplots', 'regression', 'margin of error', 'outliers'],
        },
      ],
    },
    {
      id: 'geometry_trig',
      domainName: 'Geometry & Trigonometry',
      examShare: '~15% of Exam',
      icon: BookOpen,
      colorClass: 'text-amber-700 dark:text-amber-400',
      accentBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      borderClass: 'border-amber-500/30 dark:border-amber-500/40 hover:border-amber-500/60',
      subtopics: [
        {
          id: 'geo-area-volume',
          name: 'Area & Volume Equations',
          mastery: Math.min(100, Math.round(domainMastery.geometryTrig * 1.04)),
          accuracyEasy: 88,
          accuracyMed: 74,
          accuracyHard: 58,
          avgTimeSec: 64,
          officialWeight: 'Moderate',
          searchKeywords: ['area', 'volume', 'cylinders', 'spheres', 'prisms'],
        },
        {
          id: 'geo-triangles-trig',
          name: 'Right Triangles & Radian Trigonometry',
          mastery: Math.min(100, Math.round(domainMastery.geometryTrig * 0.90)),
          accuracyEasy: 80,
          accuracyMed: 64,
          accuracyHard: 46,
          avgTimeSec: 72,
          officialWeight: 'Needs Drill',
          searchKeywords: ['triangles', 'trigonometry', 'sine', 'cosine', 'tangent', 'radians'],
        },
        {
          id: 'geo-circles',
          name: 'Circle Equations & Arc Theorems',
          mastery: Math.min(100, Math.round(domainMastery.geometryTrig * 0.82)),
          accuracyEasy: 75,
          accuracyMed: 56,
          accuracyHard: 38,
          avgTimeSec: 86,
          officialWeight: 'Critical Drill',
          searchKeywords: ['circles', 'arc length', 'sector', 'center-radius', '(x-h)^2'],
        },
      ],
    },
  ], [domainMastery]);

  const handleLaunchSubtopicDrill = (sub: SubtopicData, domainName: string) => {
    // Filter questions matching domain or topic keyword
    const matched = ALL_QUESTIONS.filter((q) => {
      const matchDomain = q.domain.toLowerCase().includes(domainName.toLowerCase()) ||
        domainName.toLowerCase().includes(q.domain.toLowerCase());
      const matchTopic = sub.searchKeywords.some((kw) =>
        (q.topic && q.topic.toLowerCase().includes(kw)) ||
        (q.question && q.question.toLowerCase().includes(kw))
      );
      return matchDomain && matchTopic;
    });

    const drillQuestions = matched.length > 0
      ? matched.slice(0, 10)
      : ALL_QUESTIONS.filter((q) => q.domain.toLowerCase().includes(domainName.toLowerCase())).slice(0, 10);

    if (onStartPractice && drillQuestions.length > 0) {
      onStartPractice(drillQuestions, `${sub.name} Drill`);
    }
  };

  const handleLaunchDomainDrill = (domainName: string) => {
    const matched = ALL_QUESTIONS.filter((q) =>
      q.domain.toLowerCase().includes(domainName.toLowerCase()) ||
      domainName.toLowerCase().includes(q.domain.toLowerCase())
    ).slice(0, 12);

    if (onStartPractice && matched.length > 0) {
      onStartPractice(matched, `${domainName} Mastery Sprint`);
    }
  };

  const getStatusBadge = (mastery: number) => {
    if (mastery >= 85) {
      return {
        label: 'Mastered',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800/60',
        barColor: 'from-emerald-500 to-teal-400',
      };
    }
    if (mastery >= 70) {
      return {
        label: 'Developing',
        badgeClass: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/80 dark:text-teal-400 dark:border-teal-800/60',
        barColor: 'from-teal-500 to-cyan-400',
      };
    }
    return {
      label: 'Needs Drill',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800/60',
      barColor: 'from-rose-500 to-amber-500',
    };
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] p-6 sm:p-7 shadow-sm transition-all space-y-6">
      
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-400 border border-teal-300 dark:border-teal-800/60">
              <Target className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono">
              Curriculum Diagnostics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Domain & Skill Breakdown
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Pinpoints specific subtopics needing drill work with expandable mastery accordions and targeted practice launch.
          </p>
        </div>

        {/* Controls: Expand/Collapse & Filter Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subtopics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-36 sm:w-44 transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('needs_drill')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'needs_drill'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Needs Drill
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('mastered')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'mastered'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mastered
            </button>
          </div>

          {/* Toggle All button */}
          <button
            type="button"
            onClick={() => {
              const allExpanded = Object.values(expandedDomains).every(Boolean);
              if (allExpanded) collapseAll();
              else expandAll();
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {Object.values(expandedDomains).every(Boolean) ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Accordion Domains List */}
      <div className="space-y-4">
        {domainsData.map((domain) => {
          const isExpanded = expandedDomains[domain.id];
          const Icon = domain.icon;

          // Compute domain average mastery from its subtopics
          const domainAverage = Math.round(
            domain.subtopics.reduce((acc, sub) => acc + sub.mastery, 0) / domain.subtopics.length
          );
          const domainStatus = getStatusBadge(domainAverage);

          // Filter subtopics based on search and active filter
          const filteredSubtopics = domain.subtopics.filter((sub) => {
            const matchesSearch = searchQuery === '' ||
              sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              sub.searchKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (activeFilter === 'needs_drill') return sub.mastery < 70;
            if (activeFilter === 'mastered') return sub.mastery >= 85;
            return true;
          });

          // If filtering and no subtopics match, hide this domain unless user searched
          if (filteredSubtopics.length === 0 && (activeFilter !== 'all' || searchQuery !== '')) {
            return null;
          }

          return (
            <div
              key={domain.id}
              className={`rounded-2xl border ${domain.borderClass} bg-slate-50/70 dark:bg-[#0f172a]/70 overflow-hidden transition-all duration-200 shadow-sm`}
            >
              {/* Accordion Bar Header */}
              <div
                onClick={() => toggleDomain(domain.id)}
                className="cursor-pointer p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Domain Title & Icon */}
                <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm flex-shrink-0 ${domain.accentBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight truncate">
                        {domain.domainName}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {domain.examShare}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${domainStatus.badgeClass}`}>
                        {domainStatus.label}
                      </span>
                    </div>

                    {/* Progress bar container */}
                    <div className="flex items-center space-x-3 pt-2">
                      <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden max-w-md">
                        <div
                          className={`h-full bg-gradient-to-r ${domainStatus.barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${domainAverage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                        {domainAverage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: Practice Sprint & Chevron */}
                <div className="flex items-center space-x-2.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchDomainDrill(domain.domainName);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 active:scale-95"
                    title={`Practice all ${domain.domainName} questions`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span className="hidden sm:inline">Practice Domain</span>
                    <span className="sm:hidden">Drill</span>
                  </button>

                  <div className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Accordion Expandable Subtopics Tray */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1424] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
                    <span className="font-semibold uppercase tracking-wider text-[11px] font-mono">
                      Subtopic Mastery & Granular Drill Work ({filteredSubtopics.length})
                    </span>
                    <span className="text-[11px] font-mono hidden sm:inline">
                      Target: ≥85% for 750+ score
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredSubtopics.map((sub) => {
                      const subStatus = getStatusBadge(sub.mastery);
                      return (
                        <div
                          key={sub.id}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          {/* Subtopic details */}
                          <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {sub.name}
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${subStatus.badgeClass}`}>
                                {subStatus.label} ({sub.mastery}%)
                              </span>
                              {sub.officialWeight.includes('Critical') && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/40 flex items-center space-x-1">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  <span>Priority Drill</span>
                                </span>
                              )}
                            </div>

                            {/* Granular accuracy bars and avg time */}
                            <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex-wrap gap-y-1">
                              <span>
                                Easy: <strong className="text-emerald-700 dark:text-emerald-400">{sub.accuracyEasy}%</strong>
                              </span>
                              <span>
                                Med: <strong className="text-teal-700 dark:text-teal-400">{sub.accuracyMed}%</strong>
                              </span>
                              <span>
                                Hard: <strong className={sub.accuracyHard < 50 ? 'text-rose-700 dark:text-rose-400 font-black' : 'text-slate-700 dark:text-slate-300'}>{sub.accuracyHard}%</strong>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>~{sub.avgTimeSec}s / Q</span>
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleLaunchSubtopicDrill(sub, domain.domainName)}
                              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs shadow-sm transition-all flex items-center space-x-1 active:scale-95"
                            >
                              <span>Drill Skill</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

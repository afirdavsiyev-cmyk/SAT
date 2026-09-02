import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionItem, QuestionDomain, QuestionDifficulty, QuestionType, SkillDirectoryItem, DomainDirectoryCategory } from '../../types/questionBank';
import { ALL_QUESTIONS, OFFICIAL_DOMAIN_TAXONOMY } from '../../data/questions';
import { QuestionBankCard } from './QuestionBankCard';
import { QuestionBankModal } from './QuestionBankModal';
import { QuestionBankFilterToolbar, DropdownFiltersState } from './QuestionBankFilterToolbar';
import { PracticeRoomView } from './PracticeRoomView';
import { DomainInteractiveCanvas } from './DomainInteractiveCanvas';
import {
  Search,
  FolderKanban,
  CheckCircle2,
  Sparkles,
  Zap,
  Bookmark,
  RotateCcw,
  BookOpen,
  Filter,
  Layers,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Compass,
  BarChart3,
  CheckSquare,
  Square,
  ChevronRight,
  Target,
  Trophy,
  PlayCircle,
  FolderTree
} from 'lucide-react';

interface SolvedRecord {
  isCorrect: boolean;
  selectedAnswer: string;
}

export const QuestionBankView: React.FC = () => {
  const { userProgress, setUserProgress } = useApp();

  // Selected subtopics for multi-select
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());

  // Active Drill-down view state (null = Tree Directory view, array of skill names = Topic Question Pool view)
  const [activeDrillDownTopics, setActiveDrillDownTopics] = useState<string[] | null>(null);
  const [activeDrillDownDomain, setActiveDrillDownDomain] = useState<QuestionDomain | null>(null);

  // Search query within tree view or topic view
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');
  const [drillSearchQuery, setDrillSearchQuery] = useState<string>('');

  // Dropdown Toolbar Filters State (OnePrep style)
  const [dropdownFilters, setDropdownFilters] = useState<DropdownFiltersState>({
    difficulties: [],
    completed: 'all',
    questionSet: 'all',
    questionType: 'all',
    bookmarkedOnly: false,
    result: 'all',
  });

  // Bookmark tracking
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Solved tracking map
  const [solvedMap, setSolvedMap] = useState<Record<string, SolvedRecord>>({});

  // Active question modal
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem | null>(null);

  // Global domain icons helper
  const getDomainIcon = (domain: QuestionDomain) => {
    switch (domain) {
      case 'Algebra':
        return <Calculator className="w-5 h-5 text-orange-600 dark:text-emerald-400" />;
      case 'Advanced Math':
        return <Sparkles className="w-5 h-5 text-amber-600 dark:text-teal-400" />;
      case 'Problem-Solving & Data Analysis':
        return <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'Geometry & Trigonometry':
        return <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <FolderKanban className="w-5 h-5 text-orange-600 dark:text-emerald-400" />;
    }
  };

  /**
   * Universal Question Filter Evaluator
   */
  const evaluateQuestionMatchesFilters = (q: QuestionItem) => {
    // 1. Difficulty filter
    if (dropdownFilters.difficulties.length > 0) {
      if (!dropdownFilters.difficulties.includes(q.difficulty)) {
        return false;
      }
    }

    // 2. Completed / Solved status
    const isSolved = !!solvedMap[q.id];
    if (dropdownFilters.completed === 'solved' && !isSolved) return false;
    if (dropdownFilters.completed === 'unsolved' && isSolved) return false;

    // 3. Question Set / Source
    if (dropdownFilters.questionSet !== 'all') {
      const qSource = q.source.toLowerCase();
      const targetSet = dropdownFilters.questionSet.toLowerCase();
      if (!qSource.includes(targetSet)) {
        return false;
      }
    }

    // 4. Question Format / Type
    if (dropdownFilters.questionType !== 'all' && q.type !== dropdownFilters.questionType) {
      return false;
    }

    // 5. Bookmarked filter
    if (dropdownFilters.bookmarkedOnly && !bookmarkedIds.has(q.id)) {
      return false;
    }

    // 6. Result filter (correct vs incorrect)
    if (dropdownFilters.result !== 'all') {
      if (!isSolved) return false;
      const wasCorrect = solvedMap[q.id]?.isCorrect;
      if (dropdownFilters.result === 'correct' && !wasCorrect) return false;
      if (dropdownFilters.result === 'incorrect' && wasCorrect) return false;
    }

    return true;
  };

  // Helper to get stats for a specific skill topic under active filters
  const getSkillStats = (skillName: string, totalOfficialPool: number) => {
    const allForSkill = ALL_QUESTIONS.filter(
      (q) => q.topic.toLowerCase().trim() === skillName.toLowerCase().trim()
    );

    const matchingForSkill = allForSkill.filter(evaluateQuestionMatchesFilters);
    const matchingCount = matchingForSkill.length;

    let solvedCount = 0;
    let correctCount = 0;

    matchingForSkill.forEach((q) => {
      const rec = solvedMap[q.id];
      if (rec) {
        solvedCount++;
        if (rec.isCorrect) correctCount++;
      }
    });

    const masteryRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : null;

    return {
      allCount: allForSkill.length,
      matchingCount,
      solvedCount,
      correctCount,
      masteryRate,
      totalOfficialPool,
    };
  };

  // Helper to get domain aggregated stats under active filters
  const getDomainAggregatedStats = (category: DomainDirectoryCategory) => {
    let totalMatching = 0;
    let totalSolved = 0;
    let totalCorrect = 0;
    let totalOfficial = 0;

    category.skills.forEach((skill) => {
      const stats = getSkillStats(skill.name, skill.totalOfficialCount);
      totalMatching += stats.matchingCount;
      totalSolved += stats.solvedCount;
      totalCorrect += stats.correctCount;
      totalOfficial += stats.totalOfficialPool;
    });

    const domainMastery = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : null;

    return {
      totalMatching,
      totalSolved,
      totalCorrect,
      totalOfficial,
      domainMastery,
    };
  };

  // Toggle single skill selection
  const handleToggleSkillSelection = (skillId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  // Toggle entire domain selection
  const handleToggleDomainSelection = (category: DomainDirectoryCategory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const skillIds = category.skills.map((s) => s.id);
    const allSelected = skillIds.every((id) => selectedSkillIds.has(id));

    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        skillIds.forEach((id) => next.delete(id));
      } else {
        skillIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Drill down into single subtopic
  const handleDrillDownSingle = (skill: SkillDirectoryItem) => {
    setActiveDrillDownTopics([skill.name]);
    setActiveDrillDownDomain(skill.domain);
    setDrillSearchQuery('');
  };

  // Drill down into all selected subtopics
  const handleDrillDownSelected = () => {
    if (selectedSkillIds.size === 0) return;
    const selectedSkillsList: SkillDirectoryItem[] = [];
    OFFICIAL_DOMAIN_TAXONOMY.forEach((cat) => {
      cat.skills.forEach((s) => {
        if (selectedSkillIds.has(s.id)) {
          selectedSkillsList.push(s);
        }
      });
    });

    const topicNames = selectedSkillsList.map((s) => s.name);
    const primaryDomain = selectedSkillsList.length > 0 ? selectedSkillsList[0].domain : null;

    setActiveDrillDownTopics(topicNames);
    setActiveDrillDownDomain(primaryDomain);
    setDrillSearchQuery('');
  };

  // Select all skills in entire Question Bank
  const handleSelectAllSkills = () => {
    const allIds = new Set<string>();
    OFFICIAL_DOMAIN_TAXONOMY.forEach((cat) => {
      cat.skills.forEach((s) => allIds.add(s.id));
    });
    setSelectedSkillIds(allIds);
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedSkillIds(new Set());
  };

  // Total questions matched in drill-down view
  const drillDownQuestions = useMemo(() => {
    if (!activeDrillDownTopics || activeDrillDownTopics.length === 0) return [];
    const topicSet = new Set(activeDrillDownTopics.map((t) => t.toLowerCase().trim()));

    return ALL_QUESTIONS.filter((q) => {
      if (!topicSet.has(q.topic.toLowerCase().trim())) {
        return false;
      }

      if (!evaluateQuestionMatchesFilters(q)) {
        return false;
      }

      if (drillSearchQuery.trim()) {
        const query = drillSearchQuery.toLowerCase().trim();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesSource = q.source.toLowerCase().includes(query);
        const matchesId = q.id.toLowerCase().includes(query);
        if (!matchesQuestion && !matchesTopic && !matchesSource && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [activeDrillDownTopics, dropdownFilters, solvedMap, bookmarkedIds, drillSearchQuery]);

  // Filter taxonomy for search query in Tree View
  const filteredTaxonomy = useMemo(() => {
    if (!treeSearchQuery.trim()) return OFFICIAL_DOMAIN_TAXONOMY;
    const q = treeSearchQuery.toLowerCase().trim();

    return OFFICIAL_DOMAIN_TAXONOMY.map((cat) => {
      const matchingSkills = cat.skills.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q)
      );
      return {
        ...cat,
        skills: matchingSkills,
      };
    }).filter((cat) => cat.skills.length > 0);
  }, [treeSearchQuery]);

  // Total matching questions across entire bank under active dropdown filters
  const totalBankMatchingCount = useMemo(() => {
    return ALL_QUESTIONS.filter(evaluateQuestionMatchesFilters).length;
  }, [dropdownFilters, solvedMap, bookmarkedIds]);

  const totalSolvedOverall = Object.keys(solvedMap).length;
  const totalCorrectOverall = Object.values(solvedMap).filter((s) => s.isCorrect).length;
  const globalBankAccuracy = totalSolvedOverall > 0 ? Math.round((totalCorrectOverall / totalSolvedOverall) * 100) : 100;

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW 1: DEDICATED BLUEBOOK/ONEPREP PRACTICE ROOM VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (activeDrillDownTopics !== null) {
    const topicLabel =
      activeDrillDownTopics.length === 1
        ? activeDrillDownTopics[0]
        : `${activeDrillDownTopics.length} Selected Subtopics (${activeDrillDownDomain || 'Practice Session'})`;

    const sessionQuestions =
      drillDownQuestions.length > 0
        ? drillDownQuestions
        : ALL_QUESTIONS.filter((q) =>
            activeDrillDownTopics.some((t) => t.toLowerCase().trim() === q.topic.toLowerCase().trim())
          );

    return (
      <PracticeRoomView
        questions={sessionQuestions.length > 0 ? sessionQuestions : ALL_QUESTIONS}
        selectedTopicName={topicLabel}
        onGoBack={() => setActiveDrillDownTopics(null)}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW 2: PRIMARY TOPIC TREE DIRECTORY VIEW (DEFAULT)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* ─── Top Header Banner & Stats ─────────────────────────────────── */}
      <div className="rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 dark:from-slate-900/90 dark:via-slate-900 dark:to-emerald-950/80 border border-amber-900/10 dark:border-emerald-500/40 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.1)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
            <span>OFFICIAL DIGITAL SAT MATH VAULT (2026/2027)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Question Bank Directory
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Practice by official College Board® domains, targeted skill subtopics, difficulty tiers, and active completion status.
          </p>
        </div>

        {/* Global Stats Counter Card Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <div className="flex-1 lg:flex-none p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-amber-900/10 dark:border-emerald-500/40 flex items-center space-x-3 text-center sm:text-left shadow-sm">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-mono font-extrabold text-orange-600 dark:text-emerald-400">
                {totalSolvedOverall} / {ALL_QUESTIONS.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Questions Solved</div>
            </div>
          </div>

          <div className="flex-1 lg:flex-none p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-amber-900/10 dark:border-emerald-500/40 flex items-center space-x-3 text-center sm:text-left shadow-sm">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-mono font-extrabold text-amber-600 dark:text-amber-300">
                {globalBankAccuracy}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Bank Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Dropdown Filter Toolbar (OnePrep Style) ─────────────────── */}
      <QuestionBankFilterToolbar
        filters={dropdownFilters}
        onChange={setDropdownFilters}
        totalMatchingCount={totalBankMatchingCount}
        totalBankCount={ALL_QUESTIONS.length}
        bookmarkedTotalCount={bookmarkedIds.size}
      />

      {/* ─── Search & Multi-Selection Action Toolbar ─────────────────── */}
      <div className="rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900/65 border border-amber-900/10 dark:border-emerald-500/40 shadow-sm backdrop-blur-xl transition-colors">
        {/* Search within tree skills */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={treeSearchQuery}
            onChange={(e) => setTreeSearchQuery(e.target.value)}
            placeholder="Search all skills & subtopics (e.g. vertex form, systems)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-amber-900/15 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 dark:focus:border-emerald-500 transition-colors shadow-inner"
          />
          {treeSearchQuery && (
            <button
              onClick={() => setTreeSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          {selectedSkillIds.size > 0 ? (
            <>
              <span className="text-xs font-mono font-bold text-orange-800 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-emerald-800/60">
                {selectedSkillIds.size} {selectedSkillIds.size === 1 ? 'Skill' : 'Skills'} Selected
              </span>

              <button
                onClick={handleDrillDownSelected}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-xs shadow-md shadow-orange-500/25 dark:shadow-glow-emerald hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Practice Selected Topics</span>
              </button>

              <button
                onClick={handleClearSelection}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-amber-900/15 dark:border-white/[0.08] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
              >
                Clear Selection
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSelectAllSkills}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-amber-900/15 dark:border-white/[0.08] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
              >
                Select All Skills
              </button>

              <button
                onClick={() => {
                  const allTopics = OFFICIAL_DOMAIN_TAXONOMY.flatMap((c) => c.skills.map((s) => s.name));
                  setActiveDrillDownTopics(allTopics);
                }}
                className="px-4 py-2 rounded-xl bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25 dark:border-emerald-400/30 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                <span>Browse Matching Questions ({totalBankMatchingCount})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── 4 Official Domains & Subtopic Skill Tree ─────────────────── */}
      <div className="space-y-6">
        {filteredTaxonomy.map((category) => {
          const domainStats = getDomainAggregatedStats(category);
          const allDomainSkillsSelected = category.skills.every((s) => selectedSkillIds.has(s.id));
          const someDomainSkillsSelected = category.skills.some((s) => selectedSkillIds.has(s.id));

          return (
            <div
              key={category.domain}
              className="rounded-3xl overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900/70 border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-400 dark:hover:border-emerald-500/60 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              {/* Domain Header Row */}
              <div className="relative flex items-center justify-between w-full p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200/90 dark:border-white/[0.06] overflow-hidden">
                
                {/* 1. LEFT: Checkbox + Icon + Title & Description (Keep intact) */}
                <div className="flex items-center gap-3.5 z-10 shrink-0">
                  {/* Domain-level selection checkbox */}
                  <button
                    onClick={(e) => handleToggleDomainSelection(category, e)}
                    className="text-slate-400 hover:text-orange-600 dark:hover:text-emerald-500 transition-colors p-1 rounded-lg"
                    title={allDomainSkillsSelected ? 'Deselect all skills in domain' : 'Select all skills in domain'}
                  >
                    {allDomainSkillsSelected ? (
                      <CheckSquare className="w-5 h-5 text-orange-600 dark:text-emerald-400" />
                    ) : someDomainSkillsSelected ? (
                      <div className="w-5 h-5 rounded border border-orange-500 bg-orange-500/20 dark:border-emerald-500 dark:bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-orange-500 dark:bg-emerald-500 rounded-sm" />
                      </div>
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>

                  <div className="p-2.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
                    {getDomainIcon(category.domain)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        {category.title}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded-md font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.05] border border-slate-200/90 dark:border-white/[0.08]">
                        {category.skills.length} Skills
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{category.subtitle}</p>
                  </div>
                </div>

                {/* 2. MIDDLE: Dedicated Canvas in the Empty Space (NEW) */}
                <div className="flex-1 h-12 mx-4 relative overflow-hidden pointer-events-none select-none min-w-[140px]">
                  <DomainInteractiveCanvas domain={category.domain} />
                </div>

                {/* 3. RIGHT: Solved Counter + Open Button (Keep intact, no overlapping SVG) */}
                <div className="flex items-center gap-4 z-10 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
                      {domainStats.totalSolved} / {domainStats.totalMatching} Solved
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {domainStats.domainMastery !== null ? `${domainStats.domainMastery}% Domain Mastery` : 'Not Started'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const topicNames = category.skills.map((s) => s.name);
                      setActiveDrillDownTopics(topicNames);
                      setActiveDrillDownDomain(category.domain);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200/90 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>Open Domain Pool ({domainStats.totalMatching})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                  </button>
                </div>

              </div>

              {/* Subtopic Skill Rows List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {category.skills.map((skill) => {
                  const isSelected = selectedSkillIds.has(skill.id);
                  const stats = getSkillStats(skill.name, skill.totalOfficialCount);

                  const progressPct = stats.matchingCount > 0 
                    ? Math.round((stats.solvedCount / stats.matchingCount) * 100) 
                    : 0;

                  let dotColor = 'bg-slate-400 dark:bg-slate-500';
                  let masteryText = '—';
                  let pillBorder = 'border-slate-200/90 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02]';

                  if (stats.masteryRate !== null) {
                    masteryText = `${stats.masteryRate}%`;
                    if (stats.masteryRate >= 85) {
                      dotColor = 'bg-orange-500 dark:bg-emerald-400 animate-pulse';
                      pillBorder = 'border-orange-300 text-orange-800 bg-orange-50 dark:border-emerald-500/40 dark:text-emerald-300 dark:bg-emerald-950/40';
                    } else if (stats.masteryRate >= 50) {
                      dotColor = 'bg-amber-500 dark:bg-amber-400';
                      pillBorder = 'border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40';
                    } else {
                      dotColor = 'bg-rose-500 dark:bg-rose-400';
                      pillBorder = 'border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40';
                    }
                  }

                  return (
                    <div
                      key={skill.id}
                      onClick={() => handleDrillDownSingle(skill)}
                      className="p-4 sm:px-6 sm:py-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-orange-50/40 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group border-b border-slate-100 dark:border-slate-800/60 last:border-b-0"
                    >
                      {/* Left: Checkbox + Subtopic Name & Description */}
                      <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => handleToggleSkillSelection(skill.id, e)}
                          className="text-slate-400 hover:text-orange-600 dark:hover:text-emerald-500 transition-colors p-1 rounded-lg flex-shrink-0"
                          title={isSelected ? 'Deselect topic' : 'Select topic'}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4.5 h-4.5 text-orange-600 dark:text-emerald-400" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-emerald-300 transition-colors truncate">
                              {skill.name}
                            </h3>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 hidden sm:block">
                            {skill.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Progress Bar, Ratio & Mastery Pill */}
                      <div className="flex items-center space-x-4 sm:space-x-6 flex-shrink-0 self-end md:self-auto w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/[0.04]">
                        
                        {/* Progress Bar & Ratio */}
                        <div className="flex items-center space-x-3">
                          <div className="w-24 sm:w-32 bg-slate-100 dark:bg-slate-950 h-2 rounded-full border border-slate-200 dark:border-white/[0.08] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 dark:from-emerald-500 dark:to-teal-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(progressPct, stats.solvedCount > 0 ? 15 : 0)}%` }}
                            />
                          </div>

                          <div className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold w-16 text-right">
                            {stats.solvedCount} / {stats.matchingCount > 0 ? stats.matchingCount : skill.totalOfficialCount}
                          </div>
                        </div>

                        {/* Mastery Percentage Pill with dot indicator */}
                        <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center space-x-1.5 flex-shrink-0 ${pillBorder}`}>
                          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                          <span>{masteryText}</span>
                        </div>

                        {/* Chevron drill-down indicator */}
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-orange-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 hidden sm:block" />

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

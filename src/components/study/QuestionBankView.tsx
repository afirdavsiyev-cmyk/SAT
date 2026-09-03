import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionItem, QuestionDomain } from '../../types/questionBank';
import { ALL_QUESTIONS } from '../../data/questions';
import { SAT_DOMAINS } from '../../data/questionTaxonomy';
import { QuestionBankFilterToolbar, DropdownFiltersState } from './QuestionBankFilterToolbar';
import { PracticeRoomView } from './PracticeRoomView';
import { DomainInteractiveCanvas } from './DomainInteractiveCanvas';
import { getProgress, recordAttempt, getBookmarks, toggleBookmark } from '../../services/userProgress';
import {
  Search,
  FolderKanban,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Compass,
  BarChart3,
  CheckSquare,
  Square,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

interface SolvedRecord {
  isCorrect: boolean;
  selectedAnswer: string;
}

const domainIdToQuestionDomain: Record<string, QuestionDomain> = {
  algebra: 'Algebra',
  advanced_math: 'Advanced Math',
  problem_solving: 'Problem-Solving & Data Analysis',
  geometry_trig: 'Geometry & Trigonometry',
};

const isQuestionInDomain = (q: QuestionItem, domainId: string): boolean => {
  const qd = q.domain.toLowerCase().replace(/[^a-z]/g, '');
  const target = domainId.toLowerCase().replace(/[^a-z]/g, '');
  if (qd === target) return true;
  if (target === 'algebra' && qd.startsWith('algebra')) return true;
  if (target === 'advancedmath' && qd.startsWith('advancedmath')) return true;
  if (target === 'problemsolving' && (qd.startsWith('problem') || qd.includes('data'))) return true;
  if (target === 'geometrytrig' && (qd.startsWith('geo') || qd.includes('trig'))) return true;
  return false;
};

const isQuestionInTopic = (q: QuestionItem, topicName: string): boolean => {
  const qt = q.topic.toLowerCase().replace(/[^a-z0-9]/g, '');
  const tt = topicName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return qt === tt;
};

export const QuestionBankView: React.FC = () => {
  const { userProgress } = useApp();

  // Selected subtopics for multi-select (stores topic names)
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

  // Active Practice Room session state (null = Curriculum Directory view, object = Full Bluebook Test Room)
  const [practiceSession, setPracticeSession] = useState<{
    questions: QuestionItem[];
    topicName: string;
    initialIndex: number;
  } | null>(null);

  // Search query within tree view
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');

  // Dropdown Toolbar Filters State (OnePrep style)
  const [dropdownFilters, setDropdownFilters] = useState<DropdownFiltersState>({
    difficulties: [],
    completed: 'all',
    questionSet: 'all',
    questionType: 'all',
    bookmarkedOnly: false,
    result: 'all',
  });

  // Bookmark tracking (synced with global persistent store)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set(getBookmarks()));

  // Solved tracking map (synced with global persistent store)
  const [solvedMap, setSolvedMap] = useState<Record<string, SolvedRecord>>(() => {
    const progress = getProgress();
    const map: Record<string, SolvedRecord> = {};
    Object.values(progress).forEach((att) => {
      map[att.questionId] = {
        isCorrect: att.isCorrect,
        selectedAnswer: att.selectedAnswer,
      };
    });
    return map;
  });

  // Sync state whenever global store is updated anywhere in the app
  useEffect(() => {
    const handleProgressUpdate = () => {
      const progress = getProgress();
      const map: Record<string, SolvedRecord> = {};
      Object.values(progress).forEach((att) => {
        map[att.questionId] = {
          isCorrect: att.isCorrect,
          selectedAnswer: att.selectedAnswer,
        };
      });
      setSolvedMap(map);
    };

    const handleBookmarksUpdate = () => {
      setBookmarkedIds(new Set(getBookmarks()));
    };

    window.addEventListener('scoreup_progress_updated', handleProgressUpdate);
    window.addEventListener('scoreup_bookmarks_updated', handleBookmarksUpdate);
    return () => {
      window.removeEventListener('scoreup_progress_updated', handleProgressUpdate);
      window.removeEventListener('scoreup_bookmarks_updated', handleBookmarksUpdate);
    };
  }, []);

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

  // Helper to get stats for a specific topic under active filters
  const getTopicStats = (domainId: string, topicName: string) => {
    const allForTopic = ALL_QUESTIONS.filter(
      (q) => isQuestionInDomain(q, domainId) && isQuestionInTopic(q, topicName)
    );

    const matchingForTopic = allForTopic.filter(evaluateQuestionMatchesFilters);
    let solvedCount = 0;
    let correctCount = 0;

    matchingForTopic.forEach((q) => {
      const rec = solvedMap[q.id];
      if (rec) {
        solvedCount++;
        if (rec.isCorrect) correctCount++;
      }
    });

    const masteryRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : null;

    return {
      allCount: allForTopic.length,
      matchingCount: matchingForTopic.length,
      solvedCount,
      correctCount,
      masteryRate,
    };
  };

  // Toggle single topic selection
  const handleToggleTopicSelection = (topicName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicName)) {
        next.delete(topicName);
      } else {
        next.add(topicName);
      }
      return next;
    });
  };

  // Toggle entire domain selection
  const handleToggleDomainSelection = (domain: { topics: readonly string[] }, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const allSelected = domain.topics.every((t) => selectedTopics.has(t));

    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        domain.topics.forEach((t) => next.delete(t));
      } else {
        domain.topics.forEach((t) => next.add(t));
      }
      return next;
    });
  };

  // 1. Direct Practice Room Launching for a single topic (starts at question 1)
  const handleStartTopicPractice = (domainId: string, topicName: string) => {
    const allTopicQuestions = ALL_QUESTIONS.filter(
      (q) => isQuestionInDomain(q, domainId) && isQuestionInTopic(q, topicName)
    );
    const matching = allTopicQuestions.filter(evaluateQuestionMatchesFilters);
    const questionsToRun = matching.length > 0 ? matching : allTopicQuestions;
    if (questionsToRun.length > 0) {
      setPracticeSession({
        questions: questionsToRun,
        topicName: `${domainIdToQuestionDomain[domainId] || 'Algebra'} • ${topicName}`,
        initialIndex: 0,
      });
    }
  };

  // 2. Direct Practice Room Launching for all selected topics (starts at question 1)
  const handleStartSelectedTopicsPractice = () => {
    if (selectedTopics.size === 0) return;
    const topicSet = new Set(Array.from(selectedTopics).map((t) => t.toLowerCase().trim()));
    const matching = ALL_QUESTIONS.filter((q) => {
      const inTopic =
        topicSet.has(q.topic.toLowerCase().trim()) ||
        Array.from(topicSet).some((t) => isQuestionInTopic(q, t));
      return inTopic && evaluateQuestionMatchesFilters(q);
    });
    const fallback = ALL_QUESTIONS.filter((q) => {
      return (
        topicSet.has(q.topic.toLowerCase().trim()) ||
        Array.from(topicSet).some((t) => isQuestionInTopic(q, t))
      );
    });
    const questionsToRun = matching.length > 0 ? matching : fallback;
    if (questionsToRun.length > 0) {
      setPracticeSession({
        questions: questionsToRun,
        topicName: `${selectedTopics.size} Topics Selected`,
        initialIndex: 0,
      });
    }
  };

  // 3. Direct Practice Room Launching for entire domain pool (starts at question 1)
  const handleOpenDomainPool = (domain: { id: string; title: string; topics: readonly string[] }) => {
    const allDomainQuestions = ALL_QUESTIONS.filter((q) => isQuestionInDomain(q, domain.id));
    const matching = allDomainQuestions.filter(evaluateQuestionMatchesFilters);
    const questionsToRun = matching.length > 0 ? matching : allDomainQuestions;
    if (questionsToRun.length > 0) {
      setPracticeSession({
        questions: questionsToRun,
        topicName: domain.title,
        initialIndex: 0,
      });
    }
  };

  // 4. Direct Practice Room Launching for all matching questions (starts at question 1)
  const handleBrowseMatchingQuestions = () => {
    const matching = ALL_QUESTIONS.filter(evaluateQuestionMatchesFilters);
    if (matching.length > 0) {
      setPracticeSession({
        questions: matching,
        topicName: 'Question Bank Practice Pool',
        initialIndex: 0,
      });
    }
  };

  // Select all topics in entire Question Bank
  const handleSelectAllTopics = () => {
    const allTopics = new Set<string>();
    SAT_DOMAINS.forEach((d) => d.topics.forEach((t) => allTopics.add(t)));
    setSelectedTopics(allTopics);
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedTopics(new Set());
  };

  // Filter taxonomy for search query in Tree View
  const filteredDomains = useMemo(() => {
    if (!treeSearchQuery.trim()) return SAT_DOMAINS;
    const q = treeSearchQuery.toLowerCase().trim();

    return SAT_DOMAINS.map((domain) => {
      const matchingTopics = domain.topics.filter(
        (topic) =>
          topic.toLowerCase().includes(q) ||
          domain.title.toLowerCase().includes(q)
      );
      return {
        ...domain,
        topics: matchingTopics,
      };
    }).filter((domain) => domain.topics.length > 0);
  }, [treeSearchQuery]);

  // Total matching questions across entire bank under active dropdown filters
  const totalBankMatchingCount = useMemo(() => {
    return ALL_QUESTIONS.filter(evaluateQuestionMatchesFilters).length;
  }, [dropdownFilters, solvedMap, bookmarkedIds]);

  const totalSolvedOverall = Object.keys(solvedMap).length;
  const totalCorrectOverall = Object.values(solvedMap).filter((s) => s.isCorrect).length;
  const globalBankAccuracy = totalSolvedOverall > 0 ? Math.round((totalCorrectOverall / totalSolvedOverall) * 100) : 100;

  // Toggle bookmark (persisted globally)
  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id);
  };

  // Record question attempt (persisted globally)
  const handleQuestionAttempt = (id: string, selectedAnswer: string, isCorrect: boolean) => {
    recordAttempt({
      questionId: id,
      selectedAnswer,
      isCorrect,
      attemptedAt: Date.now(),
    });
  };

  // Full-Screen Bluebook Practice Room Session View (starts at Question 1)
  if (practiceSession && practiceSession.questions.length > 0) {
    return (
      <PracticeRoomView
        questions={practiceSession.questions}
        selectedTopicName={practiceSession.topicName}
        initialIndex={practiceSession.initialIndex}
        onGoBack={() => setPracticeSession(null)}
      />
    );
  }

  // Default View: Full MathBook 2.0 Curriculum Directory
  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ─── Hero Header & Statistics ─────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-emerald-500/10 dark:via-teal-500/5 dark:to-transparent border border-amber-900/10 dark:border-emerald-500/40 shadow-sm backdrop-blur-xl transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-orange-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital SAT Math Question Bank</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              MathBook 2.0 Curriculum Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-xl">
              Official exam questions organized by the 4 SAT domains and 21 curriculum topics. Practice by subtopic, create custom question sets, or test by domain.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-amber-900/10 dark:border-white/[0.08] shadow-sm text-center min-w-[100px]">
              <span className="block text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {ALL_QUESTIONS.length}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Real Questions</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-amber-900/10 dark:border-white/[0.08] shadow-sm text-center min-w-[100px]">
              <span className="block text-xl font-extrabold font-mono text-orange-600 dark:text-emerald-400">
                {totalSolvedOverall}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Solved</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-amber-900/10 dark:border-white/[0.08] shadow-sm text-center min-w-[100px]">
              <span className="block text-xl font-extrabold font-mono text-amber-600 dark:text-teal-400">
                {globalBankAccuracy}%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── OnePrep-Style Universal Dropdown Filter Toolbar ──────────── */}
      <QuestionBankFilterToolbar
        filters={dropdownFilters}
        onChange={setDropdownFilters}
        totalMatchingCount={totalBankMatchingCount}
        totalBankCount={ALL_QUESTIONS.length}
        bookmarkedTotalCount={bookmarkedIds.size}
      />

      {/* ─── Search & Multi-Selection Action Toolbar ─────────────────── */}
      <div className="rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900/65 border border-amber-900/10 dark:border-emerald-500/40 shadow-sm backdrop-blur-xl transition-colors">
        {/* Search within curriculum topics */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={treeSearchQuery}
            onChange={(e) => setTreeSearchQuery(e.target.value)}
            placeholder="Search all 21 topics (e.g. Expressions, Linear Equations)..."
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
          {selectedTopics.size > 0 ? (
            <>
              <span className="text-xs font-mono font-bold text-orange-800 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-emerald-800/60">
                {selectedTopics.size} {selectedTopics.size === 1 ? 'Topic' : 'Topics'} Selected
              </span>

              <button
                onClick={handleStartSelectedTopicsPractice}
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
                onClick={handleSelectAllTopics}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-amber-900/15 dark:border-white/[0.08] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
              >
                Select All Topics
              </button>

              <button
                onClick={handleBrowseMatchingQuestions}
                className="px-4 py-2 rounded-xl bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25 dark:border-emerald-400/30 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                <span>Browse Matching Questions ({totalBankMatchingCount})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── 4 Official Domains & Curriculum Topics List ─────────────── */}
      <div className="space-y-6">
        {filteredDomains.map((domain) => {
          const qDomain = domainIdToQuestionDomain[domain.id] || 'Algebra';
          const allDomainQuestions = ALL_QUESTIONS.filter((q) => isQuestionInDomain(q, domain.id));
          const matchingDomainQuestions = allDomainQuestions.filter(evaluateQuestionMatchesFilters);
          const domainSolvedCount = matchingDomainQuestions.filter((q) => !!solvedMap[q.id]).length;
          const domainCorrectCount = matchingDomainQuestions.filter((q) => solvedMap[q.id]?.isCorrect).length;
          const domainMastery = domainSolvedCount > 0 ? Math.round((domainCorrectCount / domainSolvedCount) * 100) : null;

          const allDomainTopicsSelected = domain.topics.every((t) => selectedTopics.has(t));
          const someDomainTopicsSelected = domain.topics.some((t) => selectedTopics.has(t));

          return (
            <div
              key={domain.id}
              className="domain-card rounded-3xl overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900/70 border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-400 dark:hover:border-emerald-500/60 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              {/* Domain Header */}
              <div className="relative flex items-center justify-between w-full p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200/90 dark:border-white/[0.06] overflow-hidden">
                
                {/* Left: Checkbox + Icon + Title + Topics Count */}
                <div className="flex items-center gap-3.5 z-10 shrink-0">
                  <button
                    onClick={(e) => handleToggleDomainSelection(domain, e)}
                    className="text-slate-400 hover:text-orange-600 dark:hover:text-emerald-500 transition-colors p-1 rounded-lg"
                    title={allDomainTopicsSelected ? 'Deselect all topics in domain' : 'Select all topics in domain'}
                  >
                    {allDomainTopicsSelected ? (
                      <CheckSquare className="w-5 h-5 text-orange-600 dark:text-emerald-400" />
                    ) : someDomainTopicsSelected ? (
                      <div className="w-5 h-5 rounded border border-orange-500 bg-orange-500/20 dark:border-emerald-500 dark:bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-orange-500 dark:bg-emerald-500 rounded-sm" />
                      </div>
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>

                  <div className="p-2.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/[0.08] shadow-sm">
                    {getDomainIcon(qDomain)}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">{domain.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                      {domain.topics.length} Topics
                    </span>
                  </div>
                </div>

                {/* Middle: Canvas */}
                <div className="flex-1 h-12 mx-4 relative overflow-hidden pointer-events-none select-none min-w-[140px]">
                  <DomainInteractiveCanvas domain={qDomain} />
                </div>

                {/* Right: Solved Summary & Open Button */}
                <div className="flex items-center gap-4 z-10 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
                      {domainSolvedCount} / {matchingDomainQuestions.length} Solved
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {domainMastery !== null ? `${domainMastery}% Domain Mastery` : 'Not Started'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenDomainPool(domain)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200/90 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>Open Domain Pool ({matchingDomainQuestions.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                  </button>
                </div>

              </div>

              {/* Topics List */}
              <div className="space-y-2 p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-950/40">
                {domain.topics.map((topicName) => {
                  const isSelected = selectedTopics.has(topicName);
                  const topicStats = getTopicStats(domain.id, topicName);
                  const topicQuestions = ALL_QUESTIONS.filter(
                    (q) => isQuestionInDomain(q, domain.id) && isQuestionInTopic(q, topicName)
                  );

                  return (
                    <div
                      key={topicName}
                      onClick={() => handleStartTopicPractice(domain.id, topicName)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/50 hover:bg-slate-200/70 dark:hover:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => handleToggleTopicSelection(topicName, e)}
                          className="text-slate-400 hover:text-orange-600 dark:hover:text-emerald-500 transition-colors p-0.5 rounded"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4.5 h-4.5 text-orange-600 dark:text-emerald-400" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                          )}
                        </button>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-emerald-300 transition-colors truncate">
                          {topicName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <span>
                          {topicStats.solvedCount} / {topicQuestions.length || 0}
                        </span>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-orange-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                          ›
                        </span>
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

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Volume2,
  FastForward,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  List,
  Check
} from 'lucide-react';
import { ALL_VOCAB_TERMS, VOCAB_CATEGORIES, VocabTerm } from '../../data/vocabData';
import {
  getVocabProgressMap,
  rateVocabCard,
  skipVocabCard,
  computeVocabStats,
  VocabRating,
  VocabProgressRecord
} from '../../services/vocabProgress';
import { speakEnglishText, stopSpeech } from '../../services/tts';

export const VocabTerminologyView: React.FC = () => {
  // View mode: 'flashcard' (5-step interactive SRS) or 'glossary' (directory)
  const [viewMode, setViewMode] = useState<'flashcard' | 'glossary'>('flashcard');

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'due' | 'learning' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Flashcard State
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 to 5
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingTextKey, setSpeakingTextKey] = useState<string | null>(null);

  // Persistence reactive state
  const [progressMap, setProgressMap] = useState<Record<string, VocabProgressRecord>>(() =>
    getVocabProgressMap()
  );

  // Feedback animation when rating
  const [ratingFeedback, setRatingFeedback] = useState<{ rating: VocabRating | 'skipped'; text: string } | null>(null);

  // Glossary expanded row
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setProgressMap(getVocabProgressMap());
    };
    window.addEventListener('scoreup_vocab_updated', handleUpdate);
    return () => {
      window.removeEventListener('scoreup_vocab_updated', handleUpdate);
      stopSpeech();
    };
  }, []);

  // Filtered terms list
  const filteredTerms = useMemo(() => {
    const now = Date.now();
    return ALL_VOCAB_TERMS.filter((term) => {
      // Category filter
      if (selectedCategory !== 'All' && term.category !== selectedCategory) {
        return false;
      }

      // Status filter
      const record = progressMap[term.id];
      if (statusFilter === 'due') {
        if (!record || record.isMastered || !record.nextReviewDate || now < record.nextReviewDate) {
          return false;
        }
      } else if (statusFilter === 'learning') {
        if (!record || record.isMastered) {
          return false;
        }
      } else if (statusFilter === 'mastered') {
        if (!record || !record.isMastered) {
          return false;
        }
      }

      // Search query filter (word, translations, definition, topic)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchWord = term.word.toLowerCase().includes(query);
        const matchUz = term.translationUz.toLowerCase().includes(query);
        const matchRu = term.translationRu.toLowerCase().includes(query);
        const matchDef = term.definition.toLowerCase().includes(query);
        const matchTopic = term.topic.toLowerCase().includes(query);
        if (!matchWord && !matchUz && !matchRu && !matchDef && !matchTopic) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, statusFilter, searchQuery, progressMap]);

  // Overall statistics
  const stats = useMemo(() => {
    const allIds = ALL_VOCAB_TERMS.map((t) => t.id);
    return computeVocabStats(allIds);
  }, [progressMap]);

  // Clamp current index when list changes
  useEffect(() => {
    if (currentIndex >= filteredTerms.length) {
      setCurrentIndex(Math.max(0, filteredTerms.length - 1));
      setCurrentStep(1);
    }
  }, [filteredTerms.length, currentIndex]);

  const currentCard: VocabTerm | undefined = filteredTerms[currentIndex];

  // Speech helper
  const handleSpeak = (text: string, key: string) => {
    if (isSpeaking && speakingTextKey === key) {
      stopSpeech();
      setIsSpeaking(false);
      setSpeakingTextKey(null);
      return;
    }

    setIsSpeaking(true);
    setSpeakingTextKey(key);
    speakEnglishText(text, {
      onStart: () => {
        setIsSpeaking(true);
        setSpeakingTextKey(key);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingTextKey(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setSpeakingTextKey(null);
      }
    });
  };

  // Next card transition
  const handleNextCard = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
    setSpeakingTextKey(null);
    setCurrentStep(1);
    setCurrentIndex((prev) => (prev + 1 < filteredTerms.length ? prev + 1 : 0));
  }, [filteredTerms.length]);

  // Previous card
  const handlePrevCard = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
    setSpeakingTextKey(null);
    setCurrentStep(1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredTerms.length - 1));
  }, [filteredTerms.length]);

  // Advance step inside current card
  const handleAdvanceStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleNextCard();
    }
  }, [currentStep, handleNextCard]);

  // Rate card (Hard 1d / Medium 3d / Easy Mastered)
  const handleRate = useCallback(
    (rating: VocabRating) => {
      if (!currentCard) return;
      rateVocabCard(currentCard.id, rating);
      const text =
        rating === 'easy'
          ? 'Mastered! (Won\'t show again)'
          : rating === 'medium'
          ? 'Scheduled in 3 days (+3d)'
          : 'Scheduled in 1 day (1d)';
      setRatingFeedback({ rating, text });

      setTimeout(() => {
        setRatingFeedback(null);
        handleNextCard();
      }, 450);
    },
    [currentCard, handleNextCard]
  );

  // Skip card (Step 1 requirement: Skip if already learned/known, do not show again)
  const handleSkip = useCallback(() => {
    if (!currentCard) return;
    skipVocabCard(currentCard.id);
    setRatingFeedback({ rating: 'skipped', text: 'Skipped & Marked as Known!' });

    setTimeout(() => {
      setRatingFeedback(null);
      handleNextCard();
    }, 450);
  }, [currentCard, handleNextCard]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'flashcard') return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvanceStep();
      } else if (e.key === '1') {
        e.preventDefault();
        handleRate('hard');
      } else if (e.key === '2') {
        e.preventDefault();
        handleRate('medium');
      } else if (e.key === '3') {
        e.preventDefault();
        handleRate('easy');
      } else if (e.key === 's' || e.key === 'S') {
        if (currentStep === 1) {
          e.preventDefault();
          handleSkip();
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentStep, handleAdvanceStep, handleRate, handleSkip, handleNextCard, handlePrevCard]);

  // Shuffle deck
  const handleShuffle = () => {
    setCurrentIndex(Math.floor(Math.random() * filteredTerms.length));
    setCurrentStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ─── HEADER & STATS BAR (White & Green in Bright / Black & Green in Dark) ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#070b12] border-2 border-emerald-500/25 dark:border-emerald-500/35 rounded-3xl p-6 backdrop-blur-xl shadow-sm hover:shadow-[0_4px_25px_rgba(16,185,129,0.1)] transition-all">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>SAT Vocabulary & Terminology</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Digital SAT Math Terms & Flashcards
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                All 280 official math terms with IPA audio pronunciation, Uzbek & Russian definitions, and Leitner Spaced Repetition.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: White & Green in Light / Black & Green in Dark */}
        <div className="flex items-center space-x-2 bg-emerald-50/70 dark:bg-black p-1.5 rounded-2xl border border-emerald-200 dark:border-emerald-500/30">
          <button
            type="button"
            onClick={() => setViewMode('flashcard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'flashcard'
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('glossary')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'glossary'
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Glossary (280)</span>
          </button>
        </div>
      </div>

      {/* ─── PROGRESS METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#070b12] border-2 border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Total Terms</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalTerms}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        {/* Mastered */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#070b12] border-2 border-emerald-500/30 dark:border-emerald-500/40 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
              Mastered
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.mastered}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#070b12] border-2 border-amber-500/25 dark:border-amber-500/35 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
              In Progress
            </span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.inProgress}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Due For Review */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#070b12] border-2 border-emerald-500/25 dark:border-emerald-500/35 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
              Due For Review
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.dueForReview}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── FILTERS & SEARCH TOOLBAR ───────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, translations (UZ/RU), meanings, or topics..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-[#070b12] border-2 border-slate-200 dark:border-emerald-500/30 rounded-2xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
            />
          </div>

          {/* Status Quick Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'due', 'learning', 'mastered'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold capitalize transition-all whitespace-nowrap border ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-[#070b12] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                {st === 'all'
                  ? 'All'
                  : st === 'due'
                  ? `Due (${stats.dueForReview})`
                  : st === 'learning'
                  ? `Learning (${stats.inProgress})`
                  : `Mastered (${stats.mastered})`}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border ${
              selectedCategory === 'All'
                ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
                : 'bg-white dark:bg-[#070b12] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400'
            }`}
          >
            All Categories ({ALL_VOCAB_TERMS.length})
          </button>
          {VOCAB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
                : 'bg-white dark:bg-[#070b12] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── FLASHCARD MODE (WHITE & GREEN in BRIGHT / BLACK & GREEN in DARK) ─── */}
      {viewMode === 'flashcard' && (
        <div className="space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#070b12] border-2 border-emerald-500/25 dark:border-emerald-500/35 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No terms found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No vocabulary terms match your current category, search, or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:text-slate-950 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : currentCard ? (
            <div className="relative">
              {/* Rating Feedback Overlay */}
              {ratingFeedback && (
                <div className="absolute inset-0 z-30 rounded-3xl backdrop-blur-sm bg-black/40 dark:bg-black/70 flex items-center justify-center animate-in fade-in zoom-in duration-200">
                  <div
                    className={`px-6 py-3 rounded-2xl text-sm font-black border shadow-2xl flex items-center space-x-2.5 ${
                      ratingFeedback.rating === 'easy' || ratingFeedback.rating === 'skipped'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/50'
                        : ratingFeedback.rating === 'medium'
                        ? 'bg-amber-50 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/50'
                        : 'bg-rose-50 text-rose-900 border-rose-400 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/50'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    <span>{ratingFeedback.text}</span>
                  </div>
                </div>
              )}

              {/* Main Interactive Flashcard Card Container */}
              <div
                className="min-h-[470px] rounded-3xl p-6 sm:p-10 flex flex-col justify-between relative transition-all duration-300 select-none bg-white text-slate-900 border-2 border-emerald-500/30 shadow-[0_10px_35px_rgba(16,185,129,0.1)] dark:bg-[#060a12] dark:border-2 dark:border-emerald-500/40 dark:text-white dark:shadow-[0_0_35px_rgba(16,185,129,0.18)]"
              >
                {/* Card Top: Progress Bar Dots & Card Counter */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 dark:border-emerald-500/20 pb-5">
                  {/* Step Progress Pill Dots (1 to 5) */}
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        onClick={() => setCurrentStep(s)}
                        title={`Go to Step ${s}`}
                        className={`cursor-pointer transition-all duration-300 ${
                          currentStep === s
                            ? 'w-8 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                            : currentStep > s
                            ? 'w-2.5 h-2.5 rounded-full bg-emerald-400/60 dark:bg-emerald-600/50'
                            : 'w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-emerald-300 dark:hover:bg-emerald-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Card Counter */}
                  <div className="text-[11px] font-mono font-extrabold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">
                    Card {currentIndex + 1} / {filteredTerms.length}
                  </div>
                </div>

                {/* Card Center: Step Specific Content */}
                <div
                  className="my-auto py-6 space-y-6 text-center cursor-pointer"
                  onClick={handleAdvanceStep}
                  title="Click to reveal next step (or press Space)"
                >
                  {/* STEP 1: WORD - TRANSCRIPT - PRONUNCIATION */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                      <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-xs tracking-widest uppercase">
                        <BookOpen className="w-4 h-4" />
                        <span>Step 1: English Word & Pronunciation</span>
                      </div>

                      <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                          {currentCard.word}
                        </h2>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(currentCard.word, `word-${currentCard.id}`);
                          }}
                          className={`p-3 rounded-full border transition-all duration-200 flex-shrink-0 ${
                            isSpeaking && speakingTextKey === `word-${currentCard.id}`
                              ? 'bg-emerald-600 text-white border-emerald-500 dark:bg-emerald-400 dark:text-slate-950 scale-110 shadow-[0_0_18px_rgba(16,185,129,0.7)] animate-pulse'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40 dark:hover:bg-emerald-900/60'
                          }`}
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* IPA Badge & Part of Speech Badges */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30 shadow-sm">
                          {currentCard.ipa}
                        </span>
                        <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
                          {currentCard.partOfSpeech}
                        </span>
                        <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/40">
                          {currentCard.category}
                        </span>
                      </div>

                      {/* Skip button in Step 1 (Requirement 6) */}
                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSkip();
                          }}
                          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/40 transition-all group shadow-sm"
                          title="Skip word if you already know it (will not show again)"
                        >
                          <FastForward className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>Skip (Already Know / Don't show again)</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 flex items-center justify-center space-x-1">
                        <span>Click card or press</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-[10px] font-mono text-emerald-900 dark:text-slate-300">
                          Space
                        </kbd>
                        <span>to reveal Uzbek & Russian translations</span>
                      </p>
                    </div>
                  )}

                  {/* STEP 2: TRANSLATION IN UZB AND RUSSIAN */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                      <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-xs tracking-widest uppercase">
                        <span>文A</span>
                        <span>Step 2: Uzbek & Russian Meaning</span>
                      </div>

                      <div className="space-y-3">
                        {/* Uzbek Translation */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
                            Uzbek Translation
                          </span>
                          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {currentCard.translationUz}
                          </h2>
                        </div>

                        {/* Russian Translation */}
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400">
                            Russian Translation
                          </span>
                          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                            {currentCard.translationRu}
                          </p>
                        </div>
                      </div>

                      {/* Topic Tag */}
                      <div className="flex justify-center">
                        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-500/30 uppercase tracking-wide">
                          {currentCard.partOfSpeech} • {currentCard.topic}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 flex items-center justify-center space-x-1">
                        <span>Click card or press</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-[10px] font-mono text-emerald-900 dark:text-slate-300">
                          Space
                        </kbd>
                        <span>to explore academic English definition</span>
                      </p>
                    </div>
                  )}

                  {/* STEP 3: MEANING IN ENG AND PRONUNCIATION */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                      <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-xs tracking-widest uppercase">
                        <span>❓</span>
                        <span>Step 3: Academic English Definition</span>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-4">
                        <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                          "{currentCard.definition}"
                        </p>

                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(currentCard.definition, `def-${currentCard.id}`);
                            }}
                            className={`p-3 rounded-full border transition-all duration-200 ${
                              isSpeaking && speakingTextKey === `def-${currentCard.id}`
                                ? 'bg-emerald-600 text-white border-emerald-500 dark:bg-emerald-400 dark:text-slate-950 scale-110 shadow-[0_0_18px_rgba(16,185,129,0.7)] animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40 dark:hover:bg-emerald-900/60'
                            }`}
                            title="Listen to definition"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30">
                          Academic English
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 flex items-center justify-center space-x-1">
                        <span>Click card or press</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-[10px] font-mono text-emerald-900 dark:text-slate-300">
                          Space
                        </kbd>
                        <span>to explore Example Sentence</span>
                      </p>
                    </div>
                  )}

                  {/* STEP 4: EXAMPLE AND PRONUNCIATION WITH UZB & RU TRANSLATION */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                      <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-xs tracking-widest uppercase">
                        <span>📄</span>
                        <span>Step 4: Contextual Example Sentence</span>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-4">
                        <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed">
                          {currentCard.example}
                        </p>

                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(currentCard.example, `ex-${currentCard.id}`);
                            }}
                            className={`p-3 rounded-full border transition-all duration-200 ${
                              isSpeaking && speakingTextKey === `ex-${currentCard.id}`
                                ? 'bg-emerald-600 text-white border-emerald-500 dark:bg-emerald-400 dark:text-slate-950 scale-110 shadow-[0_0_18px_rgba(16,185,129,0.7)] animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40 dark:hover:bg-emerald-900/60'
                            }`}
                            title="Listen to example sentence"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Bilingual Translation Callout Container */}
                      <div className="max-w-2xl mx-auto rounded-2xl bg-emerald-50/60 border-2 border-emerald-200/80 dark:bg-black/80 dark:border dark:border-emerald-500/35 p-4 text-left space-y-3 shadow-sm">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center space-x-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-[9px] font-bold">
                              UZ
                            </span>
                            <span>Uzbek Meaning:</span>
                          </span>
                          <p className="text-xs text-slate-800 dark:text-slate-300 italic font-medium">
                            "{currentCard.exampleTranslationUz}"
                          </p>
                        </div>

                        <div className="border-t border-emerald-200 dark:border-emerald-500/20 pt-2 space-y-1">
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 dark:bg-slate-900 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-[9px] font-bold">
                              RU
                            </span>
                            <span>Russian Meaning:</span>
                          </span>
                          <p className="text-xs text-slate-800 dark:text-slate-300 italic font-medium">
                            "{currentCard.exampleTranslationRu}"
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 flex items-center justify-center space-x-1">
                        <span>Click card or press</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-[10px] font-mono text-emerald-900 dark:text-slate-300">
                          Space
                        </kbd>
                        <span>to rate card</span>
                      </p>
                    </div>
                  )}

                  {/* STEP 5: SRS RATING SCREEN */}
                  {currentStep === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                      <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-xs tracking-widest uppercase">
                        <Sparkles className="w-4 h-4" />
                        <span>Step 5: Leitner Spaced Repetition Review</span>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                          How well did you know this word?
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Select an interval to optimize your memory retention:
                        </p>
                      </div>

                      {/* Three Prominent Rating Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto pt-2">
                        {/* Hard */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRate('hard');
                          }}
                          className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-rose-300 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/40 transition-all text-center space-y-1 group"
                        >
                          <span className="text-base font-black block group-hover:scale-105 transition-transform">
                            Hard (1d)
                          </span>
                          <span className="text-[11px] block text-rose-700 dark:text-rose-300/80">
                            Repeat after 1 day
                          </span>
                        </button>

                        {/* Medium */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRate('medium');
                          }}
                          className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 dark:bg-amber-950/30 dark:hover:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/40 transition-all text-center space-y-1 group"
                        >
                          <span className="text-base font-black block group-hover:scale-105 transition-transform">
                            Medium (+3d)
                          </span>
                          <span className="text-[11px] block text-amber-700 dark:text-amber-300/80">
                            Repeat after 3 days
                          </span>
                        </button>

                        {/* Easy */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRate('easy');
                          }}
                          className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/50 transition-all text-center space-y-1 group shadow-sm"
                        >
                          <span className="text-base font-black block group-hover:scale-105 transition-transform">
                            Easy (Master)
                          </span>
                          <span className="text-[11px] block text-emerald-700 dark:text-emerald-300/80">
                            Do not show again
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom: Leitner SRS Review Buttons (Visible throughout all steps as requested) */}
                <div className="border-t border-emerald-500/20 dark:border-emerald-500/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Leitner SRS Review:</span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    {/* Again (1d) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate('hard');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold text-rose-800 dark:text-rose-300 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-600/40 transition-all shadow-sm"
                    >
                      <span>Again (1d)</span>
                    </button>

                    {/* Good (+3d) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate('medium');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-600/40 transition-all shadow-sm"
                    >
                      <span>Good (+3d)</span>
                    </button>

                    {/* Easy (Master) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate('easy');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold text-emerald-900 dark:text-emerald-300 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/70 border border-emerald-400 dark:border-emerald-500/50 transition-all shadow-sm"
                    >
                      <span>Easy (Master)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Bar Below Card */}
              <div className="flex items-center justify-between pt-3 px-2">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#070b12] border-2 border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 shadow-sm transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-[#070b12] border-2 border-slate-200 dark:border-emerald-500/30 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 shadow-sm transition-all"
                    title="Shuffle Deck"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNextCard}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#070b12] border-2 border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 shadow-sm transition-all"
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ─── GLOSSARY DIRECTORY MODE ───────────────────────────────── */}
      {viewMode === 'glossary' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>Showing {filteredTerms.length} of {ALL_VOCAB_TERMS.length} terms</span>
            <span>Click any term to expand definition and SAT example</span>
          </div>

          <div className="divide-y divide-emerald-500/15 dark:divide-emerald-500/20 bg-white dark:bg-[#060a12] border-2 border-emerald-500/25 dark:border-emerald-500/35 rounded-3xl overflow-hidden shadow-sm">
            {filteredTerms.map((term, index) => {
              const record = progressMap[term.id];
              const isExpanded = expandedTermId === term.id;
              return (
                <div key={term.id} className="transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20">
                  <div
                    onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  >
                    {/* Left: Term, IPA, and Pronounce */}
                    <div className="flex items-start sm:items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-400 w-7 pt-1 sm:pt-0">
                        {index + 1}.
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(term.word, `gloss-${term.id}`);
                        }}
                        className={`p-2 rounded-xl border transition-all ${
                          isSpeaking && speakingTextKey === `gloss-${term.id}`
                            ? 'bg-emerald-600 text-white border-emerald-500 dark:bg-emerald-400 dark:text-slate-950 animate-pulse'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40 hover:bg-emerald-100'
                        }`}
                        title="Pronounce word"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {term.word}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-500/30">
                            {term.ipa}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {term.category} • {term.topic}
                        </span>
                      </div>
                    </div>

                    {/* Right: Translations & Mastery Status */}
                    <div className="flex items-center space-x-3 sm:text-right pl-10 sm:pl-0">
                      <div className="text-xs">
                        <p className="font-extrabold text-emerald-800 dark:text-emerald-300">
                          🇺🇿 {term.translationUz}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                          🇷🇺 {term.translationRu}
                        </p>
                      </div>

                      {/* Status Tag */}
                      {record && record.isMastered ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-black font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/50 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Mastered</span>
                        </span>
                      ) : record && record.status === 'medium' ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-black font-mono bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50">
                          Good (+3d)
                        </span>
                      ) : record && record.status === 'hard' ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-black font-mono bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50">
                          Again (1d)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Row Detail */}
                  {isExpanded && (
                    <div className="p-4 sm:px-12 bg-emerald-50/40 dark:bg-black/60 border-t border-emerald-500/20 dark:border-emerald-500/20 space-y-3 animate-in fade-in duration-150">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                          English Definition:
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {term.definition}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white dark:bg-[#070b12] border-2 border-emerald-500/20 dark:border-emerald-500/30 p-3.5 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            SAT Context Example:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(term.example, `gloss-ex-${term.id}`)}
                            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </button>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          "{term.example}"
                        </p>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 italic">
                          🇺🇿 "{term.exampleTranslationUz}"
                        </p>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 italic">
                          🇷🇺 "{term.exampleTranslationRu}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

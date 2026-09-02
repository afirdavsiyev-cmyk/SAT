import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  BarChart3,
  CheckCircle2,
  SlidersHorizontal,
  Bookmark,
  Check,
  RotateCcw,
  Layers,
  FileQuestion,
  Sparkles,
  X,
  Target
} from 'lucide-react';
import { QuestionDifficulty, QuestionType } from '../../types/questionBank';

export interface DropdownFiltersState {
  difficulties: QuestionDifficulty[]; // If empty or all 3 selected -> 'all'
  completed: 'all' | 'solved' | 'unsolved';
  questionSet: string;
  questionType: QuestionType | 'all';
  bookmarkedOnly: boolean;
  result: 'all' | 'correct' | 'incorrect';
}

interface QuestionBankFilterToolbarProps {
  filters: DropdownFiltersState;
  onChange: (newFilters: DropdownFiltersState) => void;
  totalMatchingCount: number;
  totalBankCount: number;
  bookmarkedTotalCount: number;
}

export const QuestionBankFilterToolbar: React.FC<QuestionBankFilterToolbarProps> = ({
  filters,
  onChange,
  totalMatchingCount,
  totalBankCount,
  bookmarkedTotalCount,
}) => {
  // Open dropdown tracker: 'difficulty' | 'completed' | 'more' | null
  const [openDropdown, setOpenDropdown] = useState<'difficulty' | 'completed' | 'more' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (name: 'difficulty' | 'completed' | 'more') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Difficulty helpers
  const isDifficultySelected = (diff: QuestionDifficulty) => {
    return filters.difficulties.includes(diff);
  };

  const handleToggleDifficulty = (diff: QuestionDifficulty) => {
    let next: QuestionDifficulty[];
    if (filters.difficulties.includes(diff)) {
      next = filters.difficulties.filter((d) => d !== diff);
    } else {
      next = [...filters.difficulties, diff];
    }
    onChange({ ...filters, difficulties: next });
  };

  const handleSelectAllDifficulties = () => {
    onChange({ ...filters, difficulties: ['Easy', 'Medium', 'Hard'] });
  };

  const handleClearDifficulties = () => {
    onChange({ ...filters, difficulties: [] });
  };

  // Completed status helper
  const handleSetCompleted = (completed: 'all' | 'solved' | 'unsolved') => {
    onChange({ ...filters, completed });
    setOpenDropdown(null);
  };

  // Question Set helper
  const handleSetQuestionSet = (questionSet: string) => {
    onChange({ ...filters, questionSet });
  };

  // Question Format / Type helper
  const handleSetQuestionType = (questionType: QuestionType | 'all') => {
    onChange({ ...filters, questionType });
  };

  // Bookmarked toggle
  const handleToggleBookmarked = () => {
    onChange({ ...filters, bookmarkedOnly: !filters.bookmarkedOnly });
  };

  // Result helper
  const handleSetResult = (result: 'all' | 'correct' | 'incorrect') => {
    onChange({ ...filters, result });
  };

  // Reset all filters to default
  const handleResetAll = () => {
    onChange({
      difficulties: [],
      completed: 'all',
      questionSet: 'all',
      questionType: 'all',
      bookmarkedOnly: false,
      result: 'all',
    });
    setOpenDropdown(null);
  };

  // Active filters count for badges
  const totalActiveFilterCount =
    (filters.difficulties.length > 0 ? 1 : 0) +
    (filters.completed !== 'all' ? 1 : 0) +
    (filters.questionSet !== 'all' ? 1 : 0) +
    (filters.questionType !== 'all' ? 1 : 0) +
    (filters.bookmarkedOnly ? 1 : 0) +
    (filters.result !== 'all' ? 1 : 0);

  const isDiffActive = filters.difficulties.length > 0;
  const isCompletedActive = filters.completed !== 'all';
  const isMoreActive =
    filters.questionSet !== 'all' ||
    filters.questionType !== 'all' ||
    filters.bookmarkedOnly ||
    filters.result !== 'all';

  return (
    <div ref={containerRef} className="relative space-y-3 z-30 select-none transition-colors">
      
      {/* ─── Main Pill Button Toolbar ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-lg">
        
        {/* Left: Pill Dropdown Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* 1. 📊 Difficulty Dropdown Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('difficulty')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border active:scale-95 ${
                openDropdown === 'difficulty'
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-400/60 shadow-sm'
                  : isDiffActive
                  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                  : 'bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Difficulty</span>
              {isDiffActive && (
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-500/30 text-[10px] font-mono text-emerald-800 dark:text-emerald-200 font-bold">
                  {filters.difficulties.join(', ')}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  openDropdown === 'difficulty' ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                }`}
              />
            </button>

            {/* Difficulty Dropdown Popover */}
            {openDropdown === 'difficulty' && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl p-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-white/[0.08]">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Select Difficulty
                  </span>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <button
                      type="button"
                      onClick={handleSelectAllDifficulties}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      All
                    </button>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={handleClearDifficulties}
                      className="text-slate-500 dark:text-slate-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 py-1">
                  {[
                    { id: 'Easy' as QuestionDifficulty, label: 'Easy', color: 'text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60' },
                    { id: 'Medium' as QuestionDifficulty, label: 'Medium', color: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60' },
                    { id: 'Hard' as QuestionDifficulty, label: 'Hard & Challenge', color: 'text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60' },
                  ].map((diff) => {
                    const isChecked = isDifficultySelected(diff.id);
                    return (
                      <label
                        key={diff.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                          isChecked
                            ? 'bg-slate-100 dark:bg-white/[0.08] border-slate-300 dark:border-white/[0.15] text-slate-900 dark:text-white'
                            : 'bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleDifficulty(diff.id)}
                            className="w-4 h-4 rounded bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                          />
                          <span className="text-xs font-semibold">{diff.label}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${diff.color}`}>
                          {diff.label.split(' ')[0]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. ✔️ Completed Dropdown Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('completed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border active:scale-95 ${
                openDropdown === 'completed'
                  ? 'bg-teal-50 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-400/60 shadow-sm'
                  : isCompletedActive
                  ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-500/40'
                  : 'bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Completed</span>
              {isCompletedActive && (
                <span className="px-1.5 py-0.2 rounded-md bg-teal-100 dark:bg-teal-500/30 text-[10px] font-mono text-teal-800 dark:text-teal-200 capitalize font-bold">
                  {filters.completed}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  openDropdown === 'completed' ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                }`}
              />
            </button>

            {/* Completed Dropdown Popover */}
            {openDropdown === 'completed' && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl p-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="pb-2 mb-2 border-b border-slate-200 dark:border-white/[0.08]">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Completion Status
                  </span>
                </div>

                <div className="space-y-1 py-1">
                  {[
                    { id: 'all' as const, label: 'Show All', desc: 'All questions in bank' },
                    { id: 'solved' as const, label: 'Solved Only', desc: 'Already attempted questions' },
                    { id: 'unsolved' as const, label: 'Unsolved Only', desc: 'Fresh untouched questions' },
                  ].map((opt) => {
                    const isSelected = filters.completed === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSetCompleted(opt.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-500/20 border-teal-300 dark:border-teal-500/50 text-teal-900 dark:text-teal-200 font-bold'
                            : 'bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <div>
                          <div className="text-xs">{opt.label}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{opt.desc}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. 🌪️ More Filters Dropdown Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('more')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border active:scale-95 ${
                openDropdown === 'more'
                  ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-400/60 shadow-sm'
                  : isMoreActive
                  ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40'
                  : 'bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>More Filters</span>
              {isMoreActive && (
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  openDropdown === 'more' ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''
                }`}
              />
            </button>

            {/* More Filters Popover */}
            {openDropdown === 'more' && (
              <div className="absolute left-0 sm:left-auto top-full mt-2 w-80 sm:w-96 rounded-2xl p-5 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/[0.08]">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Secondary Filters</span>
                  </span>
                  {isMoreActive && (
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          ...filters,
                          questionSet: 'all',
                          questionType: 'all',
                          bookmarkedOnly: false,
                          result: 'all',
                        });
                      }}
                      className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                    >
                      Reset Extra
                    </button>
                  )}
                </div>

                {/* Section 1: 📁 Question Set */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                    📁 Question Set
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'all', label: 'All Sets' },
                      { id: 'Bluebook', label: 'Bluebook Real Tests' },
                      { id: 'College Board', label: 'College Board Official' },
                      { id: 'ScoreUP', label: 'MathBook 2.0 / Vault' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSetQuestionSet(s.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left transition-all border truncate ${
                          filters.questionSet === s.id
                            ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-300 dark:border-cyan-500/60 text-cyan-900 dark:text-cyan-200 font-bold'
                            : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title={s.label}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: ⏱️ Question Format */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                    ⏱️ Question Format
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'all' as const, label: 'All' },
                      { id: 'multiple_choice' as const, label: 'Multiple Choice' },
                      { id: 'student_produced' as const, label: 'Grid-In' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSetQuestionType(t.id)}
                        className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold text-center transition-all border ${
                          filters.questionType === t.id
                            ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-300 dark:border-cyan-500/60 text-cyan-900 dark:text-cyan-200 font-bold'
                            : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: 🔖 Saved & 🌓 Result Status */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                  
                  {/* Bookmarked Pill */}
                  <button
                    type="button"
                    onClick={handleToggleBookmarked}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      filters.bookmarkedOnly
                        ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/60 text-amber-800 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <Bookmark className={`w-3.5 h-3.5 ${filters.bookmarkedOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>Saved Items</span>
                    </span>
                    {bookmarkedTotalCount > 0 && (
                      <span className="text-[10px] font-mono bg-amber-100 dark:bg-amber-500/30 px-1.5 rounded-full text-amber-800 dark:text-amber-200">
                        {bookmarkedTotalCount}
                      </span>
                    )}
                  </button>

                  {/* Result Pill Dropdown */}
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-0.5 border border-slate-200 dark:border-white/[0.08]">
                    {[
                      { id: 'all' as const, label: 'All' },
                      { id: 'correct' as const, label: '✓' },
                      { id: 'incorrect' as const, label: '✗' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSetResult(r.id)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                          filters.result === r.id
                            ? r.id === 'correct'
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : r.id === 'incorrect'
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'bg-white dark:bg-white/[0.15] text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title={r.id === 'correct' ? 'Correct only' : r.id === 'incorrect' ? 'Incorrect only' : 'All results'}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                </div>

              </div>
            )}
          </div>

        </div>

        {/* Right: Summary Match Count & Reset Button */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
            <span>Matching:</span>
            <span className="text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
              {totalMatchingCount} / {totalBankCount}
            </span>
          </div>

          {totalActiveFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetAll}
              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold transition-all flex items-center space-x-1 active:scale-95"
              title="Clear all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ({totalActiveFilterCount})</span>
            </button>
          )}
        </div>

      </div>

      {/* ─── Active Filter Tags Row (if any active) ───────────────────── */}
      {totalActiveFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 animate-in fade-in duration-150">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Active:
          </span>

          {filters.difficulties.map((d) => (
            <span
              key={d}
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300"
            >
              <span>{d}</span>
              <button
                type="button"
                onClick={() => handleToggleDifficulty(d)}
                className="hover:text-slate-900 dark:hover:text-white text-emerald-600 dark:text-emerald-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.completed !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/50 text-teal-800 dark:text-teal-300 capitalize">
              <span>Status: {filters.completed}</span>
              <button
                type="button"
                onClick={() => handleSetCompleted('all')}
                className="hover:text-slate-900 dark:hover:text-white text-teal-600 dark:text-teal-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.questionSet !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800/50 text-cyan-800 dark:text-cyan-300">
              <span>Set: {filters.questionSet}</span>
              <button
                type="button"
                onClick={() => handleSetQuestionSet('all')}
                className="hover:text-slate-900 dark:hover:text-white text-cyan-600 dark:text-cyan-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.questionType !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800/50 text-cyan-800 dark:text-cyan-300">
              <span>Type: {filters.questionType === 'multiple_choice' ? 'Multiple Choice' : 'Grid-In'}</span>
              <button
                type="button"
                onClick={() => handleSetQuestionType('all')}
                className="hover:text-slate-900 dark:hover:text-white text-cyan-600 dark:text-cyan-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.bookmarkedOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300">
              <span>Saved Only</span>
              <button
                type="button"
                onClick={handleToggleBookmarked}
                className="hover:text-slate-900 dark:hover:text-white text-amber-600 dark:text-amber-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.result !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-300 capitalize">
              <span>Result: {filters.result}</span>
              <button
                type="button"
                onClick={() => handleSetResult('all')}
                className="hover:text-slate-900 dark:hover:text-white text-indigo-600 dark:text-indigo-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

    </div>
  );
};

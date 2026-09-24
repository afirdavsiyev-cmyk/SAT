import React, { useState, useMemo } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  Check,
  Zap,
  Coffee,
  Umbrella,
  Flame,
} from 'lucide-react';
import { OFFICIAL_DOMAIN_TAXONOMY, ALL_QUESTIONS } from '../../data/questions';
import { QuestionItem } from '../../types/questionBank';
import { ThemeToggle } from '../common/ThemeToggle';

export interface RushConfig {
  selectedTopics: string[];
  selectedDifficulties: ('Easy' | 'Medium' | 'Hard' | 'Challenge')[];
  questionCount: number;
  skipCompleted: boolean;
  pace: 'relaxed' | 'steady' | 'standard' | 'blitz';
  flow: 'focused' | 'rush';
}

interface QuestionRushModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRush: (config: RushConfig, questions: QuestionItem[]) => void;
  answeredQuestionIds?: Set<string>;
}

export const QuestionRushModal: React.FC<QuestionRushModalProps> = ({
  isOpen,
  onClose,
  onStartRush,
  answeredQuestionIds = new Set(),
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Topics state
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(
    () => new Set(['Algebra', 'Advanced Math', 'Problem-Solving and Data Analysis', 'Geometry and Trigonometry'])
  );
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  // Step 2: Difficulty
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<'Easy' | 'Medium' | 'Hard' | 'Challenge'>>(
    () => new Set(['Easy', 'Medium', 'Hard'])
  );

  // Step 3: Question count & skip completed
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [skipCompleted, setSkipCompleted] = useState<boolean>(true);

  // Step 4: Pace
  const [pace, setPace] = useState<'relaxed' | 'steady' | 'standard' | 'blitz'>('standard');

  // Step 5: Flow
  const [flow, setFlow] = useState<'focused' | 'rush'>('focused');

  // Domain metadata calculation
  const domainSummaries = useMemo(() => {
    return OFFICIAL_DOMAIN_TAXONOMY.map((cat) => {
      const qCount = ALL_QUESTIONS.filter((q) => {
        const d = q.domain.toLowerCase().replace(/[^a-z]/g, '');
        const target = cat.domain.toLowerCase().replace(/[^a-z]/g, '');
        return d.includes(target) || target.includes(d);
      }).length;

      return {
        domain: cat.domain,
        title: cat.domain === 'Problem-Solving & Data Analysis' ? 'Problem-Solving and Data Analysis' : cat.domain,
        skillsCount: cat.skills.length,
        questionsCount: qCount || cat.skills.reduce((acc, s) => acc + s.totalOfficialCount, 0),
        skills: cat.skills,
      };
    });
  }, []);

  if (!isOpen) return null;

  // Toggle domain
  const toggleDomain = (domainName: string) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domainName)) {
        next.delete(domainName);
      } else {
        next.add(domainName);
      }
      return next;
    });
  };

  const toggleExpand = (domainName: string) => {
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domainName)) {
        next.delete(domainName);
      } else {
        next.add(domainName);
      }
      return next;
    });
  };

  const handleSelectAllTopics = () => {
    if (selectedDomains.size === domainSummaries.length) {
      setSelectedDomains(new Set());
    } else {
      setSelectedDomains(new Set(domainSummaries.map((d) => d.domain)));
    }
  };

  // Toggle difficulty
  const toggleDifficulty = (diff: 'Easy' | 'Medium' | 'Hard' | 'Challenge') => {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(diff)) {
        if (next.size > 1) next.delete(diff);
      } else {
        next.add(diff);
      }
      return next;
    });
  };

  // Compile final questions pool
  const handleLaunchRush = () => {
    let pool = ALL_QUESTIONS.filter((q) => {
      // Domain filter
      const matchedDomain = domainSummaries.some((cat) => {
        if (!selectedDomains.has(cat.domain)) return false;
        const d = q.domain.toLowerCase().replace(/[^a-z]/g, '');
        const target = cat.domain.toLowerCase().replace(/[^a-z]/g, '');
        return d.includes(target) || target.includes(d);
      });
      if (!matchedDomain) return false;

      // Difficulty filter
      const diffMatches = Array.from(selectedDifficulties).some((diff) => {
        if (diff === 'Challenge') {
          return q.difficulty === 'Hard';
        }
        return q.difficulty === diff;
      });
      if (!diffMatches) return false;

      // Skip completed questions
      if (skipCompleted && answeredQuestionIds.has(q.id)) {
        return false;
      }

      return true;
    });

    // If pool is empty due to strict filters, fallback to all matching domains
    if (pool.length === 0) {
      pool = ALL_QUESTIONS.filter((q) => {
        return domainSummaries.some((cat) => {
          if (!selectedDomains.has(cat.domain)) return false;
          const d = q.domain.toLowerCase().replace(/[^a-z]/g, '');
          const target = cat.domain.toLowerCase().replace(/[^a-z]/g, '');
          return d.includes(target) || target.includes(d);
        });
      });
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, questionCount);

    onStartRush(
      {
        selectedTopics: Array.from(selectedDomains),
        selectedDifficulties: Array.from(selectedDifficulties),
        questionCount,
        skipCompleted,
        pace,
        flow,
      },
      shuffled
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none transition-colors">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-[#0c1017] text-slate-900 dark:text-white border border-slate-200 dark:border-[#1b2230] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        
        {/* Top Header Bar: Progress info, ThemeToggle & Modal Close Button */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200 dark:border-[#1b2230] flex items-center justify-between flex-shrink-0 bg-slate-50/70 dark:bg-[#090d14]/70">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Question Rush · Step {step} of 5
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/[0.08] transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto">
          {/* Step 1: Pick your Math topics */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider">
                  Select Math Skills
                </div>
                <h2 className="text-3xl sm:text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Pick your<br />Math topics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-4">
                  Choose the skills you want to drill. Use Select All to pick every skill at once.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">All Topics</span>
                  <button
                    type="button"
                    onClick={handleSelectAllTopics}
                    className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-[#232b3d] bg-slate-100 dark:bg-[#121824] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#1b2334] hover:text-slate-900 dark:hover:text-white transition-all shadow-sm flex-shrink-0 whitespace-nowrap"
                  >
                    {selectedDomains.size === domainSummaries.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {domainSummaries.map((cat) => {
                    const isChecked = selectedDomains.has(cat.domain);
                    const isExpanded = expandedDomains.has(cat.domain);

                    return (
                      <div
                        key={cat.domain}
                        className="rounded-2xl border border-slate-200 dark:border-[#1b2230] bg-slate-50/70 hover:bg-emerald-50/30 dark:bg-[#121722]/90 dark:hover:bg-white/[0.03] transition-all overflow-hidden"
                      >
                        <div
                          onClick={() => toggleDomain(cat.domain)}
                          className="p-3.5 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                isChecked
                                  ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-white dark:text-slate-950 dark:border-white font-black'
                                  : 'border-slate-300 dark:border-[#2d384e] bg-transparent'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">{cat.title}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {cat.skillsCount} skills · {cat.questionsCount} questions
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(cat.domain);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Collapsible skills */}
                        {isExpanded && (
                          <div className="px-5 pb-3 pt-1 space-y-1.5 border-t border-slate-200 dark:border-[#1b2230]/70 bg-white dark:bg-[#0c1017]/80">
                            {cat.skills.map((skill) => (
                              <div key={skill.id} className="text-xs text-slate-700 dark:text-slate-300 py-1 flex items-center justify-between">
                                <span>{skill.name}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{skill.totalOfficialCount} Qs</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Choose difficulty */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Step 2 of 5 · Math
                </div>
                <h2 className="text-3xl sm:text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Choose difficulty
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-4">
                  Mix difficulties for realistic practice, or focus on the levels you want to improve.
                </p>
              </div>

              <div className="space-y-3">
                {/* Easy */}
                <div
                  onClick={() => toggleDifficulty('Easy')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3.5 ${
                    selectedDifficulties.has('Easy')
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      selectedDifficulties.has('Easy')
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-white dark:text-slate-950 dark:border-white font-black'
                        : 'border-slate-300 dark:border-[#2d384e] bg-transparent'
                    }`}
                  >
                    {selectedDifficulties.has('Easy') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Easy</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Build speed on fundamentals</div>
                  </div>
                </div>

                {/* Medium */}
                <div
                  onClick={() => toggleDifficulty('Medium')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3.5 ${
                    selectedDifficulties.has('Medium')
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      selectedDifficulties.has('Medium')
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-white dark:text-slate-950 dark:border-white font-black'
                        : 'border-slate-300 dark:border-[#2d384e] bg-transparent'
                    }`}
                  >
                    {selectedDifficulties.has('Medium') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Medium</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Practice standard test-level questions</div>
                  </div>
                </div>

                {/* Hard */}
                <div
                  onClick={() => toggleDifficulty('Hard')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3.5 ${
                    selectedDifficulties.has('Hard')
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      selectedDifficulties.has('Hard')
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-white dark:text-slate-950 dark:border-white font-black'
                        : 'border-slate-300 dark:border-[#2d384e] bg-transparent'
                    }`}
                  >
                    {selectedDifficulties.has('Hard') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Hard</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Push into the most advanced questions</div>
                  </div>
                </div>

                {/* Challenge Questions (PRO / 750+) */}
                <div
                  onClick={() => toggleDifficulty('Challenge')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3.5 ${
                    selectedDifficulties.has('Challenge')
                      ? 'border-pink-500 bg-pink-50/80 text-slate-900 ring-2 ring-pink-500/20 dark:border-pink-500/80 dark:bg-pink-950/20 dark:text-white shadow-md'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      selectedDifficulties.has('Challenge')
                        ? 'bg-pink-500 text-white border-pink-500 font-black'
                        : 'border-slate-300 dark:border-[#2d384e] bg-transparent'
                    }`}
                  >
                    {selectedDifficulties.has('Challenge') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Challenge Questions</span>
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-300 dark:bg-pink-500/30 dark:text-pink-300 dark:border-pink-500/40 text-[10px] font-extrabold uppercase tracking-wide">
                        👑 PRO
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Add the toughest Challenge Questions for this subject.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: How many questions? */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Step 3 of 5 · Math
                </div>
                <h2 className="text-3xl sm:text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  How many<br />questions?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-4">
                  Pick a length for this rush. Unlimited runs until you've answered every available question.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2.5">
                  {[
                    { count: 10, label: '10 questions', desc: 'Quick session' },
                    { count: 20, label: '20 questions', desc: 'Balanced practice' },
                    { count: 30, label: '30 questions', desc: 'Focused sprint' },
                  ].map((item) => (
                    <div
                      key={item.count}
                      onClick={() => setQuestionCount(item.count)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        questionCount === item.count
                          ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                          : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                      }`}
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Toggle: Skip completed questions */}
                <div className="pt-3 border-t border-slate-200 dark:border-[#1b2230] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Skip completed questions</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Only include questions you have not answered before.</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSkipCompleted(!skipCompleted)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 p-0.5 ${
                      skipCompleted ? 'bg-emerald-500 dark:bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        skipCompleted ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Set your pace */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Step 4 of 5 · Math
                </div>
                <h2 className="text-3xl sm:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Set your pace
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-4">
                  Pick how much time you get per question. Higher numbers mean less time and tighter stars.
                </p>
              </div>

              <div className="space-y-3">
                {/* Relaxed */}
                <div
                  onClick={() => setPace('relaxed')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    pace === 'relaxed'
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Relaxed</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">1.5× time per question</div>
                  </div>
                  <Umbrella className="w-6 h-6 text-slate-400 dark:text-slate-500 stroke-[1.75]" />
                </div>

                {/* Steady */}
                <div
                  onClick={() => setPace('steady')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    pace === 'steady'
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Steady</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">1.25× time per question</div>
                  </div>
                  <Coffee className="w-6 h-6 text-slate-400 dark:text-slate-500 stroke-[1.75]" />
                </div>

                {/* Standard (Recommended) */}
                <div
                  onClick={() => setPace('standard')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    pace === 'standard'
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Standard</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#0d3b48] dark:text-[#38bdf8] dark:border-[#0284c7]/40 text-[10px] font-extrabold uppercase tracking-wide">
                        RECOMMENDED
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Baseline times</div>
                  </div>
                  <Zap className="w-6 h-6 text-slate-400 dark:text-slate-500 stroke-[1.75]" />
                </div>

                {/* Blitz */}
                <div
                  onClick={() => setPace('blitz')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    pace === 'blitz'
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Blitz</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">0.8× time per question</div>
                  </div>
                  <Flame className="w-6 h-6 text-slate-400 dark:text-slate-500 stroke-[1.75]" />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Choose your flow */}
          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Step 5 of 5 · Math
                </div>
                <h2 className="text-3xl sm:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Choose your flow
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-4">
                  Stay calm and in control, or keep the full high-energy Question Rush experience.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Focused (Recommended) */}
                <div
                  onClick={() => setFlow('focused')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    flow === 'focused'
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">Focused</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#0d3b48] dark:text-[#38bdf8] dark:border-[#0284c7]/40 text-[10px] font-extrabold uppercase tracking-wide">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Manual advance, minimal animation, and fewer live performance metrics.
                  </p>
                </div>

                {/* Rush */}
                <div
                  onClick={() => setFlow('rush')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    flow === 'rush'
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#151c2a] dark:text-white dark:ring-1 dark:ring-white/10 shadow-sm'
                      : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-[#1b2230] dark:bg-[#121722]/80 dark:hover:border-[#2d384e]'
                  }`}
                >
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">Rush</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Stars, streaks, and optional auto-advance for a higher-energy session.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-[#080b10] border-t border-slate-200 dark:border-[#1b2230] flex items-center justify-between transition-colors">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-[#232b3d] bg-white dark:bg-[#121722] hover:bg-slate-100 dark:hover:bg-[#1b2334] text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
              >
                Back
              </button>
            ) : (
              <div />
            )}
          </div>

          <div>
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                disabled={step === 1 && selectedDomains.size === 0}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 font-extrabold text-xs transition-all flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunchRush}
                className="px-7 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg hover:scale-105 flex items-center space-x-1.5"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Start Rush</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

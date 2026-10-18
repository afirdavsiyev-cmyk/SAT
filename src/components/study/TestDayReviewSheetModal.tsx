import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Printer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Zap,
  Check,
  Award,
  Layers,
  ChevronRight,
  Calculator,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { ALL_QUESTIONS } from '../../data/questions';
import { getProgress, getMistakes } from '../../services/userProgress';
import { getSpacedRepetitionQueue } from '../../utils/spacedRepetitionEngine';
import { getStoredAdaptiveData } from '../../utils/adaptivePlannerEngine';
import { useApp } from '../../context/AppContext';
import { QuestionItem } from '../../types/questionBank';

interface TestDayReviewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: 'all' | 'mistakes' | 'formulas' | 'strategy';
}

interface ResolvedMistake {
  question: QuestionItem;
  selectedAnswer?: string;
  mistakeReason?: string;
  attemptedAt?: number;
}

// Curated high-yield SAT Math trap questions if user has 0 mistakes logged
const CORE_TRAP_QUESTIONS: ResolvedMistake[] = [
  {
    question: {
      id: 'trap_q1',
      source: 'ScoreUp High-Yield Bank',
      domain: 'Advanced Math',
      topic: 'Circles & Nonlinear Equations',
      difficulty: 'Hard',
      type: 'multiple_choice',
      question: 'The equation of a circle in the $xy$-plane is $(x - 5)^2 + (y + 3)^2 = 49$. What is the radius of the circle, and what are the coordinates of its center $(h, k)$?',
      correctAnswer: 'Radius = 7, Center = (5, -3)',
      options: [
        { id: 'A', text: 'Radius = 49, Center = (-5, 3)' },
        { id: 'B', text: 'Radius = 7, Center = (-5, 3)' },
        { id: 'C', text: 'Radius = 49, Center = (5, -3)' },
        { id: 'D', text: 'Radius = 7, Center = (5, -3)' }
      ],
      explanation: 'The standard form for a circle is $(x - h)^2 + (y - k)^2 = r^2$. Here, $r^2 = 49$, so $r = \\sqrt{49} = 7$. For the center $(h, k)$, $(x - 5) \\Rightarrow h = 5$ and $(y + 3) = (y - (-3)) \\Rightarrow k = -3$. The center is $(5, -3)$ and the radius is $7$.',
    },
    selectedAnswer: 'Radius = 49, Center = (-5, 3)',
    mistakeReason: 'wrong_formula',
  },
  {
    question: {
      id: 'trap_q2',
      source: 'ScoreUp High-Yield Bank',
      domain: 'Advanced Math',
      topic: 'Quadratic Vertex & Extrema',
      difficulty: 'Hard',
      type: 'multiple_choice',
      question: 'A quadratic function is modeled by $f(x) = 2x^2 - 12x + 11$. For what value of $x$ does $f(x)$ reach its minimum value, and what is the minimum value of the function?',
      correctAnswer: 'x = 3, minimum value = -7',
      options: [
        { id: 'A', text: 'x = 6, minimum value = 11' },
        { id: 'B', text: 'x = 3, minimum value = -7' },
        { id: 'C', text: 'x = -3, minimum value = 65' },
        { id: 'D', text: 'x = 3, minimum value = 11' }
      ],
      explanation: 'For a parabola $ax^2 + bx + c$ with $a > 0$, the minimum vertex occurs at $x = -\\frac{b}{2a} = -\\frac{-12}{2(2)} = \\frac{12}{4} = 3$. Evaluating the minimum function value: $f(3) = 2(3)^2 - 12(3) + 11 = 2(9) - 36 + 11 = 18 - 36 + 11 = -7$.',
    },
    selectedAnswer: 'x = 6, minimum value = 11',
    mistakeReason: 'calculation_slip',
  },
  {
    question: {
      id: 'trap_q3',
      source: 'ScoreUp High-Yield Bank',
      domain: 'Algebra',
      topic: 'Linear Systems (Infinite Solutions)',
      difficulty: 'Medium',
      type: 'multiple_choice',
      question: 'In the system of equations $4x + 6y = 18$ and $2x + ky = 9$, the system has infinitely many solutions $(x, y)$. What is the exact value of $k$?',
      correctAnswer: 'k = 3',
      options: [
        { id: 'A', text: 'k = 2' },
        { id: 'B', text: 'k = 3' },
        { id: 'C', text: 'k = 6' },
        { id: 'D', text: 'k = 9' }
      ],
      explanation: 'A 2-variable linear system has infinitely many solutions when the two equations represent identical lines. Dividing the first equation $4x + 6y = 18$ by $2$ gives $2x + 3y = 9$. Comparing coefficients with $2x + ky = 9$ immediately yields $k = 3$.',
    },
    selectedAnswer: 'k = 6',
    mistakeReason: 'misread_question',
  },
  {
    question: {
      id: 'trap_q4',
      source: 'ScoreUp High-Yield Bank',
      domain: 'Advanced Math',
      topic: 'Radical Equations & Extraneous Roots',
      difficulty: 'Hard',
      type: 'multiple_choice',
      question: 'What is the real solution set for the equation $\\sqrt{3x + 1} = x - 3$?',
      correctAnswer: 'x = 8 (x = 1 is extraneous)',
      options: [
        { id: 'A', text: 'x = 8 only' },
        { id: 'B', text: 'x = 1 and x = 8' },
        { id: 'C', text: 'x = 1 only' },
        { id: 'D', text: 'No real solutions' }
      ],
      explanation: 'Square both sides: $3x + 1 = (x - 3)^2 = x^2 - 6x + 9$. Rearranging: $x^2 - 9x + 8 = 0 \\Rightarrow (x - 8)(x - 1) = 0$. Potential roots are $x = 8$ and $x = 1$. Must test both in the original equation! For $x = 1$: $\\sqrt{3(1) + 1} = \\sqrt{4} = 2$, but $1 - 3 = -2$. Since $2 \\neq -2$, $x = 1$ is an extraneous solution! For $x = 8$: $\\sqrt{25} = 5$ and $8 - 3 = 5$ (valid). Therefore, only $x = 8$ is a true solution.',
    },
    selectedAnswer: 'x = 1 and x = 8',
    mistakeReason: 'concept_gap',
  },
  {
    question: {
      id: 'trap_q5',
      source: 'ScoreUp High-Yield Bank',
      domain: 'Problem-Solving & Data Analysis',
      topic: 'Compound Percent Change & Multipliers',
      difficulty: 'Medium',
      type: 'multiple_choice',
      question: 'The price of an asset increases by $25\\%$. In the following quarter, the new price decreases by $20\\%$. If the original price was $P$, what is the final price in terms of $P$?',
      correctAnswer: 'P (0% net change)',
      options: [
        { id: 'A', text: '0.95P' },
        { id: 'B', text: 'P' },
        { id: 'C', text: '1.05P' },
        { id: 'D', text: '1.10P' }
      ],
      explanation: 'Common student trap: thinking $+25\\% - 20\\% = +5\\%$. In reality, percentage changes are multiplicative! Increasing by $25\\%$ means multiplying by $1.25$. Decreasing by $20\\%$ means multiplying by $(1 - 0.20) = 0.80$. The compound multiplier is $(1.25)(0.80) = 1.00$. Hence, the final price is $(1.00)P = P$ with zero net change.',
    },
    selectedAnswer: '1.05P',
    mistakeReason: 'calculation_slip',
  }
];

export const TestDayReviewSheetModal: React.FC<TestDayReviewSheetModalProps> = ({
  isOpen,
  onClose,
  initialSection = 'all',
}) => {
  const { userProgressState } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'mistakes' | 'formulas' | 'strategy'>(initialSection);
  const [printDate] = useState(() => new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }));

  const plannerData = useMemo(() => getStoredAdaptiveData(), []);

  // Resolve user mistakes from storage and questions database
  const userMistakes = useMemo<ResolvedMistake[]>(() => {
    const rawProgress = getProgress();
    const spacedQueue = getSpacedRepetitionQueue();
    const reasonMap = new Map<string, string>();
    spacedQueue.forEach((item) => {
      if (item.mistakeReason) reasonMap.set(item.questionId, item.mistakeReason);
    });

    const mistakeAttempts = Object.values(rawProgress).filter((att) => !att.isCorrect);
    const resolved: ResolvedMistake[] = [];
    const seen = new Set<string>();

    mistakeAttempts.forEach((att) => {
      const q = ALL_QUESTIONS.find((item) => item.id === att.questionId);
      if (q && !seen.has(q.id)) {
        seen.add(q.id);
        resolved.push({
          question: q,
          selectedAnswer: att.selectedAnswer,
          mistakeReason: reasonMap.get(q.id) || 'calculation_slip',
          attemptedAt: att.attemptedAt,
        });
      }
    });

    return resolved;
  }, []);

  const isUsingFallbackMistakes = userMistakes.length === 0;
  const displayedMistakes = isUsingFallbackMistakes ? CORE_TRAP_QUESTIONS : userMistakes;

  // Trigger browser native print / PDF dialog
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return createPortal(
    <div id="test-day-review-sheet-portal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md transition-all select-none print:static print:bg-white print:overflow-visible">
      
      {/* ─── 1. FIXED SCREEN TOOLBAR (Hidden in Print / PDF Export) ─── */}
      <div className="no-print sticky top-0 z-40 bg-white/95 dark:bg-[#0c121e]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 shadow-md flex items-center justify-between">
        
        {/* Left: Brand Badge & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white dark:text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Test-Day Review Sheet & Mistake Notebook
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Official Multi-Page PDF Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Generated for test-day cramming, formulas recap, and personalized mistake remediation.
            </p>
          </div>
        </div>

        {/* Center: Section Filter Tabs */}
        <div className="hidden md:flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('mistakes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'mistakes'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mistake Vault ({displayedMistakes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('formulas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'formulas'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Formulas
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('strategy')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'strategy'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            10 Rules
          </button>
        </div>

        {/* Right: Print / Export Action + Close */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center space-x-1.5"
            title="Trigger browser print dialog to print or save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── 2. MAIN PRINTABLE DOCUMENT CONTAINER ─── */}
      <div className="max-w-4xl mx-auto my-6 p-4 sm:p-8 print:p-0 print:m-0 print:max-w-none print:w-full">
        <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 print:border-none print:shadow-none print:rounded-none print:p-0 select-auto">
          
          {/* ═══════════ DOCUMENT HEADER BLOCK ═══════════ */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8 print-avoid-break">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>ScoreUP Digital SAT® Prep • Official Student Study Packet</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Digital SAT® Math Test-Day Review Sheet & Mistake Notebook
                </h1>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  High-Yield Formula Reference Sheet, Desmos Speed Shortcuts, and Error Remediation Journal
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-right font-mono text-xs space-y-1 flex-shrink-0">
                <div><span className="text-slate-400">Target Score:</span> <strong className="text-emerald-700 font-extrabold">{userProgressState.planner.targetScore || 800}+ / 800</strong></div>
                <div><span className="text-slate-400">Exam Target:</span> <strong className="text-slate-800">{userProgressState.planner.targetExamDate || 'October 2026'}</strong></div>
                <div><span className="text-slate-400">Date Generated:</span> <strong className="text-slate-700">{printDate}</strong></div>
              </div>
            </div>

            {/* Quick Readiness Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-100 text-center font-mono text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase block">Total Solved</span>
                <span className="font-bold text-slate-900">
                  {plannerData?.attempts?.length || userProgressState?.stats?.totalQuestionsSolved || 142} Qs
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase block">Accuracy</span>
                <span className="font-bold text-emerald-700">
                  {plannerData?.attempts && plannerData.attempts.length > 0
                    ? ((plannerData.attempts.filter(a => a.correct).length / plannerData.attempts.length) * 100).toFixed(1)
                    : userProgressState?.stats?.totalQuestionsSolved
                    ? ((userProgressState.stats.totalQuestionsCorrect / userProgressState.stats.totalQuestionsSolved) * 100).toFixed(1)
                    : '84.5'}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase block">Review Items</span>
                <span className="font-bold text-rose-600">{displayedMistakes.length} Missed Concepts</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase block">Target Pacing</span>
                <span className="font-bold text-slate-800">75s / Q</span>
              </div>
            </div>
          </div>

          {/* ═══════════ SECTION A: FORMULAS REFERENCE SHEET ═══════════ */}
          {(activeFilter === 'all' || activeFilter === 'formulas') && (
            <div className="space-y-6 mb-10 print-avoid-break">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-black uppercase tracking-wide text-slate-900">
                  Part 1: Official & High-Yield SAT Math Formula Sheet
                </h2>
              </div>

              {/* 2D & 3D Geometry Core */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="font-bold text-emerald-800 uppercase text-[10px] font-mono">Circle</div>
                  <div className="font-extrabold text-sm mt-1 text-slate-900"><MathRenderer content="$A = \pi r^2$" /></div>
                  <div className="text-slate-600 text-xs"><MathRenderer content="$C = 2\pi r$" /></div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="font-bold text-emerald-800 uppercase text-[10px] font-mono">Triangle & Pythagorean</div>
                  <div className="font-extrabold text-sm mt-1 text-slate-900"><MathRenderer content={"$A = \\frac{1}{2}bh$"} /></div>
                  <div className="text-slate-600 text-xs"><MathRenderer content="$c^2 = a^2 + b^2$" /></div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="font-bold text-emerald-800 uppercase text-[10px] font-mono">Special Right 30-60-90</div>
                  <div className="font-extrabold text-sm mt-1 text-slate-900"><MathRenderer content={"$x : x\\sqrt{3} : 2x$"} /></div>
                  <div className="text-[10px] text-slate-500"><MathRenderer content="Short leg = $x$, Hypotenuse = $2x$" /></div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="font-bold text-emerald-800 uppercase text-[10px] font-mono">Special Right 45-45-90</div>
                  <div className="font-extrabold text-sm mt-1 text-slate-900"><MathRenderer content={"$s : s : s\\sqrt{2}$"} /></div>
                  <div className="text-[10px] text-slate-500"><MathRenderer content="Legs = $s$, Hypotenuse = $s\\sqrt{2}$" /></div>
                </div>
              </div>

              {/* 3D Volumes & Sector Laws */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 font-sans block">Cylinder Volume</span>
                  <span className="font-bold text-slate-900"><MathRenderer content="$V = \pi r^2 h$" /></span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 font-sans block">Cone Volume</span>
                  <span className="font-bold text-slate-900"><MathRenderer content={"$V = \\frac{1}{3}\\pi r^2 h$"} /></span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 font-sans block">Sphere Volume</span>
                  <span className="font-bold text-slate-900"><MathRenderer content={"$V = \\frac{4}{3}\\pi r^3$"} /></span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 font-sans block">Circle Angle Laws</span>
                  <span className="font-bold text-emerald-700"><MathRenderer content={"$360^\\circ = 2\\pi\\text{ rad}$"} /></span>
                </div>
              </div>

              {/* Unofficial High-Yield Formulas (MUST MEMORIZE) */}
              <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    High-Yield Unofficial Formulas (NOT on Bluebook Reference Sheet)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <strong className="block text-emerald-800 text-[11px] font-sans">Quadratic Vertex Form:</strong>
                    <div className="mt-0.5"><MathRenderer content="$y = a(x - h)^2 + k$" /></div>
                    <span className="text-[10px] text-slate-500 font-sans"><MathRenderer content="Vertex is $(h, k)$" /></span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <strong className="block text-emerald-800 text-[11px] font-sans">Vertex x-Coordinate:</strong>
                    <div className="mt-0.5"><MathRenderer content={"$x = -\\frac{b}{2a}$"} /></div>
                    <span className="text-[10px] text-slate-500 font-sans">Axis of symmetry</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <strong className="block text-emerald-800 text-[11px] font-sans">Discriminant & Roots:</strong>
                    <div className="mt-0.5"><MathRenderer content="$\Delta = b^2 - 4ac$" /></div>
                    <span className="text-[10px] text-slate-500 font-sans"><MathRenderer content={"$\\Delta > 0\\text{ (2)}, = 0\\text{ (1)}, < 0\\text{ (0)}$"} /></span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <strong className="block text-emerald-800 text-[11px] font-sans">Vieta's Formulas:</strong>
                    <div className="mt-0.5"><MathRenderer content={"$\\text{Sum} = -\\frac{b}{a},\\ \\text{Product} = \\frac{c}{a}$"} /></div>
                    <span className="text-[10px] text-slate-500 font-sans">Fast algebraic shortcuts</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <strong className="block text-emerald-800 text-[11px] font-sans">Circle Equation Standard:</strong>
                    <div className="mt-0.5"><MathRenderer content="$(x - h)^2 + (y - k)^2 = r^2$" /></div>
                    <span className="text-[10px] text-slate-500 font-sans"><MathRenderer content="Center $(h, k)$, Radius $r$" /></span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <strong className="block text-emerald-800 text-[11px] font-sans">Trig Identity & Complements:</strong>
                    <div className="mt-0.5"><MathRenderer content={"$\\sin(x) = \\cos(90^\\circ - x)$"} /></div>
                    <span className="text-[10px] text-slate-500 font-sans"><MathRenderer content={"$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$"} /></span>
                  </div>
                </div>
              </div>

              {/* Desmos Speed Shortcuts */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-bold text-slate-900">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Desmos High-Speed Shortcuts (Saves ~8-10 Minutes)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>• <strong>2-Variable Systems:</strong> Type both equations directly; tap the gray intersection dot.</div>
                  <div>• <strong>Extrema / Max / Min:</strong> Type the quadratic function; tap the vertex gray dot.</div>
                  <div>• <strong>Single Variable Solving:</strong> <MathRenderer content="Type $3(2x - 5) + 4 = 19$; Desmos draws vertical line at $x = 5$." /></div>
                  <div>• <strong>Data Regressions:</strong> <MathRenderer content="Add table $(x_1, y_1)$, type $y_1 \sim m x_1 + b$ to find slope and intercept." /></div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ SECTION B: 10 TEST-DAY STRATEGY RULES ═══════════ */}
          {(activeFilter === 'all' || activeFilter === 'strategy') && (
            <div className="space-y-4 mb-10 print-avoid-break">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <Compass className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-black uppercase tracking-wide text-slate-900">
                  Part 2: 10 Critical Test-Day Strategy Rules
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  { title: 'The 30-Second Rule', desc: 'If no clear algebraic path within 30s, immediately plug into Desmos or flag and move on.' },
                  { title: 'Question Trap Alert', desc: 'Always re-read what is requested: is it x, 2x, x + y, or the y-intercept value?' },
                  { title: 'Radius vs Radius²', desc: 'In (x - h)² + (y - k)² = 36, the radius r is 6, NOT 36. Don\'t lose 20 points to this.' },
                  { title: 'Similar Figures Scaling', desc: 'If length ratio is k, area ratio is k², and volume ratio is k³.' },
                  { title: 'Extraneous Root Check', desc: 'When squaring both sides of radical equations, ALWAYS plug back in to verify validity.' },
                  { title: 'Infinite vs No Solutions', desc: 'Equal slopes + different intercepts = 0 solutions. Identical equations = infinite solutions.' },
                  { title: 'Percent Multipliers', desc: '+25% then -20% is (1.25)(0.80) = 1.00 (0% change), NOT +5%.' },
                  { title: 'Negative Exponent Rule', desc: 'x⁻ᵃ = 1/xᵃ and xᵃ/ᵇ = b-th root of xᵃ.' },
                  { title: 'Desmos Parallel Lines', desc: 'Two lines are parallel when m₁ = m₂. Perpendicular when m₁ · m₂ = -1.' },
                  { title: 'Sanity Magnitude Check', desc: 'Does the result make physical sense? Triangles cannot have negative lengths.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="text-slate-900 font-bold block">{item.title}</strong>
                      <span className="text-slate-600 leading-snug">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ SECTION C: MISTAKE NOTEBOOK JOURNAL ═══════════ */}
          {(activeFilter === 'all' || activeFilter === 'mistakes') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h2 className="text-lg font-black uppercase tracking-wide text-slate-900">
                    Part 3: Personalized Mistake Notebook ({displayedMistakes.length} Remediations)
                  </h2>
                </div>
                {isUsingFallbackMistakes && (
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Pre-Loaded with Core Test-Day Traps
                  </span>
                )}
              </div>

              {isUsingFallbackMistakes && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Zero Misses Logged Yet:</strong> We have pre-populated this Mistake Notebook with the 5 most critical Digital SAT Math trap archetypes to ensure your test-day packet is complete!
                  </span>
                </div>
              )}

              {/* Mistake Entries List */}
              <div className="space-y-6">
                {displayedMistakes.map((entry, idx) => {
                  const q = entry.question;
                  const reasonLabel = entry.mistakeReason ? entry.mistakeReason.replace('_', ' ') : 'calculation slip';
                  
                  return (
                    <div
                      key={q.id || idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 print:bg-white print-avoid-break space-y-4"
                    >
                      {/* Entry Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-mono text-xs font-black flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-xs text-slate-900">
                            {q.domain} • {q.topic || 'Core Concept'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase font-semibold">
                            {q.difficulty}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                          Mistake Type: {reasonLabel}
                        </span>
                      </div>

                      {/* Question Stem */}
                      <div className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                        <MathRenderer content={q.question || q.questionText || ''} />
                      </div>

                      {/* Options / Answer Comparison Block */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono">
                          <div className="flex items-center space-x-1.5 text-emerald-800 font-bold mb-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct Answer:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-sm">
                            {q.correctAnswer}
                          </div>
                        </div>

                        {entry.selectedAnswer && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-mono">
                            <div className="flex items-center space-x-1.5 text-rose-800 font-bold mb-1">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>Your Previous Attempt:</span>
                            </div>
                            <div className="font-bold text-rose-700 text-sm line-through">
                              {entry.selectedAnswer}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Step-by-Step Remediation */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                        <strong className="block text-emerald-800 font-extrabold text-xs uppercase tracking-wider font-mono">
                          Official Remediation Breakdown:
                        </strong>
                        <div className="text-slate-700 leading-relaxed">
                          <MathRenderer content={q.explanation || 'Review algebraic steps and plug in answer choices.'} />
                        </div>
                      </div>

                      {/* Test-Day Takeaway Pill */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          <strong>Test-Day Rule:</strong> Verify coefficients and substitute back into the prompt before clicking Next.
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════ DOCUMENT FOOTER ═══════════ */}
          <div className="mt-12 pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2 print-avoid-break">
            <div>ScoreUP SAT® Math Mastery System • scoreup.prep</div>
            <div>Good luck on exam day! Aim for 800.</div>
          </div>

        </div>
      </div>

    </div>,
    document.body
  );
};

export default TestDayReviewSheetModal;

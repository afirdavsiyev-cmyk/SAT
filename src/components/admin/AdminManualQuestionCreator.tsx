import React, { useState } from 'react';
import {
  PenTool,
  Save,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Code,
  Layers,
  Sparkles,
  Trash2,
  Eye,
} from 'lucide-react';
import { MathDomain, Question, QuestionOption } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { saveQuestionToBank } from '../../services/customPracticeTestsService';

export const AdminManualQuestionCreator: React.FC = () => {
  // Form state
  const [domain, setDomain] = useState<MathDomain>('Algebra');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [type, setType] = useState<'multiple_choice' | 'student_produced'>('multiple_choice');

  const [prompt, setPrompt] = useState(
    'If $3x + 7 = 22$, what is the value of $6x - 4$?'
  );

  // Choices for multiple choice
  const [choiceA, setChoiceA] = useState('$26$');
  const [choiceB, setChoiceB] = useState('$30$');
  const [choiceC, setChoiceC] = useState('$34$');
  const [choiceD, setChoiceD] = useState('$38$');
  const [mcCorrectAnswer, setMcCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Student produced response
  const [sprCorrectAnswer, setSprCorrectAnswer] = useState('26');
  const [sprAcceptableAnswers, setSprAcceptableAnswers] = useState('26, 26.0');

  // Explanation and Desmos tips
  const [explanation, setExplanation] = useState(
    'First, solve $3x + 7 = 22$ for $x$:\n$$3x = 22 - 7 = 15 \\implies x = 5$$\nThen evaluate $6x - 4$:\n$$6(5) - 4 = 30 - 4 = 26$$'
  );
  const [desmosEquation, setDesmosEquation] = useState('y = 3x + 7; y = 22');
  const [calculatorTip, setCalculatorTip] = useState(
    'Graph $y = 3x + 7$ and $y = 22$ on the Desmos calculator to find the intersection at $x = 5$, then compute $6(5) - 4$.'
  );

  // UI state
  const [validationError, setValidationError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Insert helper token into prompt textarea
  const insertToken = (token: string) => {
    setPrompt((prev) => prev + token);
  };

  // Build the Question object from current form state
  const constructQuestion = (): Question => {
    const isMC = type === 'multiple_choice';
    const id = `manual-q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const options: QuestionOption[] = isMC
      ? [
          { id: 'A', text: choiceA.trim() },
          { id: 'B', text: choiceB.trim() },
          { id: 'C', text: choiceC.trim() },
          { id: 'D', text: choiceD.trim() },
        ]
      : [];

    let acceptableAnswersList: string[] | undefined = undefined;
    if (!isMC && sprAcceptableAnswers.trim()) {
      acceptableAnswersList = sprAcceptableAnswers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return {
      id,
      number: 1,
      section: 'math',
      module: 1,
      domain,
      topic: topic.trim() || domain,
      difficulty,
      type,
      prompt: prompt.trim(),
      options: isMC ? options : undefined,
      correctAnswer: isMC ? mcCorrectAnswer : sprCorrectAnswer.trim(),
      acceptableAnswers: acceptableAnswersList,
      explanation: explanation.trim(),
      desmosEquation: desmosEquation.trim() || undefined,
      calculatorTip: calculatorTip.trim() || undefined,
    };
  };

  const handleSaveToQuestionBank = () => {
    setValidationError('');
    setSaveSuccess(null);

    if (!prompt.trim()) {
      setValidationError('Question prompt cannot be empty.');
      return;
    }

    if (type === 'multiple_choice') {
      if (!choiceA.trim() || !choiceB.trim() || !choiceC.trim() || !choiceD.trim()) {
        setValidationError('All 4 multiple choice options (A, B, C, D) are required.');
        return;
      }
    } else {
      if (!sprCorrectAnswer.trim()) {
        setValidationError('Correct answer for student produced question is required.');
        return;
      }
    }

    if (!explanation.trim()) {
      setValidationError('Please provide a step-by-step explanation.');
      return;
    }

    try {
      const q = constructQuestion();
      saveQuestionToBank(q);
      setSaveSuccess(`Question successfully saved to Question Bank! (ID: ${q.id})`);
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to save question.');
    }
  };

  const handleCopyJson = () => {
    try {
      const q = constructQuestion();
      navigator.clipboard.writeText(JSON.stringify(q, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleResetForm = () => {
    if (!confirm('Reset the question authoring form? All unsaved inputs will be cleared.')) return;
    setTopic('');
    setPrompt('');
    setChoiceA('');
    setChoiceB('');
    setChoiceC('');
    setChoiceD('');
    setSprCorrectAnswer('');
    setSprAcceptableAnswers('');
    setExplanation('');
    setDesmosEquation('');
    setCalculatorTip('');
    setValidationError('');
    setSaveSuccess(null);
  };

  const previewQuestion = constructQuestion();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ─────────────────────────────────────────────────────────────
          LEFT PANEL: AUTHORING FORM (6 cols)
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-6 space-y-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Manual Question Authoring Studio
                </h3>
                <p className="text-[11px] text-slate-400">
                  Compose custom Digital SAT Math problems with full LaTeX & Desmos support
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetForm}
              className="text-slate-400 hover:text-rose-500 text-xs font-semibold p-1.5 transition-colors"
              title="Reset form"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Validation & Success Feedback */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
              <button
                onClick={() => setSaveSuccess(null)}
                className="text-emerald-600 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Domain & Topic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Math Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as MathDomain)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="Algebra">Algebra</option>
                <option value="Advanced Math">Advanced Math</option>
                <option value="Problem-Solving & Data Analysis">
                  Problem-Solving & Data Analysis
                </option>
                <option value="Geometry & Trigonometry">Geometry & Trigonometry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Specific Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Linear Equations in Context"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium placeholder-slate-400"
              />
            </div>
          </div>

          {/* Difficulty & Question Type Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Difficulty Tier
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="Easy">Easy (Foundation / 400-580)</option>
                <option value="Medium">Medium (Target / 600-720)</option>
                <option value="Hard">Hard (Elite / 750-800)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Question Format
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'multiple_choice' | 'student_produced')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="multiple_choice">Multiple Choice (4 Choices)</option>
                <option value="student_produced">Student Produced (Grid-in)</option>
              </select>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Question Prompt (Supports LaTeX KaTeX)
              </label>
              <div className="flex items-center gap-1">
                {['$x$', 'x^2', '\\frac{a}{b}', '\\sqrt{x}', '\\pm', '\\le'].map((tok) => (
                  <button
                    key={tok}
                    type="button"
                    onClick={() => insertToken(` $${tok}$ `)}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title={`Insert ${tok}`}
                  >
                    {tok}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter question text. Enclose formulas in $...$ for inline or $$...$$ for block math."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Conditional: Multiple Choice Options vs Student Produced Inputs */}
          {type === 'multiple_choice' ? (
            <div className="space-y-3 pt-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Choices A, B, C, D</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Select correct answer radio
                </span>
              </label>

              <div className="space-y-2">
                {[
                  { id: 'A', value: choiceA, setter: setChoiceA },
                  { id: 'B', value: choiceB, setter: setChoiceB },
                  { id: 'C', value: choiceC, setter: setChoiceC },
                  { id: 'D', value: choiceD, setter: setChoiceD },
                ].map(({ id, value, setter }) => (
                  <div key={id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMcCorrectAnswer(id as 'A' | 'B' | 'C' | 'D')}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all shrink-0 ${
                        mcCorrectAnswer === id
                          ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                      title={mcCorrectAnswer === id ? 'Correct Answer' : 'Click to set as correct answer'}
                    >
                      {id}
                    </button>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={`Choice ${id} (LaTeX supported with $...$)`}
                      className={`flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white font-mono ${
                        mcCorrectAnswer === id
                          ? 'border-emerald-500/60 ring-1 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Correct Answer (Grid-In)
                </label>
                <input
                  type="text"
                  value={sprCorrectAnswer}
                  onChange={(e) => setSprCorrectAnswer(e.target.value)}
                  placeholder="e.g. 26 or 5/2 or -1.75"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Acceptable Equivalents</span>
                  <span className="text-[10px] text-slate-400 font-normal">Comma-separated</span>
                </label>
                <input
                  type="text"
                  value={sprAcceptableAnswers}
                  onChange={(e) => setSprAcceptableAnswers(e.target.value)}
                  placeholder="e.g. 2.5, 5/2, 2.50"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Step-by-Step Explanation (KaTeX Supported)
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Detailed step-by-step math explanation and formulas..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Desmos Equation & Calculator Tip (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Desmos Equation</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={desmosEquation}
                onChange={(e) => setDesmosEquation(e.target.value)}
                placeholder="e.g. y = 3x + 7; y = 22"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Calculator / Desmos Tip</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={calculatorTip}
                onChange={(e) => setCalculatorTip(e.target.value)}
                placeholder="e.g. Graph equations to find intersection"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[11px]"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">JSON Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Question JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveToQuestionBank}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save to Question Bank</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT PANEL: LIVE KaTeX SPLIT PREVIEW (6 cols)
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-6 space-y-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Live KaTeX Split Preview
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {domain}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  difficulty === 'Easy'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : difficulty === 'Medium'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                }`}
              >
                {difficulty}
              </span>
            </div>
          </div>

          {/* Rendered Prompt */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Prompt Render
            </span>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm leading-relaxed min-h-[70px]">
              {previewQuestion.prompt ? (
                <KaTeXRenderer text={previewQuestion.prompt} />
              ) : (
                <span className="text-slate-400 text-xs italic">
                  Type your prompt above to see live math rendering...
                </span>
              )}
            </div>
          </div>

          {/* Rendered Options or Grid-in */}
          {type === 'multiple_choice' ? (
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Choices Render
              </span>
              <div className="space-y-2">
                {previewQuestion.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      opt.id === previewQuestion.correctAnswer
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-900 dark:text-emerald-200'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        opt.id === previewQuestion.correctAnswer
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <div className="text-xs pt-0.5 flex-1 leading-relaxed">
                      {opt.text ? (
                        <KaTeXRenderer text={opt.text} />
                      ) : (
                        <span className="text-slate-400 italic">Empty choice</span>
                      )}
                    </div>
                    {opt.id === previewQuestion.correctAnswer && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Key</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Student Produced Response Key
              </span>
              <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {previewQuestion.correctAnswer || '(No answer set)'}
              </div>
              {previewQuestion.acceptableAnswers && (
                <div className="text-[11px] text-slate-500">
                  Acceptable equivalents: {previewQuestion.acceptableAnswers.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Rendered Explanation */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Step-by-Step Solution
            </span>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {previewQuestion.explanation ? (
                <KaTeXRenderer text={previewQuestion.explanation} />
              ) : (
                <span className="text-slate-400 italic">No explanation provided yet.</span>
              )}
            </div>
          </div>

          {/* Desmos Tip Preview */}
          {(previewQuestion.desmosEquation || previewQuestion.calculatorTip) && (
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Calculator className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Desmos & Calculator Strategy</span>
              </div>
              {previewQuestion.desmosEquation && (
                <div className="font-mono text-[11px]">
                  Equation: <code>{previewQuestion.desmosEquation}</code>
                </div>
              )}
              {previewQuestion.calculatorTip && (
                <div className="text-[11px] text-teal-700 dark:text-teal-300">
                  {previewQuestion.calculatorTip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManualQuestionCreator;

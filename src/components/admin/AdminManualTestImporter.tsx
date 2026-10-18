import React, { useState } from 'react';
import {
  Code,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
  Save,
  ArrowUpDown,
  Layers,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import { Question } from '../../types';
import { CustomPracticeTest } from '../../types/admin';
import { sanitizeAndParseAIJson } from '../../services/aiQuestionGenerator';
import {
  sortQuestionsByDifficulty,
  saveCustomPracticeTest,
} from '../../services/customPracticeTestsService';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface AdminManualTestImporterProps {
  onTestSaved: () => Promise<void>;
}

export const AdminManualTestImporter: React.FC<AdminManualTestImporterProps> = ({ onTestSaved }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Standard' | 'Hard' | '750+' | 'Adaptive'>('Standard');
  const [moduleTimeMinutes, setModuleTimeMinutes] = useState<number>(35);
  const [jsonText, setJsonText] = useState('');

  // Parsed and validated questions
  const [parsedM1, setParsedM1] = useState<Question[] | null>(null);
  const [parsedM2, setParsedM2] = useState<Question[] | null>(null);

  // Status and feedback
  const [validationError, setValidationError] = useState('');
  const [validationSuccess, setValidationSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Preview expansion toggle
  const [expandedPreview, setExpandedPreview] = useState(false);

  // Sample JSON generator
  const handleLoadSample = () => {
    const sampleQuestions: Question[] = [
      {
        id: 'sample-m1-q1',
        number: 1,
        section: 'math',
        module: 1,
        domain: 'Algebra',
        difficulty: 'Easy',
        prompt: 'If $2x + 5 = 15$, what is the value of $x$?',
        type: 'multiple_choice',
        options: [
          { id: 'A', text: '$3$' },
          { id: 'B', text: '$5$' },
          { id: 'C', text: '$7$' },
          { id: 'D', text: '$10$' },
        ],
        correctAnswer: 'B',
        explanation: 'Subtract 5 from both sides to get $2x = 10$, then divide by 2 to find $x = 5$.',
      },
      {
        id: 'sample-m1-q2',
        number: 2,
        section: 'math',
        module: 1,
        domain: 'Advanced Math',
        difficulty: 'Medium',
        prompt: 'The function $f$ is defined by $f(x) = (x - 4)^2 + 9$. What is the minimum value of $f(x)$?',
        type: 'student_produced',
        correctAnswer: '9',
        acceptableAnswers: ['9', '9.0'],
        explanation: 'Because $(x - 4)^2 \\ge 0$ for all real $x$, the vertex occurs at $(4, 9)$, giving a minimum value of 9.',
      },
      {
        id: 'sample-m2-q1',
        number: 3,
        section: 'math',
        module: 2,
        domain: 'Geometry & Trigonometry',
        difficulty: 'Hard',
        prompt: 'In a right triangle, $\\sin(A) = \\frac{5}{13}$. If the side opposite angle $A$ has length $15$, what is the length of the hypotenuse?',
        type: 'student_produced',
        correctAnswer: '39',
        acceptableAnswers: ['39'],
        explanation: '$\\sin(A) = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{15}{H} = \\frac{5}{13} \\implies 5H = 195 \\implies H = 39$.',
      },
    ];

    setJsonText(JSON.stringify(sampleQuestions, null, 2));
    setValidationError('');
    setValidationSuccess('Sample template loaded. Click "Validate & Sort Questions" to inspect.');
  };

  const handleValidate = () => {
    setValidationError('');
    setValidationSuccess('');
    setSaveSuccessMessage('');

    if (!jsonText.trim()) {
      setValidationError('Please paste JSON questions or click "Load Sample Template".');
      return;
    }

    try {
      const parsed = sanitizeAndParseAIJson<any>(jsonText);
      let rawM1: Question[] = [];
      let rawM2: Question[] = [];

      if (Array.isArray(parsed)) {
        // Flat array of questions
        const total = parsed.length;
        if (total === 0) {
          throw new Error('Pasted array contains 0 questions.');
        }
        const half = Math.ceil(total / 2);
        rawM1 = parsed.slice(0, half);
        rawM2 = parsed.slice(half);
      } else if (parsed && typeof parsed === 'object') {
        // Object with module1 / module2 or module1Questions / module2Questions
        const m1 = parsed.module1 || parsed.module1Questions || parsed.m1;
        const m2 = parsed.module2 || parsed.module2Questions || parsed.m2;
        const genericQuestions = parsed.questions;

        if (Array.isArray(m1) && Array.isArray(m2)) {
          rawM1 = m1;
          rawM2 = m2;
        } else if (Array.isArray(genericQuestions)) {
          const half = Math.ceil(genericQuestions.length / 2);
          rawM1 = genericQuestions.slice(0, half);
          rawM2 = genericQuestions.slice(half);
        } else {
          throw new Error(
            'Expected an array of questions or an object with { module1: [...], module2: [...] }.'
          );
        }
      } else {
        throw new Error('Invalid JSON format.');
      }

      // Normalize fields
      const normalize = (list: any[], modNum: 1 | 2): Question[] => {
        return list.map((item, idx) => ({
          id: item.id || `custom-m${modNum}-q${idx + 1}-${Date.now().toString(36)}`,
          number: idx + 1,
          section: 'math',
          module: modNum,
          domain: item.domain || 'Algebra',
          topic: item.topic || item.domain || 'General Math',
          difficulty: ['Easy', 'Medium', 'Hard'].includes(item.difficulty)
            ? item.difficulty
            : 'Medium',
          type: item.type === 'student_produced' ? 'student_produced' : 'multiple_choice',
          prompt: item.prompt || item.question || '(No prompt)',
          options: item.options || undefined,
          correctAnswer: item.correctAnswer || item.answer || 'A',
          acceptableAnswers: item.acceptableAnswers || undefined,
          explanation: item.explanation || 'No explanation provided.',
          desmosEquation: item.desmosEquation || undefined,
          calculatorTip: item.calculatorTip || undefined,
        }));
      };

      const normalizedM1 = normalize(rawM1, 1);
      const normalizedM2 = normalize(rawM2, 2);

      // Sort both modules Easy -> Medium -> Hard
      const sortedM1 = sortQuestionsByDifficulty(normalizedM1).map((q, idx) => ({
        ...q,
        module: 1 as const,
        number: idx + 1,
      }));

      const sortedM2 = sortQuestionsByDifficulty(normalizedM2).map((q, idx) => ({
        ...q,
        module: 2 as const,
        number: sortedM1.length + idx + 1,
      }));

      setParsedM1(sortedM1);
      setParsedM2(sortedM2);

      setValidationSuccess(
        `Validated ${sortedM1.length + sortedM2.length} total questions (Module 1: ${sortedM1.length}, Module 2: ${sortedM2.length}). Difficulty sorting applied (Easy → Medium → Hard).`
      );
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to parse JSON. Please verify syntax.');
      setParsedM1(null);
      setParsedM2(null);
    }
  };

  const handleAssembleAndSave = async () => {
    if (!parsedM1 || !parsedM2 || (parsedM1.length === 0 && parsedM2.length === 0)) {
      setValidationError('Please validate your questions before saving.');
      return;
    }

    setIsSaving(true);
    setValidationError('');
    setSaveSuccessMessage('');

    try {
      const allCount = parsedM1.length + parsedM2.length;
      const testId = `scoreup-import-${Date.now()}`;
      const defaultTitle = `Custom Imported SAT Practice Test (${allCount}Q • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`;

      const customTest: CustomPracticeTest = {
        id: testId,
        title: title.trim() || defaultTitle,
        description: `Imported full practice test containing ${allCount} calibrated questions assembled via JSON importer.`,
        category: 'custom',
        badge: 'ScoreUp Custom',
        difficulty,
        durationMinutes: moduleTimeMinutes * 2,
        moduleTimeMinutes,
        module1Questions: parsedM1,
        module2Questions: parsedM2,
        totalQuestions: allCount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveCustomPracticeTest(customTest);
      await onTestSaved();

      setSaveSuccessMessage(
        `Practice Test "${customTest.title}" assembled and saved successfully! It is now available in your practice library below.`
      );
      setTitle('');
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to save practice test.');
    } finally {
      setIsSaving(false);
    }
  };

  const allQuestions = [...(parsedM1 || []), ...(parsedM2 || [])];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Manual / JSON Practice Test Importer
            </h3>
            <p className="text-[11px] text-slate-400">
              Paste raw 44-question arrays or Module 1 / Module 2 question lists to assemble official format tests.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors w-fit"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Load Sample JSON Template</span>
        </button>
      </div>

      {/* Meta Configuration Fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Practice Test Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. October 2026 ScoreUp Staff Curated Practice Test"
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Psychometric Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as 'Standard' | 'Hard' | '750+' | 'Adaptive')
            }
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
          >
            <option value="Standard">Standard Official Bluebook</option>
            <option value="Hard">Adaptive Hard Module</option>
            <option value="750+">750+ Elite Challenge</option>
            <option value="Adaptive">Fully Calibrated Adaptive</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Module Duration
          </label>
          <select
            value={moduleTimeMinutes}
            onChange={(e) => setModuleTimeMinutes(parseInt(e.target.value, 10))}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
          >
            <option value={35}>35 Minutes per Module (Official SAT)</option>
            <option value={20}>20 Minutes (Speed Drill)</option>
            <option value={45}>45 Minutes (Extended Time 1.5x)</option>
          </select>
        </div>
      </div>

      {/* JSON Input Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Pasted Questions JSON</span>
          <span className="text-[10px] text-slate-400 font-normal">
            Accepts Question[] array or {'{ module1: Question[], module2: Question[] }'}
          </span>
        </label>
        <textarea
          rows={7}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`[\n  {\n    "prompt": "If $3x - 4 = 11$, what is $x$?",\n    "domain": "Algebra",\n    "difficulty": "Easy",\n    "type": "multiple_choice",\n    "options": [\n      { "id": "A", "text": "$3$" },\n      { "id": "B", "text": "$5$" },\n      { "id": "C", "text": "$7$" },\n      { "id": "D", "text": "$9$" }\n    ],\n    "correctAnswer": "B",\n    "explanation": "Add 4 then divide by 3."\n  }\n]`}
          className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Validation & Feedback Messages */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {validationSuccess && (
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
          <span>{validationSuccess}</span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMessage('')}
            className="text-emerald-600 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handleValidate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ArrowUpDown className="w-4 h-4 text-blue-500" />
          <span>Validate & Sort Questions (Easy → Hard)</span>
        </button>

        <button
          type="button"
          onClick={handleAssembleAndSave}
          disabled={!parsedM1 || !parsedM2 || isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Assembling Test...' : 'Assemble & Save Full Practice Test'}</span>
        </button>
      </div>

      {/* Difficulty Sorting & Preview Table */}
      {parsedM1 && parsedM2 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Calibrated Test Blueprint Preview ({allQuestions.length} Total Questions)
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setExpandedPreview(!expandedPreview)}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>{expandedPreview ? 'Hide Details' : 'View Question Breakdown'}</span>
              {expandedPreview ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Module Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>Module 1 (Pacing: Easy → Hard)</span>
                <span className="text-emerald-600 font-mono">{parsedM1.length} Qs</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold">
                  Easy: {parsedM1.filter((q) => q.difficulty === 'Easy').length}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 font-semibold">
                  Medium: {parsedM1.filter((q) => q.difficulty === 'Medium').length}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 font-semibold">
                  Hard: {parsedM1.filter((q) => q.difficulty === 'Hard').length}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>Module 2 (Pacing: Easy → Hard)</span>
                <span className="text-blue-600 font-mono">{parsedM2.length} Qs</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold">
                  Easy: {parsedM2.filter((q) => q.difficulty === 'Easy').length}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 font-semibold">
                  Medium: {parsedM2.filter((q) => q.difficulty === 'Medium').length}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 font-semibold">
                  Hard: {parsedM2.filter((q) => q.difficulty === 'Hard').length}
                </span>
              </div>
            </div>
          </div>

          {/* Expanded Question List */}
          {expandedPreview && (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {allQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold flex items-center justify-center shrink-0">
                    {q.number}
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        M{q.module} • {q.domain}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : q.difficulty === 'Medium'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                      <KaTeXRenderer text={q.prompt} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManualTestImporter;

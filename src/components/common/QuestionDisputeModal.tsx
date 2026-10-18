import React, { useState, useEffect } from 'react';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Send,
  Loader2,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';
import { Question } from '../../types';
import { DisputeReason } from '../../types/admin';
import { logDispute } from '../../services/disputeService';
import { useAuth } from '../../context/AuthContext';
import { KaTeXRenderer } from './KaTeXRenderer';

export interface QuestionDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  onSubmitSuccess?: () => void;
}

const REASON_OPTIONS: { id: DisputeReason; label: string; desc: string }[] = [
  {
    id: 'incorrect_answer',
    label: 'Incorrect Answer Key',
    desc: 'The marked correct answer is mathematically incorrect.',
  },
  {
    id: 'typo_or_formatting',
    label: 'Typo or Glitch',
    desc: 'Grammar, numbers, or punctuation errors in prompt/options.',
  },
  {
    id: 'broken_latex',
    label: 'Broken Formula / KaTeX',
    desc: 'An equation is unrendered or missing math symbols.',
  },
  {
    id: 'ambiguous_prompt',
    label: 'Ambiguous / Incomplete',
    desc: 'Necessary problem constraints or values are missing.',
  },
  {
    id: 'explanation_unclear',
    label: 'Unclear Explanation',
    desc: 'The solution steps skip key algebra or are misleading.',
  },
  {
    id: 'other',
    label: 'Other Issue',
    desc: 'Any other concern with this problem.',
  },
];

export const QuestionDisputeModal: React.FC<QuestionDisputeModalProps> = ({
  isOpen,
  onClose,
  question,
  onSubmitSuccess,
}) => {
  const { activeUser } = useAuth();

  const [reason, setReason] = useState<DisputeReason>('incorrect_answer');
  const [description, setDescription] = useState('');
  const [suggestedCorrection, setSuggestedCorrection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('incorrect_answer');
      setDescription('');
      setSuggestedCorrection('');
      setIsSuccess(false);
      setErrorMessage('');
    }
  }, [isOpen, question?.id]);

  if (!isOpen || !question) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please describe the problem you noticed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await logDispute({
        questionId: question.id,
        studentEmail: activeUser?.email || 'student@scoreup.app',
        studentName: activeUser?.firstName || 'Student',
        reason,
        description: description.trim(),
        suggestedCorrection: suggestedCorrection.trim() || undefined,
        questionSnapshot: question,
      });

      setIsSuccess(true);
      onSubmitSuccess?.();
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Report Question Dispute
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Question #{question.number} • {question.domain} ({question.difficulty})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Dispute Report Submitted!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Thank you! Our curriculum review team and psychometric assessment authors will
                inspect this question promptly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Question Brief Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <FileQuestion className="w-3.5 h-3.5" />
                <span>Question Prompt</span>
              </div>
              <div className="line-clamp-3">
                <KaTeXRenderer text={question.prompt} />
              </div>
            </div>

            {/* Reason Radio Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                What is the issue with this problem?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setReason(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      reason === opt.id
                        ? 'border-amber-500/80 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/30 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is incorrect, confusing, or broken about this question..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
              />
            </div>

            {/* Suggested Correction */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Suggested Correction or Alternate Answer{' '}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={suggestedCorrection}
                onChange={(e) => setSuggestedCorrection(e.target.value)}
                placeholder="e.g. Correct answer should be Choice C (-4), or typo in step 2"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Dispute</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestionDisputeModal;

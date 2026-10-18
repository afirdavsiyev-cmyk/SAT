import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  MessageSquare,
  ShieldAlert,
  Save,
} from 'lucide-react';
import { QuestionDisputeReport, DisputeStatus, StudentAdminProfile } from '../../types/admin';
import {
  getDisputes,
  updateDisputeStatus,
  deleteDispute,
} from '../../services/disputeService';
import {
  getAllStudentProfiles,
  resetStudentProgress,
} from '../../services/adminService';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

export const AdminUsersAndBugsTab: React.FC = () => {
  const [subSection, setSubSection] = useState<'disputes' | 'users'>('disputes');

  // Disputes state
  const [disputes, setDisputes] = useState<QuestionDisputeReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all');
  const [expandedDisputeId, setExpandedDisputeId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [isDisputesLoading, setIsDisputesLoading] = useState(false);

  // Users state
  const [students, setStudents] = useState<StudentAdminProfile[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [confirmResetEmail, setConfirmResetEmail] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const loadDisputes = async () => {
    setIsDisputesLoading(true);
    try {
      const data = await getDisputes(statusFilter === 'all' ? undefined : { status: statusFilter });
      setDisputes(data);
    } catch (err) {
      console.error('Failed to load disputes:', err);
    } finally {
      setIsDisputesLoading(false);
    }
  };

  const loadStudents = () => {
    try {
      const profiles = getAllStudentProfiles();
      setStudents(profiles);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  useEffect(() => {
    loadDisputes();
    loadStudents();
  }, [statusFilter]);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: DisputeStatus) => {
    try {
      await updateDisputeStatus(id, newStatus, editingNotes[id]);
      await loadDisputes();
    } catch (err) {
      console.error('Failed to update dispute status:', err);
    }
  };

  // Handle save notes
  const handleSaveNotes = async (id: string) => {
    const dispute = disputes.find((d) => d.id === id);
    if (!dispute) return;
    try {
      await updateDisputeStatus(id, dispute.status, editingNotes[id]);
      await loadDisputes();
    } catch (err) {
      console.error('Failed to save admin notes:', err);
    }
  };

  // Handle delete dispute
  const handleDeleteDispute = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this dispute report?')) return;
    try {
      await deleteDispute(id);
      await loadDisputes();
    } catch (err) {
      console.error('Failed to delete dispute:', err);
    }
  };

  // Handle reset student progress
  const handleResetProgress = async (email?: string) => {
    try {
      await resetStudentProgress(email);
      setConfirmResetEmail(null);
      loadStudents();
      setResetSuccessMessage(
        email ? `Progress for ${email} has been successfully reset.` : 'Global student progress reset.'
      );
      setTimeout(() => setResetSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to reset student progress:', err);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      s.firstName.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub-navigation pill toggle */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-fit">
        <button
          onClick={() => setSubSection('disputes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subSection === 'disputes'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Question Dispute Reports</span>
          {disputes.filter((d) => d.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-extrabold">
              {disputes.filter((d) => d.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubSection('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subSection === 'users'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          <span>Student Accounts & Progress</span>
          <span className="text-[10px] text-slate-400">({students.length})</span>
        </button>
      </div>

      {resetSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-SECTION 1: DISPUTES TRIAGE
         ───────────────────────────────────────────────────────────── */}
      {subSection === 'disputes' && (
        <div className="space-y-4">
          {/* Status filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['all', 'pending', 'in_review', 'resolved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Showing {disputes.length} report{disputes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Disputes List */}
          {isDisputesLoading ? (
            <div className="py-16 text-center text-xs text-slate-500">Loading disputes...</div>
          ) : disputes.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No dispute reports found in this status category.
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((dispute) => {
                const isExpanded = expandedDisputeId === dispute.id;
                return (
                  <div
                    key={dispute.id}
                    className="rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedDisputeId(isExpanded ? null : dispute.id)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                            dispute.status === 'resolved'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : dispute.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-500'
                              : dispute.status === 'in_review'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-slate-500/10 text-slate-500'
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                              {dispute.questionId}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {dispute.reason.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {dispute.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl capitalize ${
                            dispute.status === 'resolved'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : dispute.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                              : dispute.status === 'in_review'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {dispute.status.replace('_', ' ')}
                        </span>
                        <div className="text-slate-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-4 bg-slate-50/30 dark:bg-slate-900/20">
                        {/* Reporter metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-3">
                          <div>
                            Reported by:{' '}
                            <span className="text-slate-700 dark:text-slate-200 font-semibold">
                              {dispute.studentName || 'Student'} ({dispute.studentEmail || 'N/A'})
                            </span>
                          </div>
                          <div>
                            Date:{' '}
                            <span className="text-slate-700 dark:text-slate-200 font-semibold">
                              {new Date(dispute.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Question Snapshot */}
                        {dispute.questionSnapshot && (
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                            <div className="font-bold text-slate-500 text-[10px] uppercase mb-1">
                              Question Snapshot ({dispute.questionSnapshot.domain || 'Math'})
                            </div>
                            <KaTeXRenderer text={dispute.questionSnapshot.prompt} />
                            {dispute.questionSnapshot.correctAnswer && (
                              <div className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Stored Correct Answer: {dispute.questionSnapshot.correctAnswer}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Dispute Details */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">
                            Student Problem Report
                          </label>
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {dispute.description}
                          </div>
                        </div>

                        {dispute.suggestedCorrection && (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase">
                              Suggested Correction
                            </label>
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                              {dispute.suggestedCorrection}
                            </div>
                          </div>
                        )}

                        {/* Admin Resolution & Notes */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">
                            Admin Internal Notes
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={
                                editingNotes[dispute.id] !== undefined
                                  ? editingNotes[dispute.id]
                                  : dispute.adminNotes || ''
                              }
                              onChange={(e) =>
                                setEditingNotes({ ...editingNotes, [dispute.id]: e.target.value })
                              }
                              placeholder="Add resolution notes or action item..."
                              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                            />
                            <button
                              onClick={() => handleSaveNotes(dispute.id)}
                              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStatus(dispute.id, 'resolved')}
                              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            >
                              Mark Resolved
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(dispute.id, 'in_review')}
                              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            >
                              Mark In Review
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(dispute.id, 'rejected')}
                              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                          <button
                            onClick={() => handleDeleteDispute(dispute.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete dispute report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-SECTION 2: STUDENT ACCOUNTS & PROGRESS
         ───────────────────────────────────────────────────────────── */}
      {subSection === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search students by name or email..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <button
              onClick={() => {
                if (
                  confirm(
                    'DANGER: Are you sure you want to reset student question progress and attendance across the entire platform?'
                  )
                ) {
                  handleResetProgress('all');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Cohort Progress</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-900/40">
                    <th className="p-4">Student</th>
                    <th className="p-4">Target / Baseline</th>
                    <th className="p-4">Calibrated Math</th>
                    <th className="p-4">Problems Solved</th>
                    <th className="p-4">Streak</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudents.map((s) => (
                    <tr key={s.email} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.firstName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {s.targetScore}
                        </span>{' '}
                        <span className="text-slate-400">/ {s.baselineScore}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {s.currentEstimatedMath}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {s.totalQuestionsSolved}
                        </span>{' '}
                        <span className="text-slate-400">({s.accuracy}% acc)</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-orange-500">{s.streakDays}d</span>
                      </td>
                      <td className="p-4 text-right">
                        {confirmResetEmail === s.email ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleResetProgress(s.email)}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmResetEmail(null)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmResetEmail(s.email)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersAndBugsTab;

import React, { useState } from 'react';
import { Trophy, Flame, Award, Zap, CheckCircle2 } from 'lucide-react';
import { mockLeaderboardUsers, mockAchievements } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { SlidingTabGroup } from '../common/SlidingTabGroup';

const TABS = [
  { label: 'Global Leaderboard', icon: <Trophy className="w-3.5 h-3.5" /> },
  { label: 'Badges & Achievements', icon: <Award className="w-3.5 h-3.5" /> },
  { label: 'Daily Quests', icon: <Zap className="w-3.5 h-3.5" /> },
];

export const LeaderboardView: React.FC = () => {
  const { userProgress } = useApp();
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ─── Header Banner ────────────────────────────────────────────── */}
      <div className="rounded-3xl p-8 shadow-[0_4px_25px_rgba(245,158,11,0.08)] dark:shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-orange-500/15 via-white to-amber-500/10 dark:bg-[linear-gradient(135deg,rgba(124,45,18,0.5)_0%,rgba(15,23,42,0.8)_50%,rgba(6,78,59,0.4)_100%)] border-2 border-orange-500/25 dark:border-white/[0.08] backdrop-blur-xl transition-all">
        {/* Ambient glow orbs */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 text-center sm:text-left relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-500/20 dark:border-orange-400/30 dark:text-orange-300 shadow-sm">
            <Trophy className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Weekly SAT Ranks & Achievements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Global Leaderboard</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md">
            Earn XP by solving practice questions, completing Bluebook exams, and maintaining your daily streak.
          </p>
        </div>

        {/* User Rank Card */}
        <div className="relative z-10 p-4 rounded-2xl flex items-center space-x-4 flex-shrink-0 bg-gradient-to-r from-orange-500/15 to-amber-500/10 border border-orange-300/60 text-orange-950 shadow-sm dark:bg-emerald-500/15 dark:border-emerald-400/40 dark:text-white backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-orange-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-extrabold text-lg flex items-center justify-center shadow-md dark:shadow-[0_0_18px_rgba(16,185,129,0.5)]">
            #4
          </div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">Your Current Rank</div>
            <div className="text-xs text-orange-700 dark:text-emerald-300 font-mono font-bold mt-0.5">
              {userProgress.xp} XP • {userProgress.streakDays}d Streak
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sliding Tab Group ─────────────────────────────────────────── */}
      <SlidingTabGroup
        tabs={TABS}
        activeIndex={tabIndex}
        onChange={setTabIndex}
        className="w-full sm:w-auto"
        size="md"
      />

      {/* ─── View 1: Global Leaderboard Table ─────────────────────────── */}
      {tabIndex === 0 && (
        <div className="rounded-3xl p-6 shadow-[0_4px_20px_rgba(245,158,11,0.06)] dark:shadow-2xl space-y-4 bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-white/[0.08] backdrop-blur-xl">
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-extrabold px-4 uppercase tracking-widest border-b border-amber-900/10 dark:border-white/[0.06] pb-3">
            <span>Rank & Scholar</span>
            <span>Est. Score</span>
            <span>Total XP</span>
          </div>

          <div className="space-y-2">
            {mockLeaderboardUsers.map((u) => (
              <div
                key={u.id}
                className={`p-4 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                  u.isCurrentUser
                    ? 'bg-orange-50/80 border border-orange-300 shadow-sm dark:bg-emerald-950/30 dark:border-emerald-500/40 scale-[1.01]'
                    : 'bg-slate-50/80 hover:bg-slate-100/80 border border-amber-900/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:border-white/[0.07]'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`font-mono font-extrabold text-sm w-6 ${
                    u.rank === 1 ? 'text-amber-600 dark:text-yellow-400 text-base font-black' :
                    u.rank === 2 ? 'text-slate-700 dark:text-slate-300 font-bold' :
                    u.rank === 3 ? 'text-orange-700 dark:text-amber-500 font-bold' : 'text-slate-500'
                  }`}>
                    #{u.rank}
                  </span>
                  <span className="text-xl">{u.avatar}</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                      <span>{u.name}</span>
                      {u.isCurrentUser && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 dark:bg-emerald-500/25 dark:border-emerald-400/50 dark:text-emerald-300">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 font-mono mt-0.5">
                      <span className="flex items-center text-orange-600 dark:text-orange-400 font-semibold">
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500 mr-0.5" />
                        {u.streak}d
                      </span>
                      <span>•</span>
                      <span className="text-orange-700 dark:text-emerald-400 font-semibold">{u.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right font-mono">
                  <div className="hidden sm:block">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">SAT Est.</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{u.score}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">XP</span>
                    <span className="font-extrabold text-orange-600 dark:text-emerald-300 text-sm">{u.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── View 2: Achievements Grid ─────────────────────────────────── */}
      {tabIndex === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mockAchievements.map((a) => (
            <div
              key={a.id}
              className={`p-6 rounded-3xl flex flex-col justify-between space-y-4 transition-all duration-300 ${
                a.unlocked
                  ? 'bg-white dark:bg-[#0c1424] border border-orange-300/80 dark:border-emerald-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.06)]'
                  : 'bg-white/60 dark:bg-white/[0.03] border border-amber-900/10 dark:border-white/[0.06] opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl">{a.icon}</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  a.unlocked
                    ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/40'
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-slate-400'
                }`}>
                  {a.unlocked ? 'Unlocked' : 'In Progress'}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{a.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{a.description}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-amber-900/10 dark:border-white/[0.07]">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Progress</span>
                  <span className="text-orange-600 dark:text-emerald-400 font-bold">{a.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-950/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-emerald-500 dark:to-teal-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${a.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── View 3: Daily Quests ──────────────────────────────────────── */}
      {tabIndex === 2 && (
        <div className="rounded-3xl p-6 shadow-[0_4px_20px_rgba(245,158,11,0.06)] dark:shadow-2xl space-y-4 bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-white/[0.08]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Today's Daily Quests</h3>

          <div className="space-y-3">
            {/* Completed quest */}
            <div className="p-4 rounded-2xl flex items-center justify-between bg-orange-50/60 dark:bg-emerald-950/30 border border-orange-300 dark:border-emerald-500/35">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Solve 10 Math Questions with Desmos</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Reward: +150 XP</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full flex-shrink-0 bg-orange-100 text-orange-900 border border-orange-300 dark:bg-emerald-500/20 dark:border-emerald-400/40 dark:text-emerald-300">
                Completed ✓
              </span>
            </div>

            {/* Incomplete quest */}
            <div className="p-4 rounded-2xl flex items-center justify-between bg-slate-50/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-400 dark:border-slate-700 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Complete 1 Bluebook Timed Practice Module</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Reward: +300 XP</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full flex-shrink-0 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-400">
                0 / 1 Done
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

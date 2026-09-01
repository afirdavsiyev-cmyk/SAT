import React, { useState } from 'react';
import { Trophy, Flame, Award, Zap, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { mockLeaderboardUsers, mockAchievements } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const LeaderboardView: React.FC = () => {
  const { userProgress } = useApp();
  const [tab, setTab] = useState<'global' | 'achievements' | 'quests'>('global');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-950/80 via-slate-900 to-emerald-950/80 border border-slate-800 p-8 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-950 text-orange-400 text-xs font-bold border border-orange-800/40">
            <Trophy className="w-4 h-4 text-orange-400" />
            <span>Weekly SAT Ranks & Achievements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Global Leaderboard</h1>
          <p className="text-slate-300 text-sm">
            Earn XP by solving practice questions, completing Bluebook exams, and maintaining your daily streak.
          </p>
        </div>

        {/* User Rank Card */}
        <div className="bg-slate-950/90 border border-emerald-500/40 p-4 rounded-2xl flex items-center space-x-4 shadow-glow-emerald">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-lg flex items-center justify-center">
            #4
          </div>
          <div>
            <div className="font-extrabold text-white text-sm">Your Current Rank</div>
            <div className="text-xs text-emerald-400 font-mono font-bold">{userProgress.xp} XP • {userProgress.streakDays}d Streak</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold w-full sm:w-auto">
        <button
          onClick={() => setTab('global')}
          className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all ${
            tab === 'global' ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Global Leaderboard</span>
        </button>

        <button
          onClick={() => setTab('achievements')}
          className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all ${
            tab === 'achievements' ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Badges & Achievements</span>
        </button>

        <button
          onClick={() => setTab('quests')}
          className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all ${
            tab === 'quests' ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Daily Quests</span>
        </button>
      </div>

      {/* View 1: Global Leaderboard Table */}
      {tab === 'global' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold px-4 uppercase tracking-wider">
            <span>Rank & Scholar</span>
            <span>Est. Score</span>
            <span>Weekly XP</span>
          </div>

          <div className="space-y-2">
            {mockLeaderboardUsers.map((u) => (
              <div
                key={u.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  u.isCurrentUser
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-glow-emerald scale-[1.01]'
                    : 'bg-slate-950 border-slate-800/80 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`font-mono font-extrabold text-sm w-6 ${u.rank === 1 ? 'text-yellow-400 text-base' : u.rank === 2 ? 'text-slate-300' : u.rank === 3 ? 'text-amber-500' : 'text-slate-500'}`}>
                    #{u.rank}
                  </span>
                  <span className="text-xl">{u.avatar}</span>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center space-x-2">
                      <span>{u.name}</span>
                      {u.isCurrentUser && (
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">YOU</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-2 font-mono mt-0.5">
                      <span className="flex items-center text-orange-400">
                        <Flame className="w-3 h-3 fill-orange-400 mr-0.5" />
                        {u.streak}d
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{u.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right font-mono">
                  <div className="hidden sm:block">
                    <span className="text-xs text-slate-400 block font-semibold">SAT Est.</span>
                    <span className="font-extrabold text-white text-sm">{u.score}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Total XP</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{u.xp} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Achievements Grid */}
      {tab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mockAchievements.map((a) => (
            <div
              key={a.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                a.unlocked
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-glow-emerald'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl">{a.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  a.unlocked ? 'bg-emerald-950 text-emerald-400 border-emerald-800/50' : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  {a.unlocked ? 'Unlocked' : 'In Progress'}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-white text-base">{a.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{a.description}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Progress</span>
                  <span className="text-emerald-400">{a.progress}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${a.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Daily Quests */}
      {tab === 'quests' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">Today's Daily Quests</h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-xs">Solve 10 Math Questions with Desmos</h4>
                  <p className="text-[11px] text-slate-400">Reward: +150 XP</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full">
                Completed
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-xs">Complete 1 Bluebook Timed Practice Module</h4>
                  <p className="text-[11px] text-slate-400">Reward: +300 XP</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full">
                0 / 1 Done
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

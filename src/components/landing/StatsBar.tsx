import React from 'react';
import { TrendingUp, Users, CheckCircle2, Award } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-amber-500 dark:text-emerald-400" />,
      value: '1,450,000+',
      label: 'Questions Solved',
      sub: 'Real Bluebook format'
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500 dark:text-teal-400" />,
      value: '42,000+',
      label: 'Active SAT Prep Students',
      sub: 'Across 85 countries'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-500 dark:text-emerald-400" />,
      value: '+140 Pts',
      label: 'Average Score Boost',
      sub: 'Within 30 days'
    },
    {
      icon: <Award className="w-6 h-6 text-orange-500 dark:text-teal-400" />,
      value: '98.4%',
      label: 'Satisfaction Rate',
      sub: 'Rated 4.9/5 stars'
    }
  ];

  return (
    <div className="relative border-y border-amber-900/10 dark:border-slate-800/80 bg-amber-50/25 dark:bg-slate-950/60 py-12 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx * 120} threshold={0.1}>
              <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-amber-900/10 dark:border-emerald-500/40 hover:border-amber-500/40 dark:hover:border-emerald-500/60 transition-all h-full shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-300/40 dark:border-slate-800 mb-3 shadow-sm">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{stat.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.sub}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

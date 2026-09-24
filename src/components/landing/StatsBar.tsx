import React from 'react';
import { TrendingUp, Users, CheckCircle2, Award } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      value: '1,450,000+',
      label: 'Questions Solved',
      sub: 'Real Bluebook format'
    },
    {
      icon: <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      value: '42,000+',
      label: 'Active SAT Prep Students',
      sub: 'Across 85 countries'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      value: '+140 Pts',
      label: 'Average Score Boost',
      sub: 'Within 30 days'
    },
    {
      icon: <Award className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      value: '98.4%',
      label: 'Satisfaction Rate',
      sub: 'Rated 4.9/5 stars'
    }
  ];

  return (
    <div className="relative border-y border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/60 py-12 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx * 120} threshold={0.1} className="h-full">
              <CardContainer className="inter-var w-full h-full">
                <CardBody className="bg-white/95 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.12] dark:bg-slate-900/90 dark:border-white/[0.15] border-black/[0.08] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border transition-all h-full w-full shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-xl">
                  <CardItem translateZ="50" className="p-3 rounded-xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 mb-3 shadow-sm">
                    {stat.icon}
                  </CardItem>
                  <CardItem translateZ="60" className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </CardItem>
                  <CardItem as="div" translateZ="35" className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {stat.label}
                  </CardItem>
                  <CardItem as="div" translateZ="25" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {stat.sub}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

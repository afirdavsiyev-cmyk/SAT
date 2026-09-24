import React from 'react';
import { Play, ExternalLink, Video, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export const YouTubeBanner: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal delay={0} threshold={0.1}>
          <CardContainer className="inter-var w-full">
            <CardBody className="relative group/card rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-red-100/80 via-white to-slate-50 dark:from-red-950/70 dark:via-slate-900 dark:to-slate-950 border border-red-200/80 dark:border-red-500/30 dark:hover:shadow-2xl dark:hover:shadow-red-500/[0.15] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              
              {/* Subtle Background Glow */}
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Left Text Info */}
              <div className="space-y-4 max-w-2xl text-center md:text-left">
                <CardItem
                  translateZ="50"
                  className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800/40 shadow-xs"
                >
                  <Video className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>FREE VIDEO COURSES & WALKTHROUGHS</span>
                </CardItem>

                <CardItem
                  as="h3"
                  translateZ="65"
                  className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
                >
                  Get Free SAT Math Courses on <br />
                  <span className="bg-gradient-to-r from-red-600 via-rose-500 to-rose-600 dark:from-red-400 dark:via-rose-300 dark:to-rose-400 bg-clip-text text-transparent">
                    YouTube • ScoreUp Academy
                  </span>
                </CardItem>

                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                >
                  Watch step-by-step video solutions, Desmos calculator speed tricks, full test walkthroughs, and hard SAT Math concept breakdowns—100% free on YouTube!
                </CardItem>

                <CardItem
                  translateZ="45"
                  className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1 font-medium"
                >
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Desmos Calculator Speed Hacks</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Full Test Walkthroughs</span>
                  </div>
                </CardItem>
              </div>

              {/* Right Action Card / Button */}
              <CardItem
                translateZ="75"
                className="flex flex-col items-center justify-center w-full md:w-auto space-y-3"
              >
                <a
                  href="https://www.youtube.com/@ScoreUp_Academy_SAT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-extrabold text-base shadow-lg shadow-red-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  </div>
                  <span>Watch Free YouTube Course</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  channel: @ScoreUp_Academy_SAT
                </span>
              </CardItem>

            </CardBody>
          </CardContainer>
        </ScrollReveal>
      </div>
    </section>
  );
};

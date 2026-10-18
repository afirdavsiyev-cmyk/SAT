import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ViewSkeletonProps {
  title?: string;
}

export const ViewSkeleton: React.FC<ViewSkeletonProps> = ({ title = 'Loading...' }) => {
  return (
    <div className="w-full min-h-[60vh] p-6 sm:p-8 flex flex-col items-center justify-center animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        {/* Content Skeleton Card */}
        <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-3">
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewSkeleton;

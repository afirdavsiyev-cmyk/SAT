import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  CheckCircle2,
  Clock,
  Calculator,
  Layers,
  BarChart2,
  Compass,
  Sparkles,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Video,
  Check,
  Maximize2,
  BookOpen,
  CheckSquare
} from 'lucide-react';
import { VIDEO_LESSONS, VIDEO_DOMAINS, VideoLesson } from '../../data/videoLessonsData';
import { LessonLeftWing, LessonRightWing } from './LessonGeometricWings';
import { LessonPracticeTasks } from './LessonPracticeTasks';
import { ThemeToggle } from '../common/ThemeToggle';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

const WATCHED_STORAGE_KEY = 'scoreup_watched_lessons';

export const MathDesmosView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<VideoLesson | null>(null);
  const [watchedLessons, setWatchedLessons] = useState<string[]>([]);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [modalTab, setModalTab] = useState<'theory' | 'summary' | 'practice'>('theory');

  const videoRef = useRef<HTMLVideoElement>(null);

  // Load watched state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WATCHED_STORAGE_KEY);
      if (saved) {
        setWatchedLessons(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Lock body scroll when modal is active so full-page experience is seamless
  useEffect(() => {
    if (activeLesson) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeLesson]);

  const toggleWatched = (lessonId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWatchedLessons(prev => {
      const updated = prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleOpenLesson = (lesson: VideoLesson) => {
    setActiveLesson(lesson);
    setPlaybackRate(1);
    setModalTab('theory');
  };

  const handleCloseModal = () => {
    setActiveLesson(null);
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIndex = VIDEO_LESSONS.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < VIDEO_LESSONS.length - 1) {
      setActiveLesson(VIDEO_LESSONS[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!activeLesson) return;
    const currentIndex = VIDEO_LESSONS.findIndex(l => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(VIDEO_LESSONS[currentIndex - 1]);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        videoRef.current.requestFullscreen?.();
      }
    }
  };

  // Filter lessons
  const filteredLessons = VIDEO_LESSONS.filter(lesson => {
    const matchesDomain = selectedDomain === 'all' || lesson.domain === selectedDomain;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesDomain;

    const matchesSearch =
      lesson.title.toLowerCase().includes(q) ||
      lesson.topic.toLowerCase().includes(q) ||
      lesson.description.toLowerCase().includes(q) ||
      lesson.satFocus.toLowerCase().includes(q) ||
      lesson.keyConcepts.some(c => c.toLowerCase().includes(q));

    return matchesDomain && matchesSearch;
  });

  const completedCount = watchedLessons.length;
  const progressPercent = Math.round((completedCount / VIDEO_LESSONS.length) * 100);

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'algebra':
        return <Calculator className="w-3.5 h-3.5" />;
      case 'advanced_math':
        return <Layers className="w-3.5 h-3.5" />;
      case 'problem_solving':
        return <BarChart2 className="w-3.5 h-3.5" />;
      case 'geometry_trig':
        return <Compass className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fadeIn">
      {/* ─── HERO HEADER ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-white to-teal-500/10 dark:from-emerald-950/80 dark:via-slate-900 dark:to-teal-950/40 border border-emerald-500/30 dark:border-emerald-500/40 shadow-sm transition-all">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-700/60 text-xs font-bold shadow-xs">
            <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>DIGITAL SAT VIDEO MASTERCLASS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                SAT Math Masterclass
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                26 high-impact video lessons covering every concept from MathBook 2.0—from foundational algebra formulas and linear systems to advanced quadratics, statistics, and geometry.
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm min-w-[220px]">
              <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Course Progress</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {completedCount}/{VIDEO_LESSONS.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ─── SEARCH & DOMAIN FILTERS ──────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Domain Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {VIDEO_DOMAINS.map(cat => {
              const isActive = selectedDomain === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDomain(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 border shadow-xs ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50'
                  }`}
                >
                  {cat.id === 'all' && <Sparkles className="w-3.5 h-3.5" />}
                  {cat.id === 'course_intro' && <Compass className="w-3.5 h-3.5" />}
                  {cat.id === 'algebra' && <Calculator className="w-3.5 h-3.5" />}
                  {cat.id === 'advanced_math' && <Layers className="w-3.5 h-3.5" />}
                  {cat.id === 'problem_solving' && <BarChart2 className="w-3.5 h-3.5" />}
                  {cat.id === 'geometry_trig' && <Compass className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topics, formulas, or lessons..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredLessons.length}</strong> of {VIDEO_LESSONS.length} video lessons
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              Clear search filter
            </button>
          )}
        </div>
      </div>

      {/* ─── VIDEO LESSONS GRID ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => {
          const isWatched = watchedLessons.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              onClick={() => handleOpenLesson(lesson)}
              className="group cursor-pointer flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={lesson.thumbnailUrl}
                  alt={lesson.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[11px] font-bold flex items-center space-x-1 shadow-xs">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span>{lesson.duration}</span>
                </div>

                {/* Domain Pill on Thumbnail */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center space-x-1 border border-white/10 shadow-xs">
                    {getDomainIcon(lesson.domain)}
                    <span>{lesson.domainLabel}</span>
                  </span>
                </div>

                {/* Watched Status Badge */}
                {isWatched && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-extrabold flex items-center space-x-1 shadow-md">
                    <Check className="w-3 h-3" />
                    <span>WATCHED</span>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-emerald-500 transition-all duration-300">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {lesson.lessonNumber === 0 ? 'ORIENTATION' : `LESSON ${lesson.lessonNumber}`}
                    </span>
                    <span className="font-semibold text-slate-400">{lesson.topic}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                {/* Key Concept Chips (Top 2) */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {lesson.keyConcepts.slice(0, 2).map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium truncate max-w-full"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={e => toggleWatched(lesson.id, e)}
                      className={`text-[11px] font-semibold flex items-center space-x-1.5 px-2 py-1 rounded-lg transition-colors ${
                        isWatched
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isWatched ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span>{isWatched ? 'Completed' : 'Mark watched'}</span>
                    </button>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Watch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── YOUTUBE BANNER ───────────────────────────────────────────── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-red-500/10 via-white to-rose-500/10 dark:from-red-950/40 dark:via-slate-900 dark:to-slate-900 border border-red-500/30 dark:border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-red-600 dark:text-red-400">
            <Video className="w-3.5 h-3.5" />
            <span>OFFICIAL SCOREUP ACADEMY CHANNEL</span>
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white">
            Looking for more live test walkthroughs?
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Watch real Digital SAT test solving sessions, speed challenges, and interactive Q&amp;A directly on YouTube.
          </p>
        </div>
        <a
          href="https://www.youtube.com/@ScoreUp_Academy_SAT"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:shadow-red-500/30 whitespace-nowrap"
        >
          <span>Open YouTube Course</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* ─── FULLSCREEN THEATER VIDEO PLAYER ──────────────────────────── */}
      {activeLesson && createPortal(
        <div className="fixed inset-0 z-[99999] w-screen h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
          {/* Top Cinema Bar */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-3 truncate">
              <button
                onClick={handleCloseModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Lessons</span>
              </button>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                {activeLesson.lessonNumber === 0 ? 'ORIENTATION' : `LESSON ${activeLesson.lessonNumber}`}
              </span>

              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
                {activeLesson.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button */}
              <ThemeToggle size="sm" />

              <button
                onClick={() => toggleWatched(activeLesson.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  watchedLessons.includes(activeLesson.id)
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {watchedLessons.includes(activeLesson.id) ? 'Completed' : 'Mark Watched'}
                </span>
              </button>

              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── THEATER VIDEO STAGE (FLANKED WITH GEOMETRIC WINGS) ─── */}
          <div className="relative w-full py-4 md:py-6 px-3 md:px-6 bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/80 dark:from-slate-950 dark:via-[#070b14] dark:to-slate-950 text-slate-900 dark:text-white border-b border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-inner transition-colors">
            {/* Ambient Background Math Grid */}
            <div 
              className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%2310b981' stroke-width='0.75'/%3E%3C/svg%3E")`
              }}
            />

            {/* Soft Ambient Radiant Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-emerald-500/10 dark:bg-emerald-500/12 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 lg:gap-6">
              {/* Left Geometric Wing */}
              <LessonLeftWing lesson={activeLesson} />

              {/* Centered Flexible 16:9 Video Container */}
              <div className="w-full flex-1 min-w-0 max-w-4xl flex flex-col items-center justify-center shrink-0">
                <div className="relative w-full aspect-video min-h-[260px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[440px] max-h-[500px] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 dark:bg-black border border-slate-300 dark:border-slate-700 shadow-2xl shadow-slate-300/50 dark:shadow-emerald-500/10 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={activeLesson.videoUrl}
                    poster={activeLesson.thumbnailUrl}
                    controls
                    autoPlay
                    playsInline
                    onEnded={() => {
                      if (!watchedLessons.includes(activeLesson.id)) {
                        toggleWatched(activeLesson.id);
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Right Geometric Wing */}
              <LessonRightWing lesson={activeLesson} />
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="px-4 md:px-8 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Speed:</span>
              {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    playbackRate === speed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrevLesson}
                disabled={VIDEO_LESSONS.findIndex(l => l.id === activeLesson.id) === 0}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Lesson</span>
              </button>

              <button
                onClick={handleNextLesson}
                disabled={VIDEO_LESSONS.findIndex(l => l.id === activeLesson.id) === VIDEO_LESSONS.length - 1}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-500 font-bold"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                title="Browser Fullscreen"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── LESSON CONTENT, THEORY, SUMMARY & TASKS ─────────────────────── */}
          <div className="max-w-5xl mx-auto w-full p-6 md:p-10 space-y-8">
            {/* Header with Domain, Duration & Detailed Description */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold border ${activeLesson.domainColor}`}>
                  {activeLesson.domainLabel}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{activeLesson.topic}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-mono">{activeLesson.duration}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeLesson.title}
              </h2>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                {activeLesson.detailedDescription || activeLesson.description}
              </p>
            </div>

            {/* Navigation Tabs for Content */}
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-1">
              <button
                onClick={() => setModalTab('theory')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  modalTab === 'theory'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Theory &amp; Formulas</span>
              </button>

              <button
                onClick={() => setModalTab('summary')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  modalTab === 'summary'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Video Summary &amp; Strategy</span>
              </button>

              <button
                onClick={() => setModalTab('practice')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  modalTab === 'practice'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Practice Tasks &amp; Exercises</span>
                {activeLesson.exercises && activeLesson.exercises.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    modalTab === 'practice' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold'
                  }`}>
                    {activeLesson.exercises.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: THEORY & FORMULAS */}
            {modalTab === 'theory' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Theory Overview */}
                {activeLesson.theory?.overview && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Theoretical Foundations
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeLesson.theory.overview}
                    </p>
                  </div>
                )}

                {/* Formulas Grid */}
                {activeLesson.theory?.formulas && activeLesson.theory.formulas.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Key Formulas &amp; Equations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {activeLesson.theory.formulas.map((f, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-emerald-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{f.label}</span>
                            <span className="text-[10px] text-slate-400 font-mono">SAT Reference</span>
                          </div>
                          <div className="py-1 px-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/80 text-sm overflow-x-auto text-slate-900 dark:text-white">
                            <KaTeXRenderer math={f.latex} inline={false} />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {f.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core Rules List */}
                {activeLesson.theory?.coreRules && activeLesson.theory.coreRules.length > 0 && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Core Mathematical Axioms &amp; College Board Rules
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                      {activeLesson.theory.coreRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><KaTeXRenderer text={rule} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Traps Box */}
                {activeLesson.commonTraps && activeLesson.commonTraps.length > 0 && (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Common College Board Traps to Avoid</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200 list-disc list-inside">
                      {activeLesson.commonTraps.map((trap, idx) => (
                        <li key={idx}><KaTeXRenderer text={trap} /></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VIDEO SUMMARY & STRATEGY */}
            {modalTab === 'summary' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Executive Takeaways */}
                {activeLesson.summary?.takeaways && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Executive Summary &amp; Key Takeaways
                    </h4>
                    <div className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                      {activeLesson.summary.takeaways.map((point, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span><KaTeXRenderer text={point} /></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step-by-Step Solving Workflow */}
                {activeLesson.summary?.workflow && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Test-Day 3-Step Solving Workflow
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activeLesson.summary.workflow.map((step, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          <span className="font-bold text-teal-600 dark:text-teal-400 block text-[11px]">Phase {idx + 1}</span>
                          <p className="leading-relaxed"><KaTeXRenderer text={step} /></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Concepts Grid */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Core Competencies Tested
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeLesson.keyConcepts.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-200 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timing & Exam Strategy Box */}
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>Pacing &amp; Time Allocation Guideline</span>
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    {activeLesson.summary?.timingTip || 'Target spending 60 to 90 seconds on these questions during your first pass.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: PRACTICE TASKS & EXERCISES */}
            {modalTab === 'practice' && (
              <div className="animate-fadeIn">
                <LessonPracticeTasks
                  exercises={activeLesson.exercises || []}
                  lessonTitle={activeLesson.title}
                />
              </div>
            )}
          </div>
        </div>
      , document.body)}

    </div>
  );
};

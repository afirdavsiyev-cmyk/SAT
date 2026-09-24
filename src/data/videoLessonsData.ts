import videoLessonsJson from './videoLessons.json';

export interface LessonFormula {
  label: string;
  latex: string;
  description: string;
}

export interface LessonTheory {
  overview: string;
  formulas: LessonFormula[];
  coreRules: string[];
}

export interface LessonSummary {
  takeaways: string[];
  workflow: string[];
  timingTip: string;
}

export interface LessonExercise {
  id: string;
  difficulty?: 'Easy' | 'Easy-Medium' | 'Medium' | 'Medium-Hard' | 'Hard';
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  desmosShortcut?: string;
  hint?: string;
}

export interface VideoLesson {
  id: string;
  lessonNumber: number;
  title: string;
  topic: string;
  domain: 'course_intro' | 'algebra' | 'advanced_math' | 'problem_solving' | 'geometry_trig';
  domainLabel: string;
  domainColor: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  detailedDescription?: string;
  keyConcepts: string[];
  satFocus: string;
  commonTraps?: string[];
  desmosTip?: string;
  theory?: LessonTheory;
  summary?: LessonSummary;
  exercises?: LessonExercise[];
}

export interface VideoDomainCategory {
  id: string;
  label: string;
  count: number;
  icon: string;
  color?: string;
}

export const VIDEO_DOMAINS: VideoDomainCategory[] = [
  { id: 'all', label: 'All Lessons', count: 26, icon: 'Sparkles' },
  { id: 'course_intro', label: 'Orientation', count: 1, icon: 'Compass', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400' },
  { id: 'algebra', label: 'Algebra', count: 6, icon: 'Calculator', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400' },
  { id: 'advanced_math', label: 'Advanced Math', count: 6, icon: 'Layers', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400' },
  { id: 'problem_solving', label: 'Problem Solving', count: 7, icon: 'BarChart2', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-600 dark:text-yellow-400' },
  { id: 'geometry_trig', label: 'Geometry & Trig', count: 6, icon: 'Compass', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' },
];

export const VIDEO_LESSONS: VideoLesson[] = videoLessonsJson as VideoLesson[];

export function getVideoLessonById(id: string): VideoLesson | undefined {
  return VIDEO_LESSONS.find(v => v.id === id);
}

export function getLessonsByDomain(domain: string): VideoLesson[] {
  if (domain === 'all') return VIDEO_LESSONS;
  return VIDEO_LESSONS.filter(v => v.domain === domain);
}

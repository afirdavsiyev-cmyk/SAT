import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserOnboardingProfile } from '../../types/auth';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Globe,
  GraduationCap,
  Target,
  Trophy,
  Flame,
  Heart,
  HelpCircle,
} from 'lucide-react';

const COUNTRIES = [
  'United States',
  'Uzbekistan',
  'Kazakhstan',
  'Canada',
  'United Kingdom',
  'South Korea',
  'India',
  'Turkey',
  'Germany',
  'United Arab Emirates',
  'Vietnam',
  'China',
  'Singapore',
  'Azerbaijan',
  'Kyrgyzstan',
  'Tajikistan',
  'Poland',
  'Other',
];

const AGE_RANGES = ['Under 13', '13–15', '16–17', '18–24', '25+'];

const PREVIOUS_SCORES = [
  '200–399',
  '400–499',
  '500–599',
  '600–649',
  '650–699',
  '700–749',
  '750–799',
  '800',
  "I don't know",
];

const DREAM_SCORES = ['600+', '650+', '700+', '750+', '780+', '800'];

const MAIN_REASONS = [
  { id: 'dream_uni', label: 'Get into my dream university', icon: '🎓' },
  { id: 'scholarship', label: 'Win a scholarship', icon: '💰' },
  { id: 'highest_score', label: 'Get the highest score I can', icon: '🚀' },
  { id: 'improve_score', label: 'Improve my current score', icon: '📈' },
  { id: 'prove_myself', label: 'Prove to myself what I can achieve', icon: '🏆' },
  { id: 'family_proud', label: 'Make my parents proud', icon: '👨‍👩‍👦' },
  { id: 'study_abroad', label: 'Study abroad', icon: '🌎' },
  { id: 'future_opps', label: 'Open more opportunities for my future', icon: '🔓' },
  { id: 'figuring_out', label: "I'm still figuring it out", icon: '🤔' },
  { id: 'other', label: 'Other', icon: '✨' },
];

const MEANING_OPTIONS = [
  'Better university options',
  'Scholarship opportunities',
  'Studying abroad',
  'Personal achievement',
  'More confidence',
  'Making my family proud',
  'Better future opportunities',
  'Other',
];

const STUDENT_TRAITS = [
  { label: 'Highly motivated', icon: '🔥' },
  { label: 'Goal-oriented', icon: '🎯' },
  { label: 'I learn quickly', icon: '🧠' },
  { label: 'I work hard but need structure', icon: '💪' },
  { label: 'I procrastinate sometimes', icon: '😅' },
  { label: 'I need to improve my consistency', icon: '🐢' },
  { label: "I'm not sure yet", icon: '🤷' },
];

const BIGGEST_MOTIVATIONS = [
  'My future',
  'My dream university',
  'Scholarship',
  'My family',
  'Competition with others',
  'Proving myself',
  'Financial opportunities',
  'Personal growth',
];

const HEAR_ABOUT_OPTIONS = [
  'YouTube',
  'Instagram',
  'TikTok',
  'Telegram',
  'Google',
  'Friend',
  'Teacher',
  'School',
  'Other',
];

export const OnboardingWizardModal: React.FC = () => {
  const { user, isOnboardingModalOpen, closeOnboardingModal, saveOnboardingProfile } = useAuth();
  const { setCurrentView } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    email: user?.email || '',
    password: '',
    ageRange: '16–17',
    country: 'United States',
    takenBefore: 'No' as 'Yes' | 'No',
    latestScore: '600–649',
    targetScore: '780+',
    mainReason: 'Get into my dream university',
    meaning: 'Scholarship opportunities',
    studentType: 'Goal-oriented',
    biggestMotivation: 'My dream university',
    hearAbout: 'YouTube',
  });

  // Pre-fill fields whenever user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.name?.split(' ')[0] || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  if (!isOnboardingModalOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else if (step === 3) {
      // Transition to Step 4 Commitment Reveal
      setStep(4);
      setIsRevealing(true);

      const completedProfile: UserOnboardingProfile = {
        firstName: formData.firstName.trim() || 'Student',
        email: formData.email,
        ageRange: formData.ageRange,
        country: formData.country,
        takenBefore: formData.takenBefore,
        latestScore: formData.takenBefore === 'Yes' ? formData.latestScore : undefined,
        targetScore: formData.targetScore,
        mainReason: formData.mainReason,
        meaning: formData.meaning,
        studentType: formData.studentType,
        biggestMotivation: formData.biggestMotivation,
        hearAbout: formData.hearAbout,
        completedAt: new Date().toISOString(),
      };

      saveOnboardingProfile(completedProfile);

      // 2.5s timer before concluding and taking student to study hub
      setTimeout(() => {
        setIsRevealing(false);
        closeOnboardingModal();
        setCurrentView('dashboard');
      }, 2600);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) {
      setStep((s) => s - 1);
    }
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/20 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Header Bar: Step indicator, Badge & Close Button */}
        {step < 4 && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Step {step} of 3
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/30">
                {step === 1 ? 'Profile Calibration' : step === 2 ? 'Score Target' : 'Student Mindset'}
              </span>
            </div>
            <button
              type="button"
              onClick={closeOnboardingModal}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Step Progress Bar */}
        {step < 4 && (
          <div className="mb-6 space-y-1.5">
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ─── STEP 1: Account Credentials & Basics ───────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Let's customize your SAT journey
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tell us about yourself so we can calibrate your learning roadmap.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Alex"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@scoreup.app"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Password field only if not OAuth signed in */}
              {user?.provider === 'email' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password (Optional update)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age Range
                  </label>
                  <select
                    value={formData.ageRange}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {AGE_RANGES.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: SAT Background & Score Targets ────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Your SAT Math Ambition
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Where are you now, and what score will unlock your future?
              </p>
            </div>

            <div className="space-y-4">
              {/* Have you taken SAT before */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Have you taken the SAT before?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Yes', 'No'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, takenBefore: opt })}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formData.takenBefore === opt
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Latest score if taken before */}
              {formData.takenBefore === 'Yes' && (
                <div className="animate-in fade-in">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    What was your latest SAT Math score?
                  </label>
                  <select
                    value={formData.latestScore}
                    onChange={(e) => setFormData({ ...formData, latestScore: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {PREVIOUS_SCORES.map((score) => (
                      <option key={score} value={score}>
                        {score}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dream SAT Math score */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  What's your dream SAT Math score? ⭐
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DREAM_SCORES.map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetScore: score })}
                      className={`py-3 rounded-2xl text-sm font-extrabold border transition-all ${
                        formData.targetScore === score
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:from-emerald-500/20 dark:to-teal-500/10 dark:text-emerald-400 shadow-sm ring-2 ring-emerald-500/20 dark:ring-emerald-400/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Motivation & Student Mindset ────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Your Motivation & Mindset ⭐
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                What drives you to conquer digital SAT math?
              </p>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {/* Main Reason for studying */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  What is your main reason for studying for the SAT? ⭐
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MAIN_REASONS.map((reason) => (
                    <button
                      key={reason.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, mainReason: reason.label })}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-center space-x-2 ${
                        formData.mainReason === reason.label
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">{reason.icon}</span>
                      <span className="leading-tight">{reason.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* What would target score mean to you */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  What would getting your target score mean to you?
                </label>
                <select
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {MEANING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* What describes you best as a student */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  What describes you best as a student?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STUDENT_TRAITS.map((trait) => (
                    <button
                      key={trait.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, studentType: trait.label })}
                      className={`p-2 rounded-xl text-left text-xs font-medium border transition-all flex items-center space-x-2 ${
                        formData.studentType === trait.label
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm">{trait.icon}</span>
                      <span>{trait.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Biggest motivation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  What is your biggest motivation?
                </label>
                <select
                  value={formData.biggestMotivation}
                  onChange={(e) => setFormData({ ...formData, biggestMotivation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {BIGGEST_MOTIVATIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* How did you hear about us */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  How did you hear about us?
                </label>
                <select
                  value={formData.hearAbout}
                  onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {HEAR_ABOUT_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 4: The Personalized Commitment Reveal (Milestone) ────── */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
            <span className="text-5xl animate-bounce inline-block">🎯</span>
            
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white max-w-md mx-auto leading-tight">
              "We're not just preparing you for a test. We're helping you get closer to your goal."
            </h3>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left max-w-sm mx-auto space-y-2.5 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                <span>{formData.firstName || 'Your'}'s Goal</span>
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </h4>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                🎯 Target: <span className="text-slate-800 dark:text-slate-200 font-bold">{formData.targetScore}</span>
              </p>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                🎓 Dream: <span className="text-slate-800 dark:text-slate-200 font-bold">{formData.mainReason}</span>
              </p>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                🔥 Motivation: <span className="text-slate-800 dark:text-slate-200 font-bold">{formData.biggestMotivation}</span>
              </p>
            </div>

            <p className="text-xs uppercase tracking-widest font-black text-slate-400 animate-pulse">
              Your journey starts today. Launching your Study Hub...
            </p>
          </div>
        )}

        {/* ─── Navigation Action Buttons ──────────────────────────────────── */}
        {step < 4 && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center space-x-2"
            >
              <span>{step === 3 ? 'Complete Setup 🎯' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalNode, document.body)
    : modalNode;
};

export default OnboardingWizardModal;

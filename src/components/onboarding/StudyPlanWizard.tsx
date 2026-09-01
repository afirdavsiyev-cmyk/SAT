import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Target, AlertTriangle, Clock, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { StudyPlan } from '../../types';

export const StudyPlanWizard: React.FC = () => {
  const { setStudyPlan, setCurrentView } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form states with updated 2026/2027 test dates and 100% Math focus
  const [targetDate, setTargetDate] = useState<string>('October 2026');
  const [targetScore, setTargetScore] = useState<number>(800);
  const [currentScore, setCurrentScore] = useState<number>(720);
  const [selectedWeakAreas, setSelectedWeakAreas] = useState<string[]>([
    'Advanced Math',
    'Geometry & Trigonometry'
  ]);
  const [dailyMinutes, setDailyMinutes] = useState<number>(45);

  const testDates = [
    'October 2026',
    'November 2026',
    'December 2026',
    'March 2027',
    'May 2027',
    'June 2027'
  ];

  const targetScores = [700, 740, 760, 780, 800];

  // Strictly the 4 official Digital SAT Math domains
  const topicOptions = [
    'Algebra',
    'Advanced Math',
    'Problem-Solving & Data Analysis',
    'Geometry & Trigonometry'
  ];

  const timeOptions = [15, 30, 45, 60, 90];

  const toggleTopic = (topic: string) => {
    setSelectedWeakAreas((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleGeneratePlan = () => {
    const newPlan: StudyPlan = {
      targetDate,
      targetScore,
      currentScore,
      weakAreas: selectedWeakAreas,
      dailyTimeMinutes: dailyMinutes,
      weeklyRoadmap: [
        {
          week: 1,
          title: `Diagnostic & ${selectedWeakAreas[0] || 'Algebra'} Fundamentals`,
          focus: selectedWeakAreas[0] || 'Algebra',
          estimatedHrs: Math.round((dailyMinutes * 7) / 60),
          completed: true
        },
        {
          week: 2,
          title: `Desmos Graphing Shortcuts & ${selectedWeakAreas[1] || 'Advanced Math'}`,
          focus: 'Desmos & Advanced Math',
          estimatedHrs: Math.round((dailyMinutes * 7) / 60),
          completed: false
        },
        {
          week: 3,
          title: 'Problem-Solving, Data & Geometric Theorems',
          focus: 'Data Analysis & Geometry',
          estimatedHrs: Math.round((dailyMinutes * 7) / 60),
          completed: false
        },
        {
          week: 4,
          title: 'Full-Length Timed Bluebook Math Exam',
          focus: 'Adaptive Simulation',
          estimatedHrs: Math.round((dailyMinutes * 7) / 60),
          completed: false
        }
      ]
    };

    setStudyPlan(newPlan);
    setStep(5); // Generated step view
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Progress Bar Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-800/40 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step {step} of 4: SAT Math Roadmap Wizard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Create Your SAT Math Roadmap</h1>
        <p className="text-slate-400 text-sm mt-1">
          Target upcoming test dates and master the 4 official SAT Math domains.
        </p>

        {/* Progress indicators */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                step >= i ? 'w-12 bg-emerald-400' : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative">
        
        {/* Step 1: Target Date */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-400">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">When is your official SAT Test Date?</h2>
            </div>
            <p className="text-sm text-slate-400">
              Select from upcoming Digital SAT test administrations:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {testDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setTargetDate(date)}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                    targetDate === date
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-glow-emerald'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs text-slate-500 font-mono mb-1">Upcoming Exam</div>
                  <div className="text-base">{date}</div>
                </button>
              ))}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center space-x-2 hover:bg-emerald-400 transition-all"
              >
                <span>Next: Target Math Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Target Score */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-400">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">What is your target SAT Math Score?</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {targetScores.map((score) => (
                <button
                  key={score}
                  onClick={() => setTargetScore(score)}
                  className={`p-4 rounded-2xl border text-center font-extrabold text-xl transition-all ${
                    targetScore === score
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-glow-emerald'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {score}
                  <span className="block text-[10px] font-normal text-slate-400 mt-1">
                    {score >= 780 ? 'Perfect / Top 1%' : 'Competitive'}
                  </span>
                </button>
              ))}
            </div>

            {/* Current Score Input */}
            <div className="pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-400 block mb-2">
                Estimated Current Math Baseline (out of 800):
              </label>
              <input
                type="number"
                min="400"
                max="800"
                step="10"
                value={currentScore}
                onChange={(e) => setCurrentScore(Number(e.target.value))}
                className="w-full sm:w-1/2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
              />
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center space-x-2 hover:bg-emerald-400 transition-all"
              >
                <span>Next: Math Focus Domains</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Math Domains */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-400">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Which SAT Math domains do you find most challenging?</h2>
            </div>
            <p className="text-sm text-slate-400">
              Select all that apply. Practice drills will focus primarily on your selected domains.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {topicOptions.map((topic) => {
                const isSelected = selectedWeakAreas.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`p-4 rounded-2xl border text-left text-sm font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-glow-emerald'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{topic}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center space-x-2 hover:bg-emerald-400 transition-all"
              >
                <span>Next: Time Commitment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Daily Commitment */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-teal-400">
              <Clock className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">How much time can you commit daily?</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {timeOptions.map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDailyMinutes(mins)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    dailyMinutes === mins
                      ? 'bg-teal-950/80 border-teal-500 text-teal-300 shadow-glow-teal'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-extrabold text-2xl">{mins}</div>
                  <div className="text-[10px] text-slate-400 mt-1">mins / day</div>
                </button>
              ))}
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleGeneratePlan}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-sm shadow-glow-emerald hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate SAT Math Plan</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Output Plan Roadmap */}
        {step === 5 && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/40">
                  Math Roadmap Ready
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">
                  Target Math Score: {targetScore} / 800 by {targetDate}
                </h2>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                <span>Daily Commitment</span>
                <span className="block font-bold text-emerald-400 text-sm">{dailyMinutes} Mins / Day</span>
              </div>
            </div>

            {/* Generated Weekly Schedule list */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Customized 4-Week Sprint</h3>
              
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                      W1
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Diagnostic & {selectedWeakAreas[0] || 'Algebra'} Focus</h4>
                      <p className="text-xs text-slate-400">Linear equations, systems, inequalities & Desmos speed strategies.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">~5 Hrs</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                      W2
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Desmos Graphing Shortcuts & {selectedWeakAreas[1] || 'Advanced Math'}</h4>
                      <p className="text-xs text-slate-400">Quadratic vertex forms, polynomial roots, and exponential functions.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">~5 Hrs</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                      W3
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Problem-Solving, Data & Geometric Theorems</h4>
                      <p className="text-xs text-slate-400">Percentages, ratios, circles, right triangle trig & volume formulas.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">~5 Hrs</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                      W4
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Full Length Timed Bluebook Math Exam</h4>
                      <p className="text-xs text-slate-400">Official College Board adaptive testing simulation under timed conditions.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">~4 Hrs</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-glow-emerald hover:bg-emerald-400 transition-all"
              >
                <span>Go to Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('exam')}
                className="py-3.5 px-6 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-bold text-sm"
              >
                Take Bluebook Exam Now
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

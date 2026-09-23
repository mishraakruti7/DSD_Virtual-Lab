import React, { useState } from 'react';
import {
  ASSESSMENT_COMPONENTS,
  StudentScoreInput,
  calculateDSDGrade,
} from '../data/assessment';
import { Award, CheckCircle2, AlertTriangle, Calculator, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentPage: React.FC = () => {
  const [scores, setScores] = useState<StudentScoreInput>({
    test1: 16,
    test2: 17,
    ese: 62,
    twLab: 13,
    twProject: 4,
    twAttendance: 4,
    prOr: 21,
  });

  const result = calculateDSDGrade(scores);

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-amber-500 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-vivid-mod2 uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
            <Award className="w-4 h-4 text-white" />
            University of Mumbai Evaluation Scheme • 150 Total Marks
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-white">
          <span className="text-brand-gradient">Assessment & Grade</span> Calculator
        </h1>
        <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl leading-relaxed font-medium">
          Complete breakdown of Internal Assessment (IA), End Semester Exam (ESE), Term Work (TW), and Practical/Oral Examination with real-time grade and passing threshold evaluation.
        </p>
      </div>

      {/* Grid: 4 Assessment Heads Color-Coded by Module Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ASSESSMENT_COMPONENTS.map((item, idx) => {
          const colorStyles = [
            // IA: Blue
            {
              card: 'card-vivid-brand',
              badge: 'bg-brand-mid text-white',
            },
            // ESE: Amber
            {
              card: 'card-vivid-mod2',
              badge: 'bg-mod2 text-white',
            },
            // TW: Teal
            {
              card: 'card-vivid-mod3',
              badge: 'bg-mod3 text-white',
            },
            // PR/OR: Violet
            {
              card: 'card-vivid-mod4',
              badge: 'bg-mod4 text-white',
            },
          ][idx % 4];

          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border space-y-2 shadow-xs transition-all ${colorStyles.card}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${colorStyles.badge}`}>
                  {item.maxMarks} Marks
                </span>
                <span className="text-[11px] font-sans font-bold text-ink-600 dark:text-cream-muted">
                  Pass: {item.passingMarks}M (40%)
                </span>
              </div>
              <h3 className="font-display font-bold text-ink-900 dark:text-white text-sm">{item.component}</h3>
              <p className="text-xs font-sans text-ink-700 dark:text-cream-muted leading-relaxed font-medium">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Grade Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Inputs */}
        <div className="lg:col-span-7 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl card-vivid-brand circuit-pattern-bg p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
            <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-mid" />
              Dynamic Student Marks Entry
            </h2>
            <span className="text-xs font-sans font-bold text-ink-600 dark:text-cream-muted">Instant Recalculation</span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* IA 1 & 2: Blue */}
            <div className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-base border-2 border-brand-mid/30 space-y-3">
              <div className="flex items-center justify-between font-bold text-brand-mid dark:text-purple-400">
                <span className="font-sans">1. Internal Assessment (IA) [20 Marks Max]</span>
                <span className="text-ink-900 dark:text-white font-black font-mono">Avg: {result.iaAvg} / 20</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-700 dark:text-cream-muted mb-1 font-bold font-sans">Internal Test 1 (0..20):</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={scores.test1}
                    onChange={(e) => setScores({ ...scores, test1: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-xl px-3 py-1.5 text-ink-900 dark:text-white font-mono font-bold focus:outline-none focus:border-brand-mid shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-ink-700 dark:text-cream-muted mb-1 font-bold font-sans">Internal Test 2 (0..20):</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={scores.test2}
                    onChange={(e) => setScores({ ...scores, test2: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-xl px-3 py-1.5 text-ink-900 dark:text-white font-mono font-bold focus:outline-none focus:border-brand-mid shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* ESE: Amber */}
            <div className="p-4 rounded-2xl bg-mod2-wash dark:bg-darklab-base border-2 border-mod2/30 space-y-2">
              <div className="flex items-center justify-between font-bold text-mod2-dark dark:text-mod2 font-sans">
                <span>2. End Semester Exam (ESE) [80 Marks Max]</span>
                <span className="text-ink-900 dark:text-white font-black font-mono">Min to Pass: 32 / 80</span>
              </div>
              <div>
                <label className="block text-ink-700 dark:text-cream-muted mb-1 font-bold font-sans">Written Theory Exam Score (0..80):</label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={scores.ese}
                  onChange={(e) => setScores({ ...scores, ese: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-xl px-3 py-1.5 text-ink-900 dark:text-white font-mono font-bold focus:outline-none focus:border-mod2 shadow-xs"
                />
              </div>
            </div>

            {/* Term Work: Teal */}
            <div className="p-4 rounded-2xl bg-mod3-wash dark:bg-darklab-base border-2 border-mod3/30 space-y-3">
              <div className="flex items-center justify-between font-bold text-mod3-dark dark:text-mod3 font-sans">
                <span>3. Term Work (TW) [25 Marks Max]</span>
                <span className="text-ink-900 dark:text-white font-black font-mono">Total: {result.twTotal} / 25</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-ink-700 dark:text-cream-muted mb-1 font-bold font-sans">Lab Work (0..15):</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={scores.twLab}
                    onChange={(e) => setScores({ ...scores, twLab: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-xl px-2.5 py-1.5 text-ink-900 dark:text-white font-mono font-bold focus:outline-none focus:border-mod3 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-ink-700 dark:text-cream-muted mb-1 font-bold font-sans">Mini-Project (0..5):</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={scores.twProject}
                    onChange={(e) => setScores({ ...scores, twProject: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-xl px-2.5 py-1.5 text-ink-900 dark:text-white font-mono font-bold focus:outline-none focus:border-mod3 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-ink-700 dark:text-cream-muted mb-1 font-bold font-sans">Attendance (0..5):</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={scores.twAttendance}
                    onChange={(e) => setScores({ ...scores, twAttendance: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-xl px-2.5 py-1.5 text-ink-900 dark:text-white font-mono font-bold focus:outline-none focus:border-mod3 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Practical / Oral: Violet */}
            <div className="p-4 rounded-2xl bg-mod4-wash dark:bg-darklab-base border-2 border-mod4/30 space-y-2">
              <div className="flex items-center justify-between font-bold text-mod4 font-sans">
                <span>4. Practical / Oral Viva (PR/OR) [25 Marks Max]</span>
                <span className="text-ink-900 dark:text-white font-black font-mono">Min to Pass: 10 / 25</span>
              </div>
              <div>
                <label className="block text-ink-700 dark:text-cream-muted mb-1 font-bold font-sans">Viva Examination Marks (0..25):</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={scores.prOr}
                  onChange={(e) => setScores({ ...scores, prOr: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-xl px-3 py-1.5 text-ink-900 dark:text-white font-mono font-bold focus:outline-none focus:border-mod4 shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Performance & Grade Card */}
        <div className="lg:col-span-5 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl card-vivid-mod2 circuit-pattern-bg p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
              <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-mod2" />
                Final Result Summary
              </h2>
              <span
                className={`px-3 py-1 rounded-full font-sans text-xs font-bold ${
                  result.status === 'Passed'
                    ? 'badge-vivid-mod3'
                    : 'badge-vivid-mod1'
                }`}
              >
                {result.status}
              </span>
            </div>

            {/* Big Score Display */}
            <div className="mt-6 text-center p-6 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2">
              <div className="text-4xl sm:text-5xl font-display font-black text-ink-900 dark:text-white tracking-tight">
                <span className="text-brand-gradient">{result.grandTotal}</span> <span className="text-ink-500 dark:text-cream-muted text-2xl font-normal">/ 150</span>
              </div>
              <div className="text-sm font-sans font-bold text-mod3">
                {result.percentage}% Aggregate
              </div>
              <div className="pt-2">
                <span className="inline-block px-3.5 py-1 rounded-xl bg-mod2 !text-white font-sans font-bold text-sm shadow-amber">
                  Grade: {result.grade} (GP: {result.gradePoint})
                </span>
              </div>
            </div>

            {/* Individual Passing Head Indicators */}
            <div className="mt-6 space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
                <span className="text-ink-700 dark:text-cream-muted font-bold font-sans">ESE Theory (&ge; 32):</span>
                <span className={`font-mono font-bold ${scores.ese >= 32 ? 'text-mod3-dark dark:text-mod3' : 'text-mod1'}`}>
                  {scores.ese} / 80 {scores.ese >= 32 ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
                <span className="text-ink-700 dark:text-cream-muted font-bold font-sans">IA Average (&ge; 8):</span>
                <span className={`font-mono font-bold ${result.iaAvg >= 8 ? 'text-mod3-dark dark:text-mod3' : 'text-mod1'}`}>
                  {result.iaAvg} / 20 {result.iaAvg >= 8 ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
                <span className="text-ink-700 dark:text-cream-muted font-bold font-sans">Term Work (&ge; 10):</span>
                <span className={`font-mono font-bold ${result.twTotal >= 10 ? 'text-mod3-dark dark:text-mod3' : 'text-mod1'}`}>
                  {result.twTotal} / 25 {result.twTotal >= 10 ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
                <span className="text-ink-700 dark:text-cream-muted font-bold font-sans">Practical/Oral (&ge; 10):</span>
                <span className={`font-mono font-bold ${scores.prOr >= 10 ? 'text-mod3-dark dark:text-mod3' : 'text-mod1'}`}>
                  {scores.prOr} / 25 {scores.prOr >= 10 ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-cream-soft dark:bg-darklab-base/80 border border-cream-border dark:border-darklab-border text-xs text-ink-800 dark:text-white font-medium font-sans">
              <span className="font-bold text-brand-mid">Remarks: </span>
              {result.remarks}
            </div>
          </div>

          {result.status === 'Passed' && (
            <button
              onClick={handleTriggerConfetti}
              className="w-full py-3 rounded-2xl btn-brand-gradient !text-white font-sans font-bold text-xs shadow-brand transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Celebrate Passing Score 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

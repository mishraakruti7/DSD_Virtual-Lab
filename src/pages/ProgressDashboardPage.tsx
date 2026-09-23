import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCourseStore } from '../store/useCourseStore';
import { LAB_EXPERIMENTS } from '../data/labs';
import { DSD_GLOSSARY } from '../data/glossary';
import { Sorting } from '../dsa';
import {
  Award,
  CheckCircle2,
  Circle,
  HelpCircle,
  RotateCcw,
  Flame,
  Zap,
  Sparkles,
  Trophy,
  ShieldCheck,
  Compass,
  Lock,
  ArrowRight,
  Cloud,
  CloudUpload,
  UserCheck,
} from 'lucide-react';
import { playSuccessChime } from '../utils/soundEffects';
import { useAuth } from '../context/AuthContext';

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badgeColor: string;
  borderColor: string;
}

export const ProgressDashboardPage: React.FC<{
  onNavigateTab: (tab: string, extraId?: string | number) => void;
}> = ({ onNavigateTab }) => {
  const { studentProgress, toggleLabComplete, resetProgress } = useCourseStore();
  const { user, profile, isConfigured, openAuthModal, importLocalDataToCloud, migrationLoading } = useAuth();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleManualSync = async () => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    const res = await importLocalDataToCloud();
    if (res.success) {
      setSyncStatus(`Successfully synced ${res.importedItems ?? 0} items to cloud account!`);
      playSuccessChime();
      setTimeout(() => setSyncStatus(null), 4000);
    } else {
      setSyncStatus(`Sync issue: ${res.error}`);
    }
  };

  const totalLabs = LAB_EXPERIMENTS.length;
  const completedLabsCount = studentProgress.completedLabs.length;
  const labPercentage = Math.round((completedLabsCount / totalLabs) * 100);

  // --- DSA MODULE 4: INSERTION SORT FOR SMALL DATASETS (CO4: 4.2) ---
  // Insertion sort is optimal for small quiz attempt histories (N <= 20) with O(1) space
  const completedQuizzes = useMemo(() => {
    return Sorting.insertionSort(
      studentProgress.completedQuizzes || [],
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [studentProgress.completedQuizzes]);
  const bookmarkedTerms = DSD_GLOSSARY.filter((t) =>
    studentProgress.bookmarkedTerms.includes(t.id)
  );

  const streakDays = studentProgress.studyStreakDays || 1;
  const unlockedAchievements = studentProgress.achievements || ['first_visit'];

  // Overall syllabus completion score calculation (weighted)
  const overallCompletion = Math.min(
    100,
    Math.round(
      (completedLabsCount / totalLabs) * 50 +
        Math.min(completedQuizzes.length * 10, 35) +
        Math.min(bookmarkedTerms.length * 5, 15)
    )
  );

  // SVG circular ring properties
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (overallCompletion / 100) * circumference;

  const ACHIEVEMENTS: AchievementDef[] = [
    {
      id: 'first_visit',
      title: 'Lab Explorer',
      description: 'Entered the Virtual DSD Lab and initialized test equipment',
      icon: <Compass className="w-5 h-5 text-amber-500" />,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      borderColor: 'border-amber-300 dark:border-amber-800',
    },
    {
      id: 'first_lab',
      title: 'Circuit Builder',
      description: 'Completed and verified your first university laboratory experiment',
      icon: <Zap className="w-5 h-5 text-emerald-500" />,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      borderColor: 'border-emerald-300 dark:border-emerald-800',
    },
    {
      id: 'first_quiz',
      title: 'Logic Thinker',
      description: 'Completed your first theoretical evaluation quiz in Quiz Hub',
      icon: <Trophy className="w-5 h-5 text-indigo-500" />,
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      borderColor: 'border-indigo-300 dark:border-indigo-800',
    },
    {
      id: 'perfect_score',
      title: 'Master of Truth',
      description: 'Scored a perfect 100% on a module or daily assessment test',
      icon: <Sparkles className="w-5 h-5 text-rose-500" />,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      borderColor: 'border-rose-300 dark:border-rose-800',
    },
    {
      id: 'term_collector',
      title: 'Silicon Lexicon',
      description: 'Saved 3+ technical glossary terms for viva examination recall',
      icon: <Award className="w-5 h-5 text-purple-500" />,
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      borderColor: 'border-purple-300 dark:border-purple-800',
    },
    {
      id: 'all_labs',
      title: 'Practical Graduate',
      description: 'Successfully finished all 12 university prescribed lab practicals',
      icon: <ShieldCheck className="w-5 h-5 text-teal-500" />,
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      borderColor: 'border-teal-300 dark:border-teal-800',
    },
  ];

  const handleLabToggle = (labId: number) => {
    toggleLabComplete(labId);
    playSuccessChime();
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header Banner with Interactive Streak & Overall Progress Ring */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border-2 border-cream-border dark:border-darklab-border border-t-4 border-t-purple-600 shadow-sm transition-colors">
        {/* Playful Ambient Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-mod3/20 to-brand-mid/20 blur-3xl opacity-60 animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-mod2/20 to-mod4/20 blur-3xl opacity-50 animate-blob-drift-2" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-vivid-brand uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold text-xs shadow-sm">
                <Award className="w-4 h-4 text-white" />
                Student Learning Analytics
              </span>

              {/* Study Streak Pill */}
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/30 animate-pulse">
                <Flame className="w-4 h-4 fill-white" />
                <span>{streakDays} Day Study Streak!</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-cream-paper">
              <span className="text-brand-gradient">My Academic Progress</span> Dashboard
            </h1>

            <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted font-medium leading-relaxed">
              Track your laboratory experiment certifications, quiz evaluation history, and achievement badge shelf saved in local browser storage.
            </p>
          </div>

          {/* Satisfying Animated Overall Progress Ring */}
          <div className="flex items-center gap-5 bg-cream-soft dark:bg-darklab-base p-4 rounded-3xl border border-cream-border dark:border-darklab-border shadow-inner self-start lg:self-auto">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                {/* Background Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-stone-200 dark:text-stone-700"
                  fill="transparent"
                />
                {/* Animated Foreground Ring */}
                <motion.circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="url(#brandGradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeOffset }}
                  transition={{ type: 'spring', stiffness: 45, damping: 12 }}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#9333EA" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-2xl text-ink-900 dark:text-cream-paper">
                  {overallCompletion}%
                </span>
                <span className="font-mono text-[9px] text-ink-500 dark:text-cream-muted uppercase font-bold">
                  Curriculum
                </span>
              </div>
            </div>

            <div className="space-y-1 font-sans text-xs">
              <div className="font-bold text-ink-900 dark:text-cream-paper">Semester Readiness</div>
              <div className="text-[11px] text-ink-600 dark:text-cream-muted">
                {completedLabsCount} of 12 Labs Completed
              </div>
              <div className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">
                {completedQuizzes.length} Quizzes Logged
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-cream-border dark:border-darklab-border flex items-center justify-end">
          <button
            onClick={() => {
              if (window.confirm('Reset all saved lab completions and quiz histories?')) {
                resetProgress();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-mod1 hover:!text-white border border-cream-border hover:border-mod1 text-ink-800 dark:bg-darklab-subtle dark:border-darklab-border dark:text-white font-sans text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress Data</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Status Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-pink-50/70 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/30 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-start to-brand-end flex items-center justify-center text-white shrink-0 shadow-md shadow-brand/25">
            {user ? <Cloud className="w-5 h-5" /> : <CloudUpload className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display font-extrabold text-sm sm:text-base text-ink-900 dark:text-cream-paper">
                {user ? `Cloud Sync Active (${profile?.display_name || user.email})` : 'Local Browser Storage Active'}
              </h3>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  user
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}
              >
                {user ? (isConfigured ? 'SUPABASE CLOUD CONNECTED' : 'DEMO CLOUD MODE') : 'GUEST / LOCAL ONLY'}
              </span>
            </div>
            <p className="text-xs text-ink-600 dark:text-cream-muted mt-0.5">
              {user
                ? 'Your lab progress, quiz completions, and achievements are safely synchronized.'
                : 'Your progress is currently saved in this browser only. Sign in to sync your checklist across devices.'}
            </p>
            {syncStatus && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {syncStatus}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <button
              onClick={handleManualSync}
              disabled={migrationLoading}
              className="px-4 py-2 rounded-xl bg-white dark:bg-darklab-card border border-indigo-200 dark:border-indigo-800 text-brand-600 dark:text-brand-300 hover:bg-indigo-50 font-sans text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{migrationLoading ? 'Syncing...' : 'Sync with Cloud'}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="btn-brand-gradient px-4 py-2 rounded-xl text-xs font-bold shadow-sm shadow-brand/20 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In to Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Labs (Teal) */}
        <div className="card-vivid-mod3 p-6 space-y-3 shadow-sm bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border card-interactive">
          <span className="badge-vivid-mod3 font-sans font-bold inline-block">
            Lab Experiments Completed
          </span>
          <div className="text-3xl font-display font-black text-ink-900 dark:text-cream-paper">
            <span className="text-mod3">{completedLabsCount}</span>{' '}
            <span className="text-ink-500 dark:text-cream-muted text-lg font-normal">/ {totalLabs}</span>
          </div>
          <div className="w-full bg-cream-border dark:bg-darklab-subtle h-3 rounded-full overflow-hidden">
            <motion.div
              className="bg-mod3 h-full rounded-full shadow-teal"
              initial={{ width: 0 }}
              animate={{ width: `${labPercentage}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            />
          </div>
          <div className="text-[11px] font-sans text-ink-600 dark:text-cream-muted font-bold">
            {labPercentage}% of 12 University Practicals
          </div>
        </div>

        {/* Metric 2: Quizzes (Brand Blue/Purple) */}
        <div className="card-vivid-brand p-6 space-y-3 shadow-sm bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border card-interactive">
          <span className="badge-vivid-brand font-sans font-bold inline-block">
            Quiz Tests Attempted
          </span>
          <div className="text-3xl font-display font-black text-ink-900 dark:text-cream-paper">
            <span className="text-brand-gradient">{completedQuizzes.length}</span>{' '}
            <span className="text-ink-500 dark:text-cream-muted text-lg font-normal">Sessions</span>
          </div>
          <div className="text-xs text-ink-700 dark:text-cream-muted font-sans font-medium">
            {completedQuizzes.length > 0
              ? `Last Score: ${completedQuizzes[0].score}/${completedQuizzes[0].total} (${Math.round(
                  (completedQuizzes[0].score / completedQuizzes[0].total) * 100
                )}%)`
              : 'Take your first test in Quiz Hub'}
          </div>
          <button
            onClick={() => onNavigateTab('quiz')}
            className="text-xs font-sans text-brand-mid dark:text-purple-400 hover:underline font-bold flex items-center gap-1 mt-2 cursor-pointer"
          >
            <span>Go to Quiz Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metric 3: Bookmarks (Amber) */}
        <div className="card-vivid-mod2 p-6 space-y-3 shadow-sm bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border card-interactive">
          <span className="badge-vivid-mod2 font-sans font-bold inline-block">
            Bookmarked Terms
          </span>
          <div className="text-3xl font-display font-black text-ink-900 dark:text-cream-paper">
            <span className="text-mod2">{bookmarkedTerms.length}</span>{' '}
            <span className="text-ink-500 dark:text-cream-muted text-lg font-normal">Terms</span>
          </div>
          <div className="text-xs text-ink-700 dark:text-cream-muted font-sans font-medium">
            Saved technical definitions for quick exam revision
          </div>
          <button
            onClick={() => onNavigateTab('glossary')}
            className="text-xs font-sans text-mod2-dark dark:text-mod2 hover:underline font-bold flex items-center gap-1 mt-2 cursor-pointer"
          >
            <span>Review Bookmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Achievement Badges Shelf */}
      <div className="card-vivid-brand p-6 sm:p-8 bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
          <h2 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Milestone Achievement Shelf
          </h2>
          <span className="text-xs font-sans font-bold text-mod2-dark dark:text-mod2">
            {unlockedAchievements.length} of {ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? `bg-white dark:bg-darklab-base ${ach.borderColor} shadow-xs`
                    : 'bg-cream-soft/60 dark:bg-darklab-subtle/40 border-cream-border dark:border-darklab-border opacity-50'
                }`}
              >
                <div
                  className={`p-2.5 rounded-2xl shrink-0 ${
                    isUnlocked ? 'bg-cream-soft dark:bg-darklab-surface shadow-xs' : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-stone-400" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-ink-900 dark:text-cream-paper truncate">
                      {ach.title}
                    </span>
                    {isUnlocked && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-600 dark:text-cream-muted font-sans leading-tight">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12 Lab Experiments Checklist */}
      <div className="card-vivid-mod3 p-6 sm:p-8 bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
          <h2 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-mod3" />
            12 Lab Practical Certifications Checklist
          </h2>
          <span className="text-xs font-sans text-ink-600 dark:text-cream-muted font-bold">
            Click to toggle status
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {LAB_EXPERIMENTS.map((lab) => {
            const isDone = studentProgress.completedLabs.includes(lab.id);
            return (
              <motion.div
                key={lab.id}
                onClick={() => handleLabToggle(lab.id)}
                whileTap={{ scale: 0.97 }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isDone
                    ? 'zone-mod3-wash dark:bg-darklab-card border-mod3 text-ink-900 dark:text-cream-paper ring-2 ring-mod3 shadow-teal'
                    : 'bg-white dark:bg-darklab-subtle border-cream-border dark:border-darklab-border text-ink-900 dark:text-cream-paper hover:border-brand-mid shadow-xs'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-mod3 fill-mod3/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-cream-border dark:text-darklab-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full bg-mod3 text-white">
                      Exp {lab.id}
                    </span>
                    <span className="text-[10px] font-sans text-ink-600 dark:text-cream-muted font-bold">
                      {lab.category}
                    </span>
                  </div>
                  <div className="text-xs font-sans font-bold text-ink-900 dark:text-cream-paper truncate mt-1">
                    {lab.shortTitle}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Quiz History */}
      {completedQuizzes.length > 0 && (
        <div className="card-vivid-brand p-6 sm:p-8 bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border shadow-sm space-y-4">
          <h2 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper flex items-center gap-2 border-b border-cream-border dark:border-darklab-border pb-3">
            <HelpCircle className="w-5 h-5 text-brand-mid" />
            Recent Quiz Performance History
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-cream-border dark:border-darklab-border">
            <table className="w-full text-xs font-sans border-collapse">
              <thead>
                <tr className="zone-mod3-wash dark:bg-darklab-subtle text-ink-900 dark:text-cream-paper border-b-2 border-mod3 font-bold">
                  <th className="p-3 text-left font-bold">Test Mode / Topic</th>
                  <th className="p-3 text-center font-bold">Score</th>
                  <th className="p-3 text-center font-bold">Percentage</th>
                  <th className="p-3 text-right font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border dark:divide-darklab-border">
                {completedQuizzes.map((q, idx) => {
                  const pct = Math.round((q.score / q.total) * 100);
                  return (
                    <tr key={idx} className="hover:bg-cream-soft dark:hover:bg-darklab-surface/50 transition-colors">
                      <td className="p-3 font-bold text-ink-900 dark:text-cream-paper uppercase">{q.quizId}</td>
                      <td className="p-3 text-center text-brand-mid dark:text-purple-400 font-mono font-bold">
                        {q.score} / {q.total}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-mono font-bold text-xs ${
                            pct >= 75
                              ? 'badge-vivid-mod3'
                              : pct >= 50
                              ? 'badge-vivid-mod2'
                              : 'badge-vivid-mod1'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="p-3 text-right text-ink-600 dark:text-cream-muted font-sans font-medium">{q.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

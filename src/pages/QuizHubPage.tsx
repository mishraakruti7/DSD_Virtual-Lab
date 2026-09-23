import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DSD_QUESTIONS } from '../data/quiz/questions';
import { QuizMode, QuizQuestion, QuizResultReport } from '../types/quiz';
import { useCourseStore } from '../store/useCourseStore';
import { Stack, HashTable, Sorting } from '../dsa';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Brain,
  Sparkles,
  Flame,
  Sprout,
  Compass,
  Zap,
  Rocket
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  playSoftClick,
  playSuccessChime,
  playStreakChime,
  playAlarmBuzz
} from '../utils/soundEffects';

/**
 * Rapid typing reveal component for technical explanation text
 */
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    const stepSize = Math.max(1, Math.floor(text.length / 28));
    const timer = setInterval(() => {
      index += stepSize;
      if (index >= text.length) {
        setDisplayed(text);
        clearInterval(timer);
      } else {
        setDisplayed(text.slice(0, index));
      }
    }, 15);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayed}</span>;
};

export const QuizHubPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<QuizMode>('module');
  const [selectedModule, setSelectedModule] = useState<number>(1);
  const [selectedCO, setSelectedCO] = useState<string>('CO1');

  // Active quiz session
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Gamification Streak state
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [streakBanner, setStreakBanner] = useState<string | null>(null);

  // --- DSA MODULE 1: STACK FOR QUIZ QUESTION BACK-NAVIGATION (LIFO Behavior) ---
  const navHistoryStack = useRef(new Stack<number>(50));

  // --- DSA MODULE 3: HASH TABLE WITH QUADRATIC PROBING FOR QUESTION BANK LOOKUP ---
  const questionHashTable = useMemo(() => {
    const table = new HashTable<number, QuizQuestion>(131, 'quadratic');
    DSD_QUESTIONS.forEach((q) => {
      table.set(q.id, q);
    });
    return table;
  }, []);

  // --- DSA MODULE 4: MERGE SORT FOR QUESTION BANK ORDERING ---
  const sortedQuestionBank = useMemo(() => {
    return Sorting.mergeSort(DSD_QUESTIONS, (a, b) => a.id - b.id);
  }, []);

  const { saveQuizResult, unlockAchievement } = useCourseStore();

  // Timer for active sessions
  useEffect(() => {
    let interval: any = null;
    if (isSessionActive && !isSubmitted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, isSubmitted]);

  // Start a new quiz session based on mode
  const startQuiz = (mode: QuizMode) => {
    playSoftClick();
    setSelectedMode(mode);
    navHistoryStack.current.clear();
    let pool: QuizQuestion[] = [];

    if (mode === 'module') {
      pool = sortedQuestionBank.filter((q) => q.module === selectedModule);
    } else if (mode === 'co') {
      pool = sortedQuestionBank.filter((q) => q.co === selectedCO);
    } else if (mode === 'mock_exam') {
      pool = [...sortedQuestionBank].sort(() => 0.5 - Math.random()).slice(0, 30);
    } else if (mode === 'daily_challenge') {
      pool = [...sortedQuestionBank].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
      pool = [...sortedQuestionBank].slice(0, 15);
    }

    if (pool.length === 0) pool = sortedQuestionBank.slice(0, 10);

    setActiveQuestions(pool);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowExplanation(false);
    setElapsedSeconds(0);
    setCurrentStreak(0);
    setStreakBanner(null);
    setIsSessionActive(true);
  };

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted && selectedMode !== 'flashcards') return;
    playSoftClick();

    const isCorrect = currentQ.correctIndex === optIdx;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    setShowExplanation(true);

    if (isCorrect) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak === 3) {
        setStreakBanner('🔥 3 in a Row! On fire!');
        playStreakChime();
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } else if (nextStreak === 5) {
        setStreakBanner('⚡ 5 Question Streak! Logic Prodigy!');
        playStreakChime();
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.65 } });
        unlockAchievement('quiz_streak_5');
      } else {
        playSuccessChime();
      }
    } else {
      playAlarmBuzz();
      setCurrentStreak(0);
      setStreakBanner(null);
    }
  };

  const handleNext = () => {
    playSoftClick();
    if (currentIndex < activeQuestions.length - 1) {
      navHistoryStack.current.push(currentIndex); // Push to LIFO stack
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    playSoftClick();
    if (!navHistoryStack.current.isEmpty()) {
      const prevIdx = navHistoryStack.current.pop()!; // Pop from LIFO stack
      setCurrentIndex(prevIdx);
      setShowExplanation(userAnswers[activeQuestions[prevIdx]?.id] !== undefined);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(userAnswers[activeQuestions[currentIndex - 1]?.id] !== undefined);
    }
  };

  const finishQuiz = () => {
    setIsSubmitted(true);
    let correct = 0;
    activeQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) correct++;
    });

    const scorePct = Math.round((correct / (activeQuestions.length || 1)) * 100);

    if (scorePct >= 70) {
      playStreakChime();
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#FF4D5E', '#FF9F1C', '#8B5CF6'],
      });
    }

    if (scorePct === 100) {
      unlockAchievement('perfect_score');
    }

    saveQuizResult(selectedMode, correct, activeQuestions.length);
  };

  // Compute breakdown for result view
  const resultsReport: QuizResultReport = useMemo(() => {
    let correct = 0;
    const bloom: QuizResultReport['bloomBreakdown'] = {};
    const coMap: QuizResultReport['coBreakdown'] = {};

    activeQuestions.forEach((q) => {
      const isCorrect = userAnswers[q.id] === q.correctIndex;
      if (isCorrect) correct++;

      // bloom
      if (!bloom[q.bloomLevel]) bloom[q.bloomLevel] = { total: 0, correct: 0 };
      bloom[q.bloomLevel]!.total += 1;
      if (isCorrect) bloom[q.bloomLevel]!.correct += 1;

      // co
      if (!coMap[q.co]) coMap[q.co] = { total: 0, correct: 0 };
      coMap[q.co]!.total += 1;
      if (isCorrect) coMap[q.co]!.correct += 1;
    });

    return {
      totalQuestions: activeQuestions.length,
      attempted: Object.keys(userAnswers).length,
      correctCount: correct,
      incorrectCount: activeQuestions.length - correct,
      scorePercentage: Math.round((correct / (activeQuestions.length || 1)) * 100),
      timeSpentSeconds: elapsedSeconds,
      bloomBreakdown: bloom,
      coBreakdown: coMap,
    };
  }, [activeQuestions, userAnswers, elapsedSeconds]);

  // Bloom level mascot badge generator
  const renderBloomMascot = (bloom: string) => {
    switch (bloom) {
      case 'BL1':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
            <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>BL1: Remember</span>
          </span>
        );
      case 'BL2':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>BL2: Understand</span>
          </span>
        );
      case 'BL3':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>BL3: Apply</span>
          </span>
        );
      case 'BL4':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800 shadow-xs">
            <Rocket className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>BL4: Analyze</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs transition-colors">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-mod1/10 blur-3xl animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-mod4/10 blur-3xl animate-blob-drift-2" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-mod1 font-sans text-xs font-bold uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4 text-mod1" />
              Comprehensive Academic Assessment • 100+ DSD Questions
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-cream-paper">
              Digital System Design{' '}
              <span className="text-brand-gradient">Quiz Hub</span>
            </h1>
            <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl leading-relaxed font-medium">
              Vetted questions tagged by Bloom's taxonomy, Course Outcomes (CO1–CO6), and Modules. Choose from 6 specialized learning modes.
            </p>
          </div>

          {isSessionActive && (
            <button
              onClick={() => {
                playSoftClick();
                setIsSessionActive(false);
              }}
              className="px-4 py-2 rounded-2xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-800 dark:text-cream-paper hover:text-brand-600 font-sans text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-mod1" />
              <span>Change Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* QUIZ MODE SELECTOR (when not in session) */}
      {!isSessionActive && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Mode 1: Module Quiz (Coral) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod1 hover:shadow-coral transition-all flex flex-col justify-between space-y-4 shadow-xs card-interactive">
              <div className="space-y-2">
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full badge-vivid-mod1 inline-block">
                  Mode 1 • Module Focus
                </span>
                <h3 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper">Module-Specific Quiz</h3>
                <p className="text-xs font-sans text-ink-700 dark:text-cream-muted leading-relaxed font-medium">
                  Focus on a single curriculum module (Sequential Circuits, Logic Families, FSM, or Verilog).
                </p>
                <div className="pt-2">
                  <label className="block text-xs font-sans text-ink-800 dark:text-cream-paper mb-1 font-bold">
                    Select Module:
                  </label>
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(Number(e.target.value))}
                    className="w-full bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border rounded-xl p-2.5 text-xs font-sans text-ink-900 dark:text-cream-paper font-semibold focus:outline-none focus:border-brand-500 shadow-inner"
                  >
                    <option value={1}>Module 1: Sequential Logic Design (8h)</option>
                    <option value={2}>Module 2: Digital Logic Families (6h)</option>
                    <option value={3}>Module 3: FSM & PLDs (8h)</option>
                    <option value={4}>Module 4: Verilog HDL & Testing (8h)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => startQuiz('module')}
                className="w-full py-2.5 rounded-2xl bg-mod1 hover:bg-[#E03345] !text-white font-sans font-bold text-xs shadow-coral transition-transform active:scale-95 cursor-pointer"
              >
                Start Module {selectedModule} Quiz →
              </button>
            </div>

            {/* Mode 2: Course Outcome Quiz (Violet) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod4 hover:shadow-violet transition-all flex flex-col justify-between space-y-4 shadow-xs card-interactive">
              <div className="space-y-2">
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full badge-vivid-mod4 inline-block">
                  Mode 2 • CO Attainment
                </span>
                <h3 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper">Course Outcome (CO) Quiz</h3>
                <p className="text-xs font-sans text-ink-700 dark:text-cream-muted leading-relaxed font-medium">
                  Assess competence in specific NBA/NAAC attainment objectives (CO1 to CO6).
                </p>
                <div className="pt-2">
                  <label className="block text-xs font-sans text-ink-800 dark:text-cream-paper mb-1 font-bold">
                    Select Outcome:
                  </label>
                  <select
                    value={selectedCO}
                    onChange={(e) => setSelectedCO(e.target.value)}
                    className="w-full bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border rounded-xl p-2.5 text-xs font-sans text-ink-900 dark:text-cream-paper font-semibold focus:outline-none focus:border-brand-500 shadow-inner"
                  >
                    <option value="CO1">CO1: Sequential Circuits & Counters</option>
                    <option value="CO2">CO2: TTL/CMOS Logic Families</option>
                    <option value="CO3">CO3: FSM & ASM State Machines</option>
                    <option value="CO4">CO4: Programmable Logic (PLA/PAL)</option>
                    <option value="CO5">CO5: Verilog HDL Modeling</option>
                    <option value="CO6">CO6: Fault Modeling & Testing</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => startQuiz('co')}
                className="w-full py-2.5 rounded-2xl bg-mod4 hover:bg-[#7442E8] !text-white font-sans font-bold text-xs shadow-violet transition-transform active:scale-95 cursor-pointer"
              >
                Start {selectedCO} Assessment →
              </button>
            </div>

            {/* Mode 3: 30Q University Mock Exam (Amber) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod2 hover:shadow-amber transition-all flex flex-col justify-between space-y-4 shadow-xs card-interactive">
              <div className="space-y-2">
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full badge-vivid-mod2 inline-block">
                  Mode 3 • Semester Simulation
                </span>
                <h3 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper">30-Question Mock Exam</h3>
                <p className="text-xs font-sans text-ink-700 dark:text-cream-muted leading-relaxed font-medium">
                  Simulates university semester theory examination. 30 randomized questions with detailed Bloom breakdown.
                </p>
                <div className="text-xs font-sans text-mod2-dark dark:text-mod2 pt-2 font-bold">
                  ⏱ Duration: 30 minutes • 30 marks
                </div>
              </div>
              <button
                onClick={() => startQuiz('mock_exam')}
                className="w-full py-2.5 rounded-2xl bg-mod2 hover:bg-[#E58B12] !text-white font-sans font-bold text-xs shadow-amber transition-transform active:scale-95 cursor-pointer"
              >
                Launch Mock Exam →
              </button>
            </div>

            {/* Mode 4: Daily 5Q Challenge (Teal) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod3 hover:shadow-teal transition-all flex flex-col justify-between space-y-4 shadow-xs card-interactive">
              <div className="space-y-2">
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full badge-vivid-mod3 inline-block">
                  Mode 4 • Rapid Revision
                </span>
                <h3 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper">Daily 5-Question Sprint</h3>
                <p className="text-xs font-sans text-ink-700 dark:text-cream-muted leading-relaxed font-medium">
                  Quick 3-minute rapid revision deck to maintain active recall between practical classes.
                </p>
                <div className="text-xs font-sans text-mod3-dark dark:text-mod3 pt-2 font-bold">
                  ⚡ 5 Random Vetted Questions
                </div>
              </div>
              <button
                onClick={() => startQuiz('daily_challenge')}
                className="w-full py-2.5 rounded-2xl bg-mod3 hover:bg-[#0D9668] !text-white font-sans font-bold text-xs shadow-teal transition-transform active:scale-95 cursor-pointer"
              >
                Take Daily Challenge →
              </button>
            </div>

            {/* Mode 5: Lab Viva Prep Deck (Brand Blue) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-brand hover:shadow-brand transition-all flex flex-col justify-between space-y-4 shadow-xs card-interactive">
              <div className="space-y-2">
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full badge-vivid-brand inline-block">
                  Mode 5 • Practical Viva
                </span>
                <h3 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper">Lab Viva Voce Trainer</h3>
                <p className="text-xs font-sans text-ink-700 dark:text-cream-muted leading-relaxed font-medium">
                  Questions drawn from the 12 laboratory experiments, IC pinouts, and hardware troubleshooting.
                </p>
                <div className="text-xs font-sans text-brand-600 dark:text-brand-400 pt-2 font-bold">
                  🎙 External Oral Exam Focus
                </div>
              </div>
              <button
                onClick={() => startQuiz('viva_prep')}
                className="w-full py-2.5 rounded-2xl btn-brand-gradient !text-white font-sans font-bold text-xs shadow-brand transition-transform active:scale-95 cursor-pointer"
              >
                Start Viva Prep Deck →
              </button>
            </div>

            {/* Mode 6: Concept Flashcards */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod4 hover:shadow-violet transition-all flex flex-col justify-between space-y-4 shadow-xs card-interactive">
              <div className="space-y-2">
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full badge-vivid-mod4 inline-block">
                  Mode 6 • Self-Paced
                </span>
                <h3 className="text-lg font-display font-bold text-ink-900 dark:text-cream-paper">Interactive Flashcards</h3>
                <p className="text-xs font-sans text-ink-700 dark:text-cream-muted leading-relaxed font-medium">
                  Self-paced flashcards with immediate reveal of comprehensive explanations and circuit rationale.
                </p>
                <div className="text-xs font-sans text-mod4 pt-2 font-bold">
                  💡 Zero Stress Practice
                </div>
              </div>
              <button
                onClick={() => startQuiz('flashcards')}
                className="w-full py-2.5 rounded-2xl bg-mod4 hover:bg-[#7442E8] !text-white font-sans font-bold text-xs shadow-violet transition-transform active:scale-95 cursor-pointer"
              >
                Open Flashcards →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ SESSION */}
      {isSessionActive && !isSubmitted && currentQ && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Progress & Streak Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border px-5 py-3 rounded-2xl shadow-sm">
            <span className="text-ink-900 dark:text-white font-bold">
              Question <strong className="text-brand-mid dark:text-purple-400 font-extrabold">{currentIndex + 1}</strong> of{' '}
              {activeQuestions.length}
            </span>

            {/* Mascot Bloom Badge */}
            <div>{renderBloomMascot(currentQ.bloomLevel)}</div>

            <div className="flex items-center gap-1.5 text-mod2 font-black font-mono text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {Math.floor(elapsedSeconds / 60)}:
                {(elapsedSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Streak Celebration Banner */}
          {streakBanner && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>{streakBanner}</span>
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
            </motion.div>
          )}

          {/* Animated Question Card with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="card-vivid-brand p-6 sm:p-8 space-y-6 shadow-md bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border"
            >
              <div className="flex items-center justify-between text-xs text-ink-500 dark:text-cream-muted font-mono">
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  Module {currentQ.module} • {currentQ.co}
                </span>
                <span>Question ID #{currentQ.id}</span>
              </div>

              <h2 className="text-base sm:text-lg font-display font-bold text-ink-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  const isCorrect = currentQ.correctIndex === idx;

                  let btnStyle =
                    'bg-white dark:bg-darklab-subtle border-cream-border dark:border-darklab-border text-ink-900 dark:text-cream-paper hover:border-brand-mid hover:bg-cream-soft dark:hover:bg-darklab-surface shadow-xs';
                  let badgeStyle = 'bg-cream-soft dark:bg-darklab-border text-ink-800 dark:text-white border border-cream-border';

                  if (showExplanation) {
                    if (isCorrect) {
                      btnStyle = 'bg-mod3 border-mod3 !text-white font-bold shadow-teal';
                      badgeStyle = 'bg-white/25 !text-white';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-mod1 border-mod1 !text-white font-bold shadow-coral';
                      badgeStyle = 'bg-white/25 !text-white';
                    }
                  } else if (isSelected) {
                    btnStyle = 'btn-brand-gradient !text-white border-transparent font-bold shadow-brand';
                    badgeStyle = 'bg-white/25 !text-white';
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-sans font-medium flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 text-xs transition-colors ${badgeStyle}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-snug">{option}</span>
                      {showExplanation && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                      )}
                      {showExplanation && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-white shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation with Typewriter Reveal */}
              {showExplanation && (
                <div className="p-4 rounded-2xl zone-mod2-wash dark:bg-darklab-subtle border-2 border-mod2/40 text-xs text-ink-900 dark:text-cream-paper space-y-1.5 animate-fadeIn">
                  <span className="font-bold text-mod2-dark dark:text-mod2 font-sans text-xs block uppercase tracking-wider">
                    TECHNICAL EXPLANATION:
                  </span>
                  <p className="leading-relaxed font-sans font-medium">
                    <TypewriterText text={currentQ.explanation} />
                  </p>
                  {currentQ.hint && (
                    <p className="text-xs text-mod2-dark dark:text-mod2 font-sans font-bold pt-1">
                      💡 Hint: {currentQ.hint}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-cream-border dark:border-darklab-border">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-800 dark:text-white hover:text-brand-mid disabled:opacity-40 text-xs font-sans font-bold shadow-xs transition-all cursor-pointer"
                >
                  ← Previous
                </button>
                {currentIndex < activeQuestions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl btn-brand-gradient !text-white text-xs font-sans font-bold transition-transform active:scale-95 shadow-brand cursor-pointer"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={finishQuiz}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-mod3 via-brand-start to-brand-end !text-white text-xs font-sans font-bold shadow-brand transition-transform active:scale-95 cursor-pointer"
                  >
                    Submit Final Test ✓
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* FINAL SCORE REPORT (when submitted) */}
      {isSessionActive && isSubmitted && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <div className="card-vivid-brand p-6 sm:p-8 space-y-6 shadow-md text-center bg-white dark:bg-darklab-card rounded-3xl border border-cream-border dark:border-darklab-border">
            <span className="badge-vivid-brand uppercase tracking-wider font-sans font-bold inline-block">
              {selectedMode.toUpperCase()} SCORE REPORT
            </span>

            <div className="space-y-1">
              <div className="text-5xl sm:text-6xl font-display font-black text-ink-900 dark:text-white tracking-tight">
                <span className="text-brand-gradient">{resultsReport.correctCount}</span>{' '}
                <span className="text-ink-500 dark:text-cream-muted text-3xl font-normal">
                  / {resultsReport.totalQuestions}
                </span>
              </div>
              <div className="text-lg font-sans font-extrabold text-mod3">
                {resultsReport.scorePercentage}% Accuracy
              </div>
              <p className="text-xs text-ink-600 dark:text-cream-muted pt-1 font-sans font-medium">
                Completed in {Math.floor(resultsReport.timeSpentSeconds / 60)}m{' '}
                {resultsReport.timeSpentSeconds % 60}s
              </p>
            </div>

            {/* Bloom's Breakdown */}
            <div className="pt-4 border-t border-cream-border dark:border-darklab-border text-left">
              <h4 className="text-xs font-sans font-bold text-ink-900 dark:text-white uppercase mb-3 flex items-center gap-1.5 tracking-wider">
                <Brain className="w-4 h-4 text-mod4" />
                Bloom's Taxonomy Performance
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(resultsReport.bloomBreakdown).map(([bloom, val]) => (
                  <div key={bloom} className="p-3.5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border-2 border-cream-border dark:border-darklab-border text-xs hover:border-brand-mid transition-all shadow-xs">
                    <div className="mb-1">{renderBloomMascot(bloom)}</div>
                    <span className="text-base font-display font-bold text-ink-900 dark:text-white">
                      {val?.correct} / {val?.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-cream-border dark:border-darklab-border">
              <button
                onClick={() => startQuiz(selectedMode)}
                className="px-5 py-2.5 rounded-xl btn-brand-gradient !text-white font-sans font-bold text-xs flex items-center gap-2 shadow-brand transition-transform active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Test
              </button>
              <button
                onClick={() => {
                  playSoftClick();
                  setIsSessionActive(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-800 dark:text-white hover:text-brand-mid font-sans text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Back to Quiz Modes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

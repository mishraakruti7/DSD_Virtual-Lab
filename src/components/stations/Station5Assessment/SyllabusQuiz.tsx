import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../../data/quizData';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Filter,
  Award,
  ChevronRight
} from 'lucide-react';

export const SyllabusQuiz: React.FC = () => {
  const [coFilter, setCoFilter] = useState<string>('All');
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [showExplanations, setShowExplanations] = useState<{ [questionId: number]: boolean }>({});

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    if (coFilter === 'All') return true;
    return q.co === coFilter;
  });

  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([qId, ansIdx]) => {
      const q = QUIZ_QUESTIONS.find((item) => item.id === parseInt(qId));
      return q && q.correctIndex === ansIdx;
    }
  ).length;

  const scorePercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (userAnswers[questionId] !== undefined) return; // already answered

    const updated = { ...userAnswers, [questionId]: optionIdx };
    setUserAnswers(updated);
    setShowExplanations({ ...showExplanations, [questionId]: true });

    // Check if celebration warranted
    const newCorrect = Object.entries(updated).filter(
      ([qId, ansIdx]) => {
        const q = QUIZ_QUESTIONS.find((item) => item.id === parseInt(qId));
        return q && q.correctIndex === ansIdx;
      }
    ).length;

    if (Object.keys(updated).length >= 10 && (newCorrect / Object.keys(updated).length) >= 0.75) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanations({});
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header & Score Bar */}
      <div className="bg-[#faf6ee] dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#ded5c2] dark:border-stone-800 shadow-soft-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Comprehensive Syllabus Evaluation
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-stone-900 dark:text-stone-100 mt-1">
              20-Point DSD University Exam Quiz
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              Mapped directly to Bloom’s Taxonomy specification table: BL1 (10%), BL2 (10%), BL3 (52%), BL4 (28%).
            </p>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetQuiz}
            className="tactile-btn self-start md:self-auto px-4 py-2 rounded-xl border border-[#ded5c2] dark:border-stone-700 bg-[#fbf7ee] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#f3ede1] dark:hover:bg-stone-700 text-xs font-mono flex items-center gap-2 shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Quiz</span>
          </button>
        </div>

        {/* Scorecard Strip */}
        <div className="bg-[#fbf7ee] dark:bg-stone-950 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div>
              Answered: <strong className="text-stone-900 dark:text-stone-100">{totalAnswered}</strong> / {filteredQuestions.length}
            </div>
            <div>
              Correct: <strong className="text-emerald-700 dark:text-emerald-400">{correctCount}</strong>
            </div>
            <div>
              Score: <strong className="text-sky-700 dark:text-sky-400">{scorePercentage}%</strong>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 min-w-[200px] flex-1 max-w-xs">
            <div className="w-full bg-[#e8e0ce] dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(totalAnswered / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {scorePercentage >= 75 && totalAnswered >= 10 && (
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Distinction Grade!</span>
            </div>
          )}
        </div>

        {/* CO Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#f5efe4] dark:bg-stone-950 p-1 rounded-2xl border border-[#ded5c2] dark:border-stone-800 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-stone-500 ml-2 shrink-0" />
          {['All', 'CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map((co) => (
            <button
              key={co}
              onClick={() => setCoFilter(co)}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
                coFilter === co
                  ? 'bg-rose-200 text-rose-950 font-bold border border-rose-400 shadow-soft-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-[#faf6ee] dark:hover:bg-stone-800'
              }`}
            >
              {co}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, qIndex) => {
          const userAnswer = userAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-[#faf6ee] dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#ded5c2] dark:border-stone-800 shadow-soft-sm space-y-4"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-950 font-mono font-bold text-xs flex items-center justify-center border border-rose-300">
                    {qIndex + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                    {q.co}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    {q.bloomLevel}
                  </span>
                </div>

                {isAnswered && (
                  <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                    isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                  </span>
                )}
              </div>

              {/* Question Statement */}
              <h4 className="font-heading font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-snug">
                {q.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isThisCorrect = q.correctIndex === optIdx;

                  let btnStyle = 'bg-[#fbf7ee] dark:bg-stone-950 border-[#ded5c2] dark:border-stone-800 hover:bg-[#f5efe4] dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      btnStyle = 'bg-emerald-100/80 dark:bg-emerald-950/50 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-300';
                    } else if (isSelected && !isThisCorrect) {
                      btnStyle = 'bg-rose-100/80 dark:bg-rose-950/50 border-rose-400 text-rose-950 dark:text-rose-200 font-bold ring-1 ring-rose-300';
                    } else {
                      btnStyle = 'bg-[#f5efe4] dark:bg-stone-900 border-[#ded5c2] dark:border-stone-800 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all text-xs flex items-start gap-3 select-none ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-lg border border-[#ded5c2] dark:border-stone-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Academic Rationale Explanation Box */}
              {isAnswered && (
                <div className="mt-4 p-4 rounded-2xl bg-sky-50/90 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed space-y-1">
                  <div className="font-mono font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Academic Explanation:</span>
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ChallengeBenches } from './ChallengeBenches';
import { SyllabusQuiz } from './SyllabusQuiz';
import { Award, Zap, BookCheck } from 'lucide-react';

export const AssessmentStation: React.FC = () => {
  const [subTab, setSubTab] = useState<'challenges' | 'quiz'>('challenges');

  return (
    <div className="space-y-8">
      {/* Station Sub-Navigation */}
      <div className="flex items-center justify-between border-b border-border-warm pb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-rose-600" />
          <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
            Station 5 • Practice & Continuous Evaluation
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-canvas-warm p-1 rounded-2xl border border-border-warm">
          <button
            onClick={() => setSubTab('challenges')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'challenges'
                ? 'bg-rose-200 text-rose-950 font-bold shadow-soft-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#faf6ee]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>7 Circuit Challenges</span>
          </button>

          <button
            onClick={() => setSubTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'quiz'
                ? 'bg-rose-200 text-rose-950 font-bold shadow-soft-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#faf6ee]'
            }`}
          >
            <BookCheck className="w-3.5 h-3.5" />
            <span>20-Point Syllabus Exam</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {subTab === 'challenges' ? <ChallengeBenches /> : <SyllabusQuiz />}
      </div>
    </div>
  );
};

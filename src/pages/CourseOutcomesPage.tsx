import React, { useState } from 'react';
import { COURSE_OUTCOMES } from '../data/cos';
import { ARTICULATION_MATRIX, PROGRAM_OUTCOMES, PROGRAM_SPECIFIC_OUTCOMES } from '../data/matrix';
import { BLOOM_SPECIFICATION_TABLE, BLOOM_LEVELS_INFO } from '../data/bloom';
import { BookOpen, CheckCircle, Table, Brain, Award, Info, ChevronRight } from 'lucide-react';

export const CourseOutcomesPage: React.FC<{ onNavigateToLab?: (id: number) => void }> = ({ onNavigateToLab }) => {
  const [selectedCO, setSelectedCO] = useState<string>('CO1');
  const [activeTab, setActiveTab] = useState<'outcomes' | 'matrix' | 'bloom'>('outcomes');

  const currentCO = COURSE_OUTCOMES.find((c) => c.id === selectedCO) || COURSE_OUTCOMES[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-purple-600 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-vivid-mod4 uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
                <Award className="w-4 h-4 text-white" />
                Accreditation & Curriculum Matrix • NBA / NAAC Aligned
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-white">
              <span className="text-brand-gradient">Course Outcomes &</span> Articulation Matrix
            </h1>
            <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl font-medium leading-relaxed">
              Official Course Outcomes (CO1 to CO6), Program Outcomes (PO1 to PO12) mapping, and Bloom’s Revised Taxonomy cognitive level specifications for ECCOR2PC203.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-cream-soft dark:bg-darklab-base p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border font-sans text-xs gap-1">
            <button
              onClick={() => setActiveTab('outcomes')}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-bold ${
                activeTab === 'outcomes'
                  ? 'btn-brand-gradient !text-white shadow-brand'
                  : 'text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900'
              }`}
            >
              CO Statements
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-bold ${
                activeTab === 'matrix'
                  ? 'btn-brand-gradient !text-white shadow-brand'
                  : 'text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900'
              }`}
            >
              CO-PO-PSO Matrix
            </button>
            <button
              onClick={() => setActiveTab('bloom')}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-bold ${
                activeTab === 'bloom'
                  ? 'btn-brand-gradient !text-white shadow-brand'
                  : 'text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900'
              }`}
            >
              Bloom Table
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CO Statements */}
      {activeTab === 'outcomes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {COURSE_OUTCOMES.map((co) => (
              <button
                key={co.id}
                onClick={() => setSelectedCO(co.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all border-t-4 border-t-purple-600 ${
                  selectedCO === co.id
                    ? 'bg-mod4 !text-white shadow-violet border-mod4 ring-2 ring-mod4/40 scale-[1.02]'
                    : 'bg-white dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink-900 dark:text-white hover:border-brand-mid'
                }`}
              >
                <div className={`text-xs font-mono font-black ${selectedCO === co.id ? '!text-white' : 'text-brand-mid dark:text-purple-400'}`}>{co.id}</div>
                <div className={`text-xs font-sans font-bold truncate mt-0.5 ${selectedCO === co.id ? '!text-white' : 'text-ink-900 dark:text-white'}`}>{co.title}</div>
                <div className={`text-[10px] font-sans font-bold mt-1 ${selectedCO === co.id ? 'text-white/80' : 'text-mod4'}`}>{co.bloomLevel}</div>
              </button>
            ))}
          </div>

          {/* Selected CO Detail Card */}
          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl card-vivid-mod4 circuit-pattern-bg p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
              <div>
                <span className="badge-vivid-mod4 font-sans font-bold">
                  {currentCO.id} Details
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-black text-ink-900 dark:text-white mt-2">
                  {currentCO.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 font-sans text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-cream-soft dark:bg-darklab-base text-ink-900 dark:text-white border border-cream-border font-bold">
                  Theory Hours: <span className="font-mono">{currentCO.theoryHours}h</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-mod2 !text-white font-bold shadow-amber">
                  Exam Weight: ~<span className="font-mono">{currentCO.weightagePercent}%</span>
                </span>
              </div>
            </div>

            {/* Statement */}
            <div className="bg-mod4-wash dark:bg-darklab-base p-4 sm:p-5 rounded-2xl border-2 border-mod4/30 text-ink-900 dark:text-white leading-relaxed text-sm sm:text-base font-sans font-medium">
              <span className="font-bold text-mod4 font-sans text-xs block mb-1 uppercase tracking-wider">
                OUTCOME STATEMENT:
              </span>
              "{currentCO.statement}"
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1">
                <span className="text-xs font-mono text-ink-muted dark:text-darklab-muted font-bold">Cognitive Level</span>
                <div className="text-sm font-bold text-mod4 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-mod4" />
                  {currentCO.bloomLevel}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1">
                <span className="text-xs font-mono text-ink-muted dark:text-darklab-muted font-bold">Target Theory Module</span>
                <div className="text-sm font-bold text-brand-mid dark:text-purple-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-mid" />
                  Module {currentCO.theoryModule}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1">
                <span className="text-xs font-mono text-ink-muted dark:text-darklab-muted font-bold">Mapped Practical Labs</span>
                <div className="text-xs font-mono flex flex-wrap gap-1.5 pt-1">
                  {currentCO.labExperiments.map((labNum) => (
                    <button
                      key={labNum}
                      onClick={() => onNavigateToLab?.(labNum)}
                      className="px-2.5 py-1 rounded-lg bg-mod3 text-white font-bold shadow-teal hover:opacity-90 transition-opacity"
                    >
                      Lab Exp {labNum}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Articulation Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl card-vivid-brand circuit-pattern-bg p-6 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink dark:text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-brand-mid" />
                CO-PO & CO-PSO Articulation Matrix (1: Low [Amber], 2: Med [Blue], 3: High [Teal], PSO: [Violet])
              </h2>
              <span className="text-xs font-mono text-ink-muted dark:text-darklab-muted font-bold">
                Department of Electronics & Computer Science
              </span>
            </div>

            <table className="w-full text-xs font-mono border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-mod4-wash dark:bg-darklab-base text-ink dark:text-white border-b-2 border-mod4 font-black">
                  <th className="p-2.5 text-left text-ink dark:text-white">Course Outcome</th>
                  {PROGRAM_OUTCOMES.map((po) => (
                    <th key={po.id} className="p-2 text-center" title={po.description}>
                      {po.id}
                    </th>
                  ))}
                  {PROGRAM_SPECIFIC_OUTCOMES.map((pso) => (
                    <th key={pso.id} className="p-2 text-center text-mod4" title={pso.description}>
                      {pso.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border dark:divide-darklab-border">
                {ARTICULATION_MATRIX.map((row) => (
                  <tr key={row.coId} className="hover:bg-cream-soft dark:hover:bg-darklab-base/50 transition-colors">
                    <td className="p-2.5 font-black text-brand-mid dark:text-purple-400">{row.coId}</td>
                    {PROGRAM_OUTCOMES.map((po) => {
                      const score = row.poScores[po.id] || 0;
                      return (
                        <td key={po.id} className="p-2 text-center">
                          {score > 0 ? (
                            <span
                              className={`px-2 py-0.5 rounded-lg font-bold inline-block min-w-[24px] text-white ${
                                score === 3
                                  ? 'bg-mod3 shadow-teal'
                                  : score === 2
                                  ? 'bg-brand-mid shadow-brand'
                                  : 'bg-mod2 shadow-amber'
                              }`}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-ink-muted dark:text-darklab-muted">-</span>
                          )}
                        </td>
                      );
                    })}
                    {PROGRAM_SPECIFIC_OUTCOMES.map((pso) => {
                      const score = row.psoScores[pso.id] || 0;
                      return (
                        <td key={pso.id} className="p-2 text-center">
                          {score > 0 ? (
                            <span className="px-2 py-0.5 rounded-lg bg-mod4 text-white font-bold inline-block min-w-[24px] shadow-violet">
                              {score}
                            </span>
                          ) : (
                            <span className="text-ink-muted dark:text-darklab-muted">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrix Justifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARTICULATION_MATRIX.map((row) => (
              <div key={row.coId} className="p-4 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs shadow-xs border-l-4 border-l-brand-mid">
                <span className="font-bold text-brand-mid dark:text-purple-400 font-mono">{row.coId} Mapping Rationale:</span>
                <p className="text-ink-muted dark:text-darklab-muted mt-1 leading-relaxed font-medium">{row.justification}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Bloom's Taxonomy Table */}
      {activeTab === 'bloom' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOOM_LEVELS_INFO.map((b) => (
              <div
                key={b.level}
                className="p-4 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod4 space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="badge-vivid-mod4">
                    {b.level}: {b.name}
                  </span>
                </div>
                <div className="text-[11px] font-mono font-bold text-brand-mid dark:text-purple-400">Verbs: {b.verb}</div>
                <p className="text-xs text-ink-muted dark:text-darklab-muted font-medium">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl card-vivid-mod2 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink dark:text-white mb-4 flex items-center gap-2">
              <Table className="w-5 h-5 text-mod2" />
              Bloom's Taxonomy Marks Distribution (80-Mark Theory ESE Blueprint)
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-cream-border dark:border-darklab-border">
              <table className="w-full text-xs font-mono border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-mod2-wash dark:bg-darklab-base text-ink dark:text-white border-b-2 border-mod2 font-black">
                    <th className="p-3 text-left">Module</th>
                    <th className="p-3 text-center">Remember (BL1)</th>
                    <th className="p-3 text-center">Understand (BL2)</th>
                    <th className="p-3 text-center">Apply (BL3)</th>
                    <th className="p-3 text-center">Analyze/Evaluate (BL4/5)</th>
                    <th className="p-3 text-center text-mod4 font-black">Total Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border dark:divide-darklab-border">
                  {BLOOM_SPECIFICATION_TABLE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-cream-soft dark:hover:bg-darklab-base/50 transition-colors">
                      <td className="p-3 font-bold text-ink dark:text-white">{row.module}</td>
                      <td className="p-3 text-center text-ink dark:text-white">{row.rememberWeight}M</td>
                      <td className="p-3 text-center text-ink dark:text-white">{row.understandWeight}M</td>
                      <td className="p-3 text-center text-ink dark:text-white">{row.applyWeight}M</td>
                      <td className="p-3 text-center text-ink dark:text-white">{row.analyzeWeight}M</td>
                      <td className="p-3 text-center font-bold text-mod4">
                        <span className="bg-mod4 text-white px-2.5 py-0.5 rounded-lg shadow-violet font-bold">
                          {row.totalMarks}M
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

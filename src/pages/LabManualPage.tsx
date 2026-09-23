import React, { useState, useMemo } from 'react';
import { LAB_EXPERIMENTS } from '../data/labs';
import { LabExperimentDef } from '../types/course';
import { useCourseStore } from '../store/useCourseStore';
import {
  FlaskConical,
  CheckCircle2,
  Circle,
  Search,
  BookOpen,
  Layers,
  Cpu,
  HelpCircle,
  Table,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  TtlTotemPoleSchematic,
  MasterSlaveJkSchematic,
  Mod6RippleCounterSchematic,
  Mod8SyncCounterSchematic,
  FullAdderSubtractorSchematic,
  Decoder74138Schematic,
  SecurityDoorSchematic,
  SequenceDetectorFsmDiagram,
} from '../components/common/CircuitSchematics';

export const LabManualPage: React.FC<{
  initialLabId?: number;
  onNavigateToBreadboard?: (presetId?: string) => void;
  onNavigateToSimulator?: (simId?: string) => void;
}> = ({ initialLabId, onNavigateToBreadboard, onNavigateToSimulator }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLab, setActiveLab] = useState<LabExperimentDef>(
    LAB_EXPERIMENTS.find((l) => l.id === initialLabId) || LAB_EXPERIMENTS[0]
  );
  const [activeTab, setActiveTab] = useState<'theory' | 'procedure' | 'observations' | 'viva'>('theory');

  const { studentProgress, toggleLabComplete } = useCourseStore();

  const categories = ['All', 'Hardware TTL', 'Verilog HDL', 'System Design'];

  const filteredLabs = useMemo(() => {
    return LAB_EXPERIMENTS.filter((lab) => {
      const matchCat = selectedCategory === 'All' || lab.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        lab.title.toLowerCase().includes(q) ||
        lab.shortTitle.toLowerCase().includes(q) ||
        lab.co.toLowerCase().includes(q) ||
        lab.apparatus.some((a) => a.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const isCompleted = studentProgress.completedLabs.includes(activeLab.id);

  // Render schematic according to lab experiment
  const renderLabSchematic = (labId: number) => {
    switch (labId) {
      case 1:
        return <TtlTotemPoleSchematic activeRegion="TTL De Morgan Universal Logic" />;
      case 2:
        return <MasterSlaveJkSchematic />;
      case 3:
        return <Mod6RippleCounterSchematic />;
      case 4:
        return <Mod8SyncCounterSchematic />;
      case 7:
        return <FullAdderSubtractorSchematic />;
      case 8:
        return <Decoder74138Schematic />;
      case 11:
        return <SecurityDoorSchematic />;
      case 12:
        return <SequenceDetectorFsmDiagram />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-sm border-t-4 border-t-emerald-500 transition-colors">
        {/* Playful Ambient Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-mod3/20 to-brand-mid/20 blur-3xl opacity-60 animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-mod2/20 to-mod4/20 blur-3xl opacity-50 animate-blob-drift-2" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-vivid-mod3 uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
                <FlaskConical className="w-4 h-4 text-white" />
                12 University Lab Experiments • Mumbai University Scheme
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-white">
              <span className="text-brand-gradient">Digital System Design</span> Laboratory Manual
            </h1>
            <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl leading-relaxed font-medium">
              Complete university laboratory manual with experiment objectives, verified circuit pinouts, observation tables, step-by-step procedures, and viva voce flashcards.
            </p>
          </div>

          <div className="flex items-center gap-2 font-sans text-xs">
            <div className="px-5 py-2.5 rounded-2xl bg-white dark:bg-darklab-subtle border-2 border-mod3 text-ink-900 dark:text-white shadow-teal flex items-center gap-2 font-bold">
              <span className="text-ink-600 dark:text-cream-muted font-bold uppercase tracking-wider text-[11px]">Completed:</span>{' '}
              <strong className="text-mod3 font-black font-mono text-lg">
                {studentProgress.completedLabs.length}
              </strong>{' '}
              <span className="text-ink-600 dark:text-cream-muted font-bold">/ 12</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-mid absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiments, apparatus, ICs (e.g. 7476, counter, adder, Verilog)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-xs font-sans text-ink-900 dark:text-white placeholder:text-ink-500 dark:placeholder:text-cream-muted focus:outline-none focus:border-brand-mid shadow-inner font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-1 bg-cream-soft dark:bg-darklab-subtle p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all ${
                  selectedCategory === cat
                    ? 'btn-brand-gradient !text-white shadow-brand'
                    : 'text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 12 Experiments List */}
        <div className="lg:col-span-4 space-y-3 max-h-[850px] overflow-y-auto pr-1">
          {filteredLabs.map((lab) => {
            const isSelected = activeLab.id === lab.id;
            const isDone = studentProgress.completedLabs.includes(lab.id);
            const cardBorderClass =
              lab.category === 'Hardware TTL'
                ? 'border-t-4 border-t-amber-500'
                : lab.category === 'Verilog HDL'
                ? 'border-t-4 border-t-purple-600'
                : 'border-t-4 border-t-emerald-500';

            return (
              <div
                key={lab.id}
                onClick={() => setActiveLab(lab)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${cardBorderClass} ${
                  isSelected
                    ? 'bg-mod3-wash dark:bg-darklab-card border-mod3 ring-2 ring-mod3 shadow-teal'
                    : 'bg-white dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink-900 dark:text-darklab-text hover:border-brand-mid hover:bg-cream-soft dark:hover:bg-darklab-subtle shadow-xs'
                }`}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLabComplete(lab.id);
                  }}
                  className="mt-0.5 shrink-0"
                  title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-mod3 fill-mod3/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-cream-border hover:text-brand-mid dark:text-darklab-muted" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-mod3 text-white">
                      Exp {lab.id}
                    </span>
                    <span className="text-[10px] font-sans font-bold text-ink-600 dark:text-cream-muted">
                      {lab.co} • {lab.category}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-sans font-bold text-ink-900 dark:text-white truncate mt-1">
                    {lab.shortTitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Experiment Manual Viewer */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-emerald-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
            {/* Title & Action Buttons Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cream-border dark:border-darklab-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-sans text-xs">
                  <span className="badge-vivid-mod3 font-bold">
                    Experiment {activeLab.id}
                  </span>
                  <span className="text-ink-600 dark:text-cream-muted font-bold">{activeLab.category}</span>
                  <span className="text-brand-mid dark:text-purple-400 font-bold">{activeLab.co}</span>
                  <span className="text-mod4 font-bold">({activeLab.bloom})</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-display font-black text-ink-900 dark:text-white mt-1">
                  {activeLab.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                {activeLab.breadboardPresetId && (
                  <button
                    onClick={() => onNavigateToBreadboard?.(activeLab.breadboardPresetId)}
                    className="px-3.5 py-2 rounded-xl btn-brand-gradient !text-white font-bold flex items-center gap-1.5 shadow-brand transition-transform active:scale-95"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Open in Breadboard</span>
                  </button>
                )}

                {activeLab.simulatorId && (
                  <button
                    onClick={() => onNavigateToSimulator?.(activeLab.simulatorId)}
                    className="px-3.5 py-2 rounded-xl bg-mod4 hover:bg-purple-700 !text-white font-bold flex items-center gap-1.5 shadow-violet transition-transform active:scale-95"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Open Simulator</span>
                  </button>
                )}

                <button
                  onClick={() => toggleLabComplete(activeLab.id)}
                  className={`px-3.5 py-2 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
                    isCompleted
                      ? 'bg-mod3 !text-white border-mod3 shadow-teal'
                      : 'bg-white dark:bg-darklab-subtle text-ink-800 dark:text-cream-paper border-cream-border dark:border-darklab-border hover:border-mod3 hover:text-mod3 shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Completed ✓' : 'Mark Done'}</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex flex-wrap sm:flex-nowrap bg-cream-soft dark:bg-darklab-subtle p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border text-xs font-sans gap-1">
              {[
                { id: 'theory', label: '1. Objective & Theory' },
                { id: 'procedure', label: '2. Apparatus & Procedure' },
                { id: 'observations', label: '3. Observations & Table' },
                { id: 'viva', label: '4. Viva Voce Q&A' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 rounded-xl text-center font-bold transition-all ${
                    activeTab === tab.id
                      ? 'btn-brand-gradient !text-white shadow-brand'
                      : 'text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Objective & Theory */}
            {activeTab === 'theory' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 rounded-2xl bg-mod3-wash dark:bg-darklab-subtle border-2 border-mod3/40 space-y-1">
                  <span className="text-xs font-sans font-bold text-mod3 uppercase tracking-wider block">
                    Objective:
                  </span>
                  <p className="text-xs sm:text-sm font-sans font-medium text-ink-900 dark:text-white leading-relaxed">
                    {activeLab.objective}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-sans font-bold text-mod2-dark dark:text-mod2 uppercase block tracking-wider">
                    Underlying Academic Theory:
                  </span>
                  <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-xs sm:text-sm text-ink-800 dark:text-cream-paper leading-relaxed font-sans font-medium">
                    {activeLab.theory}
                  </div>
                </div>

                {/* Circuit Schematic */}
                {renderLabSchematic(activeLab.id) && (
                  <div className="space-y-2">
                    <span className="text-xs font-sans font-bold text-mod4 uppercase block tracking-wider">
                      Circuit Diagram & Schematic:
                    </span>
                    <div className="overflow-hidden rounded-3xl border border-cream-border dark:border-darklab-border">
                      {renderLabSchematic(activeLab.id)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Apparatus & Procedure */}
            {activeTab === 'procedure' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <span className="text-xs font-sans font-bold text-brand-mid uppercase block tracking-wider">
                    Required Hardware Apparatus / Software Tools:
                  </span>
                  <ul className="space-y-2 text-xs text-ink-800 dark:text-cream-paper font-sans">
                    {activeLab.apparatus.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border">
                        <span className="text-mod3 font-bold text-base leading-none">•</span>
                        <span className="font-semibold">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-sans font-bold text-mod2-dark dark:text-mod2 uppercase block tracking-wider">
                    Laboratory Experimental Procedure:
                  </span>
                  <ol className="space-y-2.5 text-xs sm:text-sm text-ink-800 dark:text-cream-paper font-sans">
                    {activeLab.procedure.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border leading-relaxed font-medium">
                        <span className="w-5 h-5 rounded-full bg-mod3 text-white font-sans font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 3: Observations & Table */}
            {activeTab === 'observations' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold text-brand-mid uppercase tracking-wider">
                    Verification Observation Matrix:
                  </span>
                  <span className="text-xs font-sans text-ink-600 dark:text-cream-muted font-bold">
                    Standard Laboratory Results
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border-2 border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-subtle shadow-inner">
                  <table className="w-full text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-mod3-wash dark:bg-darklab-surface border-b-2 border-mod3 text-ink-900 dark:text-white font-bold">
                        {activeLab.truthTableOrObservations.headers.map((h, idx) => (
                          <th key={idx} className="p-3 text-center border-r border-cream-border dark:border-darklab-border last:border-0 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-border dark:divide-darklab-border font-mono">
                      {activeLab.truthTableOrObservations.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-cream-soft dark:hover:bg-darklab-surface/50 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-center text-ink-900 dark:text-cream-paper font-semibold border-r border-cream-border dark:border-darklab-border last:border-0">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Viva Voce Q&A */}
            {activeTab === 'viva' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-2">
                  <span className="text-xs font-sans font-bold text-mod4 uppercase tracking-wider">
                    External Practical Viva Voce Questions & Answers
                  </span>
                  <span className="text-xs font-sans text-ink-600 dark:text-cream-muted font-bold">
                    Curated by University Examiners
                  </span>
                </div>

                <div className="space-y-3">
                  {activeLab.vivaQuestions.map((vq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border space-y-2 hover:border-mod4 transition-all">
                      <div className="flex items-start gap-2 text-xs font-bold font-sans text-ink-900 dark:text-white">
                        <span className="text-mod4 font-mono font-bold">Q{idx + 1}:</span>
                        <span>{vq.question}</span>
                      </div>
                      <div className="text-xs text-ink-800 dark:text-cream-paper pl-6 leading-relaxed font-sans font-medium">
                        <strong className="text-mod3-dark dark:text-mod3 font-sans text-xs block mb-0.5 font-bold">Answer:</strong>
                        {vq.answer}
                      </div>
                      {vq.tip && (
                        <div className="text-xs font-sans text-mod2-dark dark:text-mod2 font-bold pl-6 pt-1">
                          💡 Examiner Tip: {vq.tip}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

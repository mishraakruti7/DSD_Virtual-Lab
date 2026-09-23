import React, { useState } from 'react';
import { LAB_EXPERIMENTS } from '../../../data/experimentsData';
import { RealTimeSecurityDoor } from './RealTimeSecurityDoor';
import { VendingMachineFSM } from './VendingMachineFSM';
import { GatePlayground } from '../Station0Home/GatePlayground';
import { Module1Sequential } from '../Station1Theory/Module1Sequential';
import { Module4Verilog } from '../Station1Theory/Module4Verilog';
import { Module3FSM } from '../Station1Theory/Module3FSM';
import {
  SecurityDoorSchematic,
  SequenceDetectorFsmDiagram,
  VendingMachineAsmChart,
  MasterSlaveJkSchematic,
  TtlTotemPoleSchematic
} from '../../common/CircuitSchematics';
import {
  FlaskConical,
  Filter,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  Zap,
  Layers,
  FileCode
} from 'lucide-react';

export const LabExperiments: React.FC = () => {
  const [selectedExpId, setSelectedExpId] = useState<number>(11); // Default to real-time security door
  const [coFilter, setCoFilter] = useState<string>('All');
  const [openVivaIdx, setOpenVivaIdx] = useState<number | null>(0);

  const filteredExperiments = LAB_EXPERIMENTS.filter((exp) => {
    if (coFilter === 'All') return true;
    return exp.courseOutcome.includes(coFilter);
  });

  const currentExp = LAB_EXPERIMENTS.find((e) => e.id === selectedExpId) || LAB_EXPERIMENTS[0];

  return (
    <div className="space-y-10">
      {/* Station Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-mod3" />
            <span className="badge-vivid-mod3">
              Station 2 • University Practical Manual
            </span>
          </div>
          <h2 className="font-heading font-black text-3xl text-ink dark:text-white tracking-tight mt-2">
            12 Prescribed DSD Lab Experiments + Mini-Project
          </h2>
          <p className="text-ink-muted dark:text-darklab-muted text-sm mt-1">
            SAKEC / Mumbai University (ECCOR2PC203) • Complete apparatus, circuit schematics, procedures & live simulation testbenches.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-cream-soft dark:bg-darklab-card p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border flex-wrap shadow-xs">
          <Filter className="w-3.5 h-3.5 text-brand-mid ml-2" />
          {['All', 'CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map((co) => (
            <button
              key={co}
              onClick={() => setCoFilter(co)}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                coFilter === co ? 'btn-brand-gradient text-white shadow-brand' : 'text-ink-muted dark:text-darklab-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              {co}
            </button>
          ))}
        </div>
      </div>

      {/* Experiments Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {filteredExperiments.map((exp) => {
          const isSelected = selectedExpId === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => {
                setSelectedExpId(exp.id);
                setOpenVivaIdx(0);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all select-none flex flex-col justify-between border-t-4 border-t-emerald-500 ${
                isSelected
                  ? 'bg-mod3-wash dark:bg-darklab-card border-mod3 ring-2 ring-mod3 shadow-teal scale-[1.03]'
                  : 'bg-white dark:bg-darklab-card border-cream-border dark:border-darklab-border hover:border-brand-mid hover:bg-cream-soft dark:hover:bg-darklab-subtle text-ink dark:text-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold text-ink-muted dark:text-darklab-muted">Exp #{exp.id}</span>
                <span className="text-white font-bold bg-mod3 px-1.5 py-0.5 rounded text-[9px]">{exp.bloomLevel}</span>
              </div>
              <div className="font-heading font-bold text-xs line-clamp-2 text-ink dark:text-white mt-1">
                {exp.shortTitle}
              </div>
              <div className="text-[9px] font-mono text-ink-muted dark:text-darklab-muted mt-2 font-bold">
                {exp.courseOutcome}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Experiment Full Lab Report & Simulator */}
      <div className="bg-white dark:bg-darklab-card rounded-3xl p-6 sm:p-8 border border-cream-border dark:border-darklab-border border-t-4 border-t-emerald-500 shadow-sm space-y-8">
        
        {/* Lab Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-border dark:border-darklab-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-vivid-mod3">
                Experiment #{currentExp.id}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-muted dark:text-darklab-muted font-bold">
                Relevant: {currentExp.courseOutcome}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-muted dark:text-darklab-muted font-bold">
                Cognitive Level: {currentExp.bloomLevel}
              </span>
            </div>
            <h3 className="font-heading font-black text-2xl text-ink dark:text-white mt-2">
              {currentExp.title}
            </h3>
            <p className="text-xs text-ink-muted dark:text-darklab-muted mt-1 max-w-3xl leading-relaxed">
              <strong className="text-mod3">Objective:</strong> {currentExp.objective}
            </p>
          </div>
        </div>

        {/* Official Circuit Schematic Diagram Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-mod2 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-mod2" />
            <span>Official Circuit Schematic &amp; Hardware Wiring Diagram</span>
          </div>

          {currentExp.id === 11 ? (
            <SecurityDoorSchematic />
          ) : currentExp.id === 12 ? (
            <SequenceDetectorFsmDiagram />
          ) : currentExp.id === 13 ? (
            <VendingMachineAsmChart />
          ) : currentExp.id === 2 ? (
            <MasterSlaveJkSchematic />
          ) : (
            <div className="bg-cream-soft dark:bg-darklab-subtle p-5 rounded-2xl border border-cream-border dark:border-darklab-border text-ink dark:text-white">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-cream-border dark:border-darklab-border text-xs font-mono">
                <span className="font-bold text-brand-mid">
                  Experiment #{currentExp.id} Logical Connection Topology
                </span>
                <span className="text-mod3 font-bold">{currentExp.shortTitle}</span>
              </div>
              <p className="text-xs text-ink-muted dark:text-darklab-muted font-mono leading-relaxed mb-3">
                {currentExp.circuitSummary}
              </p>
              <div className="p-3 bg-white dark:bg-darklab-card rounded-xl border border-cream-border dark:border-darklab-border text-xs font-mono text-ink dark:text-white">
                Connection Checklist: {currentExp.apparatus.slice(1, 4).join(' • ')}
              </div>
            </div>
          )}
        </div>

        {/* Live Simulator Workspace for this Experiment */}
        <div className="pt-2">
          <div className="text-xs font-mono font-bold text-brand-mid uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-mid" />
            <span>Interactive Live Simulator for Experiment {currentExp.id}</span>
          </div>

          {currentExp.id === 11 ? (
            <RealTimeSecurityDoor />
          ) : currentExp.id === 13 ? (
            <VendingMachineFSM />
          ) : currentExp.id === 1 ? (
            <GatePlayground />
          ) : currentExp.id === 2 || currentExp.id === 3 || currentExp.id === 4 || currentExp.id === 5 || currentExp.id === 6 ? (
            <Module1Sequential />
          ) : currentExp.id === 7 || currentExp.id === 8 || currentExp.id === 9 || currentExp.id === 10 ? (
            <Module4Verilog />
          ) : (
            <Module3FSM />
          )}
        </div>

        {/* Apparatus & Theory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cream-border dark:border-darklab-border">
          
          {/* Apparatus */}
          <div className="bg-cream-soft dark:bg-darklab-subtle p-5 rounded-2xl border border-cream-border dark:border-darklab-border">
            <h4 className="font-heading font-bold text-sm text-ink dark:text-white mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-mod3" />
              Apparatus &amp; Required ICs
            </h4>
            <ul className="space-y-1.5 text-xs text-ink dark:text-darklab-text font-mono">
              {currentExp.apparatus.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-mod3 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Theory */}
          <div className="bg-cream-soft dark:bg-darklab-subtle p-5 rounded-2xl border border-cream-border dark:border-darklab-border">
            <h4 className="font-heading font-bold text-sm text-ink dark:text-white mb-3">
              Theoretical Principles
            </h4>
            <p className="text-xs text-ink-muted dark:text-darklab-muted leading-relaxed font-medium">
              {currentExp.theory}
            </p>
            <div className="mt-3 pt-3 border-t border-cream-border dark:border-darklab-border text-xs text-ink dark:text-white font-mono">
              <strong className="text-brand-mid">Circuit Connection:</strong> {currentExp.circuitSummary}
            </div>
          </div>
        </div>

        {/* Procedure & Observation Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Step-by-Step Procedure */}
          <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border">
            <h4 className="font-heading font-bold text-sm text-ink dark:text-white mb-3">
              Lab Procedure (Step-by-Step)
            </h4>
            <ol className="space-y-2 text-xs text-ink dark:text-darklab-text">
              {currentExp.procedure.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-mod3 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Observation Table Headers Guide */}
          <div className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border">
            <h4 className="font-heading font-bold text-sm text-ink dark:text-white mb-3">
              Observation Table Format
            </h4>
            <div className="overflow-x-auto rounded-xl border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-mod3-wash dark:bg-darklab-card border-b border-cream-border dark:border-darklab-border">
                  <tr>
                    {currentExp.observationHeaders.map((hdr, idx) => (
                      <th key={idx} className="py-2.5 px-3 font-bold text-ink dark:text-white border-r border-cream-border dark:border-darklab-border last:border-0">
                        {hdr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border dark:divide-darklab-border text-ink-muted dark:text-darklab-muted">
                  <tr>
                    {currentExp.observationHeaders.map((_, idx) => (
                      <td key={idx} className="py-2 px-3 italic border-r border-cream-border dark:border-darklab-border last:border-0">
                        [Reading {idx + 1}]
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-muted dark:text-darklab-muted mt-2 font-mono">
              * Record experimental readings from the live simulator above into your lab journal.
            </p>
          </div>
        </div>

        {/* Viva Voce Questions with Collapsible Answers */}
        <div className="pt-4 border-t border-cream-border dark:border-darklab-border space-y-3">
          <h4 className="font-heading font-bold text-base text-ink dark:text-white flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-mod4" />
            <span>Viva Voce Oral Examination Questions</span>
          </h4>

          <div className="space-y-2">
            {currentExp.vivaQuestions.map((viva, idx) => {
              const isOpen = openVivaIdx === idx;
              return (
                <div key={idx} className="rounded-2xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-subtle overflow-hidden">
                  <button
                    onClick={() => setOpenVivaIdx(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-ink dark:text-white hover:bg-white dark:hover:bg-darklab-card"
                  >
                    <span>Q{idx + 1}: {viva.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-ink-muted" /> : <ChevronDown className="w-4 h-4 text-ink-muted" />}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 pt-0 text-xs text-ink-muted dark:text-darklab-muted border-t border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card leading-relaxed">
                      <strong className="text-mod3 font-bold">Model Answer:</strong> {viva.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GATES_DATA } from '../../../data/gateData';
import { GateType } from '../../../types/dsd';
import { GateSvgSymbol } from '../../common/GateSvgSymbol';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { LedIndicator } from '../../common/LedIndicator';
import { evaluateGate } from '../../../utils/logicSimulation';
import { Sparkles, Info, CheckCircle2 } from 'lucide-react';

export const GatePlayground: React.FC = () => {
  const [selectedGateId, setSelectedGateId] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(true);
  const [inputB, setInputB] = useState(true);

  const activeGate = GATES_DATA.find((g) => g.id === selectedGateId) || GATES_DATA[0];
  const outputY = evaluateGate(selectedGateId, inputA, inputB);

  return (
    <div className="bg-cream-paper dark:bg-darklab-card rounded-3xl p-6 sm:p-8 border border-cream-border dark:border-darklab-border shadow-soft-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-cream-border dark:border-darklab-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
              Interactive Tool
            </span>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink-900 dark:text-white">
              Quick Logic Gate Playground
            </h3>
          </div>
          <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
            Toggle inputs A & B, observe real-time schematic wire propagation, and verify truth table rows.
          </p>
        </div>

        {/* Quick Gate Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-cream-soft dark:bg-darklab-base p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border">
          {GATES_DATA.map((gate) => {
            const isSelected = selectedGateId === gate.id;
            return (
              <button
                key={gate.id}
                onClick={() => setSelectedGateId(gate.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-500 text-white font-bold shadow-brand-sm scale-105'
                    : 'text-ink-700 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-cream-paper dark:hover:bg-darklab-card'
                }`}
              >
                {gate.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Stage + Truth Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: Interactive Gate Stage */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Active Gate Header Card */}
          <div className="bg-cream-soft dark:bg-darklab-base p-5 rounded-2xl border border-cream-border dark:border-darklab-border flex items-start justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {activeGate.icCode}
              </div>
              <div className="text-lg font-heading font-bold text-ink-900 dark:text-white mt-0.5">
                {activeGate.name}
              </div>
              <div className="text-sm font-mono text-ink-700 dark:text-ink-300 mt-1 font-semibold">
                Boolean Logic: <span className="text-brand-600 dark:text-brand-400">{activeGate.expression}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-cream-paper dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-ink-700 dark:text-ink-300 shadow-soft-sm">
                Inputs: {activeGate.inputs}
              </span>
            </div>
          </div>

          {/* Interactive Schematic & Pin Controls */}
          <div className="bg-cream-soft/60 dark:bg-darklab-base rounded-3xl p-6 border border-cream-border dark:border-darklab-border shadow-inner flex flex-col md:flex-row items-center justify-around gap-6 relative">
            
            {/* Input Switches */}
            <div className="flex flex-col gap-5 bg-cream-paper dark:bg-darklab-card p-4 rounded-2xl border border-cream-border dark:border-darklab-border shadow-soft-sm">
              <div className="text-xs font-mono font-bold text-ink-600 dark:text-ink-400 uppercase tracking-wider">
                Controls
              </div>
              <ToggleSwitch
                checked={inputA}
                onChange={setInputA}
                label="Input A"
                accentColor="bg-brand-500"
              />
              {activeGate.inputs > 1 && (
                <ToggleSwitch
                  checked={inputB}
                  onChange={setInputB}
                  label="Input B"
                  accentColor="bg-brand-500"
                />
              )}
            </div>

            {/* SVG Schematic Symbol */}
            <div className="p-2">
              <GateSvgSymbol
                type={activeGate.id}
                inA={inputA}
                inB={inputB}
                outY={outputY}
                width={210}
                height={120}
              />
            </div>

            {/* Output Indicator LED */}
            <div className="flex flex-col items-center bg-cream-paper dark:bg-darklab-card p-4 rounded-2xl border border-cream-border dark:border-darklab-border shadow-soft-sm min-w-[130px]">
              <div className="text-xs font-mono font-bold text-ink-600 dark:text-ink-400 uppercase tracking-wider mb-2">
                Output (Y)
              </div>
              <LedIndicator
                isOn={outputY}
                color={outputY ? 'emerald' : 'ruby'}
                size="lg"
                label="LED Indicator"
              />
              <div className="mt-2 text-center text-xs font-mono">
                <span className={`font-bold ${outputY ? 'text-mod3-text dark:text-mod3' : 'text-mod1-text dark:text-mod1'}`}>
                  {outputY ? 'LOGIC HIGH (1)' : 'LOGIC LOW (0)'}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Note Callout */}
          <div className="p-4 rounded-2xl bg-mod2-light/70 dark:bg-mod2/15 border border-mod2-border dark:border-mod2/30 text-ink-800 dark:text-ink-300 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-mod2 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Academic Insight:</strong> {activeGate.academicNote}
            </div>
          </div>
        </div>

        {/* Right Column: Live Truth Table with Active Row Highlight */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-cream-soft dark:bg-darklab-base rounded-3xl p-5 border border-cream-border dark:border-darklab-border h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-border dark:border-darklab-border">
              <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-white">
                Truth Table Verification
              </h4>
              <span className="text-[11px] font-mono text-ink-500">
                Active row highlighted
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-cream-border dark:border-darklab-border bg-cream-paper dark:bg-darklab-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream-soft dark:bg-darklab-surface border-b border-cream-border dark:border-darklab-border text-[11px] font-mono font-bold text-ink-600 dark:text-ink-300 uppercase">
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3 text-center">Input A</th>
                    {activeGate.inputs > 1 && (
                      <th className="py-2.5 px-3 text-center">Input B</th>
                    )}
                    <th className="py-2.5 px-3 text-center">Output Y</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border dark:divide-darklab-border text-xs font-mono">
                  {activeGate.truthTable.map((row, idx) => {
                    const isCurrentActive =
                      activeGate.inputs === 1
                        ? (row.a === (inputA ? 1 : 0))
                        : (row.a === (inputA ? 1 : 0) && row.b === (inputB ? 1 : 0));

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isCurrentActive
                            ? 'bg-brand-50 dark:bg-brand-500/20 font-bold text-brand-900 dark:text-brand-300 ring-1 ring-brand-300 dark:ring-brand-500'
                            : 'hover:bg-cream-soft dark:hover:bg-darklab-surface text-ink-700 dark:text-ink-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-ink-400 font-normal">
                          #{idx + 1}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded ${
                            row.a === 1 ? 'bg-brand-100 text-brand-800 dark:bg-brand-500/30 dark:text-brand-300 font-bold' : 'bg-cream-soft dark:bg-darklab-surface text-ink-600 dark:text-ink-400'
                          }`}>
                            {row.a}
                          </span>
                        </td>
                        {activeGate.inputs > 1 && (
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-1.5 py-0.5 rounded ${
                              row.b === 1 ? 'bg-brand-100 text-brand-800 dark:bg-brand-500/30 dark:text-brand-300 font-bold' : 'bg-cream-soft dark:bg-darklab-surface text-ink-600 dark:text-ink-400'
                            }`}>
                              {row.b}
                            </span>
                          </td>
                        )}
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            row.y === 1 ? 'bg-mod3-light text-mod3-text dark:bg-mod3/20 dark:text-mod3' : 'bg-mod1-light text-mod1-text dark:bg-mod1/20 dark:text-mod1'
                          }`}>
                            {row.y}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isCurrentActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 font-bold">
                              <CheckCircle2 className="w-3 h-3 text-brand-500" />
                              Active
                            </span>
                          ) : (
                            <span className="text-ink-400 dark:text-ink-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Description Card */}
            <div className="mt-4 pt-3 border-t border-cream-border dark:border-darklab-border text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
              <p>{activeGate.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

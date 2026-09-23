import React, { useState } from 'react';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { LedIndicator } from '../../common/LedIndicator';
import {
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';

export const Module3FSM: React.FC = () => {
  // Sequence Detector State (Pattern: 1011)
  const [isOverlapping, setIsOverlapping] = useState<boolean>(true);
  const [seqState, setSeqState] = useState<'S0' | 'S1' | 'S2' | 'S3'>('S0');
  const [bitHistory, setBitHistory] = useState<number[]>([]);
  const [detectedIndices, setDetectedIndices] = useState<number[]>([]);
  const [justDetected, setJustDetected] = useState<boolean>(false);

  // Implication Table Solver State
  // Example 4-state machine: S0, S1, S2, S3
  // Output: S0=0, S1=0, S2=0, S3=1
  // User can click cells to test equivalence
  const [implicationCells, setImplicationCells] = useState<{ [key: string]: 'untested' | 'cross' | 'equivalent' }>({
    'S1-S0': 'untested',
    'S2-S0': 'untested',
    'S2-S1': 'untested',
    'S3-S0': 'untested',
    'S3-S1': 'untested',
    'S3-S2': 'untested',
  });

  // Handle Bit Injection for 1011 Detector
  const handleInjectBit = (bit: number) => {
    const newHistory = [...bitHistory, bit];
    setBitHistory(newHistory);

    let nextState: 'S0' | 'S1' | 'S2' | 'S3' = 'S0';
    let match = false;

    if (seqState === 'S0') {
      nextState = bit === 1 ? 'S1' : 'S0';
    } else if (seqState === 'S1') {
      nextState = bit === 0 ? 'S2' : 'S1';
    } else if (seqState === 'S2') {
      nextState = bit === 1 ? 'S3' : 'S0';
    } else if (seqState === 'S3') {
      if (bit === 1) {
        // MATCH DETECTED! (1011)
        match = true;
        nextState = isOverlapping ? 'S1' : 'S0';
      } else {
        nextState = 'S2';
      }
    }

    setSeqState(nextState);
    setJustDetected(match);
    if (match) {
      setDetectedIndices((prev) => [...prev, newHistory.length - 1]);
    }
  };

  const resetSequence = () => {
    setSeqState('S0');
    setBitHistory([]);
    setDetectedIndices([]);
    setJustDetected(false);
  };

  const handleCellClick = (key: string, isMismatch: boolean) => {
    setImplicationCells((prev) => ({
      ...prev,
      [key]: isMismatch ? 'cross' : 'equivalent',
    }));
  };

  return (
    <div className="space-y-12">
      {/* Module Title Banner */}
      <div className="bg-mod3-light/60 dark:bg-darklab-surface/80 rounded-3xl p-6 sm:p-8 border border-mod3/30 shadow-cream-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mod3-light text-mod3-dark border border-mod3/30">
              Module 3 • CO4 (9 Hours)
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-white mt-2">
              Finite State Machines (FSM) & ASM Charts
            </h2>
            <p className="text-sm text-ink/70 dark:text-darklab-muted mt-1 max-w-2xl">
              Compare Mealy vs Moore models, reduce redundant states via triangular Implication Charts, track real-time sequence detection for pattern '1011', and master ASM chart symbols.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-ink/70 dark:text-darklab-muted bg-white/80 dark:bg-darklab-subtle px-4 py-2 rounded-2xl border border-mod3/30 shadow-teal-sm">
            <Compass className="w-4 h-4 text-mod3-dark dark:text-mod3" />
            <span>Mealy, Moore, ASM, Implication</span>
          </div>
        </div>
      </div>

      {/* Sub-Section 1: Mealy vs Moore Architectural Comparison */}
      <div className="bg-white/80 dark:bg-darklab-surface/80 rounded-3xl p-6 sm:p-8 border border-cream-200/80 dark:border-darklab-border shadow-cream-sm">
        <div className="pb-4 mb-6 border-b border-cream-200/80 dark:border-darklab-border">
          <h3 className="font-heading font-bold text-xl text-ink dark:text-white">
            1. Mealy vs Moore State Machine Models
          </h3>
          <p className="text-xs text-ink/60 dark:text-darklab-muted mt-0.5">
            Key differences in output dependency, clock cycle latency, and hardware glitch vulnerability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mealy Model */}
          <div className="bg-canvas-cream rounded-2xl p-6 border border-border-warm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-base text-stone-900">
                Mealy State Machine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                Z = λ(State, Input)
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Outputs are evaluated as a function of <strong>both the present state AND current inputs</strong>. Outputs react asynchronously within the current clock cycle as soon as inputs toggle.
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600 font-mono">
              <li>• <strong>States:</strong> Generally requires fewer states (e.g. n states for an n-bit sequence).</li>
              <li>• <strong>Timing:</strong> Responds one clock cycle earlier than Moore.</li>
              <li>• <strong>Trade-off:</strong> Input noise spikes / glitches can propagate directly to outputs.</li>
            </ul>
          </div>

          {/* Moore Model */}
          <div className="bg-canvas-cream rounded-2xl p-6 border border-border-warm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-base text-stone-900">
                Moore State Machine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300 font-bold">
                Z = λ(State)
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Outputs are evaluated strictly as a function of the <strong>present state only</strong>. Output values remain entirely steady throughout the clock period and change only on active clock transitions.
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600 font-mono">
              <li>• <strong>States:</strong> Requires n+1 states for an n-bit sequence detector.</li>
              <li>• <strong>Timing:</strong> Output changes 1 clock cycle later (synchronized).</li>
              <li>• <strong>Advantage:</strong> Completely glitch-free outputs, immune to input line ringing.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sub-Section 2: Sequence Detector Simulator (Pattern: 1011) */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-lavender-100 text-lavender-900 border border-lavender-300">
              Interactive State Machine
            </div>
            <h3 className="font-heading font-bold text-xl text-stone-900 mt-1">
              2. Sequence Detector Simulator: Pattern '1011'
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Inject bits serially, watch real-time state traversal, and inspect output pulses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ToggleSwitch
              checked={isOverlapping}
              onChange={setIsOverlapping}
              label="Overlapping Mode"
              sublabel={isOverlapping ? '1011011 -> 2 pulses' : '1011011 -> 1 pulse'}
              accentColor="bg-lavender-600"
            />
          </div>
        </div>

        {/* State Node Graph Visualizer */}
        <div className="mt-6 bg-[#fcfbf9] rounded-2xl p-6 border border-border-warm">
          <div className="flex flex-wrap items-center justify-around gap-4 pb-6 border-b border-border-warm">
            {[
              { id: 'S0', label: 'S0: Reset / Idle', desc: 'No match yet' },
              { id: 'S1', label: 'S1: Got "1"', desc: 'Prefix 1 recognized' },
              { id: 'S2', label: 'S2: Got "10"', desc: 'Prefix 10 recognized' },
              { id: 'S3', label: 'S3: Got "101"', desc: 'Awaiting final 1' },
            ].map((node) => {
              const isActive = seqState === node.id;
              return (
                <div
                  key={node.id}
                  className={`w-36 p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                    isActive
                      ? 'bg-lavender-100 border-lavender-600 shadow-md scale-105 ring-2 ring-lavender-300'
                      : 'bg-[#faf6ee] border-stone-300 opacity-60'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs mb-1 ${
                    isActive ? 'bg-lavender-700 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {node.id}
                  </span>
                  <span className="text-xs font-bold text-stone-800">{node.label.split(':')[1]}</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">{node.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Controls & Bitstream Feed */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-stone-700">Inject Next Bit:</span>
              <button
                onClick={() => handleInjectBit(0)}
                className="tactile-btn py-2 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 font-mono text-sm font-bold text-stone-800"
              >
                Bit 0
              </button>
              <button
                onClick={() => handleInjectBit(1)}
                className="tactile-btn py-2 px-5 rounded-xl bg-lavender-200 hover:bg-lavender-300 text-lavender-950 border border-lavender-300 font-mono text-sm font-bold shadow-soft-sm"
              >
                Bit 1
              </button>
              <button
                onClick={resetSequence}
                className="tactile-btn p-2 rounded-xl text-stone-500 hover:bg-stone-100 border border-stone-200"
                title="Reset Stream"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Live Detection Strobe */}
            <div className="flex items-center gap-4 bg-[#faf6ee] p-3.5 rounded-2xl border border-border-warm shadow-soft-sm">
              <LedIndicator
                isOn={justDetected}
                color="emerald"
                size="md"
                label="Match Output (Z)"
              />
              <div className="text-xs font-mono">
                <div>Output Pulse: <strong className={justDetected ? 'text-emerald-700' : 'text-stone-400'}>{justDetected ? '1 (DETECTED!)' : '0 (Searching)'}</strong></div>
                <div className="text-[11px] text-stone-500">Total Matches: {detectedIndices.length}</div>
              </div>
            </div>
          </div>

          {/* Bitstream Tape Display */}
          <div className="mt-5 pt-4 border-t border-border-warm">
            <div className="text-[11px] font-mono text-stone-500 mb-1">
              Injected Bitstream History ({bitHistory.length} bits):
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-xs">
              {bitHistory.length === 0 && (
                <span className="text-stone-400 italic">No bits injected yet. Click "Bit 0" or "Bit 1" above.</span>
              )}
              {bitHistory.map((bit, idx) => {
                const isDetectionEnd = detectedIndices.includes(idx);
                return (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded border ${
                      isDetectionEnd
                        ? 'bg-emerald-200 text-emerald-950 font-bold border-emerald-400 animate-pulse'
                        : 'bg-[#faf6ee] border-stone-200 text-stone-700'
                    }`}
                  >
                    {bit}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 3: Interactive Implication Chart Solver */}
      <div className="bg-[#faf6ee] dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#ded5c2] dark:border-stone-800 shadow-soft-sm">
        <div className="pb-4 mb-6 border-b border-[#ded5c2] dark:border-stone-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-900 border border-sky-300">
            State Reduction Method
          </div>
          <h3 className="font-heading font-bold text-xl text-stone-900 dark:text-stone-100 mt-1">
            3. State Minimization: Implication Chart Table Solver
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Test state pairs: if outputs differ, mark with an X (incompatible). If outputs match, evaluate next-state dependency conditions.
          </p>
        </div>

        {/* State Table Source */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#fbf7ee] dark:bg-stone-950 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-800">
            <div className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase mb-2">
              Unreduced State Table (Example Machine)
            </div>
            <table className="w-full text-left border-collapse text-xs font-mono bg-[#faf6ee] dark:bg-stone-900 rounded-xl border border-[#ded5c2] dark:border-stone-800">
              <thead>
                <tr className="bg-[#f5efe4] dark:bg-stone-800/60 border-b border-[#ded5c2] dark:border-stone-800 text-stone-700 dark:text-stone-300">
                  <th className="py-2 px-3">State</th>
                  <th className="py-2 px-3">Next (X=0)</th>
                  <th className="py-2 px-3">Next (X=1)</th>
                  <th className="py-2 px-3">Output (Z)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ded5c2] dark:divide-stone-800">
                <tr><td className="py-1.5 px-3 font-bold">S0</td><td className="py-1.5 px-3">S1</td><td className="py-1.5 px-3">S2</td><td className="py-1.5 px-3 text-sky-700 dark:text-sky-400 font-bold">0</td></tr>
                <tr><td className="py-1.5 px-3 font-bold">S1</td><td className="py-1.5 px-3">S1</td><td className="py-1.5 px-3">S2</td><td className="py-1.5 px-3 text-sky-700 dark:text-sky-400 font-bold">0</td></tr>
                <tr><td className="py-1.5 px-3 font-bold">S2</td><td className="py-1.5 px-3">S3</td><td className="py-1.5 px-3">S0</td><td className="py-1.5 px-3 text-sky-700 dark:text-sky-400 font-bold">0</td></tr>
                <tr><td className="py-1.5 px-3 font-bold">S3</td><td className="py-1.5 px-3">S2</td><td className="py-1.5 px-3">S1</td><td className="py-1.5 px-3 text-rose-700 dark:text-rose-400 font-bold">1</td></tr>
              </tbody>
            </table>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
              Note: S3 has output Z=1 while S0, S1, S2 have output Z=0.
            </div>
          </div>

          {/* Interactive Triangular Grid */}
          <div className="lg:col-span-7 bg-[#fbf7ee] dark:bg-stone-950 p-5 rounded-2xl border border-[#ded5c2] dark:border-stone-800 font-mono text-xs">
            <div className="font-bold text-stone-800 dark:text-stone-200 mb-3">
              Triangular Implication Matrix (Click cells to solve)
            </div>

            <div className="space-y-3">
              {/* Row S1 */}
              <div className="flex items-center gap-3">
                <span className="w-10 font-bold text-stone-700 dark:text-stone-300">S1</span>
                <button
                  onClick={() => handleCellClick('S1-S0', false)}
                  className={`px-4 py-2 rounded-xl border text-center transition-all ${
                    implicationCells['S1-S0'] === 'equivalent'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                      : 'bg-[#faf6ee] hover:bg-[#f3ede1] dark:bg-stone-900 dark:hover:bg-stone-800 border-[#ded5c2] dark:border-stone-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  (S1, S0): {implicationCells['S1-S0'] === 'equivalent' ? '✓ (S0 ≡ S1)' : 'Outputs match (Z=0). Click to verify'}
                </button>
              </div>

              {/* Row S2 */}
              <div className="flex items-center gap-3">
                <span className="w-10 font-bold text-stone-700 dark:text-stone-300">S2</span>
                <button
                  onClick={() => handleCellClick('S2-S0', true)}
                  className={`px-3 py-2 rounded-xl border transition-all ${
                    implicationCells['S2-S0'] === 'cross'
                      ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                      : 'bg-[#faf6ee] hover:bg-[#f3ede1] dark:bg-stone-900 dark:hover:bg-stone-800 border-[#ded5c2] dark:border-stone-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  (S2, S0): {implicationCells['S2-S0'] === 'cross' ? '× (Diff paths)' : 'Test'}
                </button>
                <button
                  onClick={() => handleCellClick('S2-S1', true)}
                  className={`px-3 py-2 rounded-xl border transition-all ${
                    implicationCells['S2-S1'] === 'cross'
                      ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                      : 'bg-[#faf6ee] hover:bg-[#f3ede1] dark:bg-stone-900 dark:hover:bg-stone-800 border-[#ded5c2] dark:border-stone-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  (S2, S1): {implicationCells['S2-S1'] === 'cross' ? '× (Diff paths)' : 'Test'}
                </button>
              </div>

              {/* Row S3 */}
              <div className="flex items-center gap-3">
                <span className="w-10 font-bold text-stone-700 dark:text-stone-300">S3</span>
                {['S3-S0', 'S3-S1', 'S3-S2'].map((pair) => (
                  <button
                    key={pair}
                    onClick={() => handleCellClick(pair, true)}
                    className={`px-3 py-2 rounded-xl border transition-all ${
                      implicationCells[pair] === 'cross'
                        ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                        : 'bg-[#faf6ee] hover:bg-[#f3ede1] dark:bg-stone-900 dark:hover:bg-stone-800 border-[#ded5c2] dark:border-stone-700 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {implicationCells[pair] === 'cross' ? '× (Output Mismatch)' : `(${pair.replace('-', ', ')})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ded5c2] dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
              <strong>Reduction Result:</strong> States <strong>S0 and S1 are equivalent (S0 ≡ S1)</strong>! They can be merged into a single state, reducing the FSM from 4 states to 3 states (saving flip-flops).
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 4: ASM Chart Standard Symbols */}
      <div className="bg-[#faf6ee] dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#ded5c2] dark:border-stone-800 shadow-soft-sm">
        <div className="pb-4 mb-6 border-b border-[#ded5c2] dark:border-stone-800">
          <h3 className="font-heading font-bold text-xl text-stone-900 dark:text-stone-100">
            4. Algorithmic State Machine (ASM) Standard Symbols
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            The three elemental blocks of ASM charts: State Box, Decision Box, and Conditional Output Box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* State Box */}
          <div className="bg-[#fbf7ee] dark:bg-stone-950 p-5 rounded-2xl border border-[#ded5c2] dark:border-stone-800 text-center space-y-3">
            <div className="w-32 h-16 mx-auto bg-[#faf6ee] dark:bg-stone-900 border-2 border-stone-600 dark:border-stone-400 rounded-lg flex flex-col justify-center items-center shadow-sm">
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">STATE_NAME [01]</span>
              <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200">Moore_Out = 1</span>
            </div>
            <div className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
              State Box (Rectangle)
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Represents an autonomous state in the sequential circuit. Holds unconditional <strong>Moore outputs</strong> that remain active for the full clock cycle.
            </p>
          </div>

          {/* Decision Box */}
          <div className="bg-[#fbf7ee] dark:bg-stone-950 p-5 rounded-2xl border border-[#ded5c2] dark:border-stone-800 text-center space-y-3">
            <div className="w-24 h-16 mx-auto bg-[#faf6ee] dark:bg-stone-900 border-2 border-stone-600 dark:border-stone-400 rotate-45 flex items-center justify-center shadow-sm">
              <span className="-rotate-45 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">X = 1 ?</span>
            </div>
            <div className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
              Decision Box (Diamond)
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Evaluates an external input condition or flag. Has 1 entry path and 2 exit paths (True '1' and False '0') directing the transition.
            </p>
          </div>

          {/* Conditional Output Box */}
          <div className="bg-[#fbf7ee] dark:bg-stone-950 p-5 rounded-2xl border border-[#ded5c2] dark:border-stone-800 text-center space-y-3">
            <div className="w-32 h-16 mx-auto bg-[#faf6ee] dark:bg-stone-900 border-2 border-stone-600 dark:border-stone-400 rounded-full flex flex-col justify-center items-center shadow-sm">
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">Mealy_Out = 1</span>
            </div>
            <div className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
              Conditional Output (Oval)
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Asserts conditional <strong>Mealy outputs</strong>. Connected to a branch of a decision box, active only when that specific condition is met in that state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

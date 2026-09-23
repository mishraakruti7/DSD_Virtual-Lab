import React, { useState } from 'react';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { LedIndicator } from '../../common/LedIndicator';
import {
  Code,
  Copy,
  Check,
  Play,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Module4Verilog: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Active Testbench Tab
  const [activeTestbench, setActiveTestbench] = useState<'mux' | 'decoder' | 'comparator' | 'dff' | 'counter'>('mux');

  // Mux 4:1 Testbench State
  const [muxInputs, setMuxInputs] = useState<number[]>([1, 0, 1, 0]); // D0, D1, D2, D3
  const [muxSel, setMuxSel] = useState<number>(0); // 0, 1, 2, 3
  const muxOut = muxInputs[muxSel];

  // 3:8 Decoder Testbench State
  const [decEnable, setDecEnable] = useState<boolean>(true);
  const [decIn, setDecIn] = useState<number>(3); // 0 to 7
  const decOut = decEnable ? (1 << decIn) : 0;

  // 4-Bit Comparator State
  const [compA, setCompA] = useState<number>(5); // 0 to 15
  const [compB, setCompB] = useState<number>(3); // 0 to 15

  // D-FF State
  const [dffD, setDffD] = useState<boolean>(true);
  const [dffRstN, setDffRstN] = useState<boolean>(true); // active low
  const [dffQ, setDffQ] = useState<number>(0);

  // 4-bit Counter State
  const [cntEn, setCntEn] = useState<boolean>(true);
  const [cntUp, setCntUp] = useState<boolean>(true);
  const [cntVal, setCntVal] = useState<number>(0);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Verilog Code Snippets
  const codeMux = `// 4:1 Multiplexer (Dataflow Verilog HDL)
module mux4to1 (
    input  wire [3:0] d,    // Data inputs d[0]..d[3]
    input  wire [1:0] sel,  // 2-bit select bus
    output wire       y     // Mux Output
);
    // Continuous assignment using bit-select
    assign y = d[sel];

endmodule`;

  const codeDecoder = `// 3:8 Line Decoder with Active-HIGH Enable
module decoder3to8 (
    input  wire       en,   // Active HIGH enable
    input  wire [2:0] in,   // 3-bit binary input
    output reg  [7:0] out   // 8 decoded outputs
);
    always @(*) begin
        if (!en)
            out = 8'b00000000;
        else begin
            case (in)
                3'b000: out = 8'b00000001;
                3'b001: out = 8'b00000010;
                3'b010: out = 8'b00000100;
                3'b011: out = 8'b00001000;
                3'b100: out = 8'b00010000;
                3'b101: out = 8'b00100000;
                3'b110: out = 8'b01000000;
                3'b111: out = 8'b10000000;
                default: out = 8'b00000000;
            endcase
        end
    end
endmodule`;

  const codeComparator = `// 4-Bit Magnitude Comparator
module comparator4bit (
    input  wire [3:0] a,
    input  wire [3:0] b,
    output wire       a_gt_b, // A > B
    output wire       a_eq_b, // A == B
    output wire       a_lt_b  // A < B
);
    assign a_gt_b = (a > b);
    assign a_eq_b = (a == b);
    assign a_lt_b = (a < b);
endmodule`;

  const codeDff = `// Positive Edge-Triggered D Flip-Flop with Async Active-LOW Reset
module d_flip_flop (
    input  wire clk,
    input  wire rst_n, // Active-LOW asynchronous reset
    input  wire d,
    output reg  q,
    output wire q_bar
);
    assign q_bar = ~q;

    // Sequential procedural block with asynchronous sensitivity
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            q <= 1'b0;  // Asynchronous Clear
        else
            q <= d;     // Non-blocking assignment on clock edge
    end
endmodule`;

  const codeCounter = `// 4-Bit Synchronous Up/Down Binary Counter
module counter4bit (
    input  wire       clk,
    input  wire       rst_n,
    input  wire       en,
    input  wire       up_down, // 1: Count UP, 0: Count DOWN
    output reg  [3:0] count
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            count <= 4'b0000;
        else if (en) begin
            if (up_down)
                count <= count + 1'b1;
            else
                count <= count - 1'b1;
        end
    end
endmodule`;

  return (
    <div className="space-y-12">
      {/* Module Title Banner */}
      <div className="bg-mod4-light/60 dark:bg-darklab-surface/80 rounded-3xl p-6 sm:p-8 border border-mod4/30 shadow-cream-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mod4-light text-mod4-dark border border-mod4/30">
              Module 4 • CO5 (7 Hours)
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-white mt-2">
              Verilog HDL Modeling & RTL Simulation Studio
            </h2>
            <p className="text-sm text-ink/70 dark:text-darklab-muted mt-1 max-w-2xl">
              Understand dataflow vs behavioral modeling, blocking (=) vs non-blocking (&lt;=) assignments, 4-value logic, and simulate combinational & sequential RTL testbenches live.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-ink/70 dark:text-darklab-muted bg-white/80 dark:bg-darklab-subtle px-4 py-2 rounded-2xl border border-mod4/30 shadow-violet-sm">
            <Code className="w-4 h-4 text-mod4-dark dark:text-mod4" />
            <span>IEEE 1364 Synthesizable Verilog</span>
          </div>
        </div>
      </div>

      {/* Sub-Section 1: Verilog Fundamentals Grid */}
      <div className="bg-white/80 dark:bg-darklab-surface/80 rounded-3xl p-6 sm:p-8 border border-cream-200/80 dark:border-darklab-border shadow-cream-sm">
        <div className="pb-4 mb-6 border-b border-cream-200/80 dark:border-darklab-border">
          <h3 className="font-heading font-bold text-xl text-ink dark:text-white">
            1. Core Verilog HDL Rules & Syntax Principles
          </h3>
          <p className="text-xs text-ink/60 dark:text-darklab-muted mt-0.5">
            Key concepts every digital designer must know for hardware synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Rule 1 */}
          <div className="bg-[#fbf7ee] dark:bg-stone-950 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-800 space-y-2">
            <span className="font-mono font-bold text-sky-900 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-300 dark:border-sky-800 text-[11px]">
              4-Value Logic System
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Verilog models physical silicon using 4 discrete values:
            </p>
            <ul className="font-mono text-[11px] text-stone-600 dark:text-stone-400 space-y-1">
              <li><strong>0:</strong> Logic Low (GND)</li>
              <li><strong>1:</strong> Logic High (VCC)</li>
              <li><strong>x:</strong> Unknown / Uninitialized</li>
              <li><strong>z:</strong> High Impedance (Tri-state)</li>
            </ul>
          </div>

          {/* Rule 2 */}
          <div className="bg-[#fbf7ee] dark:bg-stone-950 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-800 space-y-2">
            <span className="font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800 text-[11px]">
              wire vs reg
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              <strong>wire:</strong> Net type driven continuously by gate outputs or <code>assign</code>. Zero memory storage.
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              <strong>reg:</strong> Variable that retains value across procedural evaluations. Driven only inside <code>always</code> or <code>initial</code>.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-[#fbf7ee] dark:bg-stone-950 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-800 space-y-2">
            <span className="font-mono font-bold text-rose-900 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-800 text-[11px]">
              Blocking (=)
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Executes sequentially line-by-line, blocking subsequent statements in the block.
            </p>
            <div className="p-2 bg-[#faf6ee] dark:bg-stone-900 rounded-lg border border-[#ded5c2] dark:border-stone-800 font-mono text-[11px] text-stone-700 dark:text-stone-300">
              MUST use for <strong>combinational logic</strong> (<code>always @(*)</code>).
            </div>
          </div>

          {/* Rule 4 */}
          <div className="bg-[#fbf7ee] dark:bg-stone-950 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-800 space-y-2">
            <span className="font-mono font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 text-[11px]">
              Non-Blocking (&lt;=)
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Evaluates all right-hand sides concurrently and updates registers at end of time step.
            </p>
            <div className="p-2 bg-[#faf6ee] dark:bg-stone-900 rounded-lg border border-[#ded5c2] dark:border-stone-800 font-mono text-[11px] text-stone-700 dark:text-stone-300">
              MUST use for <strong>sequential logic</strong> (<code>posedge clk</code>).
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 2: Live Verilog RTL Testbenches */}
      <div className="bg-[#faf6ee] dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#ded5c2] dark:border-stone-800 shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#ded5c2] dark:border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              RTL Synthesis Simulator
            </div>
            <h3 className="font-heading font-bold text-xl text-stone-900 dark:text-stone-100 mt-1">
              2. Interactive Verilog RTL Testbenches
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Select a module, stimulate inputs live, inspect simulated outputs, and copy synthesizable Verilog code.
            </p>
          </div>

          {/* Testbench Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#f5efe4] dark:bg-stone-950 p-1 rounded-2xl border border-[#ded5c2] dark:border-stone-800">
            {[
              { id: 'mux', label: '4:1 MUX' },
              { id: 'decoder', label: '3:8 Decoder' },
              { id: 'comparator', label: '4-bit Comparator' },
              { id: 'dff', label: 'D Flip-Flop' },
              { id: 'counter', label: '4-bit Counter' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTestbench(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  activeTestbench === tab.id
                    ? 'bg-emerald-200 text-emerald-950 font-bold border border-emerald-400 shadow-soft-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-[#faf6ee] dark:hover:bg-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testbench Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Left: Interactive Input/Output Stimulus */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#fbf7ee] dark:bg-stone-950 p-5 rounded-2xl border border-[#ded5c2] dark:border-stone-800 space-y-4">
              <div className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase">
                Interactive Stimulus Controls
              </div>

              {/* 4:1 MUX Controls */}
              {activeTestbench === 'mux' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-stone-600 dark:text-stone-400 block mb-1">Select Bus (sel[1:0]):</label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((s) => (
                        <button
                          key={s}
                          onClick={() => setMuxSel(s)}
                          className={`flex-1 py-1.5 rounded font-mono text-xs font-bold ${
                            muxSel === s
                              ? 'bg-sky-200 text-sky-950 border border-sky-400 font-bold'
                              : 'bg-[#faf6ee] dark:bg-stone-900 border border-[#ded5c2] dark:border-stone-700 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {s.toString(2).padStart(2, '0')} (D{s})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-stone-600 dark:text-stone-400 block mb-1">Data Inputs d[3:0]:</label>
                    <div className="flex gap-2">
                      {muxInputs.map((val, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const copy = [...muxInputs];
                            copy[idx] = val === 1 ? 0 : 1;
                            setMuxInputs(copy);
                          }}
                          className={`flex-1 py-1.5 rounded font-mono text-xs font-bold transition-colors ${
                            val === 1
                              ? 'bg-emerald-200 text-emerald-950 border border-emerald-400 font-bold'
                              : 'bg-[#f5efe4] dark:bg-stone-800 border border-[#ded5c2] dark:border-stone-700 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          D{idx}={val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#ded5c2] dark:border-stone-800 flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Output wire y:</span>
                    <span className="text-lg font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                      {muxOut}
                    </span>
                  </div>
                </div>
              )}

              {/* 3:8 Decoder Controls */}
              {activeTestbench === 'decoder' && (
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={decEnable}
                    onChange={setDecEnable}
                    label="Enable (en)"
                    sublabel={decEnable ? 'Active HIGH' : 'All outputs forced 0'}
                    accentColor="bg-sky-600"
                  />

                  <div>
                    <label className="text-xs font-mono text-stone-600 dark:text-stone-400 block mb-1">
                      Input Code in[2:0] (0 to 7):
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="7"
                      value={decIn}
                      onChange={(e) => setDecIn(parseInt(e.target.value))}
                      className="w-full accent-sky-600 h-2 bg-[#e8e0ce] dark:bg-stone-700 rounded-lg cursor-pointer"
                    />
                    <div className="text-xs font-mono text-right text-stone-700 dark:text-stone-300 mt-1 font-bold">
                      in = 3'b{decIn.toString(2).padStart(3, '0')} ({decIn})
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#ded5c2] dark:border-stone-800">
                    <div className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 mb-2">
                      Decoded Output Bus out[7:0]:
                    </div>
                    <div className="flex gap-1 font-mono text-xs justify-between">
                      {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
                        const bitVal = (decOut >> bitIdx) & 1;
                        return (
                          <div key={bitIdx} className="text-center">
                            <span className="text-[9px] text-stone-400 dark:text-stone-500 block">Y{bitIdx}</span>
                            <span className={`w-6 h-6 rounded flex items-center justify-center font-bold transition-all ${
                              bitVal === 1
                                ? 'bg-emerald-200 text-emerald-950 border border-emerald-400 shadow-sm'
                                : 'bg-[#faf6ee] dark:bg-stone-900 border border-[#ded5c2] dark:border-stone-700 text-stone-500 dark:text-stone-400'
                            }`}>
                              {bitVal}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 4-Bit Comparator Controls */}
              {activeTestbench === 'comparator' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-stone-600 dark:text-stone-400">Operand A[3:0]:</span>
                      <strong className="text-sky-800 dark:text-sky-300">{compA} (4'b{compA.toString(2).padStart(4, '0')})</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={compA}
                      onChange={(e) => setCompA(parseInt(e.target.value))}
                      className="w-full accent-sky-600 h-2 bg-[#e8e0ce] dark:bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-stone-600 dark:text-stone-400">Operand B[3:0]:</span>
                      <strong className="text-amber-800 dark:text-amber-300">{compB} (4'b{compB.toString(2).padStart(4, '0')})</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={compB}
                      onChange={(e) => setCompB(parseInt(e.target.value))}
                      className="w-full accent-amber-600 h-2 bg-[#e8e0ce] dark:bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#ded5c2] dark:border-stone-800 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                    <div className={`p-2 rounded-xl border ${compA > compB ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-900' : 'bg-[#faf6ee] dark:bg-stone-900 border-[#ded5c2] dark:border-stone-800 text-stone-400'}`}>
                      A &gt; B ({compA > compB ? '1' : '0'})
                    </div>
                    <div className={`p-2 rounded-xl border ${compA === compB ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-900' : 'bg-[#faf6ee] dark:bg-stone-900 border-[#ded5c2] dark:border-stone-800 text-stone-400'}`}>
                      A == B ({compA === compB ? '1' : '0'})
                    </div>
                    <div className={`p-2 rounded-xl border ${compA < compB ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-900' : 'bg-[#faf6ee] dark:bg-stone-900 border-[#ded5c2] dark:border-stone-800 text-stone-400'}`}>
                      A &lt; B ({compA < compB ? '1' : '0'})
                    </div>
                  </div>
                </div>
              )}

              {/* D Flip-Flop Controls */}
              {activeTestbench === 'dff' && (
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={dffRstN}
                    onChange={(val) => {
                      setDffRstN(val);
                      if (!val) setDffQ(0); // async clear immediately!
                    }}
                    label="Reset_n (Active LOW)"
                    sublabel={dffRstN ? 'Normal Operation' : 'Forced Reset to 0'}
                    accentColor="bg-rose-500"
                  />
                  <ToggleSwitch
                    checked={dffD}
                    onChange={setDffD}
                    label="Data Input D"
                    accentColor="bg-sky-500"
                  />

                  <button
                    onClick={() => {
                      if (!dffRstN) setDffQ(0);
                      else setDffQ(dffD ? 1 : 0);
                    }}
                    className="tactile-btn w-full py-2.5 rounded-xl bg-emerald-200 text-emerald-950 font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-300 border border-emerald-400 shadow-soft-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-950" />
                    <span>Trigger Clock Edge (posedge clk)</span>
                  </button>

                  <div className="pt-3 border-t border-[#ded5c2] dark:border-stone-800 flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Registered Output Q:</span>
                    <span className="text-lg font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                      {dffQ}
                    </span>
                  </div>
                </div>
              )}

              {/* 4-Bit Counter Controls */}
              {activeTestbench === 'counter' && (
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={cntEn}
                    onChange={setCntEn}
                    label="Count Enable (en)"
                    accentColor="bg-sky-600"
                  />
                  <ToggleSwitch
                    checked={cntUp}
                    onChange={setCntUp}
                    label="Direction (up_down)"
                    sublabel={cntUp ? 'UP (0 → 15)' : 'DOWN (15 → 0)'}
                    accentColor="bg-sage-600"
                  />

                  <button
                    onClick={() => {
                      if (cntEn) {
                        setCntVal((prev) => cntUp ? (prev + 1) % 16 : (prev - 1 + 16) % 16);
                      }
                    }}
                    className="tactile-btn w-full py-2.5 rounded-xl bg-emerald-200 text-emerald-950 font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-300 border border-emerald-400 shadow-soft-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-950" />
                    <span>Trigger posedge clk</span>
                  </button>

                  <div className="pt-3 border-t border-[#ded5c2] dark:border-stone-800 flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">count[3:0]:</span>
                    <span className="text-lg font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                      {cntVal.toString(2).padStart(4, '0')} ({cntVal})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Verilog Code Viewer with Copy Button */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-[#f3ede1] dark:bg-stone-950 border border-[#ded5c2] dark:border-stone-800 rounded-2xl p-5 text-slate-800 dark:text-stone-100 font-mono text-xs relative shadow-soft-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ded5c2] dark:border-stone-800">
                  <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-stone-800 dark:text-stone-200 font-bold">
                      {activeTestbench === 'mux' && 'mux4to1.v'}
                      {activeTestbench === 'decoder' && 'decoder3to8.v'}
                      {activeTestbench === 'comparator' && 'comparator4bit.v'}
                      {activeTestbench === 'dff' && 'd_flip_flop.v'}
                      {activeTestbench === 'counter' && 'counter4bit.v'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const code =
                        activeTestbench === 'mux' ? codeMux :
                        activeTestbench === 'decoder' ? codeDecoder :
                        activeTestbench === 'comparator' ? codeComparator :
                        activeTestbench === 'dff' ? codeDff : codeCounter;
                      copyToClipboard(code, activeTestbench);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#e6ddca] hover:bg-[#dcd1bc] dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-[#d3c7ad] dark:border-stone-700 text-xs transition-colors"
                  >
                    {copiedKey === activeTestbench ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-800 dark:text-stone-200 selection:bg-amber-200 selection:text-amber-950 font-mono">
                  {activeTestbench === 'mux' && codeMux}
                  {activeTestbench === 'decoder' && codeDecoder}
                  {activeTestbench === 'comparator' && codeComparator}
                  {activeTestbench === 'dff' && codeDff}
                  {activeTestbench === 'counter' && codeCounter}
                </pre>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ded5c2] dark:border-stone-800 text-[10px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <span>Synthesizable RTL Verilog • Clean Non-Blocking Semantics</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Ready for Vivado / Quartus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

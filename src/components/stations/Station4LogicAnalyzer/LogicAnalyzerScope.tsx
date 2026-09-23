import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  Square,
  RotateCcw,
  Zap,
  ZoomIn,
  ZoomOut,
  Sliders,
  Sparkles
} from 'lucide-react';

interface WaveformPoint {
  t: number;
  clk: number;
  chA: number;
  chB: number;
  chY: number;
}

export const LogicAnalyzerScope: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [timebaseScale, setTimebaseScale] = useState<number>(1); // 0.5x, 1x, 2x
  const [sourceMode, setSourceMode] = useState<'gate' | 'counter' | 'detector'>('gate');
  const [gateSelection, setGateSelection] = useState<'AND' | 'OR' | 'XOR'>('AND');

  // Stats Counters
  const [risingEdges, setRisingEdges] = useState<number>(0);
  const [fallingEdges, setFallingEdges] = useState<number>(0);
  const [clkFreq, setClkFreq] = useState<number>(2); // 2 Hz default

  // Waveform History Buffer (holds up to 40 samples)
  const [waveform, setWaveform] = useState<WaveformPoint[]>([]);
  const timeStepRef = useRef<number>(0);
  const clockCycleRef = useRef<number>(0);

  // Tick generator
  const generateNextSample = (): WaveformPoint => {
    timeStepRef.current += 1;
    const t = timeStepRef.current;
    
    // Clock toggles every tick (2 ticks = 1 full period)
    const clk = t % 2 === 0 ? 1 : 0;
    if (clk === 1) {
      clockCycleRef.current += 1;
      setRisingEdges((prev) => prev + 1);
    } else {
      setFallingEdges((prev) => prev + 1);
    }

    let chA = 0;
    let chB = 0;
    let chY = 0;

    if (sourceMode === 'gate') {
      // Periodic test pattern for A and B
      chA = Math.floor(t / 4) % 2;
      chB = Math.floor(t / 8) % 2;
      if (gateSelection === 'AND') chY = chA & chB;
      else if (gateSelection === 'OR') chY = chA | chB;
      else if (gateSelection === 'XOR') chY = chA ^ chB;
    } else if (sourceMode === 'counter') {
      // Mod-6 count bit waveforms
      const count = Math.floor(t / 2) % 6;
      chA = count & 1; // QA (LSB)
      chB = (count >> 1) & 1; // QB
      chY = (count >> 2) & 1; // QC
    } else if (sourceMode === 'detector') {
      // 1011 sequence detection signal
      const bitStream = [1, 0, 1, 1, 0, 1, 0, 1, 1];
      const bitIdx = Math.floor(t / 4) % bitStream.length;
      chA = bitStream[bitIdx];
      chB = (bitIdx >= 3 && bitStream[bitIdx] === 1 && bitStream[bitIdx-1] === 1 && bitStream[bitIdx-2] === 0 && bitStream[bitIdx-3] === 1) ? 1 : 0;
      chY = chB; // output pulse
    }

    return { t, clk, chA, chB, chY };
  };

  // Run timer
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setWaveform((prev) => {
        const next = generateNextSample();
        const updated = [...prev, next];
        return updated.slice(-36); // keep last 36 samples for clean view
      });
    }, 450 / timebaseScale);

    return () => clearInterval(interval);
  }, [isRunning, timebaseScale, sourceMode, gateSelection]);

  // Single Step
  const handleSingleStep = () => {
    setWaveform((prev) => {
      const next = generateNextSample();
      const updated = [...prev, next];
      return updated.slice(-36);
    });
  };

  const handleReset = () => {
    setWaveform([]);
    timeStepRef.current = 0;
    setRisingEdges(0);
    setFallingEdges(0);
  };

  // Helper to construct digital stepped waveform path
  const renderDigitalChannelPath = (
    channelKey: keyof Omit<WaveformPoint, 't'>,
    baseY: number,
    amplitude: number = 28
  ) => {
    if (waveform.length < 2) return '';

    const stepWidth = 18 * timebaseScale;
    let d = '';

    waveform.forEach((pt, idx) => {
      const x = idx * stepWidth + 20;
      const val = pt[channelKey];
      const y = val === 1 ? baseY - amplitude : baseY;

      if (idx === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prevVal = waveform[idx - 1][channelKey];
        const prevY = prevVal === 1 ? baseY - amplitude : baseY;
        // Draw vertical transition edge then horizontal hold
        d += ` L ${x} ${prevY} L ${x} ${y}`;
      }
    });

    return d;
  };

  return (
    <div className="space-y-8">
      {/* Station Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sage-600" />
            <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
              Station 4 • Timing & Signal Acquisition
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl text-stone-900 tracking-tight mt-1">
            4-Channel Digital Logic Analyzer Scope
          </h2>
          <p className="text-stone-600 text-sm mt-0.5">
            Real-time digital timing waveform oscilloscope tracking Clock (CLK), Inputs (A, B), and Logic Output (Y).
          </p>
        </div>

        {/* Source Mode Selectors */}
        <div className="flex items-center gap-1.5 bg-canvas-warm p-1 rounded-2xl border border-border-warm">
          {[
            { id: 'gate', label: 'Logic Gate Stimulus' },
            { id: 'counter', label: 'MOD-6 Binary Ripple' },
            { id: 'detector', label: '1011 Sequence Detector' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSourceMode(mode.id as any);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                sourceMode === mode.id ? 'bg-indigo-200 text-indigo-950 font-bold shadow-soft-sm' : 'text-stone-600 hover:bg-[#f5efe4]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scope Main Screen */}
      <div className="bg-[#faf6ee] text-stone-800 rounded-3xl p-6 sm:p-8 border border-[#ded5c2] shadow-soft-md space-y-6">
        
        {/* Scope Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#ded5c2] text-xs font-mono">
          
          {/* Play/Pause & Step Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-amber-200 text-amber-950 border border-amber-300 hover:bg-amber-300'
                  : 'bg-emerald-200 text-emerald-950 border border-emerald-300 hover:bg-emerald-300'
              }`}
            >
              {isRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? 'HOLD (STOP)' : 'RUN (SWEEP)'}</span>
            </button>

            <button
              onClick={handleSingleStep}
              disabled={isRunning}
              className={`px-3.5 py-2 rounded-xl font-bold border transition-colors ${
                !isRunning
                  ? 'border-[#ded5c2] bg-[#f5efe4] text-stone-800 hover:bg-[#eae1cf]'
                  : 'border-[#ded5c2] text-stone-400 cursor-not-allowed'
              }`}
            >
              Single Pulse
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-[#ded5c2] bg-[#f5efe4] text-stone-700 hover:text-stone-950 hover:bg-[#eae1cf]"
              title="Clear Waveform"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Timebase Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Timebase:</span>
            {[0.5, 1, 1.5].map((scale) => (
              <button
                key={scale}
                onClick={() => setTimebaseScale(scale)}
                className={`px-2.5 py-1 rounded-lg border ${
                  timebaseScale === scale ? 'border-sky-300 bg-sky-200 text-sky-950 font-bold' : 'border-[#ded5c2] bg-[#f5efe4] text-stone-600 hover:text-stone-900'
                }`}
              >
                {scale}x
              </button>
            ))}
          </div>

          {/* Metrics Pills */}
          <div className="flex items-center gap-3 text-stone-600">
            <div>↑ Edges: <strong className="text-emerald-700">{risingEdges}</strong></div>
            <div>↓ Edges: <strong className="text-rose-700">{fallingEdges}</strong></div>
            <div>Freq: <strong className="text-amber-800">~{clkFreq} Hz</strong></div>
          </div>
        </div>

        {/* Oscilloscope Waveform Canvas */}
        <div className="relative overflow-x-auto bg-[#f1f6fa] rounded-2xl p-4 border border-[#cde0ed] shadow-inner min-w-[700px]">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          {/* SVG Waveform Lines */}
          <svg className="w-full h-80 relative z-10">
            {/* Channel 1: CLK (Sky Blue) */}
            <g>
              <text x="10" y="45" fill="#0369a1" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                CH1: CLK (Clock)
              </text>
              <path
                d={renderDigitalChannelPath('clk', 60, 26)}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(2,132,199,0.3)]"
              />
            </g>

            {/* Channel 2: Input A (Amber) */}
            <g>
              <text x="10" y="115" fill="#b45309" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                CH2: {sourceMode === 'counter' ? 'QA (LSB)' : 'Input A'}
              </text>
              <path
                d={renderDigitalChannelPath('chA', 130, 26)}
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(217,119,6,0.3)]"
              />
            </g>

            {/* Channel 3: Input B (Lavender) */}
            <g>
              <text x="10" y="185" fill="#7e22ce" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                CH3: {sourceMode === 'counter' ? 'QB' : 'Input B'}
              </text>
              <path
                d={renderDigitalChannelPath('chB', 200, 26)}
                fill="none"
                stroke="#9333ea"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(147,51,234,0.3)]"
              />
            </g>

            {/* Channel 4: Output Y (Emerald) */}
            <g>
              <text x="10" y="255" fill="#047857" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                CH4: {sourceMode === 'counter' ? 'QC (MSB)' : 'Output Y'}
              </text>
              <path
                d={renderDigitalChannelPath('chY', 270, 26)}
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(5,150,105,0.3)]"
              />
            </g>
          </svg>
        </div>

        {/* Legend & Channel Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-stone-600 pt-2 border-t border-[#ded5c2]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sky-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Channel 1: Clock (50% Duty Cycle)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Channel 2: Signal A
            </span>
            <span className="flex items-center gap-1.5 text-purple-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Channel 3: Signal B
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Channel 4: Output Y
            </span>
          </div>

          <div className="text-stone-500">
            Coupling: DC • Logic: CMOS 5V Standard
          </div>
        </div>
      </div>
    </div>
  );
};

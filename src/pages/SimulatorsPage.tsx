import React, { useState, useRef, useMemo } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Shield,
  Clock,
  Sliders,
} from 'lucide-react';
import { playAlarmBuzz, playSoftClick, playConnectClick } from '../utils/soundEffects';
import { CircularQueue, Graph, ExpressionEvaluator } from '../dsa';

export const SimulatorsPage: React.FC<{ initialSimId?: string }> = ({ initialSimId }) => {
  const [activeSim, setActiveSim] = useState<string>(initialSimId || 'flip-flops');
  const [canvasContrast, setCanvasContrast] = useState<'light' | 'dark'>('light');

  // --- 1. Clocked Flip-Flop State ---
  const [ffType, setFfType] = useState<'JK' | 'D' | 'T' | 'SR'>('JK');
  const [in1, setIn1] = useState<number>(1); // J or D or T or S
  const [in2, setIn2] = useState<number>(0); // K or R
  const [ffQ, setFfQ] = useState<number>(0);
  const [ffClk, setFfClk] = useState<number>(0);

  const clockFlipFlop = () => {
    playSoftClick();
    setFfClk((c) => (c === 0 ? 1 : 0));
    // Trigger on rising edge
    if (ffType === 'JK') {
      if (in1 === 0 && in2 === 0) {
        // No change
      } else if (in1 === 0 && in2 === 1) {
        setFfQ(0); // Reset
      } else if (in1 === 1 && in2 === 0) {
        setFfQ(1); // Set
      } else if (in1 === 1 && in2 === 1) {
        setFfQ((q) => (q === 0 ? 1 : 0)); // Toggle
      }
    } else if (ffType === 'D') {
      setFfQ(in1);
    } else if (ffType === 'T') {
      if (in1 === 1) {
        setFfQ((q) => (q === 0 ? 1 : 0));
      }
    } else if (ffType === 'SR') {
      if (in1 === 1 && in2 === 1) {
        // Invalid state
        setFfQ(-1);
      } else if (in1 === 1 && in2 === 0) {
        setFfQ(1);
      } else if (in1 === 0 && in2 === 1) {
        setFfQ(0);
      }
    }
  };

  // --- 2. Counter Waveform State ---
  const [counterType, setCounterType] = useState<'ripple' | 'synchronous'>('ripple');
  const [countVal, setCountVal] = useState<number>(0);
  const [counterHistory, setCounterHistory] = useState<number[]>([0]);

  const stepCounter = () => {
    playSoftClick();
    setCountVal((prev) => {
      const next = (prev + 1) % 16;
      setCounterHistory((hist) => [...hist.slice(-15), next]);
      return next;
    });
  };

  // --- 3. 74194 Shift Register & Ring/Johnson Counter State ---
  // DSA Module 1: CircularQueue backing fixed-capacity 4-bit register circulation
  const [srMode, setSrMode] = useState<'00' | '01' | '10' | '11' | 'ring' | 'johnson'>('01');
  const [srBits, setSrBits] = useState<number[]>([1, 0, 1, 0]);
  const [srSerInput, setSrSerInput] = useState<number>(1);

  // Dedicated CircularQueue instances for Ring and Johnson counter rotation
  const ringQueue = useRef(CircularQueue.fromArray([1, 0, 0, 0]));
  const johnsonQueue = useRef(CircularQueue.fromArray([0, 0, 0, 0]));

  const stepShiftRegister = () => {
    playSoftClick();
    if (srMode === '00') {
      // Hold: no state change
    } else if (srMode === '01') {
      // Shift Right: standard linear shift with serial input at MSB
      setSrBits((bits) => [srSerInput, bits[0], bits[1], bits[2]]);
    } else if (srMode === '10') {
      // Shift Left: standard linear shift with serial input at LSB
      setSrBits((bits) => [bits[1], bits[2], bits[3], srSerInput]);
    } else if (srMode === '11') {
      // Parallel Load [1, 1, 0, 0]
      setSrBits([1, 1, 0, 0]);
    } else if (srMode === 'ring') {
      // DSA CircularQueue: circulate single 1 through wrap-around tail -> head
      ringQueue.current.rotate();
      setSrBits(ringQueue.current.toArray());
    } else if (srMode === 'johnson') {
      // DSA CircularQueue: circulate with inverted feedback (Twisted Ring Counter)
      johnsonQueue.current.rotateInverted((bit) => (bit === 1 ? 0 : 1));
      setSrBits(johnsonQueue.current.toArray());
    }
  };

  // --- 4. Logic Family VTC State ---
  const [vtcVin, setVtcVin] = useState<number>(1.2);
  const vtcVoutTTL = vtcVin < 0.8 ? 3.4 : vtcVin > 2.0 ? 0.2 : 3.4 - (vtcVin - 0.8) * 2.6;
  const vtcVoutCMOS = vtcVin < 2.0 ? 5.0 : vtcVin > 3.0 ? 0.0 : 5.0 - (vtcVin - 2.0) * 5.0;

  // --- 5. PLA / PAL Fuse Matrix State ---
  const [fuses, setFuses] = useState<{ [key: string]: boolean }>({
    'p0_a': true, 'p0_b_bar': true,
    'p1_a_bar': true, 'p1_b': true,
  });

  const toggleFuse = (id: string) => {
    playConnectClick();
    setFuses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- 6. Security Door Alarm State ---
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const [alarmLatched, setAlarmLatched] = useState<boolean>(false);

  const handleDoorToggle = () => {
    const nextDoor = !doorOpen;
    setDoorOpen(nextDoor);
    if (nextDoor) {
      setAlarmLatched(true);
      playAlarmBuzz();
    } else {
      playSoftClick();
    }
  };

  const handleResetAlarm = () => {
    setAlarmLatched(false);
    playSoftClick();
  };

  // --- 7. FSM Pattern 1011 State ---
  // DSA Module 2: State transitions modeled as a Directed Graph (Adjacency List)
  type FsmState = 'S0' | 'S1' | 'S2' | 'S3';
  interface FsmTransition {
    from: FsmState;
    input: number;
    to: FsmState;
    output: number;
  }

  const fsmTransitions: FsmTransition[] = useMemo(
    () => [
      { from: 'S0', input: 0, to: 'S0', output: 0 },
      { from: 'S0', input: 1, to: 'S1', output: 0 },
      { from: 'S1', input: 0, to: 'S2', output: 0 },
      { from: 'S1', input: 1, to: 'S1', output: 0 },
      { from: 'S2', input: 0, to: 'S0', output: 0 },
      { from: 'S2', input: 1, to: 'S3', output: 0 },
      { from: 'S3', input: 0, to: 'S2', output: 0 },
      { from: 'S3', input: 1, to: 'S1', output: 1 }, // Overlapping match on 1011
    ],
    []
  );

  // Construct state transition graph using Adjacency List Graph
  const fsmGraph = useMemo(() => {
    const g = new Graph<FsmState>();
    (['S0', 'S1', 'S2', 'S3'] as const).forEach((s) => g.addVertex(s));
    fsmTransitions.forEach((t) => g.addEdge(t.from, t.to, true));
    return g;
  }, [fsmTransitions]);

  const [fsmState, setFsmState] = useState<FsmState>('S0');
  const [fsmOutput, setFsmOutput] = useState<number>(0);
  const [fsmInputBit, setFsmInputBit] = useState<number>(1);
  const [fsmSequenceHistory, setFsmSequenceHistory] = useState<string[]>([]);

  const stepFSM = () => {
    playSoftClick();
    // Directed graph edge traversal matching (fsmState, fsmInputBit)
    const transition = fsmTransitions.find(
      (t) => t.from === fsmState && t.input === fsmInputBit
    );

    const nextState: FsmState = transition ? transition.to : 'S0';
    const out = transition ? transition.output : 0;

    setFsmState(nextState);
    setFsmOutput(out);
    setFsmSequenceHistory((h) => [
      ...h.slice(-10),
      `Bit: ${fsmInputBit} -> State: ${nextState} (Z=${out})`,
    ]);
  };

  // Dynamic canvas classes according to contrast toggle
  const canvasBgClass =
    canvasContrast === 'light'
      ? 'bg-white dark:bg-darklab-subtle border-cream-300 dark:border-darklab-border text-ink dark:text-darklab-text shadow-inner'
      : 'bg-[#0A0A10] border-darklab-border text-darklab-text shadow-inner';

  // Simulator tabs definitions with distinct color identities
  const simTabs = [
    {
      id: 'flip-flops',
      label: '1. Flip-Flop Explorer',
      activeClass: 'bg-[#FF4D5E] text-white shadow-coral ring-2 ring-rose-300',
      inactiveClass: 'bg-[#FFF5F6] text-[#D91B33] dark:bg-rose-950/30 dark:text-rose-300 border-2 border-[#FF4D5E]/40 hover:bg-[#FF4D5E] hover:text-white',
    },
    {
      id: 'counters',
      label: '2. Counter & Waveforms',
      activeClass: 'bg-[#FF9F1C] text-white shadow-amber ring-2 ring-amber-300',
      inactiveClass: 'bg-[#FFF9ED] text-[#B45309] dark:bg-amber-950/30 dark:text-amber-300 border-2 border-[#FF9F1C]/40 hover:bg-[#FF9F1C] hover:text-white',
    },
    {
      id: 'shift-registers',
      label: '3. 74194 Shift Register',
      activeClass: 'bg-[#10B981] text-white shadow-teal ring-2 ring-emerald-300',
      inactiveClass: 'bg-[#F0FDF4] text-[#047857] dark:bg-emerald-950/30 dark:text-emerald-300 border-2 border-[#10B981]/40 hover:bg-[#10B981] hover:text-white',
    },
    {
      id: 'vtc',
      label: '4. Logic Families VTC',
      activeClass: 'bg-[#8B5CF6] text-white shadow-violet ring-2 ring-purple-300',
      inactiveClass: 'bg-[#F5F3FF] text-[#6D28D9] dark:bg-purple-950/30 dark:text-purple-300 border-2 border-[#8B5CF6]/40 hover:bg-[#8B5CF6] hover:text-white',
    },
    {
      id: 'fsm',
      label: '5. FSM Sequence 1011',
      activeClass: 'bg-[#F43F5E] text-white shadow-rose ring-2 ring-pink-300',
      inactiveClass: 'bg-[#FFF1F2] text-[#BE123C] dark:bg-rose-950/30 dark:text-rose-300 border-2 border-[#F43F5E]/40 hover:bg-[#F43F5E] hover:text-white',
    },
    {
      id: 'security-alarm',
      label: '6. Security Door Alarm',
      activeClass: 'bg-[#4F46E5] text-white shadow-brand ring-2 ring-indigo-300',
      inactiveClass: 'bg-[#EEF2FF] text-[#3730A3] dark:bg-indigo-950/30 dark:text-indigo-300 border-2 border-[#4F46E5]/40 hover:bg-[#4F46E5] hover:text-white',
    },
    {
      id: 'pla-pal',
      label: '7. PLA / PAL Matrix',
      activeClass: 'bg-[#0284C7] text-white shadow-sky ring-2 ring-sky-300',
      inactiveClass: 'bg-[#F0F9FF] text-[#0369A1] dark:bg-sky-950/30 dark:text-sky-300 border-2 border-[#0284C7]/40 hover:bg-[#0284C7] hover:text-white',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border-2 border-indigo-100 dark:border-darklab-border shadow-sm transition-colors border-t-4 border-t-indigo-600">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-mod2/15 blur-3xl animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-brand-500/15 blur-3xl animate-blob-drift-2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-vivid-brand uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-white animate-pulse" />
              Interactive Concept Simulators • 100% Client-Side Physics
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-ink-900 dark:text-cream-paper">
            DSD Concept <span className="text-brand-gradient">Exploration Sandbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-cream-muted mt-2 max-w-2xl leading-relaxed font-sans font-medium">
            Real-time interactive digital computing models for Flip-Flop excitation, ripple vs synchronous counters, 74194 shift register modes, logic family VTC curves, and security alarm state machines.
          </p>

          {/* Simulator Nav Tabs & Canvas Contrast Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-cream-border dark:border-darklab-border">
            <div className="flex flex-wrap gap-2 font-sans text-xs">
              {simTabs.map((tab) => {
                const isTabActive = activeSim === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSim(tab.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                      isTabActive ? `${tab.activeClass} scale-102` : tab.inactiveClass
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Dedicated Canvas Contrast Toggle */}
            <button
              onClick={() => setCanvasContrast(canvasContrast === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-sans text-xs font-bold transition-all bg-white dark:bg-darklab-base border-cream-border dark:border-darklab-border text-ink-700 hover:text-brand-600 shadow-xs shrink-0"
              title="Toggle between soft light canvas and high-contrast dark canvas for simulation display"
            >
              {canvasContrast === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-brand-500" />
                  <span>Dark Canvas</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-mod2" />
                  <span>Light Canvas</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SIMULATOR 1: FLIP-FLOP EXPLORER (Module 1 - Coral) */}
      {activeSim === 'flip-flops' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod1 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
            <div>
              <span className="badge-vivid-mod1">
                Module 1 • CO1
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-cream-paper mt-2">
                Clocked Flip-Flop Excitation & State Engine
              </h2>
            </div>

            {/* Type selector with solid color pills */}
            <div className="flex bg-cream-soft dark:bg-darklab-base p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border text-xs font-sans gap-1">
              {(['JK', 'D', 'T', 'SR'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFfType(t)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    ffType === t
                      ? 'bg-mod1 text-white shadow-coral font-black'
                      : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white'
                  }`}
                >
                  {t} FF
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls with Color-Coded Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/60 dark:bg-indigo-950/20 overflow-hidden shadow-xs">
                <div className="panel-header-blue px-5 py-2.5 flex items-center justify-between font-sans font-bold text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-white" />
                    <span>Input Controls</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                    ACTIVE LOGIC
                  </span>
                </div>

                <div className="p-5 space-y-4 font-sans text-xs">
                  <div className="flex items-center gap-4">
                    {ffType === 'JK' && (
                      <>
                        <div>
                          <span className="text-ink-700 dark:text-cream-muted font-bold block mb-1.5">J Input:</span>
                          <button
                            onClick={() => setIn1(in1 === 1 ? 0 : 1)}
                            className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                              in1 === 1
                                ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                                : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600 font-bold hover:bg-rose-50'
                            }`}
                          >
                            J = {in1}
                          </button>
                        </div>
                        <div>
                          <span className="text-ink-700 dark:text-cream-muted font-bold block mb-1.5">K Input:</span>
                          <button
                            onClick={() => setIn2(in2 === 1 ? 0 : 1)}
                            className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                              in2 === 1
                                ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                                : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600 font-bold hover:bg-rose-50'
                            }`}
                          >
                            K = {in2}
                          </button>
                        </div>
                      </>
                    )}

                    {ffType === 'D' && (
                      <div>
                        <span className="text-ink-700 dark:text-cream-muted font-bold block mb-1.5">D Data Input:</span>
                        <button
                          onClick={() => setIn1(in1 === 1 ? 0 : 1)}
                          className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                            in1 === 1
                              ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                              : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600 font-bold hover:bg-rose-50'
                          }`}
                        >
                          D = {in1}
                        </button>
                      </div>
                    )}

                    {ffType === 'T' && (
                      <div>
                        <span className="text-ink-700 dark:text-cream-muted font-bold block mb-1.5">T Toggle Input:</span>
                        <button
                          onClick={() => setIn1(in1 === 1 ? 0 : 1)}
                          className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                            in1 === 1
                              ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                              : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600 font-bold hover:bg-rose-50'
                          }`}
                        >
                          T = {in1}
                        </button>
                      </div>
                    )}

                    {ffType === 'SR' && (
                      <>
                        <div>
                          <span className="text-ink-700 dark:text-cream-muted font-bold block mb-1.5">S (Set):</span>
                          <button
                            onClick={() => setIn1(in1 === 1 ? 0 : 1)}
                            className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                              in1 === 1
                                ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                                : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600 font-bold hover:bg-rose-50'
                            }`}
                          >
                            S = {in1}
                          </button>
                        </div>
                        <div>
                          <span className="text-ink-700 dark:text-cream-muted font-bold block mb-1.5">R (Reset):</span>
                          <button
                            onClick={() => setIn2(in2 === 1 ? 0 : 1)}
                            className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                              in2 === 1
                                ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                                : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600 font-bold hover:bg-rose-50'
                            }`}
                          >
                            R = {in2}
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-3 border-t border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between gap-3">
                    <button
                      onClick={clockFlipFlop}
                      className="px-5 py-2.5 rounded-xl btn-brand-gradient text-white font-bold font-sans text-xs flex items-center gap-2 shadow-brand transition-transform active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Send Clock Pulse (↑ Edge)</span>
                    </button>
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-darklab-card px-3 py-1 rounded-xl border border-indigo-200">
                      CLK: {ffClk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Characteristic Equation Box */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50 text-ink-800 dark:text-cream-paper font-sans text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block mb-1">
                  Characteristic Equation:
                </span>
                <strong className="font-mono text-sm text-mod1 font-bold">
                  {ffType === 'JK'
                    ? "Q(next) = J·Q' + K'·Q"
                    : ffType === 'D'
                    ? 'Q(next) = D'
                    : ffType === 'T'
                    ? 'Q(next) = T ⊕ Q'
                    : "Q(next) = S + R'·Q (SR=0 constraint)"}
                </strong>
              </div>
            </div>

            {/* Visual Flip-Flop Output with Color-Coded Panel */}
            <div className="lg:col-span-6 rounded-3xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 overflow-hidden shadow-xs">
              <div className="panel-header-green px-5 py-2.5 flex items-center justify-between font-sans font-bold text-xs uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white" />
                  <span>Output Logic State</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                  TELEMETRY
                </span>
              </div>

              <div className={`p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all ${canvasBgClass}`}>
                <div
                  className={`text-6xl font-black font-mono transition-transform ${
                    ffQ === 1
                      ? 'text-mod3 scale-110 drop-shadow-sm'
                      : ffQ === 0
                      ? 'text-ink-400 dark:text-darklab-muted'
                      : 'text-mod1'
                  }`}
                >
                  Q = {ffQ === -1 ? 'INVALID' : ffQ}
                </div>
                <div className="text-sm font-mono font-bold text-ink-700 dark:text-cream-muted bg-white dark:bg-darklab-card px-4 py-1 rounded-xl border border-cream-border">
                  Complement Q' = {ffQ === -1 ? 'INVALID' : ffQ === 1 ? 0 : 1}
                </div>
                <p className="text-xs text-ink-500 dark:text-cream-muted font-sans max-w-xs pt-2">
                  Latch state changes synchronously on the positive clock edge based on excitation truth tables.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 2: COUNTER & WAVEFORM GENERATOR (Module 1 - Coral/Amber) */}
      {activeSim === 'counters' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod2 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
            <div>
              <span className="badge-vivid-mod2">
                Module 1 • CO1
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-cream-paper mt-2">
                4-Bit Ripple vs Synchronous Counter & Waveform Visualizer
              </h2>
            </div>

            <div className="flex bg-cream-soft dark:bg-darklab-base p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border text-xs font-sans gap-1">
              <button
                onClick={() => setCounterType('ripple')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  counterType === 'ripple'
                    ? 'bg-mod2 text-white shadow-amber font-black'
                    : 'text-ink-700 dark:text-cream-muted hover:text-ink-900'
                }`}
              >
                Ripple (Asynchronous)
              </button>
              <button
                onClick={() => setCounterType('synchronous')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  counterType === 'synchronous'
                    ? 'bg-mod2 text-white shadow-amber font-black'
                    : 'text-ink-700 dark:text-cream-muted hover:text-ink-900'
                }`}
              >
                Synchronous
              </button>
            </div>
          </div>

          {/* Stepper controls */}
          <div className="rounded-3xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 overflow-hidden shadow-xs">
            <div className="panel-header-amber px-5 py-2.5 flex items-center justify-between font-sans font-bold text-xs uppercase tracking-wider">
              <span>Counter Clock Trigger & Register Readout</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                {counterType.toUpperCase()} MODE
              </span>
            </div>

            <div className="p-5 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={stepCounter}
                className="px-6 py-3 rounded-xl bg-mod3 hover:bg-emerald-600 text-white font-sans font-bold text-xs flex items-center gap-2 shadow-teal transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Step Clock Pulse (T=20ns)</span>
              </button>

              <div className="flex items-center gap-6 font-mono">
                <div className="bg-white dark:bg-darklab-card px-4 py-2 rounded-2xl border border-amber-200">
                  <span className="text-ink-500 dark:text-cream-muted text-[11px] font-bold block">Decimal:</span>
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{countVal}</span>
                </div>
                <div className="bg-white dark:bg-darklab-card px-4 py-2 rounded-2xl border border-amber-200">
                  <span className="text-ink-500 dark:text-cream-muted text-[11px] font-bold block">Binary (QD QC QB QA):</span>
                  <span className="text-2xl font-black text-mod3 tracking-widest">
                    {countVal.toString(2).padStart(4, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timing Waveform Scope */}
          <div className={`p-6 rounded-3xl border-2 border-cream-border dark:border-darklab-border space-y-4 font-mono text-xs transition-all ${canvasBgClass}`}>
            <div className="flex items-center justify-between font-sans font-bold tracking-wide text-ink-900 dark:text-cream-paper border-b border-cream-border pb-2">
              <span className="text-sm">4-Bit Digital Logic Waveform Scope</span>
              <span className="text-xs text-ink-500 font-mono">16-CYCLE ROLLING BUFFER</span>
            </div>
            {['QA (Bit 0)', 'QB (Bit 1)', 'QC (Bit 2)', 'QD (Bit 3)'].map((bitLabel, bitIdx) => (
              <div key={bitIdx} className="flex items-center gap-3">
                <span className="w-24 text-ink-700 dark:text-cream-muted text-xs shrink-0 font-bold">{bitLabel}</span>
                <div className="flex-1 flex gap-1 h-8 items-end bg-cream-soft dark:bg-darklab-card p-1 rounded-xl border border-cream-border dark:border-darklab-border overflow-x-auto">
                  {counterHistory.map((val, i) => {
                    const bitState = (val >> bitIdx) & 1;
                    return (
                      <div
                        key={i}
                        className={`w-6 transition-all rounded-t-sm ${
                          bitState === 1
                            ? 'h-full bg-mod3 border-t-2 border-emerald-300 shadow-xs'
                            : 'h-1 bg-cream-border dark:bg-darklab-border'
                        }`}
                        title={`Cycle ${i}: ${bitState}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIMULATOR 3: 74194 UNIVERSAL SHIFT REGISTER (Module 1 - Teal) */}
      {activeSim === 'shift-registers' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod3 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
            <div>
              <span className="badge-vivid-mod3">
                Module 1 • Lab Exp 6
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-cream-paper mt-2">
                IC 74194 4-Bit Universal Shift Register Simulator
              </h2>
            </div>

            {/* Mode Selector with solid pills */}
            <div className="flex bg-cream-soft dark:bg-darklab-base p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border text-xs font-sans gap-1">
              {[
                { mode: '00', label: '00: Hold' },
                { mode: '01', label: '01: Shift Right' },
                { mode: '10', label: '10: Shift Left' },
                { mode: '11', label: '11: Load' },
                { mode: 'ring', label: 'Ring Counter (Circular Queue)' },
                { mode: 'johnson', label: 'Johnson Counter (Twisted)' },
              ].map((m) => (
                <button
                  key={m.mode}
                  onClick={() => {
                    setSrMode(m.mode as any);
                    if (m.mode === 'ring') setSrBits(ringQueue.current.toArray());
                    if (m.mode === 'johnson') setSrBits(johnsonQueue.current.toArray());
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                    srMode === m.mode
                      ? 'bg-mod3 text-white shadow-teal font-black'
                      : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
            {srBits.map((bit, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border-2 border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2 shadow-xs"
              >
                <span className="text-xs font-sans text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider block">
                  Stage Q{String.fromCharCode(65 + idx)}
                </span>
                <div
                  className={`text-5xl font-black ${
                    bit === 1 ? 'text-mod3' : 'text-ink-300 dark:text-cream-muted'
                  }`}
                >
                  {bit}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border font-sans text-xs">
            <div className="flex items-center gap-3">
              <span className="text-ink-700 dark:text-cream-muted font-bold">Serial Input Bit (SR/SL):</span>
              <button
                onClick={() => setSrSerInput(srSerInput === 1 ? 0 : 1)}
                className={`px-4 py-2 rounded-xl font-bold font-mono transition-all ${
                  srSerInput === 1
                    ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                    : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600'
                }`}
              >
                Bit = {srSerInput}
              </button>
            </div>

            <button
              onClick={stepShiftRegister}
              className="px-6 py-2.5 rounded-xl btn-brand-gradient text-white font-bold flex items-center gap-2 shadow-brand transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Step Clock (Execute Mode {srMode})</span>
            </button>
          </div>
        </div>
      )}

      {/* SIMULATOR 4: LOGIC FAMILY VTC & NOISE MARGIN (Module 2 - Violet) */}
      {activeSim === 'vtc' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod4 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
            <div>
              <span className="badge-vivid-mod4">
                Module 2 • CO2
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-cream-paper mt-2">
                Voltage Transfer Characteristics (VTC) & Noise Margins
              </h2>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-6 rounded-3xl bg-purple-50/70 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-ink-900 dark:text-cream-paper font-bold text-sm">
                  Sweep Input Voltage Vin (0.0V to 5.0V):
                </span>
                <span className="bg-mod4 text-white font-mono font-black text-base px-3 py-1 rounded-xl shadow-violet">
                  {vtcVin.toFixed(2)} V
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.05"
                value={vtcVin}
                onChange={(e) => setVtcVin(parseFloat(e.target.value))}
                className="w-full accent-mod4 cursor-pointer h-2 bg-purple-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
              {/* TTL Curve Output */}
              <div className="p-6 rounded-3xl border-2 border-amber-200 bg-amber-50/60 dark:bg-darklab-card space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-mod2 font-bold font-sans">
                  <span>Standard 74xx TTL Inverter Output</span>
                  <span className="text-base font-black font-mono">Vout: {vtcVoutTTL.toFixed(2)}V</span>
                </div>
                <div className="space-y-1.5 text-ink-700 dark:text-cream-muted text-xs font-sans">
                  <div>• VOH(min) = 2.4V | VIH(min) = 2.0V</div>
                  <div>• VOL(max) = 0.4V | VIL(max) = 0.8V</div>
                  <div className="text-mod2 font-bold pt-1">
                    • Noise Margin: NMH = 0.4V, NML = 0.4V
                  </div>
                </div>
              </div>

              {/* CMOS Curve Output */}
              <div className="p-6 rounded-3xl border-2 border-purple-200 bg-purple-50/60 dark:bg-darklab-card space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-mod4 font-bold font-sans">
                  <span>Standard 5V CMOS Inverter Output</span>
                  <span className="text-base font-black font-mono">Vout: {vtcVoutCMOS.toFixed(2)}V</span>
                </div>
                <div className="space-y-1.5 text-ink-700 dark:text-cream-muted text-xs font-sans">
                  <div>• VOH(min) = 4.9V | VIH(min) = 3.5V</div>
                  <div>• VOL(max) = 0.1V | VIL(max) = 1.5V</div>
                  <div className="text-mod4 font-bold pt-1">
                    • Noise Margin: NMH = 1.4V, NML = 1.4V (Much Wider!)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 5: FSM SEQUENCE 1011 (Module 3 - Rose) */}
      {activeSim === 'fsm' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-brand rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
            <div>
              <span className="badge-vivid-brand">
                Module 3 • Lab Exp 12
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-cream-paper mt-2">
                Overlapping Mealy FSM: Sequence Detector '1011'
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
            {(['S0', 'S1', 'S2', 'S3'] as const).map((st) => (
              <div
                key={st}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  fsmState === st
                    ? 'bg-rose-500 text-white font-bold shadow-rose ring-2 ring-rose-300 scale-105'
                    : 'bg-white dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink'
                }`}
              >
                <div className="text-xl font-black">{st}</div>
                <div className={`text-xs mt-1 font-sans font-bold ${fsmState === st ? 'text-white' : 'text-ink-500 dark:text-cream-muted'}`}>
                  {st === 'S0' ? 'Reset/Idle' : st === 'S1' ? 'Got 1' : st === 'S2' ? 'Got 10' : 'Got 101'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border font-sans text-xs">
            <div className="flex items-center gap-3">
              <span className="text-ink-700 dark:text-cream-muted font-bold">Incoming Serial Bit:</span>
              <button
                onClick={() => setFsmInputBit(fsmInputBit === 1 ? 0 : 1)}
                className={`px-4 py-2 rounded-xl font-bold font-mono transition-all ${
                  fsmInputBit === 1
                    ? 'bg-emerald-500 text-white shadow-teal ring-2 ring-emerald-300'
                    : 'bg-white dark:bg-darklab-card border-2 border-rose-300 text-rose-600'
                }`}
              >
                Bit = {fsmInputBit}
              </button>
            </div>

            <button
              onClick={stepFSM}
              className="px-6 py-2.5 rounded-xl btn-brand-gradient text-white font-bold flex items-center gap-2 shadow-brand transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Step FSM Clock Edge</span>
            </button>

            <div className="flex items-center gap-2 font-bold">
              <span className="text-ink-700 dark:text-cream-muted">Mealy Output Z:</span>
              <span
                className={`px-4 py-1.5 rounded-xl text-xs font-mono ${
                  fsmOutput === 1
                    ? 'bg-emerald-500 text-white shadow-teal animate-bounce font-black'
                    : 'bg-cream-border dark:bg-darklab-muted/20 text-ink-600 dark:text-cream-muted'
                }`}
              >
                {fsmOutput === 1 ? '1 (DETECTED 1011!)' : '0'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 6: SECURITY DOOR ALARM (Module 1 - Indigo) */}
      {activeSim === 'security-alarm' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-brand rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
            <div>
              <span className="badge-vivid-brand">
                Module 1 • Lab Exp 11
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-cream-paper mt-2">
                Lab 11: Real-Time Security Door Alarm Latch System
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center font-sans">
            <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-darklab-base border-2 border-indigo-200 dark:border-indigo-900/50 space-y-4 text-xs">
              <div className="text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider">
                Hardware Sensors & Switches
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleDoorToggle}
                  className={`w-full py-3.5 rounded-2xl font-bold transition-all text-xs ${
                    doorOpen
                      ? 'bg-mod1 text-white shadow-coral font-black'
                      : 'bg-white dark:bg-darklab-card text-ink-900 border-2 border-indigo-200 hover:bg-cream-soft'
                  }`}
                >
                  {doorOpen ? '🚪 Door is OPEN (Magnet Separated!)' : '🚪 Door is CLOSED (Normal Secure)'}
                </button>

                <button
                  onClick={handleResetAlarm}
                  className="w-full py-3 rounded-2xl bg-white dark:bg-darklab-card hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-700 font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <RotateCcw className="w-4 h-4 text-indigo-600" />
                  <span>Authorized Key Reset (/CLR Pulse)</span>
                </button>
              </div>
            </div>

            <div
              className={`p-8 rounded-3xl border-2 flex flex-col items-center justify-center space-y-3 text-center transition-all ${
                alarmLatched
                  ? 'bg-rose-500 text-white shadow-rose border-rose-600 animate-pulse'
                  : 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
              }`}
            >
              <Shield className={`w-12 h-12 ${alarmLatched ? 'text-white' : 'text-emerald-600'}`} />
              <div className={`text-xl font-black ${alarmLatched ? 'text-white' : 'text-emerald-900'}`}>
                {alarmLatched ? '🚨 SIREN STROBE ALARM ACTIVE!' : 'System Armed • Secure'}
              </div>
              <p className={`text-xs max-w-xs leading-relaxed ${alarmLatched ? 'text-white/90' : 'text-emerald-700'}`}>
                {alarmLatched
                  ? '7474 D Flip-Flop has latched Q=1. Closing door will NOT silence alarm until Reset is pressed.'
                  : 'Intrusion sensor armed and ready.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATOR 7: PLA/PAL FUSE MATRIX (Module 2 - Sky Blue) */}
      {activeSim === 'pla-pal' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod2 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div className="border-b border-cream-border dark:border-darklab-border pb-4">
            <span className="badge-vivid-mod2">
              Module 3 • CO4
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-cream-paper mt-2">
              Programmable Logic Array (PLA) Interactive Fuse Matrix
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-sky-50/60 dark:bg-darklab-base border-2 border-sky-200 dark:border-sky-900/50 space-y-4 font-sans text-xs">
            <div className="text-sky-900 dark:text-sky-200 font-bold">
              Click fuses to blow/connect product terms into the AND array:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
              <div className="p-5 rounded-2xl border-2 border-sky-200 bg-white dark:bg-darklab-card space-y-3">
                <span className="font-bold text-sky-700 dark:text-sky-400 font-sans">Product Term P0:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFuse('p0_a')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                      fuses['p0_a']
                        ? 'bg-sky-600 text-white shadow-sky'
                        : 'bg-cream-border text-ink-400 line-through'
                    }`}
                  >
                    Input A
                  </button>
                  <button
                    onClick={() => toggleFuse('p0_b_bar')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                      fuses['p0_b_bar']
                        ? 'bg-sky-600 text-white shadow-sky'
                        : 'bg-cream-border text-ink-400 line-through'
                    }`}
                  >
                    Input B'
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border-2 border-sky-200 bg-white dark:bg-darklab-card space-y-3">
                <span className="font-bold text-sky-700 dark:text-sky-400 font-sans">Product Term P1:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFuse('p1_a_bar')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                      fuses['p1_a_bar']
                        ? 'bg-sky-600 text-white shadow-sky'
                        : 'bg-cream-border text-ink-400 line-through'
                    }`}
                  >
                    Input A'
                  </button>
                  <button
                    onClick={() => toggleFuse('p1_b')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                      fuses['p1_b']
                        ? 'bg-sky-600 text-white shadow-sky'
                        : 'bg-cream-border text-ink-400 line-through'
                    }`}
                  >
                    Input B
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

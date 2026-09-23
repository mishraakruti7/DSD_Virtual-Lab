import React, { useState } from 'react';
import { MSI_CHIPS_DATA } from '../../../data/msiChipsData';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { LedIndicator } from '../../common/LedIndicator';
import {
  RotateCcw,
  Zap,
  Play,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { MasterSlaveJkSchematic } from '../../common/CircuitSchematics';

export const Module1Sequential: React.FC = () => {
  // Flip-Flop Interactive State
  const [ffType, setFfType] = useState<'SR' | 'JK' | 'D' | 'T'>('JK');
  const [ffStateQ, setFfStateQ] = useState(0);
  const [inputS, setInputS] = useState(false);
  const [inputR, setInputR] = useState(false);
  const [inputJ, setInputJ] = useState(true);
  const [inputK, setInputK] = useState(true);
  const [inputD, setInputD] = useState(true);
  const [inputT, setInputT] = useState(true);

  // Master-Slave JK Race-Around Simulation
  const [msJ, setMsJ] = useState(true);
  const [msK, setMsK] = useState(true);
  const [msClk, setMsClk] = useState(0); // 0 or 1
  const [masterQ, setMasterQ] = useState(0);
  const [slaveQ, setSlaveQ] = useState(0);
  const [raceStep, setRaceStep] = useState(0);

  // Shift Register Animation State (4-bit)
  const [shiftReg, setShiftReg] = useState<number[]>([1, 0, 1, 0]);
  const [serialIn, setSerialIn] = useState(1);
  const [shiftMode, setShiftMode] = useState<'SISO' | 'SIPO' | 'PIPO'>('SIPO');
  const [pipoInputs, setPipoInputs] = useState<number[]>([1, 1, 0, 1]);

  // IC 74194 Universal Shift Register State
  const [s1, setS1] = useState(0);
  const [s0, setS0] = useState(1); // Shift Right default
  const [reg74194, setReg74194] = useState<number[]>([0, 1, 0, 0]);
  const [srSer, setSrSer] = useState(1);
  const [slSer, setSlSer] = useState(0);
  const [parInputs, setParInputs] = useState<number[]>([1, 0, 0, 1]);

  // Counter Simulator State (Mod-6 with IC 7493)
  const [mod6Count, setMod6Count] = useState(0);
  const [counterType, setCounterType] = useState<'mod6' | 'syncUpDown' | 'ring' | 'johnson'>('mod6');
  const [syncCount, setSyncCount] = useState(0);
  const [isCountUp, setIsCountUp] = useState(true);
  const [ringState, setRingState] = useState<number[]>([1, 0, 0, 0]);
  const [johnsonState, setJohnsonState] = useState<number[]>([0, 0, 0, 0]);

  // Selected MSI Reference Card
  const [selectedMsiIc, setSelectedMsiIc] = useState<string>('7490');

  // Trigger Clock on Flip-Flop
  const handleClockPulseFF = () => {
    if (ffType === 'SR') {
      if (inputS && !inputR) setFfStateQ(1);
      else if (!inputS && inputR) setFfStateQ(0);
      else if (!inputS && !inputR) { /* Hold */ }
      else { /* Invalid 1-1 */ }
    } else if (ffType === 'JK') {
      if (inputJ && !inputK) setFfStateQ(1);
      else if (!inputJ && inputK) setFfStateQ(0);
      else if (inputJ && inputK) setFfStateQ(ffStateQ === 1 ? 0 : 1);
    } else if (ffType === 'D') {
      setFfStateQ(inputD ? 1 : 0);
    } else if (ffType === 'T') {
      if (inputT) setFfStateQ(ffStateQ === 1 ? 0 : 1);
    }
  };

  // Master-Slave Step Clock
  const handleStepMasterSlave = () => {
    if (msClk === 0) {
      // Transition to CLK = 1: Master captures inputs based on Slave's current feedback!
      const nextMaster =
        msJ && !msK ? 1 :
        !msJ && msK ? 0 :
        msJ && msK ? (slaveQ === 1 ? 0 : 1) :
        slaveQ;
      setMsClk(1);
      setMasterQ(nextMaster);
      setRaceStep((prev) => prev + 1);
    } else {
      // Transition to CLK = 0: Slave updates from Master!
      setMsClk(0);
      setSlaveQ(masterQ);
      setRaceStep((prev) => prev + 1);
    }
  };

  // Shift Register Clock
  const handleClockShift = () => {
    if (shiftMode === 'PIPO') {
      setShiftReg([...pipoInputs]);
    } else {
      // Shift right
      setShiftReg([serialIn, shiftReg[0], shiftReg[1], shiftReg[2]]);
    }
  };

  // 74194 Clock Pulse
  const handleClock74194 = () => {
    const mode = `${s1}${s0}`;
    if (mode === '00') {
      // Inhibit (Hold)
    } else if (mode === '01') {
      // Shift Right: srSer into QA
      setReg74194([srSer, reg74194[0], reg74194[1], reg74194[2]]);
    } else if (mode === '10') {
      // Shift Left: slSer into QD
      setReg74194([reg74194[1], reg74194[2], reg74194[3], slSer]);
    } else if (mode === '11') {
      // Parallel Load
      setReg74194([...parInputs]);
    }
  };

  // Counter Clock Pulse
  const handleCounterClock = () => {
    if (counterType === 'mod6') {
      setMod6Count((prev) => (prev + 1 >= 6 ? 0 : prev + 1));
    } else if (counterType === 'syncUpDown') {
      setSyncCount((prev) => {
        if (isCountUp) return (prev + 1) % 8;
        return (prev - 1 + 8) % 8;
      });
    } else if (counterType === 'ring') {
      setRingState(([q0, q1, q2, q3]) => [q3, q0, q1, q2]);
    } else if (counterType === 'johnson') {
      setJohnsonState(([q0, q1, q2, q3]) => [q3 === 1 ? 0 : 1, q0, q1, q2]);
    }
  };

  const selectedMsi = MSI_CHIPS_DATA.find((m) => m.icNumber === selectedMsiIc) || MSI_CHIPS_DATA[0];

  return (
    <div className="space-y-12">
      {/* Module Title Banner */}
      <div className="bg-mod1-light/60 dark:bg-darklab-surface/80 rounded-3xl p-6 sm:p-8 border border-mod1/30 shadow-cream-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-mod1-light text-mod1-dark border border-mod1/30">
              Module 1 • CO1 & CO2 (8 Hours)
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-white mt-2">
              Sequential Circuit Design & MSI Integrated Circuits
            </h2>
            <p className="text-sm text-ink/70 dark:text-darklab-muted mt-1 max-w-2xl">
              Understand bistable multivibrators, race-around resolution in JK flip-flops, serial/parallel shift registers, and ripple/synchronous counters implemented with industry-standard 74-series MSI ICs.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-ink/70 dark:text-darklab-muted bg-white/80 dark:bg-darklab-subtle px-4 py-2 rounded-2xl border border-mod1/30 shadow-coral-sm">
            <Cpu className="w-4 h-4 text-mod1" />
            <span>ICs: 7490, 7492, 7493, 74163, 74169, 74194</span>
          </div>
        </div>
      </div>

      {/* Sub-Section 1: Interactive Flip-Flops */}
      <div className="bg-white/80 dark:bg-darklab-surface/80 rounded-3xl p-6 sm:p-8 border border-cream-200/80 dark:border-darklab-border shadow-cream-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200/80 dark:border-darklab-border">
          <div>
            <h3 className="font-heading font-bold text-xl text-ink dark:text-white">
              1. Fundamental Flip-Flop Architectures
            </h3>
            <p className="text-xs text-ink/60 dark:text-darklab-muted mt-0.5">
              Set inputs and hit clock pulse to observe state transitions, excitation, and characteristic equations.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-cream-100 dark:bg-darklab-subtle p-1 rounded-2xl border border-cream-300/80 dark:border-darklab-border">
            {(['SR', 'JK', 'D', 'T'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFfType(type)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  ffType === type
                    ? 'bg-mod1 text-white font-bold shadow-coral-sm'
                    : 'text-ink/70 dark:text-darklab-muted hover:text-ink dark:hover:text-white hover:bg-white dark:hover:bg-darklab-surface'
                }`}
              >
                {type}-FF
              </button>
            ))}
          </div>
        </div>

        {/* FF Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
          
          {/* Controls & Inputs */}
          <div className="lg:col-span-5 space-y-4 bg-canvas-cream p-5 rounded-2xl border border-border-warm">
            <div className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider">
              {ffType} Flip-Flop Input Controls
            </div>

            {ffType === 'SR' && (
              <div className="space-y-3">
                <ToggleSwitch checked={inputS} onChange={setInputS} label="Input S (Set)" accentColor="bg-sky-500" />
                <ToggleSwitch checked={inputR} onChange={setInputR} label="Input R (Reset)" accentColor="bg-sky-500" />
                {inputS && inputR && (
                  <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Warning: S=1, R=1 is an INVALID condition in basic SR latches!</span>
                  </div>
                )}
              </div>
            )}

            {ffType === 'JK' && (
              <div className="space-y-3">
                <ToggleSwitch checked={inputJ} onChange={setInputJ} label="Input J" accentColor="bg-sky-500" />
                <ToggleSwitch checked={inputK} onChange={setInputK} label="Input K" accentColor="bg-sky-500" />
                <div className="text-[11px] text-stone-500 font-mono">
                  {inputJ && inputK ? 'Toggle mode: Q will invert on each clock pulse.' : 'Synchronous set/reset mode.'}
                </div>
              </div>
            )}

            {ffType === 'D' && (
              <div className="space-y-3">
                <ToggleSwitch checked={inputD} onChange={setInputD} label="Input D (Data)" accentColor="bg-sky-500" />
                <div className="text-[11px] text-stone-500 font-mono">
                  Transparent data latch: Q+ captures D on clock trigger.
                </div>
              </div>
            )}

            {ffType === 'T' && (
              <div className="space-y-3">
                <ToggleSwitch checked={inputT} onChange={setInputT} label="Input T (Toggle)" accentColor="bg-sky-500" />
                <div className="text-[11px] text-stone-500 font-mono">
                  When T=1, state inverts on each clock. When T=0, state holds.
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleClockPulseFF}
                className="tactile-btn w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-200 text-sky-950 hover:bg-sky-300 border border-sky-300 text-xs font-mono font-bold shadow-soft-sm"
              >
                <Play className="w-3.5 h-3.5 fill-sky-950" />
                <span>Trigger Positive Clock Edge (↑ CLK)</span>
              </button>
            </div>
          </div>

          {/* Logic Symbol & State Outputs */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center bg-[#faf6ee] p-6 rounded-2xl border border-border-warm shadow-soft-sm">
            <div className="w-40 h-44 bg-canvas-warm rounded-2xl border-2 border-stone-700 relative flex flex-col justify-between p-4 shadow-sm">
              <div className="text-center font-mono font-bold text-xs text-stone-700">
                {ffType} FLIP-FLOP
              </div>
              
              {/* Internal Clock Triangle */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 border-y-[8px] border-y-transparent border-l-[10px] border-l-stone-700" />
              <div className="text-[10px] font-mono text-stone-500 absolute left-3 top-1/2 -translate-y-1/2">
                CLK
              </div>

              {/* Output Pins */}
              <div className="flex justify-between items-center px-1">
                <div className="text-xs font-mono font-bold text-stone-700">
                  {ffType === 'SR' ? 'S' : ffType === 'JK' ? 'J' : ffType === 'D' ? 'D' : 'T'}
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700">Q</div>
              </div>
              <div className="flex justify-between items-center px-1">
                <div className="text-xs font-mono font-bold text-stone-700">
                  {ffType === 'SR' ? 'R' : ffType === 'JK' ? 'K' : ''}
                </div>
                <div className="text-xs font-mono font-bold text-rose-700">Q'</div>
              </div>
            </div>

            {/* LED Status Indicators */}
            <div className="flex items-center gap-8 mt-5">
              <LedIndicator isOn={ffStateQ === 1} color="emerald" size="md" label="Output Q" />
              <LedIndicator isOn={ffStateQ === 0} color="ruby" size="md" label="Output Q'" />
            </div>
          </div>

          {/* Characteristic & Excitation Table */}
          <div className="lg:col-span-3 bg-canvas-cream p-5 rounded-2xl border border-border-warm text-xs space-y-3 font-mono">
            <div className="font-bold text-stone-800 border-b border-border-warm pb-2">
              Characteristic Equations
            </div>
            {ffType === 'SR' && (
              <div>
                <p className="text-sky-800 font-bold">Q(next) = S + R'·Q</p>
                <p className="text-[11px] text-stone-500 mt-1">Constraint: S · R = 0</p>
              </div>
            )}
            {ffType === 'JK' && (
              <div>
                <p className="text-sky-800 font-bold">Q(next) = J·Q' + K'·Q</p>
                <p className="text-[11px] text-stone-500 mt-1">Resolves S=R=1 into Toggle</p>
              </div>
            )}
            {ffType === 'D' && (
              <div>
                <p className="text-sky-800 font-bold">Q(next) = D</p>
                <p className="text-[11px] text-stone-500 mt-1">Direct single-cycle data buffer</p>
              </div>
            )}
            {ffType === 'T' && (
              <div>
                <p className="text-sky-800 font-bold">Q(next) = T ⊕ Q</p>
                <p className="text-[11px] text-stone-500 mt-1">Binary frequency divider (÷2)</p>
              </div>
            )}

            <div className="pt-2 border-t border-border-warm text-[11px] text-stone-600 leading-relaxed">
              Current State: <strong>Q = {ffStateQ}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 2: Master-Slave JK Race-Around Resolution */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Exam Benchmark Topic
            </div>
            <h3 className="font-heading font-bold text-xl text-stone-900 mt-1">
              2. Master-Slave JK Race-Around Resolution
            </h3>
          </div>
          <div className="text-xs font-mono text-stone-500">
            Eliminating oscillation when J=1, K=1 and clock pulse width tp &gt; tpd
          </div>
        </div>

        {/* Deep Dive Theory Card */}
        <div className="my-6 p-4 rounded-2xl bg-canvas-cream border border-border-warm text-xs text-stone-700 leading-relaxed space-y-2">
          <p>
            <strong>The Problem (Race-Around Condition):</strong> In a level-triggered JK flip-flop with J=1 and K=1, the output toggles every propagation delay t_pd. If the clock pulse width t_p &gt; t_pd, the output toggles repeatedly and uncontrollably before the clock returns to 0, resulting in an unpredictable final state.
          </p>
          <p>
            <strong>The Master-Slave Solution:</strong> Two flip-flops are cascaded in series. The <strong>Master</strong> is enabled when CLK = 1, while the <strong>Slave</strong> is disabled because its clock is inverted (CLK_bar = 0). When CLK transitions to 0, the Master is disabled (isolating its inputs) and the Slave is enabled, safely copying the Master state to outputs Q and Q_bar. Feedback is thus isolated during clocking!
          </p>
        </div>

        {/* Master-Slave Interactive Widget */}
        <div className="bg-[#fcfbf9] rounded-3xl p-6 border-2 border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Input Controls */}
            <div className="md:col-span-3 space-y-3 bg-[#faf6ee] p-4 rounded-2xl border border-border-warm">
              <div className="text-xs font-mono font-bold text-stone-600">
                Inputs (Toggle Mode)
              </div>
              <ToggleSwitch checked={msJ} onChange={setMsJ} label="J = 1" accentColor="bg-amber-500" />
              <ToggleSwitch checked={msK} onChange={setMsK} label="K = 1" accentColor="bg-amber-500" />
              
              <button
                onClick={handleStepMasterSlave}
                className="tactile-btn w-full mt-3 py-2.5 px-3 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Next Clock Half-Cycle ({msClk === 0 ? 'Raise CLK' : 'Lower CLK'})</span>
              </button>
            </div>

            {/* Stage 1: Master FF */}
            <div className={`md:col-span-4 p-4 rounded-2xl border-2 transition-all ${
              msClk === 1 ? 'bg-sky-50 border-sky-400 shadow-md scale-102' : 'bg-[#faf6ee] border-stone-300 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-stone-800">
                  Stage 1: MASTER (CLK = {msClk})
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  msClk === 1 ? 'bg-sky-200 text-sky-900 font-bold animate-pulse' : 'bg-stone-200 text-stone-600'
                }`}>
                  {msClk === 1 ? 'SAMPLING ACTIVE' : 'LATCHED (ISOLATED)'}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mb-3">
                {msClk === 1
                  ? `CLK=1: Master samples J=${msJ?1:0}, K=${msK?1:0} and feedback from Slave Q=${slaveQ}.`
                  : 'CLK=0: Master disabled. Inputs cannot alter Master state.'}
              </p>
              <div className="flex items-center justify-between bg-[#faf6ee] p-2.5 rounded-xl border border-stone-200">
                <span className="text-xs font-mono">Master Output (Qm):</span>
                <span className="text-sm font-mono font-bold text-sky-800 bg-sky-100 px-3 py-0.5 rounded-md">
                  {masterQ}
                </span>
              </div>
            </div>

            {/* Inverter Symbol */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-stone-400 font-mono text-[10px]">
              <div className="p-1 rounded bg-stone-200 text-stone-700 font-bold mb-1">NOT</div>
              <span>CLK'={msClk === 0 ? 1 : 0}</span>
            </div>

            {/* Stage 2: Slave FF */}
            <div className={`md:col-span-4 p-4 rounded-2xl border-2 transition-all ${
              msClk === 0 ? 'bg-emerald-50 border-emerald-400 shadow-md scale-102' : 'bg-[#faf6ee] border-stone-300 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-stone-800">
                  Stage 2: SLAVE (CLK' = {msClk === 0 ? 1 : 0})
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  msClk === 0 ? 'bg-emerald-200 text-emerald-900 font-bold' : 'bg-stone-200 text-stone-600'
                }`}>
                  {msClk === 0 ? 'TRANSFERRING TO Q' : 'ISOLATED'}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mb-3">
                {msClk === 0
                  ? `CLK=0 (CLK_bar=1): Slave safely latches Q = Qm (${masterQ}).`
                  : 'CLK=1 (CLK_bar=0): Slave disabled. Output Q holds steady.'}
              </p>
              <div className="flex items-center justify-between bg-[#faf6ee] p-2.5 rounded-xl border border-stone-200">
                <span className="text-xs font-mono font-bold text-emerald-900">Final Output Q:</span>
                <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-md">
                  {slaveQ}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Master-Slave JK Two-Stage Schematic */}
        <div className="mt-8 pt-6 border-t border-border-warm">
          <MasterSlaveJkSchematic />
        </div>
      </div>

      {/* Sub-Section 3: Shift Registers & IC 74194 Universal Shift Register */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <h3 className="font-heading font-bold text-xl text-stone-900">
              3. Shift Registers & IC 74194 Universal Shift Register
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Explore serial/parallel data conversion modes: SISO, SIPO, PISO, and PIPO.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-canvas-warm p-1 rounded-2xl border border-border-warm">
              {(['SIPO', 'SISO', 'PIPO'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setShiftMode(m)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                    shiftMode === m ? 'bg-sky-200 text-sky-950 font-bold shadow-soft-sm' : 'text-stone-600 hover:bg-[#faf6ee]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shift Register Live Bitstream Animation */}
        <div className="mt-6 bg-[#fcfbf9] rounded-2xl p-6 border border-border-warm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Input Controls */}
            <div className="flex flex-col gap-3 bg-[#faf6ee] p-4 rounded-xl border border-border-warm">
              {shiftMode !== 'PIPO' ? (
                <div>
                  <label className="text-xs font-mono font-bold text-stone-600 block mb-1">
                    Serial In (Bit)
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSerialIn(0)}
                      className={`px-3 py-1 rounded font-mono text-xs font-bold ${serialIn === 0 ? 'bg-sky-200 text-sky-950 font-bold border border-sky-300' : 'bg-[#faf6ee] text-stone-700 border border-stone-300'}`}
                    >
                      Bit 0
                    </button>
                    <button
                      onClick={() => setSerialIn(1)}
                      className={`px-3 py-1 rounded font-mono text-xs font-bold ${serialIn === 1 ? 'bg-sky-200 text-sky-950 font-bold border border-sky-300' : 'bg-[#faf6ee] text-stone-700 border border-stone-300'}`}
                    >
                      Bit 1
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-mono font-bold text-stone-600 block mb-1">
                    Parallel Inputs [D0..D3]
                  </label>
                  <div className="flex gap-1.5">
                    {pipoInputs.map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const updated = [...pipoInputs];
                          updated[idx] = val === 1 ? 0 : 1;
                          setPipoInputs(updated);
                        }}
                        className={`w-7 h-7 rounded font-mono text-xs font-bold ${
                          val === 1 ? 'bg-sky-200 text-sky-950 font-bold border border-sky-300' : 'bg-[#faf6ee] text-stone-700 border border-stone-300'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleClockShift}
                className="tactile-btn mt-2 py-2 px-4 rounded-xl bg-sky-200 text-sky-950 text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-sky-300 border border-sky-300"
              >
                <Play className="w-3 h-3 fill-sky-950" />
                <span>Clock Shift Pulse</span>
              </button>
            </div>

            {/* 4 Flip-Flop Register Cells */}
            <div className="flex items-center gap-3">
              {shiftReg.map((bit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-20 h-24 bg-[#faf6ee] rounded-2xl border-2 border-stone-700 p-2.5 flex flex-col justify-between shadow-soft-sm">
                    <div className="text-[10px] font-mono text-stone-500 font-bold text-center">
                      FF_{i} (Q{i})
                    </div>
                    <div className="text-center font-mono font-extrabold text-2xl text-stone-900">
                      {bit}
                    </div>
                    <div className="flex justify-center">
                      <LedIndicator isOn={bit === 1} color="sky" size="sm" />
                    </div>
                  </div>
                  {i < shiftReg.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Output Summary */}
            <div className="bg-[#faf6ee] p-4 rounded-xl border border-border-warm min-w-[140px] text-center font-mono">
              <div className="text-xs text-stone-500 mb-1">
                {shiftMode === 'SIPO' ? 'Parallel Word Out' : 'Serial Out (Q3)'}
              </div>
              <div className="text-lg font-bold text-sky-800">
                {shiftMode === 'SIPO' ? shiftReg.join('') : shiftReg[3]}
              </div>
            </div>
          </div>
        </div>

        {/* IC 74194 Universal Shift Register Interactive Mode Matrix */}
        <div className="mt-8 pt-6 border-t border-border-warm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                IC 74194 Bidirectional Universal Shift Register
              </span>
              <h4 className="font-heading font-bold text-base text-stone-900 mt-1">
                Mode Control (S1, S0) Simulator
              </h4>
            </div>
            <div className="text-xs font-mono text-stone-500">
              Active Mode: <strong className="text-stone-900">
                {s1===0 && s0===0 && '00: Inhibit / Hold'}
                {s1===0 && s0===1 && '01: Shift Right (D_SR → QA)'}
                {s1===1 && s0===0 && '10: Shift Left (D_SL → QD)'}
                {s1===1 && s0===1 && '11: Synchronous Parallel Load'}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-canvas-cream p-5 rounded-2xl border border-border-warm items-center">
            {/* Mode Selector Switches */}
            <div className="md:col-span-4 space-y-2 bg-[#faf6ee] p-4 rounded-xl border border-border-warm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Mode Pin S1:</span>
                <button
                  onClick={() => setS1(s1 === 1 ? 0 : 1)}
                  className={`px-2.5 py-1 rounded font-bold ${s1===1 ? 'bg-sky-200 text-sky-950 font-bold border border-sky-300' : 'bg-[#faf6ee] text-stone-700 border border-stone-300'}`}
                >
                  {s1}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Mode Pin S0:</span>
                <button
                  onClick={() => setS0(s0 === 1 ? 0 : 1)}
                  className={`px-2.5 py-1 rounded font-bold ${s0===1 ? 'bg-sky-200 text-sky-950 font-bold border border-sky-300' : 'bg-[#faf6ee] text-stone-700 border border-stone-300'}`}
                >
                  {s0}
                </button>
              </div>
              <button
                onClick={handleClock74194}
                className="tactile-btn w-full mt-3 py-2 rounded-lg bg-sky-200 text-sky-950 font-mono text-xs font-bold hover:bg-sky-300 border border-sky-300"
              >
                Execute Mode Clock
              </button>
            </div>

            {/* Register Cells Output */}
            <div className="md:col-span-8 flex flex-col sm:flex-row items-center justify-around gap-4">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs text-stone-500 mr-1">QA:</span>
                <span className="w-9 h-9 rounded-xl bg-[#faf6ee] border border-border-warm flex items-center justify-center font-bold text-sm shadow-sm">{reg74194[0]}</span>
                <span className="text-xs text-stone-500 mr-1">QB:</span>
                <span className="w-9 h-9 rounded-xl bg-[#faf6ee] border border-border-warm flex items-center justify-center font-bold text-sm shadow-sm">{reg74194[1]}</span>
                <span className="text-xs text-stone-500 mr-1">QC:</span>
                <span className="w-9 h-9 rounded-xl bg-[#faf6ee] border border-border-warm flex items-center justify-center font-bold text-sm shadow-sm">{reg74194[2]}</span>
                <span className="text-xs text-stone-500 mr-1">QD:</span>
                <span className="w-9 h-9 rounded-xl bg-[#faf6ee] border border-border-warm flex items-center justify-center font-bold text-sm shadow-sm">{reg74194[3]}</span>
              </div>
              <div className="text-xs font-mono bg-[#faf6ee] p-3 rounded-xl border border-border-warm">
                Word: <strong className="text-sky-700">{reg74194.join('')}</strong> (Hex: {parseInt(reg74194.join(''), 2).toString(16).toUpperCase()})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 4: Counters (MOD-6 Truncation, Ring, Johnson) */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <h3 className="font-heading font-bold text-xl text-stone-900">
              4. Counter Topologies (MOD-N Ripple, Ring, Johnson)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Observe ripple truncation at 110_2, reversible synchronous up/down counting, and ring states.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-canvas-warm p-1 rounded-2xl border border-border-warm">
            {[
              { id: 'mod6', label: 'MOD-6 Truncated' },
              { id: 'syncUpDown', label: 'Synchronous Up/Down' },
              { id: 'ring', label: 'Ring (n states)' },
              { id: 'johnson', label: 'Johnson (2n states)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCounterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  counterType === tab.id ? 'bg-sky-200 text-sky-950 font-bold shadow-soft-sm' : 'text-stone-600 hover:bg-[#faf6ee]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Visual Stage */}
        <div className="mt-6 bg-[#fcfbf9] rounded-2xl p-6 border border-border-warm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-3">
              {counterType === 'syncUpDown' && (
                <ToggleSwitch
                  checked={isCountUp}
                  onChange={setIsCountUp}
                  label="Direction Control (U//D)"
                  sublabel={isCountUp ? 'Counting UP (0 → 7)' : 'Counting DOWN (7 → 0)'}
                  accentColor="bg-sage-600"
                />
              )}
              <button
                onClick={handleCounterClock}
                className="tactile-btn py-2.5 px-5 rounded-xl bg-sky-200 text-sky-950 text-xs font-mono font-bold flex items-center gap-2 hover:bg-sky-300 border border-sky-300"
              >
                <Play className="w-3.5 h-3.5 fill-sky-950" />
                <span>Clock Pulse (CLK)</span>
              </button>
            </div>

            {/* Visual Count Display */}
            <div className="flex items-center gap-4 bg-[#faf6ee] p-4 rounded-2xl border border-border-warm shadow-soft-sm">
              <div className="text-center font-mono">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">State Value</div>
                <div className="text-3xl font-extrabold text-stone-900">
                  {counterType === 'mod6' && mod6Count}
                  {counterType === 'syncUpDown' && syncCount}
                  {counterType === 'ring' && ringState.join('')}
                  {counterType === 'johnson' && johnsonState.join('')}
                </div>
              </div>

              {counterType === 'mod6' && (
                <div className="text-xs font-mono text-stone-600 border-l border-border-warm pl-4 space-y-1">
                  <div>Binary: <strong>{mod6Count.toString(2).padStart(3, '0')}</strong></div>
                  <div>Modulus: MOD-6 (States 0 to 5)</div>
                  <div className="text-[11px] text-amber-700">
                    Auto-resets when count reaches 6 (110_2) via QC·QB feedback!
                  </div>
                </div>
              )}

              {counterType === 'ring' && (
                <div className="text-xs font-mono text-stone-600 border-l border-border-warm pl-4">
                  <div>Active States: 4 (n = 4)</div>
                  <div>Circulating 1: 1000 → 0100 → 0010 → 0001</div>
                </div>
              )}

              {counterType === 'johnson' && (
                <div className="text-xs font-mono text-stone-600 border-l border-border-warm pl-4">
                  <div>Active States: 8 (2n = 8)</div>
                  <div>Inverted Feedback: D0 = QD_bar</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 5: MSI Integrated Circuit Inspector Cards */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <h3 className="font-heading font-bold text-xl text-stone-900">
              5. MSI Integrated Circuits Datasheet & Pinout Inspector
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Prescribed MSI chips: 7490, 7492, 7493, 74163, 74169, and 74194.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-canvas-warm p-1 rounded-2xl border border-border-warm">
            {MSI_CHIPS_DATA.map((chip) => (
              <button
                key={chip.icNumber}
                onClick={() => setSelectedMsiIc(chip.icNumber)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  selectedMsiIc === chip.icNumber
                    ? 'bg-sky-200 text-sky-950 font-bold shadow-soft-sm'
                    : 'text-stone-600 hover:bg-[#faf6ee]'
                }`}
              >
                IC {chip.icNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Selected MSI Chip Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-canvas-cream p-5 rounded-2xl border border-border-warm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  {selectedMsi.type} • {selectedMsi.syncType}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Mapped: {selectedMsi.coMapping}
                </span>
              </div>
              <h4 className="font-heading font-bold text-lg text-stone-900 mt-2">
                IC {selectedMsi.icNumber}: {selectedMsi.name}
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {selectedMsi.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf6ee] border border-border-warm">
              <div className="text-xs font-mono font-bold text-stone-700 uppercase mb-2">
                Key Architectural Features:
              </div>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {selectedMsi.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pinout Table */}
          <div className="lg:col-span-5 bg-canvas-cream p-4 rounded-2xl border border-border-warm">
            <div className="text-xs font-mono font-bold text-stone-700 uppercase mb-3">
              DIP Pin Assignment (IC {selectedMsi.icNumber})
            </div>
            <div className="max-h-72 overflow-y-auto rounded-xl border border-border-warm bg-[#faf6ee]">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead className="bg-stone-50 border-b border-border-warm text-stone-600">
                  <tr>
                    <th className="py-2 px-2.5">Pin</th>
                    <th className="py-2 px-2.5">Symbol</th>
                    <th className="py-2 px-2.5">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm text-stone-700">
                  {selectedMsi.pins.map((p) => (
                    <tr key={p.pin} className="hover:bg-stone-50">
                      <td className="py-1.5 px-2.5 font-bold">{p.pin}</td>
                      <td className="py-1.5 px-2.5 text-sky-700 font-bold">{p.name}</td>
                      <td className="py-1.5 px-2.5 text-stone-500">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

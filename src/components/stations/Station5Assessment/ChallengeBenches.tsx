import React, { useState } from 'react';
import { CHALLENGE_BENCHES } from '../../../data/quizData';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { LedIndicator } from '../../common/LedIndicator';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ChallengeBenches: React.FC = () => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<number>(1);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  // States for the 7 challenges:
  // Ch 1: AND
  const [c1A, setC1A] = useState(false);
  const [c1B, setC1B] = useState(false);

  // Ch 2: XOR Parity (D0, D1, D2)
  const [c2D0, setC2D0] = useState(false);
  const [c2D1, setC2D1] = useState(false);
  const [c2D2, setC2D2] = useState(false);

  // Ch 3: Half Adder (A, B) -> Sum=1, Carry=0
  const [c3A, setC3A] = useState(false);
  const [c3B, setC3B] = useState(false);

  // Ch 4: Majority (T1, T2, T3) -> 2 of 3
  const [c4T1, setC4T1] = useState(false);
  const [c4T2, setC4T2] = useState(false);
  const [c4T3, setC4T3] = useState(false);

  // Ch 5: 74194 Mode -> S1=1, S0=1
  const [c5S1, setC5S1] = useState(0);
  const [c5S0, setC5S0] = useState(0);

  // Ch 6: Master Slave JK -> Step clock through CLK=1 and CLK=0 with J=1, K=1
  const [c6J, setC6J] = useState(true);
  const [c6K, setC6K] = useState(true);
  const [c6Clk, setC6Clk] = useState(0);
  const [c6Stepped, setC6Stepped] = useState(false);

  // Ch 7: Pull-up resistor -> connect pull-up
  const [c7PullUp, setC7PullUp] = useState(false);

  // Verification Logic for each challenge
  const isC1Done = c1A && c1B;
  const isC2Done = ((c2D0 ? 1 : 0) + (c2D1 ? 1 : 0) + (c2D2 ? 1 : 0)) % 2 === 1;
  const isC3Done = (c3A ? 1 : 0) ^ (c3B ? 1 : 0) && !(c3A && c3B);
  const isC4Done = ((c4T1 ? 1 : 0) + (c4T2 ? 1 : 0) + (c4T3 ? 1 : 0)) >= 2;
  const isC5Done = c5S1 === 1 && c5S0 === 1;
  const isC6Done = c6Stepped;
  const isC7Done = c7PullUp;

  const checkCompletion = (chId: number, isPassed: boolean) => {
    if (isPassed && !completedChallenges.includes(chId)) {
      setCompletedChallenges((prev) => [...prev, chId]);
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 }
      });
    }
  };

  const activeChallenge = CHALLENGE_BENCHES.find((c) => c.id === selectedChallengeId) || CHALLENGE_BENCHES[0];

  return (
    <div className="space-y-8">
      {/* Bench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-600" />
            <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
              Interactive Lab Benches
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-stone-900 mt-1">
            7 Hands-On Circuit Challenges
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Troubleshoot circuit scenarios, configure control buses, and test digital logic principles directly.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="px-4 py-2 rounded-2xl bg-canvas-cream border border-border-warm font-mono text-xs text-stone-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Completed: <strong className="text-stone-900">{completedChallenges.length}</strong> / 7</span>
        </div>
      </div>

      {/* Challenge Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {CHALLENGE_BENCHES.map((bench) => {
          const isSelected = selectedChallengeId === bench.id;
          const isDone = completedChallenges.includes(bench.id);
          return (
            <button
              key={bench.id}
              onClick={() => setSelectedChallengeId(bench.id)}
              className={`p-3 rounded-2xl border text-left transition-all select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-50 border-rose-400 shadow-soft-sm ring-2 ring-rose-300'
                  : 'bg-[#faf6ee] border-[#ded5c2] hover:bg-[#f5efe4] text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold">#{bench.id}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="font-heading font-bold text-xs line-clamp-2 text-stone-900">
                {bench.title.split(' ')[1] || bench.title}
              </div>
              <div className="text-[9px] font-mono text-stone-500 mt-1">
                {bench.co}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Challenge Interactive Workspace */}
      <div className="bg-[#faf6ee] rounded-3xl p-6 sm:p-8 border border-[#ded5c2] shadow-soft-sm space-y-6">
        
        {/* Scenario Banner */}
        <div className="bg-canvas-cream p-5 rounded-2xl border border-border-warm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">
              Challenge {activeChallenge.id}: {activeChallenge.title}
            </span>
            <span className="text-xs font-mono text-stone-500">
              Target CO: {activeChallenge.co}
            </span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed font-medium">
            <strong>Scenario:</strong> {activeChallenge.scenario}
          </p>
          <div className="mt-2 pt-2 border-t border-border-warm text-xs text-rose-900 font-bold font-mono">
            Goal: {activeChallenge.objective}
          </div>
        </div>

        {/* Interactive Workspace depending on activeChallenge.id */}
        <div className="bg-[#fcfbf9] rounded-2xl p-6 border border-border-warm">
          
          {/* Challenge 1: 7408 AND */}
          {activeChallenge.id === 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <ToggleSwitch checked={c1A} onChange={(v) => { setC1A(v); checkCompletion(1, v && c1B); }} label="Shield Sensor A" accentColor="bg-sky-500" />
                <ToggleSwitch checked={c1B} onChange={(v) => { setC1B(v); checkCompletion(1, c1A && v); }} label="Foot Pedal B" accentColor="bg-sky-500" />
              </div>
              <div className="text-center bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] shadow-soft-sm min-w-[150px]">
                <LedIndicator isOn={isC1Done} color="emerald" size="lg" label="Motor Drill Y" />
                <div className={`text-xs font-mono font-bold mt-2 ${isC1Done ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {isC1Done ? 'MOTOR ENGAGED (1)' : 'STANDBY (0)'}
                </div>
              </div>
            </div>
          )}

          {/* Challenge 2: 7486 XOR Parity */}
          {activeChallenge.id === 2 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <ToggleSwitch checked={c2D0} onChange={(v) => { setC2D0(v); checkCompletion(2, ((v?1:0) + (c2D1?1:0) + (c2D2?1:0))%2 === 1); }} label="Data Line D0" accentColor="bg-purple-500" />
                <ToggleSwitch checked={c2D1} onChange={(v) => { setC2D1(v); checkCompletion(2, ((c2D0?1:0) + (v?1:0) + (c2D2?1:0))%2 === 1); }} label="Data Line D1" accentColor="bg-purple-500" />
                <ToggleSwitch checked={c2D2} onChange={(v) => { setC2D2(v); checkCompletion(2, ((c2D0?1:0) + (c2D1?1:0) + (v?1:0))%2 === 1); }} label="Data Line D2" accentColor="bg-purple-500" />
              </div>
              <div className="text-center bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] shadow-soft-sm min-w-[150px]">
                <LedIndicator isOn={isC2Done} color="sky" size="lg" label="Odd Parity Y" />
                <div className={`text-xs font-mono font-bold mt-2 ${isC2Done ? 'text-sky-700' : 'text-stone-400'}`}>
                  {isC2Done ? 'PARITY VALID (ODD)' : 'PARITY EVEN (0)'}
                </div>
              </div>
            </div>
          )}

          {/* Challenge 3: Half Adder */}
          {activeChallenge.id === 3 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <ToggleSwitch checked={c3A} onChange={(v) => { setC3A(v); checkCompletion(3, (((v?1:0)^(c3B?1:0)) === 1) && !(v&&c3B)); }} label="Operand A" accentColor="bg-amber-500" />
                <ToggleSwitch checked={c3B} onChange={(v) => { setC3B(v); checkCompletion(3, (((c3A?1:0)^(v?1:0)) === 1) && !(c3A&&v)); }} label="Operand B" accentColor="bg-amber-500" />
              </div>
              <div className="flex gap-4 bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] shadow-soft-sm">
                <LedIndicator isOn={(c3A?1:0)^(c3B?1:0) ? true : false} color="emerald" size="md" label="Sum (S)" />
                <LedIndicator isOn={c3A && c3B} color="ruby" size="md" label="Carry (C)" />
              </div>
            </div>
          )}

          {/* Challenge 4: Majority Voting (2 of 3) */}
          {activeChallenge.id === 4 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <ToggleSwitch checked={c4T1} onChange={(v) => { setC4T1(v); checkCompletion(4, ((v?1:0)+(c4T2?1:0)+(c4T3?1:0))>=2); }} label="Sensor T1" accentColor="bg-rose-500" />
                <ToggleSwitch checked={c4T2} onChange={(v) => { setC4T2(v); checkCompletion(4, ((c4T1?1:0)+(v?1:0)+(c4T3?1:0))>=2); }} label="Sensor T2" accentColor="bg-rose-500" />
                <ToggleSwitch checked={c4T3} onChange={(v) => { setC4T3(v); checkCompletion(4, ((c4T1?1:0)+(c4T2?1:0)+(v?1:0))>=2); }} label="Sensor T3" accentColor="bg-rose-500" />
              </div>
              <div className="text-center bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] shadow-soft-sm min-w-[150px]">
                <LedIndicator isOn={isC4Done} color="ruby" size="lg" label="Quorum Trip (Y)" />
                <div className={`text-xs font-mono font-bold mt-2 ${isC4Done ? 'text-rose-700' : 'text-stone-400'}`}>
                  {isC4Done ? 'OVERRIDE TRIPPED' : 'NORMAL RANGE'}
                </div>
              </div>
            </div>
          )}

          {/* Challenge 5: IC 74194 Parallel Load */}
          {activeChallenge.id === 5 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span>Mode S1:</span>
                  <button
                    onClick={() => { const v = c5S1===1?0:1; setC5S1(v); checkCompletion(5, v===1 && c5S0===1); }}
                    className={`px-3 py-1 rounded-lg font-bold ${c5S1===1 ? 'bg-rose-200 text-rose-950 border border-rose-300' : 'bg-[#ede4d4] text-stone-700'}`}
                  >
                    {c5S1}
                  </button>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span>Mode S0:</span>
                  <button
                    onClick={() => { const v = c5S0===1?0:1; setC5S0(v); checkCompletion(5, c5S1===1 && v===1); }}
                    className={`px-3 py-1 rounded-lg font-bold ${c5S0===1 ? 'bg-rose-200 text-rose-950 border border-rose-300' : 'bg-[#ede4d4] text-stone-700'}`}
                  >
                    {c5S0}
                  </button>
                </div>
              </div>
              <div className="bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] text-xs font-mono">
                <div>Configuration: <strong>S1={c5S1}, S0={c5S0}</strong></div>
                <div className={`mt-1 font-bold ${isC5Done ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isC5Done ? '✓ PARALLEL LOAD ENABLED' : 'HOLD / SHIFT MODE'}
                </div>
              </div>
            </div>
          )}

          {/* Challenge 6: Master-Slave JK */}
          {activeChallenge.id === 6 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-xs font-mono">
                <div>Inputs locked in Toggle Mode: J=1, K=1</div>
                <button
                  onClick={() => {
                    setC6Clk((prev) => (prev === 0 ? 1 : 0));
                    setC6Stepped(true);
                    checkCompletion(6, true);
                  }}
                  className="tactile-btn py-2.5 px-4 rounded-xl bg-rose-200 hover:bg-rose-300 border border-rose-300 text-rose-950 font-bold"
                >
                  Step Clock Phase (CLK = {c6Clk === 0 ? 'Raise to 1' : 'Drop to 0'})
                </button>
              </div>
              <div className="bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] text-xs font-mono">
                <div>Clock Level: <strong>CLK = {c6Clk}</strong></div>
                <div className="text-emerald-700 font-bold mt-1">
                  {c6Stepped ? '✓ Master-Slave cycle executed' : 'Click Step Clock to test'}
                </div>
              </div>
            </div>
          )}

          {/* Challenge 7: TTL-to-CMOS Pull-up */}
          {activeChallenge.id === 7 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <ToggleSwitch
                  checked={c7PullUp}
                  onChange={(v) => { setC7PullUp(v); checkCompletion(7, v); }}
                  label="10 kΩ Pull-Up Resistor to +5V"
                  accentColor="bg-emerald-600"
                />
              </div>
              <div className="bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] text-xs font-mono">
                <div>Output Voltage: <strong>{c7PullUp ? '4.92 V (Valid HIGH)' : '2.40 V (Indeterminate)'}</strong></div>
                <div className={`mt-1 font-bold ${isC7Done ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isC7Done ? '✓ CMOS Threshold Satisfied (> 3.5V)' : 'Under-voltage failure'}
                </div>
              </div>
            </div>
          )}

          {/* Hint Footer */}
          <div className="mt-4 pt-3 border-t border-border-warm flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
              <span><strong>Hint:</strong> {activeChallenge.hint}</span>
            </div>
            {completedChallenges.includes(activeChallenge.id) && (
              <span className="text-emerald-700 font-bold font-mono">
                Challenge Solved!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

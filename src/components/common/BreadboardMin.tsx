import React, { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { LedIndicator } from './LedIndicator';
import { Sparkles, Zap } from 'lucide-react';

export const BreadboardMin: React.FC = () => {
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);

  const outputY = switchA && switchB;

  return (
    <div className="bg-[#faf6ee] rounded-3xl p-6 border border-[#ded5c2] shadow-soft-md relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-stone-800 uppercase tracking-wide">
            Mini-Breadboard Workbench • 7408 AND Gate
          </span>
        </div>
        <div className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          VCC: +5.0V | Active Logic
        </div>
      </div>

      {/* Breadboard Visual Canvas */}
      <div className="bg-[#fcfbf9] rounded-2xl p-5 border-2 border-dashed border-stone-200 relative">
        {/* Subtle breadboard pin holes pattern */}
        <div className="absolute inset-0 breadboard-grid opacity-35 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Inputs Section: Dual Toggle Switches */}
          <div className="flex flex-col gap-4 bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] shadow-soft-sm">
            <div className="text-xs font-mono font-bold text-stone-600 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Logic Inputs</span>
            </div>
            <ToggleSwitch
              checked={switchA}
              onChange={setSwitchA}
              label="Switch A"
              sublabel="Pin 1 (1A)"
              accentColor="bg-sky-500"
            />
            <ToggleSwitch
              checked={switchB}
              onChange={setSwitchB}
              label="Switch B"
              sublabel="Pin 2 (1B)"
              accentColor="bg-sky-500"
            />
          </div>

          {/* Central DIP-14 IC (7408 AND) */}
          <div className="flex flex-col items-center">
            {/* Top Pin labels */}
            <div className="flex justify-between w-44 px-3 text-[9px] font-mono text-stone-500 mb-1">
              <span>14:VCC</span>
              <span>13</span>
              <span>12</span>
              <span>11</span>
              <span>10</span>
              <span>9</span>
              <span>8</span>
            </div>

            {/* IC Package */}
            <div className="w-48 h-20 bg-[#334155] rounded-lg shadow-md relative flex items-center justify-between px-3 border border-[#475569]">
              {/* Left Notch */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-full bg-[#1e293b] border border-[#475569]" />
              
              {/* IC Label */}
              <div className="mx-auto text-center">
                <div className="text-[10px] font-mono font-bold text-amber-300 tracking-wider">
                  SN7408N
                </div>
                <div className="text-[8px] font-mono text-stone-300">
                  QUAD 2-IN AND
                </div>
              </div>

              {/* Pins (visual silver pins) */}
              <div className="absolute -top-2 left-3 right-3 flex justify-between">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2 bg-gradient-to-b from-stone-400 to-stone-200 rounded-t-sm border-t border-x border-stone-400" />
                ))}
              </div>
              <div className="absolute -bottom-2 left-3 right-3 flex justify-between">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2 bg-gradient-to-b from-stone-200 to-stone-400 rounded-b-sm border-b border-x border-stone-400" />
                ))}
              </div>
            </div>

            {/* Bottom Pin labels */}
            <div className="flex justify-between w-44 px-3 text-[9px] font-mono text-stone-500 mt-1">
              <span className="font-bold text-sky-700">1:A</span>
              <span className="font-bold text-sky-700">2:B</span>
              <span className="font-bold text-emerald-700">3:Y</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7:GND</span>
            </div>
          </div>

          {/* Output Section: Resistor + Glowing Emerald LED */}
          <div className="flex flex-col items-center bg-[#f5efe4] p-4 rounded-2xl border border-[#ded5c2] shadow-soft-sm min-w-[140px]">
            <div className="text-xs font-mono font-bold text-stone-600 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Output (Y)</span>
            </div>
            <div className="my-2">
              <LedIndicator
                isOn={outputY}
                color="emerald"
                size="lg"
                label="Pin 3 (1Y)"
              />
            </div>
            <div className="mt-2 text-[11px] font-mono text-center">
              <span className="text-stone-500">R = 330Ω Limiter</span>
              <div className={`font-bold mt-1 ${outputY ? 'text-emerald-700' : 'text-stone-400'}`}>
                {outputY ? '5V HIGH (Conducting)' : '0V LOW (Cutoff)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Truth Summary Banner */}
      <div className="mt-4 pt-3 border-t border-border-warm flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-2">
        <div className="font-mono">
          Equation: <span className="font-bold text-stone-900">Y = A · B</span> &nbsp;→&nbsp;{' '}
          <span className="text-sky-700 font-bold">{switchA ? '1' : '0'}</span> ·{' '}
          <span className="text-sky-700 font-bold">{switchB ? '1' : '0'}</span> ={' '}
          <span className={`font-bold ${outputY ? 'text-emerald-700' : 'text-stone-700'}`}>
            {outputY ? '1' : '0'}
          </span>
        </div>
        <div className="text-[11px] text-stone-500 italic">
          {outputY
            ? 'Both switches closed: conduction path complete, LED shines bright.'
            : 'One or both switches open: series circuit incomplete, LED stays off.'}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Module1Sequential } from './Module1Sequential';
import { Module2LogicFamilies } from './Module2LogicFamilies';
import { Module3FSM } from './Module3FSM';
import { Module4Verilog } from './Module4Verilog';
import {
  BookOpen,
  Layers,
  Cpu,
  Activity,
  Code,
  GraduationCap
} from 'lucide-react';

export const TheoryModules: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number>(1);

  const modules = [
    {
      id: 1,
      title: 'Module 1: Sequential & MSI ICs',
      co: 'CO1, CO2',
      hours: '8 Hours',
      icon: Layers,
      badge: 'badge-vivid-mod1',
      selected: 'bg-mod1 text-white shadow-coral border-mod1 font-bold',
      cardBorder: 'card-vivid-mod1',
    },
    {
      id: 2,
      title: 'Module 2: Logic Families & PLD',
      co: 'CO3',
      hours: '6 Hours',
      icon: Cpu,
      badge: 'badge-vivid-mod2',
      selected: 'bg-mod2 text-white shadow-amber border-mod2 font-bold',
      cardBorder: 'card-vivid-mod2',
    },
    {
      id: 3,
      title: 'Module 3: FSM & ASM State Machines',
      co: 'CO4',
      hours: '9 Hours',
      icon: Activity,
      badge: 'badge-vivid-mod3',
      selected: 'bg-mod3 text-white shadow-teal border-mod3 font-bold',
      cardBorder: 'card-vivid-mod3',
    },
    {
      id: 4,
      title: 'Module 4: Verilog HDL Studio',
      co: 'CO5',
      hours: '7 Hours',
      icon: Code,
      badge: 'badge-vivid-mod4',
      selected: 'bg-mod4 text-white shadow-violet border-mod4 font-bold',
      cardBorder: 'card-vivid-mod4',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Station Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <span className="text-xs font-mono font-bold text-ink-500 dark:text-cream-muted uppercase tracking-wider">
              Station 1 • Curriculum Theory
            </span>
          </div>
          <h2 className="font-heading font-black text-3xl text-ink-900 dark:text-cream-paper tracking-tight mt-1">
            DSD 30-Hour{' '}
            <span className="text-brand-gradient">Theory Curriculum</span>
          </h2>
          <p className="text-ink-600 dark:text-cream-muted text-sm mt-0.5">
            Interactive, visual theory modules aligned with Mumbai University / SAKEC Course ECCOR2PC203.
          </p>
        </div>

        {/* Total Hours Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs text-xs font-mono text-ink-700 dark:text-cream-paper">
          <GraduationCap className="w-4 h-4 text-mod2-dark dark:text-mod2" />
          <span>Total: 30 Lecture Hours</span>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`p-4 rounded-2xl border text-left transition-all select-none flex flex-col justify-between ${
                isActive
                  ? `${m.selected} scale-[1.02]`
                  : `bg-white dark:bg-darklab-card border-cream-border dark:border-darklab-border ${m.cardBorder} hover:shadow-xs text-ink-700 dark:text-cream-muted`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/25 text-white' : m.badge}`}>
                  {m.co}
                </span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-ink-400 dark:text-cream-muted'}`}>
                  {m.hours}
                </span>
              </div>
              <div className={`flex items-center gap-2 font-heading font-bold text-sm mt-1 ${isActive ? 'text-white' : 'text-ink-900 dark:text-cream-paper'}`}>
                <Icon className="w-4 h-4" />
                <span>{m.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Module Content */}
      <div className="transition-opacity duration-200">
        {activeModule === 1 && <Module1Sequential />}
        {activeModule === 2 && <Module2LogicFamilies />}
        {activeModule === 3 && <Module3FSM />}
        {activeModule === 4 && <Module4Verilog />}
      </div>
    </div>
  );
};

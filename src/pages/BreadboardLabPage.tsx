import React, { useState } from 'react';
import { VirtualBreadboard } from '../components/stations/Station3Breadboard/VirtualBreadboard';
import { Layers, HelpCircle, CheckCircle, Award, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BreadboardLabPage: React.FC<{
  onNavigateToLab?: (id: number) => void;
}> = ({ onNavigateToLab }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-cyan-500 shadow-sm transition-colors">
        {/* Playful Ambient Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-mod4/15 blur-3xl animate-blob-drift-2" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-vivid-brand uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
                <Layers className="w-4 h-4 text-white" />
                Solderless Hardware Prototyping • Physics & Logic Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-cream-paper">
              Virtual Breadboard <span className="text-brand-gradient">Workbench</span>
            </h1>
            <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl leading-relaxed font-medium">
              Wire digital integrated circuits with natural catenary sagging wires, mount DIP-14 chips (7408, 7432, 7404, 7400, 7486), inspect voltages with the multimeter probe, and verify circuit continuity in real time.
            </p>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-800 dark:text-cream-paper hover:text-cyan-700 dark:hover:text-cyan-300 font-sans font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{showGuide ? 'Hide Wiring Guide' : 'Wiring Guide & Pinout Tips'}</span>
          </button>
        </div>

        {/* Quick Guide Drawer */}
        {showGuide && (
          <div className="relative z-10 mt-5 pt-4 border-t border-cream-border dark:border-darklab-border text-xs text-ink-800 dark:text-cream-muted font-sans space-y-2 animate-fadeIn bg-cream-soft dark:bg-darklab-base/80 p-5 rounded-2xl border border-cream-border dark:border-darklab-border shadow-xs">
            <div className="text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider font-sans text-xs">
              Standard DIP-14 Wiring Rules for Laboratory Practical Sessions:
            </div>
            <ul className="space-y-1.5 text-ink-700 dark:text-cream-paper font-sans">
              <li>1. Always connect <strong className="text-rose-600 dark:text-rose-400 font-mono">Pin 14 to +5V (VCC)</strong> using a Red wire before powering.</li>
              <li>2. Always connect <strong className="text-ink-900 dark:text-white font-mono">Pin 7 to 0V (GND)</strong> using a Black wire.</li>
              <li>3. Connect input switches to gate inputs: <span className="font-mono">Pin 1 (1A)</span> and <span className="font-mono">Pin 2 (1B)</span>.</li>
              <li>4. Connect gate output <span className="font-mono">Pin 3 (1Y)</span> to the 330Ω current-limiting resistor to protect the output LED.</li>
              <li>5. Switch to <strong className="text-mod4 dark:text-purple-400">Multimeter Probe</strong> mode to inspect analog voltages and logic levels at any tie point.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Interactive Breadboard Component */}
      <VirtualBreadboard />
    </div>
  );
};

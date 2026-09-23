import React from 'react';
import { Home, Layers, Cpu, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { playConnectClick, playSoftClick } from '../utils/soundEffects';

interface NotFoundPageProps {
  onGoHome: () => void;
  onNavigateTab?: (tab: string, extraId?: string | number) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome, onNavigateTab }) => {
  const handleHome = () => {
    playConnectClick();
    onGoHome();
  };

  const handleBreadboard = () => {
    playSoftClick();
    if (onNavigateTab) {
      onNavigateTab('breadboard');
    } else {
      onGoHome();
    }
  };

  const handleSimulators = () => {
    playSoftClick();
    if (onNavigateTab) {
      onNavigateTab('simulators');
    } else {
      onGoHome();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 text-center space-y-8 animate-fadeIn">
      {/* Broken Net Vector Illustration */}
      <div className="relative flex justify-center">
        <div className="w-80 h-52 bg-white dark:bg-darklab-card rounded-3xl border-2 border-rose-200 dark:border-rose-900/40 p-4 shadow-xl shadow-rose-500/5 relative overflow-hidden flex flex-col items-center justify-center">
          <svg viewBox="0 0 320 160" className="w-full h-auto select-none">
            <defs>
              <linearGradient id="wireLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#FF4D5E" />
              </linearGradient>
              <linearGradient id="wireRight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>

            {/* Left Connected Wire */}
            <path
              d="M 20 80 C 60 80, 80 50, 120 70"
              fill="none"
              stroke="url(#wireLeft)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="80" r="7" fill="#6366F1" />
            <text x="20" y="105" fill="#6366F1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
              VCC (+5V)
            </text>

            {/* Spark Gap / Broken Net */}
            <circle cx="120" cy="70" r="5" fill="#FF4D5E" />
            <circle cx="120" cy="70" r="10" fill="none" stroke="#FF4D5E" strokeWidth="1.5" className="animate-ping" />

            {/* Disconnected Gap Sparks */}
            <path d="M 128 65 L 142 55 L 138 72 L 150 62" fill="none" stroke="#FF9F1C" strokeWidth="2" strokeLinecap="round" />
            <circle cx="145" cy="85" r="2.5" fill="#FF9F1C" className="animate-pulse" />

            {/* Right Broken Wire (Floating / Hi-Z) */}
            <path
              d="M 175 90 C 210 110, 240 80, 295 80"
              fill="none"
              stroke="url(#wireRight)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
            <circle cx="175" cy="90" r="5" fill="#94A3B8" />
            <circle cx="295" cy="80" r="7" fill="#94A3B8" />
            <text x="295" y="105" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
              Hi-Z (Floating)
            </text>

            {/* Warning Pill in center */}
            <rect x="110" y="125" width="100" height="24" rx="8" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1" />
            <text x="160" y="141" fill="#E11D48" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
              ERR: NET_OPEN
            </text>
          </svg>
        </div>
      </div>

      {/* Narrative & Storytelling */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold border border-rose-200 dark:border-rose-900">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          404 Logic Level: Floating / High Impedance
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-black text-ink-900 dark:text-cream-paper tracking-tight">
          Signal Lost &bull; <span className="text-brand-gradient">Net Disconnected</span>
        </h1>

        <p className="font-sans text-ink-600 dark:text-cream-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          This digital trace isn't tied to +5V (VCC) or 0V (GND). In digital hardware, floating inputs pick up ambient noise and toggle chaotically. Let's pull this net back to a known state!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handleHome}
          className="px-6 py-3.5 rounded-2xl btn-brand-gradient text-white font-bold flex items-center gap-2 shadow-brand transition-all active:scale-95 text-xs sm:text-sm"
        >
          <Home className="w-4 h-4 text-white" />
          <span>Re-Route Signal Home</span>
        </button>

        <button
          onClick={handleBreadboard}
          className="px-5 py-3.5 rounded-2xl bg-white dark:bg-darklab-card hover:bg-cream-soft text-ink-900 dark:text-cream-paper font-bold flex items-center gap-2 border-2 border-cream-border dark:border-darklab-border transition-all shadow-xs text-xs sm:text-sm"
        >
          <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Virtual Breadboard</span>
        </button>

        <button
          onClick={handleSimulators}
          className="px-5 py-3.5 rounded-2xl bg-white dark:bg-darklab-card hover:bg-cream-soft text-ink-900 dark:text-cream-paper font-bold flex items-center gap-2 border-2 border-cream-border dark:border-darklab-border transition-all shadow-xs text-xs sm:text-sm"
        >
          <Cpu className="w-4 h-4 text-mod2" />
          <span>Simulators Hub</span>
        </button>
      </div>
    </div>
  );
};

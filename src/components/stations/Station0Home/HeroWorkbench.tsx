import React from 'react';
import { BreadboardMin } from '../../common/BreadboardMin';
import { GatePlayground } from './GatePlayground';
import { SyllabusRoadmap } from './SyllabusRoadmap';
import { StationTab } from '../../common/Header';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

interface HeroWorkbenchProps {
  onNavigate: (station: StationTab) => void;
}

export const HeroWorkbench: React.FC<HeroWorkbenchProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16">
      
      {/* Hero Section with Playful Drifting Accent Blobs */}
      <div className="relative pt-6 sm:pt-10 overflow-hidden">
        
        {/* Playful abstract soft blobs drifting in Coral, Amber, Teal & Violet */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B7A]/20 rounded-full filter blur-3xl -z-10 pointer-events-none animate-blob-coral" />
        <div className="absolute top-16 left-4 w-96 h-96 bg-[#FFB347]/20 rounded-full filter blur-3xl -z-10 pointer-events-none animate-blob-amber" />
        <div className="absolute bottom-6 right-8 w-80 h-80 bg-[#3DDC97]/20 rounded-full filter blur-3xl -z-10 pointer-events-none animate-blob-teal" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#9D7BFF]/20 rounded-full filter blur-3xl -z-10 pointer-events-none animate-blob-violet" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Academic & Live Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-paper dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-soft-sm text-xs font-medium text-ink-800 dark:text-cream-paper">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                <span>University Course ECCOR2PC203</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cream-muted" />
                <span className="text-ink-500 font-mono">Autonomous MU / SAKEC</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mod3-light dark:bg-mod3/20 border border-mod3-border dark:border-mod3/40 text-xs font-mono font-bold text-mod3-text dark:text-mod3 shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-mod3 animate-ping" />
                <span>Interactive Hardware Workbench</span>
              </div>
            </div>

            {/* Main Headline with Energetic Accent Gradients */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink-900 dark:text-white tracking-tight leading-[1.12]">
              Hands-On Digital System Design,{' '}
              <span className="bg-gradient-to-r from-brand-500 via-mod1 to-mod4 bg-clip-text text-transparent underline decoration-mod1/40 decoration-wavy decoration-2">
                Purely In Your Browser
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-ink-700 dark:text-ink-400 leading-relaxed font-normal">
              A bright, energetic, and accessible digital electronics laboratory for curious learners.
              Wire virtual breadboards with real catenary jumper wires, inspect TTL totem-pole transistor VTC curves, step through Master-Slave race-around resolution, and simulate 12 university lab experiments with zero server dependencies.
            </p>

            {/* Key Value Module-Tinted Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-mono font-bold border border-brand-200 dark:border-brand-500/30 shadow-soft-sm">
                <Zap className="w-3.5 h-3.5 text-brand-500" /> 100% Client-Side Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-mod1-light dark:bg-mod1/20 text-mod1-text dark:text-mod1 text-xs font-mono font-bold border border-mod1-border dark:border-mod1/40 shadow-soft-sm">
                <Layers className="w-3.5 h-3.5 text-mod1" /> 12 Lab Experiments
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-mod3-light dark:bg-mod3/20 text-mod3-text dark:text-mod3 text-xs font-mono font-bold border border-mod3-border dark:border-mod3/40 shadow-soft-sm">
                <Activity className="w-3.5 h-3.5 text-mod3" /> Live Practice Breadboard
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-mod4-light dark:bg-mod4/20 text-mod4-text dark:text-mod4 text-xs font-mono font-bold border border-mod4-border dark:border-mod4/40 shadow-soft-sm">
                <Cpu className="w-3.5 h-3.5 text-mod4" /> Verilog & FSM Synthesis
              </span>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Action: Solid bright blue fill with white text */}
              <button
                onClick={() => onNavigate('breadboard')}
                className="tactile-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-brand-sm transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Launch Practice Breadboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Action: Soft tinted fill with accent text */}
              <button
                onClick={() => onNavigate('theory')}
                className="tactile-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-mod4-light hover:bg-mod4-soft text-mod4-text text-sm font-bold border border-mod4-border shadow-soft-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-mod4" />
                <span>Explore Theory Modules</span>
              </button>

              <button
                onClick={() => onNavigate('lab')}
                className="tactile-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cream-paper hover:bg-cream-soft dark:bg-darklab-card dark:hover:bg-darklab-surface text-ink-800 dark:text-cream-paper text-sm font-semibold border border-cream-border dark:border-darklab-border shadow-soft-sm transition-all"
              >
                <span>12 Lab Manuals</span>
              </button>
            </div>
          </div>

          {/* Right Hero: Interactive Mini-Breadboard */}
          <div className="lg:col-span-6">
            <BreadboardMin />
          </div>
        </div>
      </div>

      {/* Station 0 Component: Quick Gate Playground */}
      <GatePlayground />

      {/* Station 0 Component: Syllabus Roadmap */}
      <SyllabusRoadmap onNavigate={onNavigate} />
    </div>
  );
};

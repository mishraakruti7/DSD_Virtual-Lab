import React, { useState } from 'react';
import {
  Cpu,
  BookOpen,
  FlaskConical,
  Layers,
  Activity,
  Award,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export type StationTab = 'home' | 'theory' | 'lab' | 'breadboard' | 'analyzer' | 'assessment';

interface HeaderProps {
  activeStation: StationTab;
  onSelectStation: (station: StationTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeStation, onSelectStation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stations = [
    { id: 'home', label: 'Home Workbench', icon: Cpu, accent: 'text-stone-700 bg-stone-100 hover:bg-stone-200' },
    { id: 'theory', label: 'Theory Modules', icon: BookOpen, accent: 'text-sky-700 bg-sky-50 hover:bg-sky-100' },
    { id: 'lab', label: '12 Lab Experiments', icon: FlaskConical, accent: 'text-peach-700 bg-peach-50 hover:bg-peach-100' },
    { id: 'breadboard', label: 'Virtual Breadboard', icon: Layers, accent: 'text-amber-700 bg-amber-50 hover:bg-amber-100' },
    { id: 'analyzer', label: 'Logic Analyzer', icon: Activity, accent: 'text-sage-700 bg-sage-50 hover:bg-sage-100' },
    { id: 'assessment', label: 'Challenges & Quiz', icon: Award, accent: 'text-rose-700 bg-rose-50 hover:bg-rose-100' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas-paper/90 backdrop-blur-md border-b border-border-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Course Metadata */}
          <div
            onClick={() => onSelectStation('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 shadow-soft-sm group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl text-stone-900 tracking-tight">
                  Virtual DSD Lab
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sage-100 text-sage-800 border border-sage-300">
                  ECCOR2PC203
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Digital System Design • Shah & Anchor Kutchhi Engineering College
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-canvas-warm/70 p-1.5 rounded-full border border-border-warm">
            {stations.map((item) => {
              const Icon = item.icon;
              const isActive = activeStation === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectStation(item.id as StationTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all select-none ${
                    isActive
                      ? 'bg-[#faf6ee] text-sky-950 shadow-soft-sm border border-[#ded5c2] font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-[#faf6ee]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Syllabus Pill & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#faf6ee] border border-[#ded5c2] text-xs text-stone-700 shadow-soft-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px]">Client Engine: Online</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-[#faf6ee] border border-[#ded5c2] text-stone-600 hover:bg-[#f5efe4] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#ded5c2] bg-[#faf6ee]/98 px-4 pt-3 pb-5 shadow-soft-lg space-y-1.5">
          {stations.map((item) => {
            const Icon = item.icon;
            const isActive = activeStation === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectStation(item.id as StationTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-sky-100 text-sky-900 border border-sky-200'
                    : 'text-stone-700 hover:bg-[#f5efe4]'
                }`}
              >
                <Icon className="w-4 h-4 text-sky-600" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import {
  BookOpen,
  FlaskConical,
  Cpu,
  Layers,
  HelpCircle,
  Award,
  Search,
  Menu,
  X,
  FileText,
  Activity,
  Bookmark,
  ChevronDown,
} from 'lucide-react';
import { useCourseStore } from '../../store/useCourseStore';
import { playStreakChime } from '../../utils/soundEffects';
import { UserMenu } from './UserMenu';

export type MainHubTab =
  | 'home'
  | 'theory'
  | 'lab'
  | 'simulators'
  | 'breadboard'
  | 'analyzer'
  | 'gallery'
  | 'quiz'
  | 'assessment'
  | 'projects'
  | 'resources'
  | 'glossary'
  | 'progress';

interface NavbarProps {
  activeTab: MainHubTab;
  onSelectTab: (tab: MainHubTab, extraId?: string | number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const { setCommandPaletteOpen, studentProgress, partyMode, togglePartyMode } = useCourseStore();

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1;
    if (nextCount >= 5) {
      togglePartyMode();
      playStreakChime();
      setLogoClicks(0);
    } else {
      setLogoClicks(nextCount);
      setTimeout(() => setLogoClicks(0), 2500);
    }
    onSelectTab('home');
  };

  const primaryLinks: { id: MainHubTab; label: string; icon: (isActive: boolean) => React.ReactNode }[] = [
    {
      id: 'theory',
      label: 'Theory Modules',
      icon: (active) => <BookOpen className={`w-3.5 h-3.5 ${active ? '!text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />,
    },
    {
      id: 'lab',
      label: '12 Labs',
      icon: (active) => <FlaskConical className={`w-3.5 h-3.5 ${active ? '!text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />,
    },
    {
      id: 'breadboard',
      label: 'Breadboard Lab',
      icon: (active) => <Layers className={`w-3.5 h-3.5 ${active ? '!text-white' : 'text-purple-600 dark:text-purple-400'}`} />,
    },
    {
      id: 'simulators',
      label: 'Simulators',
      icon: (active) => <Cpu className={`w-3.5 h-3.5 ${active ? '!text-white' : 'text-amber-500 dark:text-amber-400'}`} />,
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: (active) => <FileText className={`w-3.5 h-3.5 ${active ? '!text-white' : 'text-pink-600 dark:text-pink-400'}`} />,
    },
    {
      id: 'quiz',
      label: 'Quiz Hub',
      icon: (active) => <HelpCircle className={`w-3.5 h-3.5 ${active ? '!text-white' : 'text-rose-500 dark:text-rose-400'}`} />,
    },
  ];

  const secondaryLinks: { id: MainHubTab; label: string; icon: (isActive: boolean) => React.ReactNode }[] = [
    {
      id: 'assessment',
      label: 'Internal Assessment Calculator',
      icon: (active) => <Award className={`w-4 h-4 ${active ? '!text-white' : 'text-amber-600 dark:text-amber-400'}`} />,
    },
    {
      id: 'analyzer',
      label: 'Logic Analyzer Scope',
      icon: (active) => <Activity className={`w-4 h-4 ${active ? '!text-white' : 'text-sky-500'}`} />,
    },
    {
      id: 'projects',
      label: 'Mini-Projects (8 Ideas)',
      icon: (active) => <Award className={`w-4 h-4 ${active ? '!text-white' : 'text-amber-500'}`} />,
    },
    {
      id: 'glossary',
      label: 'DSD Glossary (80+ Terms)',
      icon: (active) => <Bookmark className={`w-4 h-4 ${active ? '!text-white' : 'text-purple-500'}`} />,
    },
    {
      id: 'resources',
      label: 'Books & NPTEL Links',
      icon: (active) => <FileText className={`w-4 h-4 ${active ? '!text-white' : 'text-emerald-500'}`} />,
    },
    {
      id: 'progress',
      label: 'My Progress Dashboard',
      icon: (active) => <Award className={`w-4 h-4 ${active ? '!text-white' : 'text-brand-500'}`} />,
    },
  ];

  const completedLabCount = studentProgress.completedLabs.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F0F17]/95 backdrop-blur-xl border-b border-indigo-100/70 dark:border-darklab-border text-ink-900 dark:text-cream-paper shadow-sm shadow-indigo-500/5 transition-colors">
      {/* 3px Signature Brand Gradient Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 xl:gap-8">
          {/* ZONE 1: Left Brand (Logo + Title + Course Code Badge) */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
            title={partyMode ? 'Party Mode Active! Click 5 times to turn off' : 'Virtual DSD Lab'}
          >
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-start via-brand-mid to-brand-end flex items-center justify-center !text-white font-display font-black text-sm shadow-md shadow-brand/30 group-hover:scale-105 transition-all ${
                partyMode ? 'ring-4 ring-amber-400 animate-bounce' : ''
              }`}
            >
              {partyMode ? '🎉' : 'DSD'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-ink-900 dark:text-cream-paper group-hover:text-brand-600 transition-colors">
                  Virtual DSD Lab
                </span>
                {partyMode ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-ink-900 animate-pulse shadow-amber-sm">
                    PARTY MODE 🚀
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
                    ECCOR2PC203
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-500 dark:text-cream-muted font-sans font-medium hidden sm:block">
                SAKEC &bull; Mumbai University Course Portal
              </p>
            </div>
          </div>

          {/* ZONE 2: Center Primary Nav Cluster (Grouped into a single sleek pill cluster) */}
          <nav
            className="hidden xl:flex items-center p-1 bg-cream-soft/80 dark:bg-darklab-base/80 border border-cream-border dark:border-darklab-border rounded-2xl shadow-xs backdrop-blur-sm gap-0.5"
            aria-label="Main Curriculum Navigation"
          >
            {primaryLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                    isActive
                      ? 'nav-pill-active !text-white font-extrabold shadow-sm ring-1 ring-purple-300 dark:ring-purple-600'
                      : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-darklab-card/80 font-semibold'
                  }`}
                >
                  {link.icon(isActive)}
                  <span className={isActive ? '!text-white font-black' : ''}>{link.label}</span>
                  {link.id === 'lab' && completedLabCount > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-white/30 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {completedLabCount}/12
                    </span>
                  )}
                </button>
              );
            })}

            {/* More Hubs Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                  secondaryLinks.some((l) => l.id === activeTab)
                    ? 'nav-pill-active !text-white font-extrabold shadow-sm ring-1 ring-purple-300 dark:ring-purple-600'
                    : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-darklab-card/80 font-semibold'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white/98 dark:bg-[#181824]/98 backdrop-blur-xl border-2 border-indigo-100 dark:border-darklab-border rounded-2xl shadow-xl py-2 z-50 animate-fadeIn space-y-1"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {secondaryLinks.map((item) => {
                    const isItemActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setMoreDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2.5 w-full px-4 py-2 text-xs font-sans tracking-wide text-left transition-all ${
                          isItemActive
                            ? 'nav-pill-active !text-white font-black'
                            : 'text-ink-800 dark:text-cream-muted hover:text-brand-600 dark:hover:text-white hover:bg-cream-soft dark:hover:bg-darklab-base font-bold'
                        }`}
                      >
                        {item.icon(isItemActive)}
                        <span className={isItemActive ? '!text-white' : ''}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ZONE 3: Right Zone (Quick Search + User Account CTA, cleanly partitioned) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Visual Separator between Center Nav and Right Zone */}
            <div className="hidden xl:block h-6 w-px bg-cream-border dark:bg-darklab-border shrink-0" aria-hidden="true" />

            {/* Quick Search Ctrl+K Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-soft dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper hover:border-brand-400 text-xs font-sans font-bold transition-all shadow-xs shrink-0"
              title="Search Course Materials (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
              <span className="hidden sm:inline font-sans">Quick Search</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white dark:bg-darklab-base text-[10px] font-mono text-ink-600 dark:text-cream-muted border border-cream-border dark:border-darklab-border">
                Ctrl K
              </kbd>
            </button>

            {/* Student Account Menu / Sign In CTA */}
            <UserMenu onNavigateTab={onSelectTab} />

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-ink-800 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-cream-soft dark:hover:bg-darklab-card transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-cream-border dark:border-darklab-border bg-white/98 dark:bg-darklab-card/98 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {/* Mobile User Profile Section */}
          <div className="pb-2 border-b border-cream-border dark:border-darklab-border flex items-center justify-between">
            <span className="text-[11px] font-sans text-ink-500 dark:text-cream-muted font-bold uppercase tracking-wider">
              Student Account
            </span>
            <UserMenu onNavigateTab={(tab) => {
              onSelectTab(tab as MainHubTab);
              setMobileMenuOpen(false);
            }} />
          </div>

          <div className="text-[11px] font-sans text-ink-500 dark:text-cream-muted font-bold px-2 uppercase tracking-wider mb-1 pt-1">
            Curriculum & Labs
          </div>

          {[...primaryLinks, ...secondaryLinks].map((link) => {
            const isItemActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold text-left transition-colors ${
                  isItemActive
                    ? 'nav-pill-active !text-white font-black shadow-brand'
                    : 'text-ink-800 dark:text-cream-muted hover:bg-cream-soft dark:hover:bg-darklab-base hover:text-ink-900 dark:hover:text-cream-paper'
                }`}
              >
                {link.icon(isItemActive)}
                <span className={isItemActive ? '!text-white font-black' : ''}>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

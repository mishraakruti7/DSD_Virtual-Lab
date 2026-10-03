import React, { useState, useRef, useEffect } from 'react';
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
  GraduationCap,
  ShieldAlert,
  MessageSquarePlus,
  Mail,
  Home,
  TrendingUp,
  Sparkles,
  Database,
} from 'lucide-react';
import { useCourseStore } from '../../store/useCourseStore';
import { useAuth } from '../../context/AuthContext';
import { playStreakChime, playConnectClick } from '../../utils/soundEffects';
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
  | 'progress'
  | 'faculty'
  | 'admin'
  | 'database-showcase'
  | 'feedback'
  | 'help'
  | 'contact'
  | 'reset-password';

interface NavbarProps {
  activeTab: MainHubTab;
  onSelectTab: (tab: MainHubTab, extraId?: string | number) => void;
}

interface NavItem {
  id: MainHubTab;
  label: string;
  desc?: string;
  icon: (active: boolean) => React.ReactNode;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'learn' | 'practice' | 'resources' | 'faculty' | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<Record<string, boolean>>({
    learn: true,
    practice: false,
    resources: false,
    faculty: false,
  });

  const [logoClicks, setLogoClicks] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setCommandPaletteOpen, studentProgress, partyMode, togglePartyMode } = useCourseStore();
  const { isFacultyOrAdmin, isAdmin, user } = useAuth();

  const completedLabCount = studentProgress?.completedLabs?.length || 0;

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  // Nav Groups Definition
  const learnItems: NavItem[] = [
    {
      id: 'theory',
      label: 'Theory Modules',
      desc: '6 syllabus chapters & learning objectives',
      icon: (active) => <BookOpen className={`w-4 h-4 ${active ? '!text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />,
    },
    {
      id: 'lab',
      label: '12 Labs Manual',
      desc: 'Hands-on practicals with truth tables',
      badge: completedLabCount > 0 ? `${completedLabCount}/12` : undefined,
      icon: (active) => <FlaskConical className={`w-4 h-4 ${active ? '!text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />,
    },
    {
      id: 'breadboard',
      label: 'Breadboard Lab',
      desc: 'Interactive solderless breadboard sandbox',
      icon: (active) => <Layers className={`w-4 h-4 ${active ? '!text-white' : 'text-purple-600 dark:text-purple-400'}`} />,
    },
    {
      id: 'simulators',
      label: 'Circuit Simulators',
      desc: '7 interactive digital logic builders',
      icon: (active) => <Cpu className={`w-4 h-4 ${active ? '!text-white' : 'text-amber-500 dark:text-amber-400'}`} />,
    },
  ];

  const practiceItems: NavItem[] = [
    {
      id: 'quiz',
      label: 'Quiz Hub',
      desc: 'Chapter-wise questions & viva prep',
      icon: (active) => <HelpCircle className={`w-4 h-4 ${active ? '!text-white' : 'text-rose-500 dark:text-rose-400'}`} />,
    },
    {
      id: 'assessment',
      label: 'Assessment Calculator',
      desc: 'Mumbai University internal marks estimator',
      icon: (active) => <Award className={`w-4 h-4 ${active ? '!text-white' : 'text-amber-600 dark:text-amber-400'}`} />,
    },
    {
      id: 'projects',
      label: 'Mini-Projects (8 Ideas)',
      desc: 'Semester project ideas with schematics',
      icon: (active) => <Sparkles className={`w-4 h-4 ${active ? '!text-white' : 'text-purple-500'}`} />,
    },
    {
      id: 'analyzer',
      label: 'Logic Analyzer Scope',
      desc: '4-channel real-time digital oscilloscope',
      icon: (active) => <Activity className={`w-4 h-4 ${active ? '!text-white' : 'text-sky-500'}`} />,
    },
  ];

  const resourcesItems: NavItem[] = [
    {
      id: 'gallery',
      label: 'Circuit Gallery',
      desc: 'Prebuilt verified starter schematics',
      icon: (active) => <FileText className={`w-4 h-4 ${active ? '!text-white' : 'text-pink-600 dark:text-pink-400'}`} />,
    },
    {
      id: 'glossary',
      label: 'DSD Glossary (80+ Terms)',
      desc: 'Quick digital electronics terminology search',
      icon: (active) => <Bookmark className={`w-4 h-4 ${active ? '!text-white' : 'text-indigo-500'}`} />,
    },
    {
      id: 'resources',
      label: 'Books & NPTEL Links',
      desc: 'Prescribed textbooks & video lectures',
      icon: (active) => <BookOpen className={`w-4 h-4 ${active ? '!text-white' : 'text-emerald-500'}`} />,
    },
  ];

  const facultyItems: NavItem[] = [
    ...(isFacultyOrAdmin
      ? [
          {
            id: 'faculty' as MainHubTab,
            label: 'Faculty Dashboard',
            desc: 'Continuous assessment & student roster',
            icon: (active: boolean) => (
              <GraduationCap className={`w-4 h-4 ${active ? '!text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
            ),
          },
          {
            id: 'database-showcase' as MainHubTab,
            label: 'System Database & ER',
            desc: 'Interactive schema explorer, ER diagram & audit metrics',
            icon: (active: boolean) => (
              <Database className={`w-4 h-4 ${active ? '!text-white' : 'text-cyan-600 dark:text-cyan-400'}`} />
            ),
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            id: 'admin' as MainHubTab,
            label: 'Admin Panel',
            desc: 'User management & support inbox',
            icon: (active: boolean) => (
              <ShieldAlert className={`w-4 h-4 ${active ? '!text-white' : 'text-purple-600 dark:text-purple-400'}`} />
            ),
          },
        ]
      : []),
  ];

  const isLearnActive = learnItems.some((i) => i.id === activeTab);
  const isPracticeActive = practiceItems.some((i) => i.id === activeTab);
  const isResourcesActive = resourcesItems.some((i) => i.id === activeTab);
  const isFacultyActive = facultyItems.some((i) => i.id === activeTab);

  const toggleDropdown = (key: 'learn' | 'practice' | 'resources' | 'faculty') => {
    playConnectClick();
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleSelectAndClose = (tab: MainHubTab) => {
    onSelectTab(tab);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F0F17]/95 backdrop-blur-xl border-b border-indigo-100/70 dark:border-darklab-border text-ink-900 dark:text-cream-paper shadow-sm shadow-indigo-500/5 transition-colors">
      {/* 3px Signature Brand Gradient Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* ZONE 1: Left Brand (Logo + Wordmark + Course Badge) */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
            title={partyMode ? 'Party Mode Active! Click 5 times to turn off' : 'Virtual DSD Lab Home'}
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
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs hidden sm:inline-block">
                    ECCOR2PC203
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-500 dark:text-cream-muted font-sans font-medium hidden md:block">
                SAKEC &bull; Mumbai University Course Portal
              </p>
            </div>
          </div>

          {/* ZONE 2: Center Primary Navigation (Hierarchical Dropdowns) */}
          <nav
            ref={dropdownRef}
            className="hidden lg:flex items-center p-1 bg-cream-soft/80 dark:bg-darklab-base/80 border border-cream-border dark:border-darklab-border rounded-2xl shadow-xs backdrop-blur-sm gap-0.5"
            aria-label="Primary Course Navigation"
          >
            {/* 1. Home Direct Link */}
            <button
              onClick={() => handleSelectAndClose('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                activeTab === 'home'
                  ? 'nav-pill-active !text-white font-extrabold shadow-sm ring-1 ring-purple-300 dark:ring-purple-600'
                  : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-darklab-card/80 font-bold'
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${activeTab === 'home' ? '!text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span>Home</span>
            </button>

            {/* 2. Learn Dropdown */}
            <div className="relative">
              <button
                id="nav-btn-learn"
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'learn'}
                aria-controls="nav-menu-learn"
                onClick={() => toggleDropdown('learn')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                  isLearnActive
                    ? 'nav-pill-active !text-white font-extrabold shadow-sm ring-1 ring-purple-300 dark:ring-purple-600'
                    : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-darklab-card/80 font-bold'
                }`}
              >
                <span>Learn</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'learn' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'learn' && (
                <div
                  id="nav-menu-learn"
                  role="menu"
                  aria-labelledby="nav-btn-learn"
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-darklab-card border border-indigo-100 dark:border-darklab-border rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn space-y-1"
                >
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 dark:text-cream-muted">
                    Curriculum & Practicals
                  </div>
                  {learnItems.map((item) => {
                    const isItemActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        onClick={() => handleSelectAndClose(item.id)}
                        className={`flex items-start gap-3 w-full px-3.5 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                          isItemActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                            : 'hover:bg-cream-soft dark:hover:bg-darklab-base text-ink-800 dark:text-cream-paper'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{item.icon(isItemActive)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold leading-tight truncate">{item.label}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.desc && (
                            <p className="text-[11px] text-ink-500 dark:text-cream-muted truncate mt-0.5">{item.desc}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Practice Dropdown */}
            <div className="relative">
              <button
                id="nav-btn-practice"
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'practice'}
                aria-controls="nav-menu-practice"
                onClick={() => toggleDropdown('practice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                  isPracticeActive
                    ? 'nav-pill-active !text-white font-extrabold shadow-sm ring-1 ring-purple-300 dark:ring-purple-600'
                    : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-darklab-card/80 font-bold'
                }`}
              >
                <span>Practice</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'practice' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'practice' && (
                <div
                  id="nav-menu-practice"
                  role="menu"
                  aria-labelledby="nav-btn-practice"
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-darklab-card border border-indigo-100 dark:border-darklab-border rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn space-y-1"
                >
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 dark:text-cream-muted">
                    Testing & Continuous Assessment
                  </div>
                  {practiceItems.map((item) => {
                    const isItemActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        onClick={() => handleSelectAndClose(item.id)}
                        className={`flex items-start gap-3 w-full px-3.5 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                          isItemActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                            : 'hover:bg-cream-soft dark:hover:bg-darklab-base text-ink-800 dark:text-cream-paper'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{item.icon(isItemActive)}</div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold leading-tight block truncate">{item.label}</span>
                          {item.desc && (
                            <p className="text-[11px] text-ink-500 dark:text-cream-muted truncate mt-0.5">{item.desc}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Resources Dropdown */}
            <div className="relative">
              <button
                id="nav-btn-resources"
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'resources'}
                aria-controls="nav-menu-resources"
                onClick={() => toggleDropdown('resources')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                  isResourcesActive
                    ? 'nav-pill-active !text-white font-extrabold shadow-sm ring-1 ring-purple-300 dark:ring-purple-600'
                    : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-darklab-card/80 font-bold'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'resources' && (
                <div
                  id="nav-menu-resources"
                  role="menu"
                  aria-labelledby="nav-btn-resources"
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-darklab-card border border-indigo-100 dark:border-darklab-border rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn space-y-1"
                >
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 dark:text-cream-muted">
                    Reference Library
                  </div>
                  {resourcesItems.map((item) => {
                    const isItemActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        onClick={() => handleSelectAndClose(item.id)}
                        className={`flex items-start gap-3 w-full px-3.5 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                          isItemActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                            : 'hover:bg-cream-soft dark:hover:bg-darklab-base text-ink-800 dark:text-cream-paper'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{item.icon(isItemActive)}</div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold leading-tight block truncate">{item.label}</span>
                          {item.desc && (
                            <p className="text-[11px] text-ink-500 dark:text-cream-muted truncate mt-0.5">{item.desc}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. My Progress Direct Link */}
            <button
              onClick={() => handleSelectAndClose('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                activeTab === 'progress'
                  ? 'nav-pill-active !text-white font-extrabold shadow-sm ring-1 ring-purple-300 dark:ring-purple-600'
                  : 'text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-darklab-card/80 font-bold'
              }`}
            >
              <TrendingUp className={`w-3.5 h-3.5 ${activeTab === 'progress' ? '!text-white' : 'text-brand-500'}`} />
              <span>My Progress</span>
            </button>

            {/* 6. Faculty / Admin Conditional Dropdown */}
            {(isFacultyOrAdmin || isAdmin) && (
              <div className="relative">
                <button
                  id="nav-btn-faculty"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === 'faculty'}
                  aria-controls="nav-menu-faculty"
                  onClick={() => toggleDropdown('faculty')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                    isFacultyActive
                      ? 'bg-indigo-600 text-white font-extrabold shadow-sm ring-1 ring-indigo-300'
                      : 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-bold'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{isAdmin ? 'Staff / Admin' : 'Faculty'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'faculty' ? 'rotate-180' : ''}`} />
                </button>

                {openDropdown === 'faculty' && (
                  <div
                    id="nav-menu-faculty"
                    role="menu"
                    aria-labelledby="nav-btn-faculty"
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-darklab-card border border-indigo-100 dark:border-darklab-border rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn space-y-1"
                  >
                    <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 dark:text-cream-muted">
                      Academic Administration
                    </div>
                    {facultyItems.map((item) => {
                      const isItemActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          role="menuitem"
                          onClick={() => handleSelectAndClose(item.id)}
                          className={`flex items-start gap-3 w-full px-3.5 py-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                            isItemActive
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                              : 'hover:bg-cream-soft dark:hover:bg-darklab-base text-ink-800 dark:text-cream-paper'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">{item.icon(isItemActive)}</div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold leading-tight block truncate">{item.label}</span>
                            {item.desc && (
                              <p className="text-[11px] text-ink-500 dark:text-cream-muted truncate mt-0.5">{item.desc}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* ZONE 3: Right Utility Zone (Quick Search + Help/Feedback/Contact Icons + User Account) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Search Ctrl+K Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cream-soft dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper hover:border-brand-400 text-xs font-sans font-bold transition-all shadow-xs shrink-0"
              title="Search Course Materials (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
              <span className="hidden xl:inline font-sans">Quick Search</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white dark:bg-darklab-base text-[10px] font-mono text-ink-600 dark:text-cream-muted border border-cream-border dark:border-darklab-border">
                Ctrl K
              </kbd>
            </button>

            {/* Help Icon Link */}
            <button
              onClick={() => handleSelectAndClose('help')}
              className={`p-2 rounded-xl text-xs font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                activeTab === 'help'
                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 ring-1 ring-sky-300'
                  : 'text-ink-600 dark:text-cream-muted hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-darklab-card'
              }`}
              title="Help & FAQ"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="sr-only">Help</span>
            </button>

            {/* Feedback Icon Link */}
            <button
              onClick={() => handleSelectAndClose('feedback')}
              className={`p-2 rounded-xl text-xs font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                activeTab === 'feedback'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 ring-1 ring-indigo-300'
                  : 'text-ink-600 dark:text-cream-muted hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-darklab-card'
              }`}
              title="Submit Feedback & Bug Report"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span className="sr-only">Feedback</span>
            </button>

            {/* Contact Us Icon Link */}
            <button
              onClick={() => handleSelectAndClose('contact')}
              className={`p-2 rounded-xl text-xs font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid ${
                activeTab === 'contact'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-300'
                  : 'text-ink-600 dark:text-cream-muted hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-darklab-card'
              }`}
              title="Contact SAKEC Faculty"
            >
              <Mail className="w-4 h-4" />
              <span className="sr-only">Contact</span>
            </button>

            {/* Vertical Separator */}
            <div className="h-6 w-px bg-cream-border dark:border-darklab-border mx-0.5" aria-hidden="true" />

            {/* User Account Menu / Sign In CTA */}
            <UserMenu onNavigateTab={onSelectTab} />

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              id="mobile-nav-toggle"
              aria-haspopup="true"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-ink-800 dark:text-cream-muted hover:text-ink-900 dark:hover:text-white hover:bg-cream-soft dark:hover:bg-darklab-card transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          role="region"
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card px-4 pt-3 pb-6 space-y-3 animate-fadeIn max-h-[80vh] overflow-y-auto shadow-2xl"
        >
          {/* User Account Line */}
          <div className="pb-3 border-b border-cream-border dark:border-darklab-border flex items-center justify-between">
            <span className="text-[11px] font-sans text-ink-500 dark:text-cream-muted font-bold uppercase tracking-wider">
              {user ? 'Account Logged In' : 'Student Portal'}
            </span>
            <UserMenu onNavigateTab={(tab) => handleSelectAndClose(tab as MainHubTab)} />
          </div>

          {/* Quick Direct Links */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectAndClose('home')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'home' ? 'bg-indigo-600 text-white' : 'bg-cream-soft dark:bg-darklab-base text-ink-800 dark:text-cream-paper'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleSelectAndClose('progress')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'progress' ? 'bg-indigo-600 text-white' : 'bg-cream-soft dark:bg-darklab-base text-ink-800 dark:text-cream-paper'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>My Progress</span>
            </button>
          </div>

          {/* Accordion 1: Learn */}
          <div className="border border-cream-border dark:border-darklab-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setMobileAccordion({ ...mobileAccordion, learn: !mobileAccordion.learn })}
              className="w-full px-4 py-2.5 bg-cream-soft/70 dark:bg-darklab-base/70 flex items-center justify-between text-xs font-bold text-ink-900 dark:text-cream-paper"
            >
              <span>Learn & Curriculum</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion.learn ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion.learn && (
              <div className="p-2 space-y-1 bg-white dark:bg-darklab-card">
                {learnItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectAndClose(item.id)}
                    className={`w-full p-2 rounded-xl text-xs font-bold text-left flex items-center justify-between ${
                      activeTab === item.id ? 'bg-indigo-50 dark:bg-indigo-950/60 text-brand-mid' : 'text-ink-700 dark:text-cream-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon(activeTab === item.id)}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 2: Practice */}
          <div className="border border-cream-border dark:border-darklab-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setMobileAccordion({ ...mobileAccordion, practice: !mobileAccordion.practice })}
              className="w-full px-4 py-2.5 bg-cream-soft/70 dark:bg-darklab-base/70 flex items-center justify-between text-xs font-bold text-ink-900 dark:text-cream-paper"
            >
              <span>Practice & Assessment</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion.practice ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion.practice && (
              <div className="p-2 space-y-1 bg-white dark:bg-darklab-card">
                {practiceItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectAndClose(item.id)}
                    className={`w-full p-2 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 ${
                      activeTab === item.id ? 'bg-indigo-50 dark:bg-indigo-950/60 text-brand-mid' : 'text-ink-700 dark:text-cream-muted'
                    }`}
                  >
                    {item.icon(activeTab === item.id)}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 3: Resources */}
          <div className="border border-cream-border dark:border-darklab-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setMobileAccordion({ ...mobileAccordion, resources: !mobileAccordion.resources })}
              className="w-full px-4 py-2.5 bg-cream-soft/70 dark:bg-darklab-base/70 flex items-center justify-between text-xs font-bold text-ink-900 dark:text-cream-paper"
            >
              <span>Resources & Gallery</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion.resources ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion.resources && (
              <div className="p-2 space-y-1 bg-white dark:bg-darklab-card">
                {resourcesItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectAndClose(item.id)}
                    className={`w-full p-2 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 ${
                      activeTab === item.id ? 'bg-indigo-50 dark:bg-indigo-950/60 text-brand-mid' : 'text-ink-700 dark:text-cream-muted'
                    }`}
                  >
                    {item.icon(activeTab === item.id)}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 4: Faculty / Admin (if authorized) */}
          {(isFacultyOrAdmin || isAdmin) && (
            <div className="border border-indigo-200 dark:border-indigo-900/60 rounded-2xl overflow-hidden">
              <button
                onClick={() => setMobileAccordion({ ...mobileAccordion, faculty: !mobileAccordion.faculty })}
                className="w-full px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200"
              >
                <span>Academic Management</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion.faculty ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion.faculty && (
                <div className="p-2 space-y-1 bg-white dark:bg-darklab-card">
                  {facultyItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectAndClose(item.id)}
                      className={`w-full p-2 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 ${
                        activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {item.icon(activeTab === item.id)}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Utility Links */}
          <div className="pt-2 border-t border-cream-border dark:border-darklab-border grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectAndClose('help')}
              className={`p-2 rounded-xl text-[11px] font-bold text-center flex flex-col items-center gap-1 ${
                activeTab === 'help' ? 'bg-sky-100 text-sky-800' : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-sky-500" />
              <span>Help</span>
            </button>
            <button
              onClick={() => handleSelectAndClose('feedback')}
              className={`p-2 rounded-xl text-[11px] font-bold text-center flex flex-col items-center gap-1 ${
                activeTab === 'feedback' ? 'bg-indigo-100 text-indigo-800' : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4 text-indigo-500" />
              <span>Feedback</span>
            </button>
            <button
              onClick={() => handleSelectAndClose('contact')}
              className={`p-2 rounded-xl text-[11px] font-bold text-center flex flex-col items-center gap-1 ${
                activeTab === 'contact' ? 'bg-emerald-100 text-emerald-800' : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted'
              }`}
            >
              <Mail className="w-4 h-4 text-emerald-500" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

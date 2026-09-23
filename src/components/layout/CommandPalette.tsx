import React, { useState, useEffect, useMemo } from 'react';
import { useCourseStore } from '../../store/useCourseStore';
import {
  Search,
  X,
  BookOpen,
  FlaskConical,
  Cpu,
  Layers,
  HelpCircle,
  FileText,
  CheckCircle,
  Award,
  Sparkles,
  Shuffle,
  Coins,
  Volume2,
} from 'lucide-react';
import { playConnectClick, playStreakChime, playSoftClick } from '../../utils/soundEffects';
import { ALL_THEORY_MODULES } from '../../data/modules';
import { LAB_EXPERIMENTS } from '../../data/labs';
import { DSD_GLOSSARY } from '../../data/glossary';
import { MINI_PROJECTS } from '../../data/projects';
import { Searching, Sorting } from '../../dsa';

export interface CommandItem {
  id: string;
  category: 'Module' | 'Lab' | 'Simulator' | 'Quiz' | 'Glossary' | 'Project' | 'Academic' | 'Playful';
  title: string;
  subtitle: string;
  targetTab?: string;
  targetId?: string | number;
  icon: React.ReactNode;
  onExecute?: () => void;
}

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extraId?: string | number) => void;
}> = ({ isOpen, onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playfulNotice, setPlayfulNotice] = useState<string | null>(null);

  // Index searchable corpus
  const allItems: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // Modules
    ALL_THEORY_MODULES.forEach((m) => {
      list.push({
        id: `mod-${m.id}`,
        category: 'Module',
        title: `Module ${m.id}: ${m.title}`,
        subtitle: `${m.hours} Hours • ${m.coTarget}`,
        targetTab: 'theory',
        targetId: m.id,
        icon: <BookOpen className="w-4 h-4 text-sky-400" />,
      });
      m.sections.forEach((sec) => {
        list.push({
          id: sec.subtopicId,
          category: 'Module',
          title: sec.title,
          subtitle: `Module ${m.id} Subtopic`,
          targetTab: 'theory',
          targetId: m.id,
          icon: <BookOpen className="w-4 h-4 text-sky-300" />,
        });
      });
    });

    // Labs
    LAB_EXPERIMENTS.forEach((exp) => {
      list.push({
        id: `lab-${exp.id}`,
        category: 'Lab',
        title: `Lab Exp ${exp.id}: ${exp.shortTitle}`,
        subtitle: `${exp.category} • ${exp.co}`,
        targetTab: 'lab',
        targetId: exp.id,
        icon: <FlaskConical className="w-4 h-4 text-emerald-400" />,
      });
    });

    // Simulators
    list.push(
      { id: 'sim-ff', category: 'Simulator', title: 'Flip-Flop Explorer', subtitle: 'SR, JK, D, T Excitation & Timing', targetTab: 'simulators', targetId: 'flip-flops', icon: <Cpu className="w-4 h-4 text-amber-400" /> },
      { id: 'sim-cnt', category: 'Simulator', title: 'Counter Waveform Visualizer', subtitle: 'Ripple vs Synchronous Real-time Scope', targetTab: 'simulators', targetId: 'counters', icon: <Cpu className="w-4 h-4 text-amber-400" /> },
      { id: 'sim-sr', category: 'Simulator', title: '74194 Shift Register Simulator', subtitle: 'SISO, SIPO, PISO, PIPO, Ring & Johnson', targetTab: 'simulators', targetId: 'shift-registers', icon: <Cpu className="w-4 h-4 text-amber-400" /> },
      { id: 'sim-vtc', category: 'Simulator', title: 'Logic Family VTC & Noise Margins', subtitle: 'TTL vs CMOS Switching Thresholds', targetTab: 'simulators', targetId: 'vtc', icon: <Cpu className="w-4 h-4 text-amber-400" /> },
      { id: 'sim-fsm', category: 'Simulator', title: 'FSM State Bubble Designer', subtitle: 'Mealy / Moore Pattern 1011 Stepper', targetTab: 'simulators', targetId: 'fsm', icon: <Cpu className="w-4 h-4 text-amber-400" /> },
      { id: 'sim-alarm', category: 'Simulator', title: 'Lab 11 Security Door System', subtitle: 'Magnetic Reed + 7474 Latch + Siren', targetTab: 'simulators', targetId: 'security-alarm', icon: <Cpu className="w-4 h-4 text-rose-400" /> }
    );

    // Breadboard & Analyzer
    list.push(
      { id: 'bb-main', category: 'Simulator', title: 'Virtual Breadboard Lab', subtitle: 'Interactive Solderless Breadboard & IC Wiring', targetTab: 'breadboard', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
      { id: 'analyzer-main', category: 'Simulator', title: 'Digital Logic Analyzer', subtitle: '8-Channel Waveform Scope & Timing Analyzer', targetTab: 'analyzer', icon: <Layers className="w-4 h-4 text-purple-400" /> }
    );

    // Quiz Hub
    list.push(
      { id: 'quiz-hub', category: 'Quiz', title: 'Quiz Hub (100+ Questions)', subtitle: '6 Modes: Modules, COs, Mock Exam, Viva Prep', targetTab: 'quiz', icon: <HelpCircle className="w-4 h-4 text-pink-400" /> }
    );

    // Circuit Gallery
    list.push(
      { id: 'gal-main', category: 'Academic', title: 'Circuit Schematics Gallery', subtitle: '30+ Interactive SVG Schematics & Pinouts', targetTab: 'gallery', icon: <FileText className="w-4 h-4 text-indigo-400" /> }
    );

    // Assessment & Calculator
    list.push(
      { id: 'assess-calc', category: 'Academic', title: 'Marks & Grade Calculator', subtitle: 'Internal Assessment, TW, ESE & Viva Grading', targetTab: 'assessment', icon: <Award className="w-4 h-4 text-yellow-400" /> }
    );

    // Mini Projects
    MINI_PROJECTS.forEach((p) => {
      list.push({
        id: `proj-${p.id}`,
        category: 'Project',
        title: p.title,
        subtitle: `${p.complexity} • ${p.category}`,
        targetTab: 'projects',
        targetId: p.id,
        icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      });
    });

    // Glossary
    DSD_GLOSSARY.forEach((g) => {
      list.push({
        id: `gloss-${g.id}`,
        category: 'Glossary',
        title: g.term,
        subtitle: g.definition.slice(0, 70) + '...',
        targetTab: 'glossary',
        targetId: g.id,
        icon: <BookOpen className="w-4 h-4 text-stone-400" />,
      });
    });

    // Playful Easter Egg & Utility Commands
    list.push(
      {
        id: 'cmd-surprise',
        category: 'Playful',
        title: 'Surprise Me! 🎲',
        subtitle: 'Jump to a randomly selected interactive simulator, lab experiment, or quiz',
        icon: <Shuffle className="w-4 h-4 text-emerald-400" />,
        onExecute: () => {
          const surprises: { tab: string; id?: string | number }[] = [
            { tab: 'breadboard' },
            { tab: 'simulators', id: 'counters' },
            { tab: 'simulators', id: 'flip-flops' },
            { tab: 'simulators', id: 'shift-registers' },
            { tab: 'simulators', id: 'security-alarm' },
            { tab: 'quiz' },
            { tab: 'lab', id: 2 },
            { tab: 'lab', id: 5 },
            { tab: 'lab', id: 11 },
            { tab: 'theory', id: 3 },
          ];
          const pick = surprises[Math.floor(Math.random() * surprises.length)];
          playStreakChime();
          onNavigate(pick.tab, pick.id);
          onClose();
        },
      },
      {
        id: 'cmd-coin',
        category: 'Playful',
        title: 'Flip a Coin 🪙 (Logic 0 or Logic 1)',
        subtitle: 'Generate a random binary state: Logic 0 (0V / GND) or Logic 1 (+5V / HIGH)',
        icon: <Coins className="w-4 h-4 text-amber-400" />,
        onExecute: () => {
          const isHigh = Math.random() > 0.5;
          playConnectClick();
          setPlayfulNotice(
            isHigh
              ? '🪙 Coin landed on LOGIC 1 (HIGH / +5V)! Saturated conduction path open.'
              : '🪙 Coin landed on LOGIC 0 (LOW / GND)! Ground pull-down active.'
          );
        },
      },
      {
        id: 'cmd-party',
        category: 'Playful',
        title: 'Toggle Party Mode 🎉',
        subtitle: 'Toggle celebratory animations and dynamic effects across the lab',
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        onExecute: () => {
          useCourseStore.getState().togglePartyMode();
          playStreakChime();
          const active = useCourseStore.getState().partyMode;
          setPlayfulNotice(active ? '🎉 Party Mode ENABLED! Enjoy the animations.' : 'Party mode returned to standard.');
        },
      },
      {
        id: 'cmd-sound',
        category: 'Playful',
        title: 'Toggle Lab Audio Synthesizer 🔊',
        subtitle: 'Enable or mute zero-dependency Web Audio synthesizer sound effects',
        icon: <Volume2 className="w-4 h-4 text-sky-400" />,
        onExecute: () => {
          useCourseStore.getState().toggleSound();
          playConnectClick();
          const soundOn = useCourseStore.getState().soundEnabled;
          setPlayfulNotice(soundOn ? '🔊 Audio synthesizer enabled!' : '🔇 Audio feedback muted.');
        },
      }
    );

    return list;
  }, [onNavigate, onClose]);

  // --- DSA MODULE 3 & 4: PRE-SORTED INDEX FOR O(log N) BINARY SEARCH ---
  // Pre-sorts the catalog alphabetically once using MergeSort (CO4: 4.2)
  const sortedByTitle = useMemo(() => {
    return Sorting.mergeSort(allItems, (a, b) => a.title.localeCompare(b.title));
  }, [allItems]);

  // --- DSA MODULE 3: HYBRID BINARY SEARCH + LINEAR SEARCH (CO3: 3.1) ---
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return allItems.slice(0, 15);
    }

    // Step A: Binary Search for exact / prefix matches in O(log N)
    const binaryPrefixMatches = Searching.binarySearchPrefix(
      sortedByTitle,
      q,
      (item) => item.title
    );
    const seenIds = new Set(binaryPrefixMatches.map((item) => item.id));

    // Step B: Linear Search fallback for substring / category matches in O(N)
    const { items: linearMatches } = Searching.linearSearch(allItems, (item) => {
      if (seenIds.has(item.id)) return false;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });

    // Merge exact/prefix matches first, followed by substring linear matches
    return [...binaryPrefixMatches, ...linearMatches].slice(0, 20);
  }, [allItems, sortedByTitle, searchQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          const item = filteredItems[selectedIndex];
          if (item.onExecute) {
            item.onExecute();
          } else if (item.targetTab) {
            onNavigate(item.targetTab, item.targetId);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onNavigate]);

  // Global Ctrl+K trigger
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          useCourseStore.getState().setCommandPaletteOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#fbf7ee] dark:bg-stone-900 border border-[#ded5c2] dark:border-stone-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-800 dark:text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#ded5c2] dark:border-stone-800 gap-3 bg-[#faf6ee] dark:bg-stone-900">
          <Search className="w-5 h-5 text-cyan-700 dark:text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search syllabus modules, 12 labs, ICs, glossary, simulators... (↑↓ to select, Enter to jump)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent border-0 text-sm focus:outline-none focus:ring-0 text-slate-900 dark:text-stone-100 placeholder:text-stone-400 font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-[#ede4d4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#ede4d4] dark:divide-stone-800/40 bg-[#fbf7ee] dark:bg-stone-900">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-500 font-mono text-sm">
              No matching curriculum or lab items found for "{searchQuery}".
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.onExecute) {
                    item.onExecute();
                  } else if (item.targetTab) {
                    onNavigate(item.targetTab, item.targetId);
                    onClose();
                  }
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? 'bg-cyan-100 text-cyan-950 border border-cyan-300'
                    : 'hover:bg-[#f5efe4] text-slate-700 dark:text-stone-300'
                }`}
              >
                <div className="p-2 rounded-lg bg-[#ede4d4] dark:bg-stone-800 border border-[#ded5c2] dark:border-stone-700 shrink-0 text-stone-700 dark:text-stone-300">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate text-slate-900 dark:text-stone-100">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ede4d4] text-stone-700 font-mono border border-[#ded5c2] uppercase">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-stone-500 hidden sm:inline">
                  Jump ↵
                </span>
              </div>
            ))
          )}
        </div>

        {/* Playful Notice Banner */}
        {playfulNotice && (
          <div className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 border-t border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
            <span>{playfulNotice}</span>
            <button
              onClick={() => setPlayfulNotice(null)}
              className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-500 hover:text-indigo-800 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#f5efe4] dark:bg-stone-950 border-t border-[#ded5c2] dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-400 flex items-center justify-between">
          <span>Use ↑↓ arrows to navigate</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};

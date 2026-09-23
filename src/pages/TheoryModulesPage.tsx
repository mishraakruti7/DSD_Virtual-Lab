import React, { useState, useMemo } from 'react';
import { ALL_THEORY_MODULES } from '../data/modules';
import { DoublyLinkedList } from '../dsa';
import {
  BookOpen,
  Clock,
  Award,
  Sparkles,
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Eye,
  Zap,
  Coffee,
  Camera,
  DoorOpen,
  RotateCcw,
  Radio,
  Flame,
  Activity,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  TtlTotemPoleSchematic,
  MasterSlaveJkSchematic,
  VendingMachineAsmChart,
  SequenceDetectorFsmDiagram,
  Mod6RippleCounterSchematic,
  Mod8SyncCounterSchematic,
  FullAdderSubtractorSchematic,
  Decoder74138Schematic,
} from '../components/common/CircuitSchematics';
import {
  CombinationalVsSequentialIllustration,
  LatchVsFlipFlopIllustration,
  FlipFlopPersonalitiesIllustration,
  MasterSlaveAirlockIllustration,
  ShiftRegisterBucketBrigadeIllustration,
  RingVsJohnsonCounterIllustration,
  RippleVsSynchronousCounterIllustration,
  TtlVsCmosCarIllustration,
  SubwayTurnstileFsmIllustration,
  VerilogWiresVsCodeIllustration,
  StuckAtFaultDetectiveIllustration,
  Module1HeroIllustration,
  Module2HeroIllustration,
  Module3HeroIllustration,
  Module4HeroIllustration,
} from '../components/illustrations/TheoryIllustrations';

export const TheoryModulesPage: React.FC<{ initialModuleId?: number }> = ({
  initialModuleId,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<number>(initialModuleId || 1);
  const [learningMode, setLearningMode] = useState<'beginner' | 'technical'>('beginner');
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>('all');
  const [expandedAnalogy, setExpandedAnalogy] = useState<{ [key: string]: boolean }>({
    'latch-vs-ff': true,
    'race-around': true,
    'shift-register': true,
    'counter-types': true,
    'ttl-vs-cmos': true,
    'totem-pole': true,
    'interfacing': true,
    'fsm-concept': true,
    'mealy-vs-moore': true,
    'asm-concept': true,
    'plds-concept': true,
    'verilog-concept': true,
    'blocking-nonblocking': true,
    'fault-testing': true,
  });

  const toggleAnalogy = (key: string) => {
    setExpandedAnalogy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- DSA MODULE 1: DOUBLY LINKED LIST FOR SEQUENTIAL MODULE NAVIGATION ---
  // Models Theory Modules 1-4 as DoublyNode instances with O(1) prev and next stepping
  const moduleList = useMemo(
    () => DoublyLinkedList.fromArray(ALL_THEORY_MODULES),
    []
  );

  const currentNode = useMemo(
    () => moduleList.findNode((m) => m.id === activeModuleId) || moduleList.getNode(0),
    [moduleList, activeModuleId]
  );

  const currentModule = currentNode ? currentNode.data : ALL_THEORY_MODULES[0];
  const prevModule = currentNode?.prev?.data;
  const nextModule = currentNode?.next?.data;

  return (
    <div className="space-y-10 animate-fadeIn pb-16 max-w-6xl mx-auto">
      {/* 1. Header Banner & Mode Selector */}
      <div className="bg-white dark:bg-darklab-card p-6 sm:p-10 rounded-3xl border border-cream-border dark:border-darklab-border shadow-md dark:shadow-2xl relative overflow-hidden transition-colors">
        {/* Soft drifting ambient blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-mod1/10 rounded-full blur-3xl animate-blob-drift-1 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-mod4/10 rounded-full blur-3xl animate-blob-drift-2 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
                DSD Theory Made Crystal Clear &bull; Zero Confusion
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink-900 dark:text-cream-paper">
                Digital System Design{' '}
                <span className="text-brand-gradient">Simplified</span>
              </h1>
              <p className="text-ink-600 dark:text-cream-muted text-sm max-w-2xl leading-relaxed">
                Learn core digital electronics from scratch with intuitive real-world analogies, step-by-step visual mechanisms, and practical examples before diving into university formulas.
              </p>
            </div>

            {/* Beginner vs Exam Mode Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-cream-soft dark:bg-darklab-base p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border shadow-inner">
              <span className="text-[11px] font-mono text-ink-500 dark:text-cream-muted px-2 font-semibold">
                Explanation Style:
              </span>
              <div className="flex gap-1 font-mono text-xs">
                <button
                  onClick={() => setLearningMode('beginner')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    learningMode === 'beginner'
                      ? 'bg-mod2 text-white shadow-amber scale-105'
                      : 'text-ink-600 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Friendly & Simple</span>
                </button>
                <button
                  onClick={() => setLearningMode('technical')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    learningMode === 'technical'
                      ? 'btn-brand-gradient text-white shadow-brand scale-105'
                      : 'text-ink-600 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Technical & Exam</span>
                </button>
              </div>
            </div>
          </div>

          {/* Module Selection Pills with Saturated Identity */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-cream-border dark:border-darklab-border font-sans">
            {ALL_THEORY_MODULES.map((mod) => {
              const isSelected = activeModuleId === mod.id;
              const moduleThemes = {
                1: {
                  selected: 'bg-mod1 text-white shadow-coral border-mod1 font-bold ring-2 ring-rose-300',
                  idle: 'bg-rose-50/50 hover:bg-rose-100/70 border-2 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 text-ink-900 dark:text-cream-paper',
                  badge: 'text-mod1 font-black',
                },
                2: {
                  selected: 'bg-mod2 text-white shadow-amber border-mod2 font-bold ring-2 ring-amber-300',
                  idle: 'bg-amber-50/50 hover:bg-amber-100/70 border-2 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 text-ink-900 dark:text-cream-paper',
                  badge: 'text-mod2 font-black',
                },
                3: {
                  selected: 'bg-mod3 text-white shadow-teal border-mod3 font-bold ring-2 ring-emerald-300',
                  idle: 'bg-emerald-50/50 hover:bg-emerald-100/70 border-2 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-ink-900 dark:text-cream-paper',
                  badge: 'text-mod3 font-black',
                },
                4: {
                  selected: 'bg-mod4 text-white shadow-violet border-mod4 font-bold ring-2 ring-purple-300',
                  idle: 'bg-purple-50/50 hover:bg-purple-100/70 border-2 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/40 text-ink-900 dark:text-cream-paper',
                  badge: 'text-mod4 font-black',
                },
              }[mod.id as 1 | 2 | 3 | 4];

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModuleId(mod.id);
                    setActiveSubtopicId('all');
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? moduleThemes.selected
                      : `${moduleThemes.idle}`
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${isSelected ? '!text-white' : moduleThemes.badge}`}>Module {mod.id}</span>
                    <span className={`font-mono text-[11px] ${isSelected ? 'text-white/80' : 'text-ink-500 dark:text-cream-muted'}`}>{mod.hours}h</span>
                  </div>
                  <div className={`font-display font-bold text-sm line-clamp-1 ${isSelected ? '!text-white' : 'text-ink-900 dark:text-cream-paper'}`}>
                    {mod.id === 1 && 'Sequential Logic'}
                    {mod.id === 2 && 'Logic Families'}
                    {mod.id === 3 && 'FSM & PLDs'}
                    {mod.id === 4 && 'Verilog & Testing'}
                  </div>
                  <div className={`text-[11px] font-mono ${isSelected ? 'text-white/80' : 'text-ink-500 dark:text-cream-muted'}`}>
                    ~{mod.weightageMarks} Marks in ESE
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Current Module Overview Card */}
      <div className={`bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors ${
        currentModule.id === 1 ? 'card-vivid-mod1' :
        currentModule.id === 2 ? 'card-vivid-mod2' :
        currentModule.id === 3 ? 'card-vivid-mod3' :
        'card-vivid-mod4'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-border dark:border-darklab-border">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs mb-1">
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                currentModule.id === 1 ? 'badge-vivid-mod1' :
                currentModule.id === 2 ? 'badge-vivid-mod2' :
                currentModule.id === 3 ? 'badge-vivid-mod3' :
                'badge-vivid-mod4'
              }`}>
                {currentModule.code}
              </span>
              <span className="text-ink-500 dark:text-cream-muted font-medium">
                Syllabus Target: {currentModule.coTarget}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink-900 dark:text-cream-paper">
              {currentModule.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              {currentModule.hours} Lecture Hours
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-mod2-light text-mod2-dark border border-mod2/30 font-bold">
              Weightage: ~{currentModule.weightageMarks} Marks
            </span>
          </div>
        </div>

        {/* Big Friendly Concept Teaser */}
        <div className={`p-5 rounded-2xl border flex items-start gap-4 text-ink-700 dark:text-cream-muted text-sm leading-relaxed shadow-xs ${
          currentModule.id === 1 ? 'bg-mod1-light/40 border-mod1/30 dark:bg-darklab-base' :
          currentModule.id === 2 ? 'bg-mod2-light/40 border-mod2/30 dark:bg-darklab-base' :
          currentModule.id === 3 ? 'bg-mod3-light/40 border-mod3/30 dark:bg-darklab-base' :
          'bg-mod4-light/40 border-mod4/30 dark:bg-darklab-base'
        }`}>
          <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
            currentModule.id === 1 ? 'bg-mod1-light text-mod1-dark border-mod1/30' :
            currentModule.id === 2 ? 'bg-mod2-light text-mod2-dark border-mod2/30' :
            currentModule.id === 3 ? 'bg-mod3-light text-mod3-dark border-mod3/30' :
            'bg-mod4-light text-mod4-dark border-mod4/30'
          }`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-ink-900 dark:text-cream-paper block text-sm mb-1">
              What will you learn in this module?
            </span>
            {currentModule.id === 1 && (
              <p>
                How computers remember information! You&apos;ll learn how basic logic gates are wired into memory elements (flip-flops), how digital watches and odometers count pulses, and how data is shifted bit-by-bit inside registers.
              </p>
            )}
            {currentModule.id === 2 && (
              <p>
                What happens under the physical hood of microchips! We look at the actual silicon transistors (bipolar TTL and MOSFET CMOS), compare power and speed, and solve why plugging different chip families together needs special care.
              </p>
            )}
            {currentModule.id === 3 && (
              <p>
                How to design electronic brains! You&apos;ll build state machines that control traffic lights, drink vending machines, and digital locks using Finite State Machines (FSMs) and reconfigurable chips (PLDs &amp; FPGAs).
              </p>
            )}
            {currentModule.id === 4 && (
              <p>
                How modern chips are coded and tested! Instead of drawing gates by hand, engineers write hardware in Verilog code. You&apos;ll learn how hardware runs simultaneously, and how test engineers detect broken silicon connections.
              </p>
            )}
          </div>
        </div>

        {/* Subtopic Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
          <span className="text-ink-500 dark:text-cream-muted mr-1">Jump to Topic:</span>
          <button
            onClick={() => setActiveSubtopicId('all')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeSubtopicId === 'all'
                ? currentModule.id === 1 ? 'bg-mod1 text-white shadow-coral font-bold' :
                  currentModule.id === 2 ? 'bg-mod2 text-white shadow-amber font-bold' :
                  currentModule.id === 3 ? 'bg-mod3 text-white shadow-teal font-bold' :
                  'bg-mod4 text-white shadow-violet font-bold'
                : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper border border-cream-border dark:border-darklab-border'
            }`}
          >
            All Concepts
          </button>
          {currentModule.sections.map((sec) => (
            <button
              key={sec.subtopicId}
              onClick={() => setActiveSubtopicId(sec.subtopicId)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeSubtopicId === sec.subtopicId
                  ? currentModule.id === 1 ? 'bg-mod1 text-white shadow-coral font-bold' :
                    currentModule.id === 2 ? 'bg-mod2 text-white shadow-amber font-bold' :
                    currentModule.id === 3 ? 'bg-mod3 text-white shadow-teal font-bold' :
                    'bg-mod4 text-white shadow-violet font-bold'
                  : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper border border-cream-border dark:border-darklab-border'
              }`}
            >
              {sec.title.split(':')[0].split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETAILED CONTENT SECTIONS FOR MODULE 1 */}
      {/* ========================================================================= */}
      {currentModule.id === 1 && (
        <div className="space-y-8">
          {/* Conversational Welcome & Hero Dynamic */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border-2 border-mod1/30 card-vivid-mod1 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl select-none">👋</span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ink-900 dark:text-cream-paper">
                  Welcome to Sequential Circuits
                </h3>
                <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                  Forget dry formulas for a moment: today we teach cold silicon how to remember. From the instant a flip-flop catches a clock edge to data marching down a shift register, here is how digital memory actually breathes.
                </p>
              </div>
            </div>
            <Module1HeroIllustration />
          </div>

          {/* TOPIC 1.1: LATCHES VS FLIP-FLOPS & RACE-AROUND */}
          {(activeSubtopicId === 'all' || activeSubtopicId === 'm1-latches-ff') && (
            <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod1 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
              <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-mod1 text-white font-mono font-bold flex items-center justify-center text-sm shadow-coral-sm">
                    1.1
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-cream-paper">
                      Memory Elements: Latches vs. Flip-Flops
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-cream-muted font-mono">
                      Level-Triggering vs. Edge-Triggering &bull; Race-Around Elimination
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-ink-500 dark:text-cream-muted">3 Hours</span>
              </div>

              {/* Visual Infographic: Combinational vs Sequential */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-mod1 dark:text-mod1 uppercase tracking-wider block">
                  Core Foundational Difference:
                </span>
                <CombinationalVsSequentialIllustration />
              </div>

              {/* The "Explain Like I'm 5" Analogy Box */}
              <div className="rounded-2xl zone-mod1-wash border border-mod1/25 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-mod1-dark dark:text-mod1 flex items-center gap-2 uppercase tracking-wider">
                    <Coffee className="w-4 h-4 text-mod1" />
                    Everyday Real-World Analogy: The Open Door vs. Camera Snapshot
                  </span>
                  <button
                    onClick={() => toggleAnalogy('latch-vs-ff')}
                    className="text-ink-600 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper p-1 transition-colors"
                  >
                    {expandedAnalogy['latch-vs-ff'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {expandedAnalogy['latch-vs-ff'] && (
                  <div className="space-y-4 pt-2 border-t border-mod1/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
                        <div className="font-bold text-mod2-dark dark:text-mod2 flex items-center gap-1.5">
                          <DoorOpen className="w-4 h-4 text-mod2" />
                          1. A Latch is like an OPEN DOOR (Level-Sensitive)
                        </div>
                        <p className="leading-relaxed text-ink-700 dark:text-cream-muted">
                          Imagine a classroom door held wide open as long as the bell rings (Clock = HIGH). While the door is open, students can continuously run in and out. The room&apos;s contents change constantly! In electronics, a latch lets data pass straight through as long as the enable is held HIGH.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
                        <div className="font-bold text-brand-600 dark:text-brand-300 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-brand-500" />
                          2. A Flip-Flop is like a CAMERA SNAPSHOT (Edge-Triggered)
                        </div>
                        <p className="leading-relaxed text-ink-700 dark:text-cream-muted">
                          Now imagine a camera with a high-speed shutter. It doesn&apos;t matter what you do before or after the flash. Only what you are doing at the <em>exact instant the shutter clicks</em> (the rising clock edge &uarr;) gets saved into the photo forever!
                        </p>
                      </div>
                    </div>

                    {/* Illustrated Visual Comparison */}
                    <LatchVsFlipFlopIllustration />
                  </div>
                )}
              </div>

              {/* The 4 Standard Flip-Flop Types Explained Simply */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider block">
                  The 4 Classic Flip-Flop Personalities:
                </span>
                <FlipFlopPersonalitiesIllustration />
              </div>

              {/* The Race-Around Condition & Master-Slave Solution */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold text-mod1 uppercase tracking-wider block">
                  The Race-Around Disaster &amp; The Master-Slave Two-Door Solution:
                </span>

                <div className="p-5 rounded-2xl zone-mod1-wash border border-mod1/25 space-y-4 text-xs sm:text-sm text-ink-700 dark:text-cream-muted">
                  <div className="flex items-center gap-2 font-bold text-mod1-dark dark:text-mod1">
                    <Flame className="w-4 h-4 text-mod1" />
                    What is the Race-Around Condition?
                  </div>
                  <p className="leading-relaxed">
                    Imagine two hyperactive kids running back and forth through a revolving door. If the door remains unlocked for too long, they keep spinning wildly (0 &rarr; 1 &rarr; 0 &rarr; 1 ...). In a level-triggered JK flip-flop, when J=K=1, the output toggles repeatedly while clock is HIGH. If the clock pulse width stays HIGH longer than the gate delay (t_pulse &gt; t_pd), the final output when the clock ends is complete random luck!
                  </p>

                  {/* Illustrated Master-Slave Submarine Airlock */}
                  <MasterSlaveAirlockIllustration />

                  {/* Embedded Master-Slave Schematic */}
                  <div className="pt-2">
                    <MasterSlaveJkSchematic />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 1.2: SHIFT REGISTERS */}
          {(activeSubtopicId === 'all' || activeSubtopicId === 'm1-shift-registers') && (
            <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod1 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
              <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-mod1 text-white font-mono font-bold flex items-center justify-center text-sm shadow-coral-sm">
                    1.2
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-cream-paper">
                      Shift Registers: Passing Data Down the Line
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-cream-muted font-mono">
                      SISO, SIPO, PISO, PIPO &bull; Universal Shift Register IC 74194 &bull; Ring &amp; Johnson
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-ink-500 dark:text-cream-muted">2 Hours</span>
              </div>

              {/* Firefighter Bucket Analogy Box */}
              <div className="rounded-2xl zone-mod3-wash border border-mod3/25 p-5 space-y-3">
                <span className="text-xs font-mono font-bold text-mod3-dark dark:text-mod3 flex items-center gap-2 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-mod3" />
                  Real-World Analogy: The Firefighting Bucket Brigade
                </span>
                <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                  Imagine four firefighters standing in a row with empty hands. At each whistle blow (clock tick), firefighter 1 takes a bucket from the river, firefighter 2 takes firefighter 1&apos;s bucket, firefighter 3 takes 2&apos;s, and firefighter 4 takes 3&apos;s. That&apos;s a 4-bit shift register!
                </p>

                {/* Firefighter Bucket Brigade Illustration */}
                <ShiftRegisterBucketBrigadeIllustration />
              </div>

              {/* Ring vs Johnson Counter Comparison */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider block">
                  Ring Counter vs. Twisted Johnson Counter:
                </span>
                <RingVsJohnsonCounterIllustration />
              </div>
            </div>
          )}

          {/* TOPIC 1.3: COUNTERS */}
          {(activeSubtopicId === 'all' || activeSubtopicId === 'm1-counters') && (
            <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod1 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
              <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-mod1 text-white font-mono font-bold flex items-center justify-center text-sm shadow-coral-sm">
                    1.3
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-cream-paper">
                      Digital Counters: Falling Dominoes vs. Synchronized Dance
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-cream-muted font-mono">
                      Asynchronous (Ripple) vs. Synchronous &bull; Truncated MOD-N Counters
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-ink-500 dark:text-cream-muted">3 Hours</span>
              </div>

              {/* Falling Dominoes vs Synchronized Dance Squad Illustration */}
              <RippleVsSynchronousCounterIllustration />

              {/* Schematics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-5 rounded-2xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-mod2 space-y-2 shadow-xs">
                  <span className="font-mono font-bold text-mod2-dark dark:text-mod2 block text-xs uppercase">
                    1. Ripple Counter Circuit (MOD-6 Truncated)
                  </span>
                  <p className="leading-relaxed text-ink-700 dark:text-cream-muted text-xs">
                    Output of FF0 clocks FF1, FF1 clocks FF2. When count hits binary 6 (110), the NAND gate sends an active-LOW reset pulse to reset all flip-flops back to 000.
                  </p>
                  <div className="pt-2">
                    <Mod6RippleCounterSchematic />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-mod3 space-y-2 shadow-xs">
                  <span className="font-mono font-bold text-mod3-dark dark:text-mod3 block text-xs uppercase">
                    2. Synchronous Counter Circuit (MOD-8 Up-Counter)
                  </span>
                  <p className="leading-relaxed text-ink-700 dark:text-cream-muted text-xs">
                    Every flip-flop is clocked on the exact same beat. AND gates look ahead at previous outputs (FF2 toggles only when Q0=1 AND Q1=1).
                  </p>
                  <div className="pt-2">
                    <Mod8SyncCounterSchematic />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DETAILED CONTENT SECTIONS FOR MODULE 2 */}
      {/* ========================================================================= */}
      {currentModule.id === 2 && (
        <div className="space-y-8">
          {/* Conversational Welcome & Hero Dynamic */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border-2 border-mod2/30 card-vivid-mod2 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl select-none">👋</span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ink-900 dark:text-cream-paper">
                  Welcome to Digital Logic Families
                </h3>
                <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                  Here we dive under the hood of real silicon chips. Ever wonder why your laptop fans roar while your smartwatch battery lasts days? It all comes down to bipolar muscle versus CMOS complementary elegance.
                </p>
              </div>
            </div>
            <Module2HeroIllustration />
          </div>

          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod2 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-mod2 text-white font-mono font-bold flex items-center justify-center text-sm shadow-amber-sm">
                  2.1
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-cream-paper">
                    Digital Logic Families: TTL vs. CMOS
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-cream-muted font-mono">
                    Muscle Car vs. Electric Vehicle &bull; Noise Margins &bull; Totem-Pole &bull; Interfacing
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-ink-500 dark:text-cream-muted">6 Hours</span>
            </div>

            {/* Muscle Car Analogy */}
            <div className="rounded-2xl zone-mod2-wash border border-mod2/25 p-5 space-y-3">
              <span className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 flex items-center gap-2 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-mod2" />
                The Intuitive Comparison: Muscle Cars vs. Electric Vehicles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
                <div className="p-3.5 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1 shadow-xs">
                  <span className="font-bold text-mod2-dark dark:text-mod2">TTL (Transistor-Transistor Logic) = Muscle Car</span>
                  <p className="leading-relaxed text-ink-700 dark:text-cream-muted text-xs">
                    Built with Bipolar (BJT) transistors. Powerful and rugged, but burns electric current constantly even when parked (static power dissipation).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1 shadow-xs">
                  <span className="font-bold text-mod3-dark dark:text-mod3">CMOS (Complementary MOSFET) = Tesla Electric Car</span>
                  <p className="leading-relaxed text-ink-700 dark:text-cream-muted text-xs">
                    Built with PMOS and NMOS pairs. Consumes virtually ZERO current when not switching! That&apos;s why your smartphone battery lasts all day.
                  </p>
                </div>
              </div>

              {/* Illustrated Muscle Car vs Tesla EV */}
              <TtlVsCmosCarIllustration />
            </div>

            {/* Key Specs Demystified */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-ink-900 dark:text-cream-paper uppercase tracking-wider block">
                The 4 Crucial Specs Every Engineer Measures:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-brand space-y-1 shadow-xs">
                  <span className="text-brand-600 dark:text-brand-300 font-bold">1. Propagation Delay (t_pd)</span>
                  <p className="text-ink-600 dark:text-cream-muted font-sans text-[11px]">
                    The reflex speed. How many nanoseconds between flipping an input switch and the output responding.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-mod3 space-y-1 shadow-xs">
                  <span className="text-mod3-dark dark:text-mod3 font-bold">2. Noise Margin (NM)</span>
                  <p className="text-ink-600 dark:text-cream-muted font-sans text-[11px]">
                    Immunity to electrical noise! How much electrical hum on a wire can occur before 1 accidentally turns into 0.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-mod2 space-y-1 shadow-xs">
                  <span className="text-mod2-dark dark:text-mod2 font-bold">3. Fan-Out</span>
                  <p className="text-ink-600 dark:text-cream-muted font-sans text-[11px]">
                    Driving capacity. How many other chip inputs can a single gate output feed without overloading (TTL ~10, CMOS ~50+).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-mod4 space-y-1 shadow-xs">
                  <span className="text-mod4 font-bold">4. Speed-Power Product</span>
                  <p className="text-ink-600 dark:text-cream-muted font-sans text-[11px]">
                    Efficiency score: t_pd &times; P_d in picojoules (pJ). Lower is better!
                  </p>
                </div>
              </div>
            </div>

            {/* Totem-Pole Schematic and Description */}
            <div className="p-5 rounded-2xl zone-mod2-wash border border-mod2/25 space-y-3">
              <span className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 uppercase tracking-wider block">
                Inside the TTL Gate: The Famous Totem-Pole Output
              </span>
              <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                Why is it called &quot;Totem-Pole&quot;? Because two transistors (Q3 and Q4) are stacked directly on top of each other!
                <br />&bull; <strong>Q3 (Top transistor):</strong> Pulls output up to +5V (HIGH).
                <br />&bull; <strong>Q4 (Bottom transistor):</strong> Pulls output down to 0V (LOW).
                <br />&bull; <strong>Diode D:</strong> The traffic cop! Prevents both transistors from conducting simultaneously, which would create a direct short circuit from +5V to Ground and fry the IC.
              </p>
              <div className="pt-2">
                <TtlTotemPoleSchematic activeRegion="Standard 74xx Saturated Totem-Pole" />
              </div>
            </div>

            {/* Interfacing TTL to CMOS */}
            <div className="p-5 rounded-2xl zone-mod1-wash border border-mod1/25 space-y-3">
              <span className="text-xs font-mono font-bold text-mod1 uppercase tracking-wider block">
                The Voltage Gap Conflict: Connecting TTL to CMOS
              </span>
              <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                A standard TTL gate outputs at least <strong>2.4V</strong> for a logic HIGH. But a 5V CMOS chip requires at least <strong>3.5V</strong> to recognize a HIGH!
                <br />If you connect them directly, the voltage lands in &quot;No Man&apos;s Land&quot; (2.4V to 3.5V), turning both CMOS input transistors half-ON and causing overheating!
                <br /><strong className="text-mod3-dark dark:text-mod3">The 10-Cent Fix:</strong> Add a 2.2 k&Omega; to 4.7 k&Omega; pull-up resistor from the line to +5V. This pulls the signal up to almost 5V, satisfying CMOS perfectly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DETAILED CONTENT SECTIONS FOR MODULE 3 */}
      {/* ========================================================================= */}
      {currentModule.id === 3 && (
        <div className="space-y-8">
          {/* Conversational Welcome & Hero Dynamic */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border-2 border-mod3/30 card-vivid-mod3 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl select-none">👋</span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ink-900 dark:text-cream-paper">
                  Welcome to Finite State Machines &amp; PLDs
                </h3>
                <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                  Today you graduate from passive logic gates to designing autonomous digital brains. Whether it is a metro turnstile, an elevator dispatcher, or a vending machine, here is how machines remember where they are and decide what to do next.
                </p>
              </div>
            </div>
            <Module3HeroIllustration />
          </div>

          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod3 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-mod3 text-white font-mono font-bold flex items-center justify-center text-sm shadow-teal-sm">
                  3.1
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-cream-paper">
                    Finite State Machines (FSM) &amp; Programmable Logic
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-cream-muted font-mono">
                    Mealy vs. Moore &bull; Algorithmic State Machines (ASM) &bull; PLA / PAL / FPGA
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-ink-500 dark:text-cream-muted">8 Hours</span>
            </div>

            {/* Turnstile Analogy Box */}
            <div className="rounded-2xl zone-mod3-wash border border-mod3/25 p-5 space-y-3">
              <span className="text-xs font-mono font-bold text-mod3-dark dark:text-mod3 flex items-center gap-2 uppercase tracking-wider">
                <RotateCcw className="w-4 h-4 text-mod3" />
                Real-World Analogy: The Metro Turnstile
              </span>
              <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                What is an FSM? It&apos;s a machine that lives in one specific state, waits for an event, and transitions to another state!
                <br />&bull; <strong>State 1: Locked.</strong> If you push the bar, it stays locked. But if you tap your Metro Card (insert coin), it transitions to <strong>State 2: Unlocked</strong>.
                <br />&bull; <strong>State 2: Unlocked.</strong> Once you push through the turnstile, it immediately transitions back to <strong>State 1: Locked</strong>.
              </p>

              {/* Illustrated Subway Turnstile FSM */}
              <SubwayTurnstileFsmIllustration />
            </div>

            {/* Mealy vs Moore Simple Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-brand space-y-2 shadow-xs">
                <span className="font-bold text-brand-600 dark:text-brand-300 font-mono text-sm block">
                  Moore Machine (Calm &amp; Glitch-Free)
                </span>
                <p className="text-ink-700 dark:text-cream-muted leading-relaxed">
                  The outputs depend <strong>ONLY on the present state</strong>. It doesn&apos;t matter what inputs are twitching right now; the output won&apos;t change until the clock edge advances the state. Clean, stable, and immune to input glitches!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-mod3 space-y-2 shadow-xs">
                <span className="font-bold text-mod3-dark dark:text-mod3 font-mono text-sm block">
                  Mealy Machine (Fast &amp; Immediate)
                </span>
                <p className="text-ink-700 dark:text-cream-muted leading-relaxed">
                  The outputs depend on <strong>both present state AND current inputs</strong>. Can react immediately without waiting for a clock cycle, but input noise can leak directly to the output.
                </p>
              </div>
            </div>

            {/* Sequence Detector 1011 Schematic */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider block">
                Visual State Machine: Sequence Detector &apos;1011&apos; State Graph
              </span>
              <SequenceDetectorFsmDiagram />
            </div>

            {/* ASM Chart for Vending Machine */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 uppercase tracking-wider block">
                Algorithmic State Machine (ASM): Beverage Dispenser Flowchart
              </span>
              <VendingMachineAsmChart />
            </div>

            {/* PLA vs PAL vs FPGA in Plain English */}
            <div className="p-5 rounded-2xl zone-mod3-wash border border-mod3/25 space-y-3 text-xs">
              <span className="font-mono font-bold text-ink-900 dark:text-cream-paper uppercase tracking-wider block text-xs">
                Programmable Logic: The Cooking Analogy (PROM vs PLA vs PAL)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1 shadow-xs">
                  <span className="font-bold text-ink-900 dark:text-cream-paper">PROM</span>
                  <p className="text-ink-600 dark:text-cream-muted text-[11px] font-sans">
                    Fixed ingredients (AND array), you only choose how to blend them (Programmable OR).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1 shadow-xs">
                  <span className="font-bold text-mod2-dark dark:text-mod2">PLA</span>
                  <p className="text-ink-600 dark:text-cream-muted text-[11px] font-sans">
                    Choose custom ingredients (Programmable AND) AND custom blending (Programmable OR). Maximum flexibility!
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1 shadow-xs">
                  <span className="font-bold text-mod3-dark dark:text-mod3">PAL</span>
                  <p className="text-ink-600 dark:text-cream-muted text-[11px] font-sans">
                    Programmable ingredients (AND), but fixed serving bowls (Fixed OR). Faster, cheaper, industry favourite.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DETAILED CONTENT SECTIONS FOR MODULE 4 */}
      {/* ========================================================================= */}
      {currentModule.id === 4 && (
        <div className="space-y-8">
          {/* Conversational Welcome & Hero Dynamic */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border-2 border-mod4/30 card-vivid-mod4 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl select-none">👋</span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ink-900 dark:text-cream-paper">
                  Welcome to Verilog HDL &amp; Digital Testing
                </h3>
                <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                  Here is the big paradigm shift: in hardware, lines of code don&apos;t run sequentially like Python. Everything executes simultaneously in real parallel copper! Let&apos;s master concurrency and hunt down microscopic manufacturing faults.
                </p>
              </div>
            </div>
            <Module4HeroIllustration />
          </div>

          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod4 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-mod4 text-white font-mono font-bold flex items-center justify-center text-sm shadow-violet-sm">
                  4.1
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-cream-paper">
                    Verilog HDL Hardware Modeling &amp; Digital Testing
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-cream-muted font-mono">
                    Hardware Concurrency &bull; Blocking vs. Non-Blocking &bull; Stuck-At Faults
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-ink-500 dark:text-cream-muted">8 Hours</span>
            </div>

            {/* Software vs Hardware Analogy */}
            <div className="rounded-2xl zone-mod4-wash border border-mod4/25 p-5 space-y-3">
              <span className="text-xs font-mono font-bold text-mod4 flex items-center gap-2 uppercase tracking-wider">
                <Radio className="w-4 h-4 text-mod4" />
                The Golden Rule: Verilog is NOT Software!
              </span>
              <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                In C or Python, lines execute one by one (Line 1 runs, then Line 2). In Verilog hardware, <strong>everything runs in parallel at the same time</strong>! Electricity doesn&apos;t wait for line 1 to finish before flowing into wire 2.
              </p>

              {/* Illustrated Verilog Concurrency */}
              <VerilogWiresVsCodeIllustration />
            </div>

            {/* Blocking vs Non-Blocking Analogy */}
            <div className="p-5 rounded-2xl bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border card-vivid-mod2 space-y-3 shadow-xs">
              <span className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 uppercase tracking-wider block">
                The Great Mystery: Blocking (=) vs. Non-Blocking (&lt;=)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-cream-soft dark:bg-darklab-card border border-cream-border dark:border-darklab-border space-y-2">
                  <span className="font-bold text-mod2-dark dark:text-mod2 font-mono text-sm block">
                    Blocking (=) : Sequential Recipe
                  </span>
                  <p className="text-ink-700 dark:text-cream-muted leading-relaxed">
                    &quot;Chop onions, wait until finished, then put them in the pan.&quot; Each line blocks the next line until complete.
                    <br /><strong className="text-mod2-dark dark:text-mod2">Used for:</strong> Combinational logic only (e.g. Adders, MUX).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cream-soft dark:bg-darklab-card border border-cream-border dark:border-darklab-border space-y-2">
                  <span className="font-bold text-brand-600 dark:text-brand-300 font-mono text-sm block">
                    Non-Blocking (&lt;=) : Simultaneous Grab
                  </span>
                  <p className="text-ink-700 dark:text-cream-muted leading-relaxed">
                    &quot;At the whistle blow, all 4 chefs grab ingredients simultaneously.&quot; Everyone reads their inputs in parallel!
                    <br /><strong className="text-brand-600 dark:text-brand-300">Used for:</strong> Sequential clocked flip-flops. Eliminates race bugs!
                  </p>
                </div>
              </div>
            </div>

            {/* Single Stuck-At Faults */}
            <div className="p-5 rounded-2xl zone-mod4-wash border border-mod4/25 space-y-3">
              <span className="text-xs font-mono font-bold text-ink-900 dark:text-cream-paper uppercase tracking-wider block">
                VLSI Testing: Finding Broken Wires (Stuck-At Faults)
              </span>
              <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted leading-relaxed">
                When billions of nanometer transistors are manufactured, stray dust particles can permanently short a wire to Ground (<strong>Stuck-at-0</strong>) or to +5V (<strong>Stuck-at-1</strong>).
              </p>

              {/* Illustrated Path Sensitization Detective Method */}
              <StuckAtFaultDetectiveIllustration />
            </div>
          </div>
        </div>
      )}

      {/* 7. University Exam Practice Questions (When in Technical Mode) */}
      {learningMode === 'technical' && (
        <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-brand rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn transition-colors">
          <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
            <h3 className="text-lg font-bold text-ink-900 dark:text-cream-paper flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-500" />
              University Exam Problem Sets &amp; Model Solutions
            </h3>
            <span className="text-xs font-mono text-ink-500 dark:text-cream-muted">
              Module {currentModule.id} Past Papers
            </span>
          </div>

          <div className="space-y-4">
            {currentModule.sampleQuestions.map((sq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-mod2 text-white shadow-xs">
                    Question {idx + 1} ({sq.marks} Marks)
                  </span>
                  <span className="text-xs font-mono text-white bg-mod4 px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                    {sq.bloom}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-ink-900 dark:text-cream-paper leading-relaxed">
                  {sq.question}
                </p>

                <div className="p-4 rounded-xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs text-ink-700 dark:text-cream-muted leading-relaxed space-y-1 shadow-xs">
                  <span className="font-mono font-bold text-mod3-dark dark:text-mod3 block text-[11px] uppercase">
                    Step-by-Step Solution Strategy:
                  </span>
                  <p>{sq.solutionOutline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Doubly Linked List Prev / Next Module Stepping (DSA Module 1: 1.5) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-cream-border dark:border-darklab-border">
        {prevModule ? (
          <button
            onClick={() => {
              setActiveModuleId(prevModule.id);
              setActiveSubtopicId('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-darklab-card border-2 border-cream-border dark:border-darklab-border text-xs font-sans font-bold flex items-center gap-2 hover:border-brand-500 shadow-xs cursor-pointer text-ink-900 dark:text-cream-paper transition-all active:scale-95"
          >
            <span>&larr; Previous: Module {prevModule.id} ({prevModule.title})</span>
          </button>
        ) : (
          <div />
        )}

        {nextModule ? (
          <button
            onClick={() => {
              setActiveModuleId(nextModule.id);
              setActiveSubtopicId('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-darklab-card border-2 border-cream-border dark:border-darklab-border text-xs font-sans font-bold flex items-center gap-2 hover:border-brand-500 shadow-xs cursor-pointer text-ink-900 dark:text-cream-paper transition-all active:scale-95 ml-auto"
          >
            <span>Next: Module {nextModule.id} ({nextModule.title}) &rarr;</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

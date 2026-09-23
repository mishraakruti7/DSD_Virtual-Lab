import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  FlaskConical,
  Layers,
  Cpu,
  FileText,
  HelpCircle,
  Award,
  Bookmark,
  Activity,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { SITE_CONFIG } from '../data/site.config';
import { COURSE_OUTCOMES } from '../data/cos';
import { MainHubTab } from '../components/layout/Navbar';

/**
 * Scroll-linked animated circuit wire connecting Hero to Lab Stations
 */
const SignalJourneyWire: React.FC<{ targetRef: React.RefObject<HTMLElement | null> }> = ({ targetRef }) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef as React.RefObject<HTMLElement>,
    offset: ['start start', 'end start'],
  });

  const pulseX = useTransform(scrollYProgress, [0, 1], [80, 720]);
  const pulseY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 25, 50]);
  const wireOpacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.5, 1, 1, 0.7]);

  return (
    <motion.div
      style={{ opacity: shouldReduceMotion ? 1 : wireOpacity }}
      className="relative -my-3 flex justify-center items-center pointer-events-none h-14 overflow-hidden"
    >
      <svg viewBox="0 0 800 50" className="w-full max-w-4xl h-14 select-none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="signalWireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FF4D5E" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Base circuit copper trace */}
        <path
          d="M 80 0 C 180 35, 320 15, 400 25 C 480 35, 620 15, 720 50"
          fill="none"
          stroke="currentColor"
          className="text-cream-border dark:text-darklab-border"
          strokeWidth="3.5"
        />

        {/* Active signal flowing dash trace */}
        <path
          d="M 80 0 C 180 35, 320 15, 400 25 C 480 35, 620 15, 720 50"
          fill="none"
          stroke="url(#signalWireGradient)"
          strokeWidth="3.5"
          strokeDasharray="10 14"
          className={shouldReduceMotion ? '' : 'wire-flow-high'}
        />

        {/* Scroll-Linked Travelling Signal Pulse Dot */}
        {!shouldReduceMotion && (
          <motion.circle
            style={{ cx: pulseX, cy: pulseY }}
            r="6"
            fill="#10B981"
          />
        )}

        {/* Solder junction nodes */}
        <circle cx="80" cy="0" r="5" fill="#6366F1" />
        <circle cx="400" cy="25" r="4.5" fill="#10B981" />
        <circle cx="720" cy="50" r="5" fill="#FF4D5E" />
      </svg>
      <div className="absolute top-1/2 -translate-y-1/2 px-3.5 py-1 rounded-full bg-white dark:bg-darklab-base border border-cream-border dark:border-darklab-border shadow-xs text-[11px] font-mono text-ink-600 dark:text-cream-muted flex items-center gap-2 pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-semibold">Signal Path &bull; Follow circuit to lab stations &darr;</span>
      </div>
    </motion.div>
  );
};

const TRIVIA_FACTS = [
  'The Apollo Guidance Computer (1966) was built entirely from 2,800 dual 3-input NOR ICs.',
  'CMOS consumes virtually zero static current — your smartphone battery lasts because silicon rests when idle!',
  'A single 7400 Quad 2-Input NAND gate IC packs 16 bipolar transistors inside a single standard DIP-14 package.',
  "The Master-Slave JK flip-flop was invented to eliminate the 'race-around' hazard where clock pulses stay HIGH too long.",
  'In Verilog hardware design, code is not software: all blocks synthesize into real parallel copper traces that execute concurrently!',
  'A stuck-at-0 fault occurs when microscopic dust particles permanently short a silicon trace to Ground during fabrication.',
];

/**
 * Animated number counter triggered when scrolled into view
 */
const CountUpNumber: React.FC<{ end: number; prefix?: string; suffix?: string; duration?: number }> = ({
  end,
  prefix = '',
  suffix = '',
  duration = 1400,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quartic for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [started, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

/**
 * Rotating digital electronics trivia ticker
 */
const DidYouKnowTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TRIVIA_FACTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-400/30 dark:border-amber-500/20 text-xs flex items-center justify-between gap-3 text-ink-800 dark:text-cream-paper transition-all shadow-xs"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="p-1 rounded-lg bg-amber-500 text-white shrink-0 shadow-xs">
          <Lightbulb className="w-3.5 h-3.5 animate-pulse" />
        </span>
        <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-[10px] tracking-wider uppercase shrink-0">
          Did You Know?
        </span>
        <span className="text-ink-700 dark:text-cream-muted truncate font-sans text-xs">
          {TRIVIA_FACTS[index]}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-ink-500 dark:text-cream-muted">
        <span>
          {index + 1}/{TRIVIA_FACTS.length}
        </span>
        <button
          onClick={() => setIndex((prev) => (prev - 1 + TRIVIA_FACTS.length) % TRIVIA_FACTS.length)}
          className="p-1 rounded-md hover:bg-amber-500/20 transition-colors"
          title="Previous Fact"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % TRIVIA_FACTS.length)}
          className="p-1 rounded-md hover:bg-amber-500/20 transition-colors"
          title="Next Fact"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const HomePage: React.FC<{
  onSelectTab: (tab: MainHubTab, extraId?: string | number) => void;
}> = ({ onSelectTab }) => {
  const heroRef = useRef<HTMLElement>(null);

  const hubCards: {
    tab: MainHubTab;
    title: string;
    badge: string;
    badgeColor: string;
    cardBorder: string;
    iconBg: string;
    description: string;
    actionText: string;
    icon: React.ReactNode;
  }[] = [
    {
      tab: 'theory',
      title: 'Theory Modules (M1–M4)',
      badge: '30 Lecture Hours',
      badgeColor: 'badge-vivid-mod1',
      cardBorder: 'card-vivid-mod1 hover:shadow-coral',
      iconBg: 'bg-mod1 text-white shadow-coral-sm',
      description:
        'Sequential circuits, latches vs flip-flops, Master-Slave JK, race-around elimination, digital logic families (TTL, CMOS), FSM synthesis, ASM charts, and Verilog HDL.',
      actionText: 'Explore 4 Modules',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      tab: 'lab',
      title: '12 Lab Experiments',
      badge: 'Continuous Assessment',
      badgeColor: 'badge-vivid-mod3',
      cardBorder: 'card-vivid-mod3 hover:shadow-teal',
      iconBg: 'bg-mod3 text-white shadow-teal-sm',
      description:
        'Complete university laboratory manual with apparatus lists, step-by-step procedures, truth tables, circuit schematics, and oral viva voce questions.',
      actionText: 'View 12 Experiments',
      icon: <FlaskConical className="w-6 h-6" />,
    },
    {
      tab: 'breadboard',
      title: 'Virtual Breadboard Lab',
      badge: 'Interactive Hardware',
      badgeColor: 'badge-vivid-brand',
      cardBorder: 'card-vivid-brand hover:shadow-brand',
      iconBg: 'bg-gradient-to-tr from-brand-start via-brand-mid to-brand-end text-white shadow-brand-sm',
      description:
        'Solderless practice breadboard with natural catenary sagging wires, 74xx DIP-14 chips, multimeter logic probe, and real-time electrical conduction diagnostics.',
      actionText: 'Launch Breadboard',
      icon: <Layers className="w-6 h-6" />,
    },
    {
      tab: 'simulators',
      title: '7 Concept Simulators',
      badge: 'Physics & Logic Engines',
      badgeColor: 'badge-vivid-mod2',
      cardBorder: 'card-vivid-mod2 hover:shadow-amber',
      iconBg: 'bg-mod2 text-white shadow-amber-sm',
      description:
        'Clocked Flip-Flop Explorer, Ripple vs Synchronous Counter visualizer, 74194 Universal Shift Register, VTC & Noise Margins slider, FSM 1011 stepper, and Lab 11 Security Alarm.',
      actionText: 'Open Simulators',
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      tab: 'quiz',
      title: 'Quiz Hub (100+ Questions)',
      badge: '6 Assessment Modes',
      badgeColor: 'badge-vivid-mod1',
      cardBorder: 'card-vivid-mod1 hover:shadow-coral',
      iconBg: 'bg-mod1 text-white shadow-coral-sm',
      description:
        'Module-wise tests, CO quizzes, 30-Question timed mock semester exam, lab viva prep flashcards, and daily sprint challenges mapped to Bloom’s taxonomy.',
      actionText: 'Take a Quiz',
      icon: <HelpCircle className="w-6 h-6" />,
    },
    {
      tab: 'gallery',
      title: 'Circuit Schematics Gallery',
      badge: '30+ Interactive SVGs',
      badgeColor: 'badge-vivid-mod4',
      cardBorder: 'card-vivid-mod4 hover:shadow-violet',
      iconBg: 'bg-mod4 text-white shadow-violet-sm',
      description:
        'High-resolution vector schematics of TTL totem-pole transistors, CMOS complementary networks, Master-Slave stages, FSM state diagrams, and ASM charts.',
      actionText: 'Browse Gallery',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      tab: 'assessment',
      title: 'Assessment & Marks Calculator',
      badge: '150 Total Marks',
      badgeColor: 'badge-vivid-mod2',
      cardBorder: 'card-vivid-mod2 hover:shadow-amber',
      iconBg: 'bg-mod2 text-white shadow-amber-sm',
      description:
        'Dynamic grade calculator for Internal Assessment (IA 20M), End Semester Exam (ESE 80M), Term Work (TW 25M), and Practical/Oral Viva (25M).',
      actionText: 'Calculate Grade',
      icon: <Award className="w-6 h-6" />,
    },
    {
      tab: 'projects',
      title: 'Mini-Project Repository',
      badge: '8 Hardware Proposals',
      badgeColor: 'badge-vivid-mod3',
      cardBorder: 'card-vivid-mod3 hover:shadow-teal',
      iconBg: 'bg-mod3 text-white shadow-teal-sm',
      description:
        'Complete hardware project proposals: Traffic light controller, combination lock, vending machine, bidirectional people counter, 4-bit ALU, and frequency meter.',
      actionText: 'View Projects',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      tab: 'glossary',
      title: 'DSD Technical Glossary',
      badge: '80+ Definitions',
      badgeColor: 'badge-vivid-mod4',
      cardBorder: 'card-vivid-mod4 hover:shadow-violet',
      iconBg: 'bg-mod4 text-white shadow-violet-sm',
      description:
        'Alphabetical reference of digital system terms, equations, timing definitions (setup, hold, clock skew, race-around), and personal study bookmarking.',
      actionText: 'Open Glossary',
      icon: <Bookmark className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      {/* Rotating Trivia Ticker */}
      <DidYouKnowTicker />

      {/* Hero Banner with Multi-Color Blobs */}
      <section ref={heroRef} className="relative overflow-hidden rounded-3xl bg-white dark:bg-darklab-card border-2 border-indigo-100 dark:border-darklab-border p-8 sm:p-12 shadow-xl shadow-brand/5 dark:shadow-2xl transition-colors border-t-4 border-t-indigo-600">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-mod1/15 blur-3xl animate-blob-drift-1 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-mod3/15 blur-3xl animate-blob-drift-2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-mod4/15 blur-3xl animate-blob-drift-3 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
            <span className="badge-vivid-brand flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              {SITE_CONFIG.course.code}: {SITE_CONFIG.course.title}
            </span>
            <span className="text-ink-400 hidden sm:inline">&bull;</span>
            <span className="text-ink-700 dark:text-cream-muted font-bold hidden sm:inline">
              {SITE_CONFIG.institution.collegeName} ({SITE_CONFIG.institution.collegeAbbr})
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-ink-900 dark:text-cream-paper tracking-tight leading-[1.08]">
            The Digital System Design{' '}
            <span className="text-brand-gradient">
              Virtual Laboratory
            </span>
          </h1>

          <p className="font-sans text-ink-700 dark:text-cream-muted text-sm sm:text-base leading-relaxed font-medium">
            A comprehensive, gentle, and accessible educational platform tailored for undergraduate engineering students. Features full curriculum modules, hands-on practice breadboard wiring, interactive physics concept simulators, and a 100+ question vetted quiz bank.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 font-sans text-xs">
            <button
              onClick={() => onSelectTab('breadboard')}
              className="px-6 py-3.5 rounded-2xl btn-brand-gradient text-white font-bold flex items-center gap-2 shadow-brand transition-all active:scale-95"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Launch Virtual Breadboard</span>
            </button>
            <button
              onClick={() => onSelectTab('quiz')}
              className="px-6 py-3.5 rounded-2xl bg-mod1 hover:bg-[#E03345] text-white font-bold flex items-center gap-2 transition-all shadow-coral active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-white" />
              <span>Practice Quiz Hub (100+ Qs)</span>
            </button>
            <button
              onClick={() => onSelectTab('theory')}
              className="px-6 py-3.5 rounded-2xl bg-mod4 hover:bg-[#7442E8] text-white font-bold flex items-center gap-2 transition-all shadow-violet active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>Syllabus Modules (30h)</span>
            </button>
          </div>
        </div>

        {/* Quick Curriculum Stats Strip with Animated Count-Up Numbers */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-cream-border dark:border-darklab-border font-sans text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-darklab-card border-2 border-rose-200 dark:border-darklab-border card-vivid-mod1 space-y-1 shadow-xs">
            <span className="text-mod1 font-bold uppercase text-[10px] tracking-wider block">Curriculum</span>
            <div className="text-lg font-black font-display text-ink-900 dark:text-cream-paper">
              <CountUpNumber end={4} suffix=" Theory Modules" />
            </div>
            <div className="text-ink-600 dark:text-cream-muted text-xs font-mono">30 Total Lecture Hours</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-darklab-card border-2 border-emerald-200 dark:border-darklab-border card-vivid-mod3 space-y-1 shadow-xs">
            <span className="text-mod3 font-bold uppercase text-[10px] tracking-wider block">Practical Lab</span>
            <div className="text-lg font-black font-display text-ink-900 dark:text-cream-paper">
              <CountUpNumber end={12} suffix=" Experiments" />
            </div>
            <div className="text-ink-600 dark:text-cream-muted text-xs font-mono">TTL, Verilog &amp; FSM</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-darklab-card border-2 border-purple-200 dark:border-darklab-border card-vivid-mod4 space-y-1 shadow-xs">
            <span className="text-mod4 font-bold uppercase text-[10px] tracking-wider block">Question Bank</span>
            <div className="text-lg font-black font-display text-ink-900 dark:text-cream-paper">
              <CountUpNumber end={100} suffix="+ Vetted Qs" />
            </div>
            <div className="text-ink-600 dark:text-cream-muted text-xs font-mono">6 Assessment Modes</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-darklab-card border-2 border-amber-200 dark:border-darklab-border card-vivid-mod2 space-y-1 shadow-xs">
            <span className="text-mod2 font-bold uppercase text-[10px] tracking-wider block">Evaluation Scheme</span>
            <div className="text-lg font-black font-display text-ink-900 dark:text-cream-paper">
              <CountUpNumber end={150} suffix=" Total Marks" />
            </div>
            <div className="text-ink-600 dark:text-cream-muted text-xs font-mono">IA + ESE + TW + Oral Viva</div>
          </div>
        </div>
      </section>

      {/* Animated Signal Journey: Circuit Wire connecting Hero to Stations */}
      <SignalJourneyWire targetRef={heroRef} />

      {/* SECTION WASH 1: Workstations Zone (Soft Coral-Wash Background) */}
      <section className="section-wash-coral p-6 sm:p-8 rounded-3xl border-2 border-rose-200/70 dark:border-rose-950/40 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="badge-vivid-mod1 mb-1 inline-block">ENGINEERING LAB STATIONS</div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-cream-paper tracking-tight">
              Academic Hubs & Workstations
            </h2>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted mt-1 font-sans">
              Select an engineering station below to begin your study or virtual experiment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hubCards.map((card) => (
            <div
              key={card.tab}
              onClick={() => onSelectTab(card.tab)}
              className={`group p-6 rounded-3xl bg-white dark:bg-darklab-card border-2 border-cream-border dark:border-darklab-border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-lg hover:-translate-y-1 ${card.cardBorder}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl shadow-xs ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <span
                    className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-ink-900 dark:text-cream-paper group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-ink-600 dark:text-cream-muted leading-relaxed font-sans font-medium">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-cream-border dark:border-darklab-border flex items-center justify-between text-xs font-sans text-brand-600 dark:text-brand-400 font-bold group-hover:text-brand-700 dark:group-hover:text-brand-300">
                <span>{card.actionText}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION WASH 2: Course Outcomes Zone (Soft Teal-Wash Background) */}
      <section className="section-wash-teal p-6 sm:p-8 rounded-3xl border-2 border-emerald-200/80 dark:border-emerald-950/40 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 dark:border-emerald-900/40 pb-4">
          <div>
            <div className="badge-vivid-mod3 mb-1 inline-block">OUTCOME-BASED EDUCATION</div>
            <h3 className="font-display text-2xl font-extrabold text-ink-900 dark:text-cream-paper flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-mod3" />
              Course Outcomes Alignment (CO1 to CO6)
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-cream-muted mt-1 font-sans">
              Verified mapping with NBA / NAAC Outcome-Based Education (OBE) criteria.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('theory')}
            className="px-4 py-2 rounded-xl bg-mod3 text-white text-xs font-sans font-bold hover:bg-emerald-600 transition-all shadow-teal flex items-center gap-1.5"
          >
            <span>View Articulation Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSE_OUTCOMES.map((co) => (
            <div
              key={co.id}
              className="p-4 rounded-2xl bg-white dark:bg-darklab-card border-2 border-emerald-200/80 dark:border-darklab-border hover:border-emerald-400 space-y-2 text-xs transition-all shadow-xs"
            >
              <div className="flex items-center justify-between font-sans font-bold">
                <span className="text-white bg-mod3 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-teal-sm">{co.id}</span>
                <span className="text-white bg-mod4 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-violet-sm">{co.bloomLevel}</span>
              </div>
              <div className="font-display font-bold text-sm text-ink-900 dark:text-cream-paper">{co.title}</div>
              <p className="text-ink-600 dark:text-cream-muted text-xs line-clamp-2 leading-relaxed font-sans">
                {co.statement}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

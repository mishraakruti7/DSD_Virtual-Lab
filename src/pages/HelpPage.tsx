import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Layers,
  Cpu,
  BookOpen,
  Award,
  UserCheck,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient';
import { SupportMessageRecord } from '../types/database.types';
import { playConnectClick, playSuccessChime, playErrorClick } from '../utils/soundEffects';

interface HelpPageProps {
  onNavigateTab?: (tab: string, extraId?: string | number) => void;
}

interface FaqItem {
  id: string;
  category: 'getting_started' | 'breadboard' | 'simulators' | 'quizzes' | 'accounts';
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  // Getting Started
  {
    id: 'gs-1',
    category: 'getting_started',
    question: 'How do I complete a practical experiment in the Virtual DSD Lab?',
    answer:
      'Navigate to the "12 Labs" tab and select an experiment (e.g., Lab 1: Verification of Logic Gates). Read the theoretical background, study the IC pinout diagram, and either open the dedicated interactive circuit simulator or build it directly on the solderless breadboard. Once you verify the complete truth table, mark the lab as completed to record your continuous assessment credit.',
    tags: ['experiments', 'labs', 'syllabus', 'progress'],
  },
  {
    id: 'gs-2',
    category: 'getting_started',
    question: 'How is my lab and course progress tracked?',
    answer:
      'Your completed experiments, chapter quiz scores, saved breadboard circuits, and continuous assessment marks are stored under your student profile. If you are signed in, your progress synchronizes automatically across devices via Supabase cloud storage. Offline sessions are also saved to your local browser storage.',
    tags: ['tracking', 'marks', 'cloud', 'storage'],
  },
  {
    id: 'gs-3',
    category: 'getting_started',
    question: 'Is this portal aligned with the Mumbai University DSD syllabus?',
    answer:
      'Yes, the Virtual DSD Lab is custom-tailored for Mumbai University Course ECCOR2PC203 (Digital System Design, Semester 4, Electronics & Computer Science Department). All 12 practicals, pin numbers, IC datasheets, and assessment calculations match the 2024 revised MU syllabus.',
    tags: ['mumbai university', 'sakec', 'syllabus', 'eccor2pc203'],
  },

  // Breadboard
  {
    id: 'bb-1',
    category: 'breadboard',
    question: 'How do I place ICs and connect wires on the Virtual Breadboard?',
    answer:
      'In the "Breadboard Lab" sandbox, select a component from the component library panel (e.g., 7408 Quad AND gate, LED, or DIP Switch). Drag or click to place it on the breadboard over the central divider notch. To wire, click on any breadboard terminal hole or IC pin to begin a wire run, pick a wire insulation color, and click the target terminal to complete the connection.',
    tags: ['breadboard', 'wiring', 'chips', 'placement'],
  },
  {
    id: 'bb-2',
    category: 'breadboard',
    question: 'Why did my circuit trigger a warning or short-circuit alarm?',
    answer:
      'The breadboard simulator includes real-time engineering diagnostics that enforce real-world lab safety rules. You will see warning alerts if: (1) An IC has missing VCC (Pin 14) or GND (Pin 7) connections; (2) An input pin is left floating without a defined HIGH/LOW state; (3) An LED is connected without a 330Ω current-limiting resistor; or (4) A direct short circuit connects VCC to GND rails.',
    tags: ['diagnostics', 'short circuit', 'floating pin', 'safety'],
  },
  {
    id: 'bb-3',
    category: 'breadboard',
    question: 'Are there keyboard shortcuts for rapid circuit wiring?',
    answer:
      'Yes! Use Delete or Backspace to remove a selected wire or IC. Press Esc to cancel an active wire trace. Press Space to toggle the DC Power Supply (VCC/GND rails) on or off. Use Ctrl+Z (or Cmd+Z) to undo previous actions.',
    tags: ['shortcuts', 'hotkeys', 'undo'],
  },

  // Simulators
  {
    id: 'sim-1',
    category: 'simulators',
    question: 'What is the difference between the Breadboard Lab and dedicated Simulators?',
    answer:
      'The Breadboard Lab provides a physical-component sandbox mimicking real physical ICs, DIP switches, and terminal rows. The Simulators tab provides dedicated interactive mathematical engines for specific experiments (e.g., K-Map Solver with Quine-McCluskey, 4-Bit Adder/Subtractor with Two’s Complement flags, Mod-16 Asynchronous Ripple Counter with live timing diagrams).',
    tags: ['simulators', 'k-map', 'counters', 'difference'],
  },
  {
    id: 'sim-2',
    category: 'simulators',
    question: 'How does the Logic Analyzer Scope work?',
    answer:
      'The Logic Analyzer Scope is a virtual 4-channel digital oscilloscope. It monitors real-time digital logic transitions (Clock, Q0, Q1, Q2, Q3) and renders synchronous timing diagrams with customizable timebase scale, edge triggers, and cursor measurement tools.',
    tags: ['logic analyzer', 'oscilloscope', 'timing diagram'],
  },

  // Quizzes
  {
    id: 'qz-1',
    category: 'quizzes',
    question: 'How does Quiz scoring and Continuous Assessment work?',
    answer:
      'Each chapter quiz evaluates viva-voce questions and circuit analysis. Scores contribute toward the continuous internal assessment score (25 marks Term Work) calculated on the Assessment page. You can retake practice quizzes to reinforce weak concepts.',
    tags: ['quizzes', 'viva', 'scoring', 'term work'],
  },
  {
    id: 'qz-2',
    category: 'quizzes',
    question: 'Can I download a Course Completion Certificate?',
    answer:
      'Yes! Once you complete all 12 syllabus practical experiments and achieve an overall quiz average above 75%, a verified SAKEC Virtual DSD Lab Completion Certificate becomes available for download as a high-resolution PDF from your Progress Dashboard.',
    tags: ['certificate', 'download', 'progress'],
  },

  // Accounts
  {
    id: 'acc-1',
    category: 'accounts',
    question: 'What is the difference between Student and Faculty accounts?',
    answer:
      'Student accounts allow full access to all lab experiments, simulators, quiz submissions, and personal progress tracking. Faculty accounts grant educator privileges, including the Faculty Dashboard to view class-wide rosters, track student lab completion, inspect breadboard safety error logs, and export official Mumbai University Continuous Assessment reports.',
    tags: ['student', 'faculty', 'roles', 'permissions'],
  },
  {
    id: 'acc-2',
    category: 'accounts',
    question: 'How do I reset my password if I forget it?',
    answer:
      'Click the "Sign In" button in the top navbar, select "Forgot your password?", and enter your registered email address. You will receive a secure password recovery link to set a new password complying with our security policy (minimum 8 characters with at least one number).',
    tags: ['password', 'reset', 'auth', 'recovery'],
  },
];

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('gs-1');

  // Help Request Form State
  const [helpSubject, setHelpSubject] = useState<string>('');
  const [helpMessage, setHelpMessage] = useState<string>('');
  const [helpCategory, setHelpCategory] = useState<string>('lab_assistance');
  const [helpEmail, setHelpEmail] = useState<string>('');
  const [submittingHelp, setSubmittingHelp] = useState<boolean>(false);
  const [helpSuccess, setHelpSuccess] = useState<boolean>(false);
  const [helpError, setHelpError] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  React.useEffect(() => {
    if (user?.email && !helpEmail) {
      setHelpEmail(user.email);
    }
  }, [user, helpEmail]);

  const categories = [
    { id: 'all', label: 'All Topics', icon: Sparkles },
    { id: 'getting_started', label: 'Getting Started', icon: BookOpen },
    { id: 'breadboard', label: 'Virtual Breadboard', icon: Layers },
    { id: 'simulators', label: 'Circuit Simulators', icon: Cpu },
    { id: 'quizzes', label: 'Quizzes & Marks', icon: Award },
    { id: 'accounts', label: 'Accounts & Roles', icon: UserCheck },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    playConnectClick();
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpSubject.trim() || !helpMessage.trim()) {
      setHelpError('Please enter both a subject and a clear message.');
      playErrorClick();
      return;
    }
    if (!consentChecked) {
      setHelpError('Please consent to message processing to submit.');
      playErrorClick();
      return;
    }

    setSubmittingHelp(true);
    setHelpError(null);
    playConnectClick();

    const payload = {
      user_id: user?.id || null,
      type: 'help_request' as const,
      category: `help:${helpCategory}`,
      subject: helpSubject.trim(),
      message: helpMessage.trim(),
      contact_email: helpEmail.trim() || user?.email || null,
      status: 'new' as const,
    };

    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase.from('support_messages').insert(payload);
        if (error) throw error;
      } else {
        const existingRaw = localStorage.getItem('dsd_support_messages');
        const existing: SupportMessageRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
        const newRecord: SupportMessageRecord = {
          id: `help-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...payload,
        };
        existing.unshift(newRecord);
        localStorage.setItem('dsd_support_messages', JSON.stringify(existing));
      }

      setHelpSuccess(true);
      playSuccessChime();
      setHelpSubject('');
      setHelpMessage('');
    } catch (err: any) {
      console.error('Help request failed:', err);
      setHelpError(err.message || 'Failed to submit help ticket. Please try again.');
      playErrorClick();
    } finally {
      setSubmittingHelp(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 text-white shadow-xl overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30">
              Knowledge Base & Support Desk
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-sky-400" />
            <span>Frequently Asked Questions & Help</span>
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
            Quick guides, troubleshooting tips for breadboard wiring and IC diagnostics, scoring rules, and student support.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-sky-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs (e.g. breadboard, short circuit, ripple counter, password)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-sky-200/60 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sky-200 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                playConnectClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300 dark:ring-sky-700'
                  : 'bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted hover:border-sky-300 hover:text-ink-900 dark:hover:text-cream-paper'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-cream-border dark:border-darklab-border">
          <h2 className="font-display font-extrabold text-base text-ink-900 dark:text-cream-paper">
            Questions & Answers ({filteredFaqs.length})
          </h2>
          <span className="text-[11px] text-ink-500 font-mono">
            Click question to expand
          </span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs font-bold text-ink-600 dark:text-cream-muted">
              No matching questions found for "{searchQuery}".
            </p>
            <p className="text-xs text-ink-400">
              Try adjusting your search terms or submit a direct help inquiry below.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-sky-300 dark:border-sky-700 bg-sky-50/30 dark:bg-sky-950/20'
                      : 'border-cream-border dark:border-darklab-border bg-cream-soft/40 dark:bg-darklab-base/40 hover:border-sky-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        {faq.category.replace('_', ' ')}
                      </span>
                      <h3 className="font-bold text-sm text-ink-900 dark:text-cream-paper leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`p-1.5 rounded-xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-ink-600 dark:text-cream-muted shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180 text-sky-600' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-ink-700 dark:text-cream-muted leading-relaxed border-t border-sky-100 dark:border-sky-900/30 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* "Still Need Help?" Support Ticket Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-border dark:border-darklab-border">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-mid" />
              <span>Still Need Help? Open a Lab Support Ticket</span>
            </h2>
            <p className="text-xs text-ink-500 dark:text-cream-muted">
              Our SAKEC DSD faculty and lab assistants usually respond within 24–48 hours.
            </p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('contact')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Faculty Directory</span>
            </button>
          )}
        </div>

        {helpSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-ink-900 dark:text-cream-paper">
              Help Request Submitted!
            </h3>
            <p className="text-xs text-ink-600 dark:text-cream-muted max-w-md mx-auto">
              Your ticket has been logged in the faculty queue. Responses will appear under "My Submissions" in the Feedback tab and via your email.
            </p>
            <button
              onClick={() => setHelpSuccess(false)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleHelpSubmit} className="space-y-4">
            {helpError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{helpError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                  Category
                </label>
                <select
                  value={helpCategory}
                  onChange={(e) => setHelpCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-bold text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                >
                  <option value="lab_assistance">Lab Practical Assistance</option>
                  <option value="breadboard_bug">Breadboard Wiring Help</option>
                  <option value="quiz_issue">Quiz / Grade Discrepancy</option>
                  <option value="account_access">Account / Access Problem</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                  Your College Email
                </label>
                <input
                  type="email"
                  required
                  value={helpEmail}
                  onChange={(e) => setHelpEmail(e.target.value)}
                  placeholder="student@sakec.ac.in"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                Subject
              </label>
              <input
                type="text"
                required
                value={helpSubject}
                onChange={(e) => setHelpSubject(e.target.value)}
                placeholder="e.g. Trouble connecting Master-Slave JK Flip Flop in Lab 8"
                className="w-full px-3.5 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                Message & Questions
              </label>
              <textarea
                required
                rows={3}
                value={helpMessage}
                onChange={(e) => setHelpMessage(e.target.value)}
                placeholder="Please describe what you are trying to accomplish and where you got stuck..."
                className="w-full px-3.5 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid resize-none"
              />
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-[11px] text-slate-500 dark:text-stone-400">
                We use your message only to reply and improve the course portal.
              </p>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700"
                />
                <span className="text-xs text-slate-700 dark:text-stone-300">
                  I consent to the processing of this help ticket in accordance with the{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-700 dark:text-cyan-400 font-bold underline">
                    Privacy Notice
                  </a>.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-ink-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>Estimated reply: 24–48 hours</span>
              </div>

              <button
                type="submit"
                disabled={submittingHelp || !consentChecked}
                className="px-5 py-2.5 rounded-xl btn-brand-gradient text-white font-bold text-xs shadow-md shadow-brand/25 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {submittingHelp ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

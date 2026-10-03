import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquarePlus,
  Star,
  Bug,
  Lightbulb,
  FileQuestion,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  Check,
  ChevronRight,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient';
import { SupportMessageRecord, SupportMessageType, SupportMessageStatus } from '../types/database.types';
import { playConnectClick, playSuccessChime, playErrorClick } from '../utils/soundEffects';

interface FeedbackPageProps {
  onNavigateTab?: (tab: string, extraId?: string | number) => void;
}

const PUBLIC_CHANGELOG = [
  {
    id: 'ch-1',
    title: 'Breadboard Wire Snapping Fixed',
    date: '2026-09-24',
    category: 'Breadboard Lab',
    type: 'bug_report',
    description: 'Resolved pin-to-pin wiring snapping issues on IC terminals 7 and 14.',
    resolvedIn: 'v2.4.1',
  },
  {
    id: 'ch-2',
    title: 'Mod-16 Ripple Counter Propagation Delay Modeled',
    date: '2026-09-22',
    category: 'Simulators',
    type: 'feature_request',
    description: 'Added realistic 12ns gate delay visualization in Lab 7 interactive timing scope.',
    resolvedIn: 'v2.4.0',
  },
  {
    id: 'ch-3',
    title: 'Internal Assessment Calculator Formulas Aligned with MU Scheme',
    date: '2026-09-20',
    category: 'Assessment',
    type: 'content_error',
    description: 'Updated Term Work weightage (25 marks) to match Mumbai University 2024 revised syllabus.',
    resolvedIn: 'v2.3.9',
  },
];

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onNavigateTab }) => {
  const { user, profile } = useAuth();
  const [activeView, setActiveView] = useState<'form' | 'my_submissions' | 'changelog'>('form');

  // Form State
  const [feedbackType, setFeedbackType] = useState<'bug_report' | 'feature_request' | 'content_error' | 'general'>('general');
  const [category, setCategory] = useState<string>('breadboard');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  // Submissions list
  const [mySubmissions, setMySubmissions] = useState<SupportMessageRecord[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false);

  useEffect(() => {
    if (user?.email && !contactEmail) {
      setContactEmail(user.email);
    }
  }, [user, contactEmail]);

  // Load user submissions if logged in
  const loadMySubmissions = async () => {
    if (!user) return;
    setLoadingSubmissions(true);
    try {
      if (SUPABASE_CONFIGURED) {
        const { data, error } = await supabase
          .from('support_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setMySubmissions(data as SupportMessageRecord[]);
          return;
        }
      }

      // Local fallback
      const saved = localStorage.getItem('dsd_support_messages');
      if (saved) {
        const parsed: SupportMessageRecord[] = JSON.parse(saved);
        setMySubmissions(parsed.filter((m) => m.user_id === user.id));
      }
    } catch (err) {
      console.error('Failed to load user submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (activeView === 'my_submissions' && user) {
      loadMySubmissions();
    }
  }, [activeView, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setErrorMessage('Please provide both a subject and a detailed description.');
      playErrorClick();
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please consent to the processing of this feedback ticket.');
      playErrorClick();
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    playConnectClick();

    const dbType: SupportMessageType = feedbackType === 'bug_report' ? 'bug_report' : 'feedback';
    const payload = {
      user_id: user?.id || null,
      type: dbType,
      category: `${feedbackType}:${category}`,
      subject: subject.trim(),
      message: description.trim(),
      rating,
      contact_email: contactEmail.trim() || user?.email || null,
      status: 'new' as SupportMessageStatus,
    };

    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase.from('support_messages').insert(payload);
        if (error) throw error;
      } else {
        // Local persistence fallback
        const existingRaw = localStorage.getItem('dsd_support_messages');
        const existing: SupportMessageRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
        const newRecord: SupportMessageRecord = {
          id: `msg-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...payload,
        };
        existing.unshift(newRecord);
        localStorage.setItem('dsd_support_messages', JSON.stringify(existing));
      }

      setSubmitSuccess(true);
      playSuccessChime();
      setSubject('');
      setDescription('');
    } catch (err: any) {
      console.error('Feedback submission failed:', err);
      setErrorMessage(err.message || 'Failed to submit feedback. Please try again.');
      playErrorClick();
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: SupportMessageStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
            <Check className="w-3 h-3" /> Resolved
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Review
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> New
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.25),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                Community Feedback & Issue Tracker
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-3">
              <MessageSquarePlus className="w-8 h-8 text-brand-mid" />
              <span>Feedback & Suggestions</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl leading-relaxed">
              Help us improve the Virtual DSD Lab. Report simulator glitches, suggest new ICs, or let us know how your lab session went.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => {
                setActiveView('form');
                setSubmitSuccess(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'form'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Submit Feedback
            </button>
            {user && (
              <button
                onClick={() => setActiveView('my_submissions')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'my_submissions'
                    ? 'bg-white text-indigo-900 shadow-md'
                    : 'text-indigo-200 hover:text-white hover:bg-white/5'
                }`}
              >
                My Submissions
              </button>
            )}
            <button
              onClick={() => setActiveView('changelog')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'changelog'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Recent Fixes
            </button>
          </div>
        </div>
      </div>

      {/* Main View Content */}
      <AnimatePresence mode="wait">
        {activeView === 'form' && (
          <motion.div
            key="feedback-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form Column */}
            <div className="lg:col-span-2">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-sm space-y-6">
                {submitSuccess ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-scaleUp">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-extrabold text-xl text-ink-900 dark:text-cream-paper">
                        Feedback Submitted Successfully!
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-600 dark:text-cream-muted max-w-md mx-auto">
                        Thank you for contributing. Our faculty and lab administration team review all student feedback to enhance the coursework.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setSubmitSuccess(false);
                          setSubject('');
                          setDescription('');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                      >
                        Submit Another Feedback
                      </button>
                      {user && (
                        <button
                          onClick={() => setActiveView('my_submissions')}
                          className="px-4 py-2 rounded-xl bg-white dark:bg-darklab-base border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-50 transition-colors"
                        >
                          View My Submissions
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Step 1: Type Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                        1. What kind of feedback are you sharing?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'bug_report', label: 'Bug Report', icon: Bug, color: 'hover:border-rose-400' },
                          { id: 'feature_request', label: 'Feature Request', icon: Lightbulb, color: 'hover:border-amber-400' },
                          { id: 'content_error', label: 'Content Error', icon: FileQuestion, color: 'hover:border-sky-400' },
                          { id: 'general', label: 'General / UX', icon: MessageSquarePlus, color: 'hover:border-purple-400' },
                        ].map((t) => {
                          const isSelected = feedbackType === t.id;
                          const Icon = t.icon;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => {
                                setFeedbackType(t.id as any);
                                playConnectClick();
                              }}
                              className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-2 ${
                                isSelected
                                  ? 'border-brand-mid bg-indigo-50/80 dark:bg-indigo-950/40 text-brand-mid ring-2 ring-brand-mid/20'
                                  : `border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-muted ${t.color}`
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-mid' : 'text-ink-500 dark:text-cream-muted'}`} />
                              <span className="text-xs font-bold">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Lab Module & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                          2. Lab Section / Module
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-bold text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                        >
                          <option value="breadboard">Breadboard Lab Sandbox</option>
                          <option value="lab_manual">12 Syllabus Practicals</option>
                          <option value="simulators">Logic & Sequential Simulators</option>
                          <option value="theory">Theory Modules & Syllabus</option>
                          <option value="quiz">Quiz Hub & Assessment</option>
                          <option value="general">Account, Navbar & UI</option>
                        </select>
                      </div>

                      {/* Star Rating */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                          Overall Experience Rating
                        </label>
                        <div className="flex items-center gap-1.5 pt-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              onClick={() => {
                                setRating(star);
                                playConnectClick();
                              }}
                              className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  (hoverRating !== null ? hoverRating >= star : rating >= star)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-ink-500 dark:text-cream-muted ml-2">
                            {rating} / 5 Stars
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Subject & Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. IC 7476 Pin 5 Q output inverted in Lab 8 simulation"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-mid"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                        Detailed Description
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the steps to reproduce the issue, or provide suggestions for improvement..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-mid resize-none"
                      />
                    </div>

                    {/* Contact Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                        Contact Email (Optional for updates)
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="student@sakec.ac.in"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-mid"
                      />
                      <p className="text-[11px] text-ink-400 dark:text-cream-muted">
                        We will only use this email to follow up on your specific feedback ticket.
                      </p>
                    </div>

                    {/* Statutory Form Consent */}
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
                          I consent to the processing of this feedback in accordance with the{' '}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-700 dark:text-cyan-400 font-bold underline">
                            Privacy Notice
                          </a>.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting || !consentChecked}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl btn-brand-gradient text-white font-bold text-xs sm:text-sm shadow-md shadow-brand/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {submitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Feedback Ticket</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Guide */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">How We Use Feedback</h3>
                </div>
                <p className="text-xs text-ink-600 dark:text-cream-muted leading-relaxed">
                  Student bug reports directly guide our lab simulator updates. Each semester, SAKEC DSD faculty review simulation discrepancies and update the course portal accordingly.
                </p>
                <div className="space-y-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/40 text-xs">
                  <div className="flex items-center gap-2 text-ink-700 dark:text-cream-paper font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Average review within 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-700 dark:text-cream-paper font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Direct responses in your account</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-700 dark:text-cream-paper font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Published to our public changelog</span>
                  </div>
                </div>
              </div>

              {/* Quick Link to Help / FAQ */}
              <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-ink-900 dark:text-cream-paper uppercase tracking-wider">
                  Looking for Immediate Help?
                </h4>
                <p className="text-xs text-ink-500 dark:text-cream-muted leading-relaxed">
                  Check our interactive FAQ for instant solutions to breadboard wiring, IC pinouts, and truth table calculations.
                </p>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('help')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-mid hover:underline"
                  >
                    <span>Visit Help & FAQ Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* My Submissions Tab */}
        {activeView === 'my_submissions' && (
          <motion.div
            key="my-submissions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper">
                  My Feedback & Support History
                </h2>
                <p className="text-xs text-ink-500 dark:text-cream-muted">
                  Track status updates and faculty replies to your submitted tickets.
                </p>
              </div>
              <button
                onClick={loadMySubmissions}
                className="px-3 py-1.5 rounded-xl border border-cream-border dark:border-darklab-border text-xs font-bold text-ink-700 dark:text-cream-muted hover:bg-cream-soft dark:hover:bg-darklab-base"
              >
                Refresh
              </button>
            </div>

            {loadingSubmissions ? (
              <div className="py-12 text-center text-xs text-ink-400">Loading your submissions...</div>
            ) : mySubmissions.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-ink-700 dark:text-cream-muted">
                  No feedback tickets submitted yet.
                </p>
                <button
                  onClick={() => setActiveView('form')}
                  className="px-4 py-2 rounded-xl btn-brand-gradient text-white text-xs font-bold shadow-xs"
                >
                  Submit Your First Feedback
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {mySubmissions.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-base/60 border border-cream-border dark:border-darklab-border space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-ink-600 dark:text-cream-muted">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-sm text-ink-900 dark:text-cream-paper">
                          {item.subject}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] text-ink-400 font-mono">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    <p className="text-xs text-ink-700 dark:text-cream-muted leading-relaxed">
                      {item.message}
                    </p>

                    {item.admin_reply && (
                      <div className="mt-3 p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Faculty / Admin Response:</span>
                        </div>
                        <p className="text-xs text-ink-800 dark:text-cream-paper leading-relaxed pl-5">
                          {item.admin_reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Public Changelog Tab */}
        {activeView === 'changelog' && (
          <motion.div
            key="changelog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-sm space-y-6"
          >
            <div>
              <h2 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper">
                Recent Fixes & Student Requested Updates
              </h2>
              <p className="text-xs text-ink-500 dark:text-cream-muted">
                Transparent log of resolved bugs, simulator refinements, and syllabus updates made from community feedback.
              </p>
            </div>

            <div className="space-y-4">
              {PUBLIC_CHANGELOG.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-base/60 border border-cream-border dark:border-darklab-border space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {item.resolvedIn}
                      </span>
                      <h3 className="font-bold text-sm text-ink-900 dark:text-cream-paper">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-ink-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-ink-700 dark:text-cream-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

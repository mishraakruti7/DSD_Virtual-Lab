import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  GraduationCap,
  Building,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient';
import { SupportMessageRecord } from '../types/database.types';
import { playConnectClick, playSuccessChime, playErrorClick } from '../utils/soundEffects';

interface ContactUsPageProps {
  onNavigateTab?: (tab: string, extraId?: string | number) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<string>('academic_query');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  React.useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      playErrorClick();
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please consent to the processing of your message to submit.');
      playErrorClick();
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    playConnectClick();

    const payload = {
      user_id: user?.id || null,
      type: 'contact' as const,
      category: `contact:${category}`,
      subject: `[${category.toUpperCase()}] ${subject.trim()}`,
      message: `From: ${name.trim()} (${email.trim()})\n\n${message.trim()}`,
      contact_email: email.trim(),
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
          id: `contact-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...payload,
        };
        existing.unshift(newRecord);
        localStorage.setItem('dsd_support_messages', JSON.stringify(existing));
      }

      setSubmitSuccess(true);
      playSuccessChime();
      setName('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact inquiry failed:', err);
      setErrorMessage(err.message || 'Failed to send inquiry. Please try again.');
      playErrorClick();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white shadow-xl overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Department of Electronics & Computer Science
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            <span>Contact Course Faculty & Lab Administration</span>
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
            Get in touch with course instructors, lab technical staff, or department administrators regarding Course ECCOR2PC203 (Digital System Design).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form (Left 2 cols) */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-sm space-y-6">
            <div>
              <h2 className="font-display font-extrabold text-xl text-ink-900 dark:text-cream-paper">
                Send an Official Course Inquiry
              </h2>
              <p className="text-xs text-ink-500 dark:text-cream-muted mt-1">
                Submissions are sent directly to the SAKEC DSD faculty desk.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="font-bold text-base text-ink-900 dark:text-cream-paper">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-xs text-ink-600 dark:text-cream-muted max-w-md mx-auto">
                  Your message has been forwarded to the course faculty. We will reach back to you via your email address.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                      College Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya.sharma@sakec.ac.in"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-bold text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                    >
                      <option value="academic_query">Academic & Syllabus Query</option>
                      <option value="continuous_assessment">Continuous Assessment / Marks</option>
                      <option value="technical_issue">Technical / Simulator Issue</option>
                      <option value="collaboration">Project Mentorship / Collaboration</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Continuous assessment marks calculation query"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message or inquiry here..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-xs font-medium text-ink-800 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid resize-none"
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
                      I consent to the processing of this message in accordance with the{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-700 dark:text-cyan-400 font-bold underline">
                        Privacy Notice
                      </a>.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !consentChecked}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl btn-brand-gradient text-white font-bold text-xs sm:text-sm shadow-md shadow-brand/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Official Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Info Column (Academic institution & faculty details) */}
        <div className="space-y-6">
          {/* Institutional Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Building className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-wider">Institution Details</h3>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm text-ink-900 dark:text-cream-paper">
                Shah & Anchor Kutchhi Engineering College (SAKEC)
              </h4>
              <p className="text-ink-600 dark:text-cream-muted leading-relaxed">
                Affiliated to University of Mumbai & Approved by AICTE, New Delhi.
              </p>
              <div className="pt-2 border-t border-cream-border dark:border-darklab-border space-y-1.5 text-ink-700 dark:text-cream-muted">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Mahavir Education Trust Chowk, W. T. Patil Marg, Chembur, Mumbai 400088, Maharashtra, India
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Course Code: ECCOR2PC203 (DSD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Academic Year 2026–2027 • Sem IV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty in Charge Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-brand-mid">
              <GraduationCap className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-wider">Faculty in Charge</h3>
            </div>

            <div className="space-y-3 text-xs">
              {/* Instructor 1 */}
              <div className="p-3 rounded-2xl bg-cream-soft/60 dark:bg-darklab-base/60 border border-cream-border dark:border-darklab-border space-y-1">
                <span className="font-bold text-ink-900 dark:text-cream-paper block">
                  Prof. Rajesh Verma
                </span>
                <span className="text-[11px] text-ink-500 dark:text-cream-muted block">
                  Course Coordinator & Assistant Professor
                </span>
                <div className="pt-1 flex flex-col gap-0.5 text-[11px] text-ink-600 dark:text-cream-muted">
                  <span>Cabin: 402, 4th Floor Main Building</span>
                  <span>Email: rajesh.verma@sakec.ac.in</span>
                </div>
              </div>

              {/* Instructor 2 */}
              <div className="p-3 rounded-2xl bg-cream-soft/60 dark:bg-darklab-base/60 border border-cream-border dark:border-darklab-border space-y-1">
                <span className="font-bold text-ink-900 dark:text-cream-paper block">
                  Dr. Nilakshi Jain
                </span>
                <span className="text-[11px] text-ink-500 dark:text-cream-muted block">
                  Head of Department (ECS)
                </span>
                <div className="pt-1 flex flex-col gap-0.5 text-[11px] text-ink-600 dark:text-cream-muted">
                  <span>HOD Office: 4th Floor Administrative Wing</span>
                  <span>Email: nilakshi.jain@sakec.ac.in</span>
                </div>
              </div>

              {/* Lab Hours */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Physical Hardware Lab Location</span>
                </div>
                <p>Digital Hardware Laboratory (Room 408)</p>
                <p>Mon – Fri: 9:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

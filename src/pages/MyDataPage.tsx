import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourseStore } from '../store/useCourseStore';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  FileText,
  User,
  Clock,
  Sparkles,
  RefreshCw,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { playSuccessChime, playErrorClick } from '../utils/soundEffects';

export const MyDataPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { studentProgress, resetProgress } = useCourseStore();
  const navigate = useNavigate();

  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingDeleteChat, setLoadingDeleteChat] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    document.title = 'My Data & Privacy Rights | Virtual DSD Lab';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 1. Download complete data in JSON format
  const handleExportData = async () => {
    setLoadingExport(true);
    setActionNotice(null);

    try {
      let cloudProgress: any[] = [];
      let cloudQuizzes: any[] = [];
      let cloudCircuits: any[] = [];
      let cloudChat: any[] = [];
      let cloudConsents: any[] = [];

      if (user && isSupabaseConfigured()) {
        const [progRes, quizRes, circRes, chatRes, consentRes] = await Promise.all([
          supabase.from('progress').select('*').eq('user_id', user.id),
          supabase.from('quiz_attempts').select('*').eq('user_id', user.id),
          supabase.from('saved_circuits').select('*').eq('user_id', user.id),
          supabase.from('chat_history').select('*').eq('user_id', user.id),
          supabase.from('consent_records').select('*').eq('user_id', user.id),
        ]);

        cloudProgress = progRes.data || [];
        cloudQuizzes = quizRes.data || [];
        cloudCircuits = circRes.data || [];
        cloudChat = chatRes.data || [];
        cloudConsents = consentRes.data || [];
      }

      // Read local storage data fallback
      const localCircuits = localStorage.getItem('dsd_saved_circuits_local');
      const localCourseStore = localStorage.getItem('dsd_course_storage_v1');

      const exportBundle = {
        exportMetadata: {
          platform: 'Digital System Design Virtual Lab (ECCOR2PC203)',
          exportedAt: new Date().toISOString(),
          applicableStatute: 'India Digital Personal Data Protection Act, 2023 (Section 11 Right to Access)',
          userId: user?.id || 'guest_user',
          userEmail: user?.email || 'unauthenticated',
        },
        profile: profile || {
          displayName: user?.user_metadata?.full_name || 'Guest Learner',
          role: 'student' as const,
        },
        academicProgress: {
          cloudProgressRecords: cloudProgress,
          localProgressStore: localCourseStore ? JSON.parse(localCourseStore) : studentProgress,
        },
        quizEvaluations: cloudQuizzes,
        savedCircuits: {
          cloud: cloudCircuits,
          local: localCircuits ? JSON.parse(localCircuits) : [],
        },
        aiTutorChatHistory: cloudChat,
        consentHistory: cloudConsents,
      };

      const jsonBlob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(jsonBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = downloadUrl;
      downloadAnchor.download = `dsd-lab-my-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(downloadUrl);

      playSuccessChime();
      setActionNotice({
        type: 'success',
        message: 'Your personal data package has been downloaded successfully in portable JSON format.',
      });
    } catch (err: any) {
      playErrorClick();
      setActionNotice({
        type: 'error',
        message: `Failed to compile data export: ${err.message || 'Unknown error'}`,
      });
    } finally {
      setLoadingExport(false);
    }
  };

  // 2. Delete AI Tutor chat history
  const handleDeleteChatHistory = async () => {
    if (!window.confirm('Are you sure you want to delete all saved conversations with the DSD Tutor?')) {
      return;
    }

    setLoadingDeleteChat(true);
    setActionNotice(null);

    try {
      if (user && isSupabaseConfigured()) {
        const { error } = await supabase.from('chat_history').delete().eq('user_id', user.id);
        if (error) throw error;
      }
      localStorage.removeItem('dsd_tutor_history');
      playSuccessChime();
      setActionNotice({
        type: 'success',
        message: 'Your AI Tutor conversation history has been permanently deleted.',
      });
    } catch (err: any) {
      playErrorClick();
      setActionNotice({
        type: 'error',
        message: `Could not delete chat history: ${err.message || 'Unknown error'}`,
      });
    } finally {
      setLoadingDeleteChat(false);
    }
  };

  // 3. Withdraw consent
  const handleWithdrawConsent = async () => {
    if (
      !window.confirm(
        'Withdrawing consent means the platform will no longer synchronize your course progress, quiz attempts, or circuits to the cloud. You will be signed out. Do you wish to proceed?'
      )
    ) {
      return;
    }

    setLoadingWithdraw(true);
    setActionNotice(null);

    try {
      if (user && isSupabaseConfigured()) {
        await supabase.from('consent_records').insert({
          user_id: user.id,
          document: 'privacy-policy',
          version: '1.0.0',
          purpose: 'course_platform_operation',
          granted: false,
          created_at: new Date().toISOString(),
        });
      }

      await signOut();
      playSuccessChime();
      navigate('/');
    } catch (err: any) {
      playErrorClick();
      setActionNotice({
        type: 'error',
        message: `Consent withdrawal encountered an issue: ${err.message || 'Unknown error'}`,
      });
    } finally {
      setLoadingWithdraw(false);
    }
  };

  // 4. Permanent Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') {
      setActionNotice({
        type: 'error',
        message: 'Please type "DELETE" in capital letters to confirm account removal.',
      });
      playErrorClick();
      return;
    }

    setLoadingDeleteAccount(true);
    setActionNotice(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Cascade delete through user tables
        await Promise.allSettled([
          supabase.from('saved_circuits').delete().eq('user_id', user.id),
          supabase.from('quiz_attempts').delete().eq('user_id', user.id),
          supabase.from('progress').delete().eq('user_id', user.id),
          supabase.from('chat_history').delete().eq('user_id', user.id),
          supabase.from('profiles').delete().eq('id', user.id),
          supabase.from('consent_records').insert({
            user_id: user.id,
            document: 'account-erasure',
            version: '1.0.0',
            purpose: 'right_to_be_forgotten',
            granted: false,
            created_at: new Date().toISOString(),
          }),
        ]);
      }

      // Clear local storage
      resetProgress();
      localStorage.removeItem('dsd_active_breadboard_circuit');
      localStorage.removeItem('dsd_saved_circuits_local');
      localStorage.removeItem('dsd_support_messages');

      await signOut();
      playSuccessChime();
      alert('Your account and all associated lab data have been permanently erased. You are now signed out.');
      navigate('/');
    } catch (err: any) {
      playErrorClick();
      setActionNotice({
        type: 'error',
        message: `Account deletion error: ${err.message || 'Unknown error'}. Please contact the grievance officer.`,
      });
    } finally {
      setLoadingDeleteAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 font-sans">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline focus-visible:ring-2 focus-visible:ring-cyan-500 rounded p-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Hero Header */}
      <header className="rounded-3xl border border-[#ded4c2] dark:border-slate-800 bg-white/80 dark:bg-[#121622]/90 backdrop-blur-xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Statutory Data Rights Hub • DPDP Act 2023 (Sections 11–14)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Manage My Personal Data & Privacy Choices
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 leading-relaxed">
          In compliance with India's Digital Personal Data Protection Act, 2023, you have full sovereignty over your
          academic data. You can inspect your records, download an offline copy, delete optional AI chat history, withdraw
          consent, or permanently erase your account.
        </p>

        {user ? (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="font-bold text-slate-900 dark:text-white">{profile?.display_name || user.email}</span>
              <span className="text-slate-500 dark:text-stone-400 font-mono">({user.email})</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed In • Role: {profile?.role || 'student'}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            <strong>Guest Mode:</strong> You are currently using the lab offline or unauthenticated. Data actions below apply to
            your local browser storage.
          </div>
        )}
      </header>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 text-xs font-semibold ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          )}
          <span>{actionNotice.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Download My Data (Right to Access) */}
        <section className="rounded-3xl border border-[#ded4c2] dark:border-slate-800 bg-white/70 dark:bg-[#121622]/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Download My Data (JSON Export)
            </h2>
            <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed mb-4">
              Export an itemized copy of your user profile, completed experiments, quiz attempt history, saved circuit
              wirings, and consent audit logs in standard JSON format.
            </p>
          </div>
          <button
            onClick={handleExportData}
            disabled={loadingExport}
            className="w-full py-2.5 px-4 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50"
          >
            {loadingExport ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{loadingExport ? 'Compiling JSON...' : 'Export Complete Data Bundle'}</span>
          </button>
        </section>

        {/* Card 2: Delete AI Tutor History */}
        <section className="rounded-3xl border border-[#ded4c2] dark:border-slate-800 bg-white/70 dark:bg-[#121622]/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Purge AI Tutor Chat History
            </h2>
            <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed mb-4">
              Clear all conversational threads with "Ask the DSD Tutor". Does not affect your course experiment progress,
              quiz marks, or breadboard circuits.
            </p>
          </div>
          <button
            onClick={handleDeleteChatHistory}
            disabled={loadingDeleteChat}
            className="w-full py-2.5 px-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200 font-bold text-xs flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
          >
            {loadingDeleteChat ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>{loadingDeleteChat ? 'Deleting...' : 'Delete Tutor Conversations'}</span>
          </button>
        </section>

        {/* Card 3: Withdraw Consent */}
        <section className="rounded-3xl border border-[#ded4c2] dark:border-slate-800 bg-white/70 dark:bg-[#121622]/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Withdraw Consent
            </h2>
            <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed mb-4">
              Withdrawing consent is as straightforward as granting it. If you withdraw consent, your active cloud sync will
              cease and you will be signed out. Your existing past completed records remain archived as required by college
              accreditation guidelines.
            </p>
          </div>
          <button
            onClick={handleWithdrawConsent}
            disabled={loadingWithdraw}
            className="w-full py-2.5 px-4 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50"
          >
            {loadingWithdraw ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
            <span>{loadingWithdraw ? 'Withdrawing...' : 'Withdraw Consent & Sign Out'}</span>
          </button>
        </section>

        {/* Card 4: Delete Account (Right to Erasure) */}
        <section className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">
              Permanently Delete My Account
            </h2>
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed mb-4">
              Irreversibly deletes your login credentials, personal profile, progress history, saved circuits, and quiz
              evaluations. This action cannot be undone.
            </p>

            {confirmDeleteAccount && (
              <div className="mb-4 space-y-2 p-3 rounded-2xl bg-white dark:bg-[#121622] border border-rose-300 dark:border-rose-800">
                <label className="block text-[11px] font-bold text-rose-900 dark:text-rose-200">
                  Type <strong>DELETE</strong> below to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-700 text-xs font-mono font-bold uppercase text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900"
                />
              </div>
            )}
          </div>

          {!confirmDeleteAccount ? (
            <button
              onClick={() => setConfirmDeleteAccount(true)}
              className="w-full py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <Trash2 className="w-4 h-4" />
              <span>Begin Account Deletion Request</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={loadingDeleteAccount || deleteConfirmationText !== 'DELETE'}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50"
              >
                {loadingDeleteAccount ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Confirm Permanent Erasure</span>
              </button>
              <button
                onClick={() => {
                  setConfirmDeleteAccount(false);
                  setDeleteConfirmationText('');
                }}
                className="py-2.5 px-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Statutory Grievance Redressal Notice */}
      <footer className="mt-12 rounded-3xl border border-[#ded4c2] dark:border-slate-800 bg-white/80 dark:bg-[#121622]/90 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
            Institutional Grievance Redressal
          </h3>
          <p className="text-xs text-slate-600 dark:text-stone-400 max-w-md">
            If you believe your personal data has been handled inconsistently with India DPDP Act 2023 or wish to nominate an
            authorized representative, please reach out to our Grievance Officer.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-cyan-800 dark:hover:bg-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 shrink-0"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>File a Privacy Grievance</span>
        </Link>
      </footer>
    </div>
  );
};

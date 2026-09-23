// ==============================================================================
// AuthModal Component: Student Login & Sign Up Dialog
// Styled with vivid palette, Bricolage Grotesque & Plus Jakarta Sans typography.
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CloudUpload,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSuccessChime } from '../../utils/soundEffects';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    demoSignIn,
    isConfigured,
    showMigrationPrompt,
    importLocalDataToCloud,
    dismissMigrationPrompt,
    migrationLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!authModalOpen && !showMigrationPrompt) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authModalMode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message || 'Failed to sign in. Please verify your email and password.');
        } else {
          playSuccessChime();
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          setErrorMsg(error.message || 'Failed to register account.');
        } else {
          playSuccessChime();
          setSuccessMsg('Account created successfully! Check your email for verification link if required.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message || 'Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoSignIn('Priya Sharma (Student)', 'priya.sharma@sakec.ac.in');
    closeAuthModal();
    playSuccessChime();
  };

  const handleMigrate = async () => {
    const res = await importLocalDataToCloud();
    if (res.success) {
      playSuccessChime();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        {/* Migration Prompt Overlay */}
        {showMigrationPrompt ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-[#14141E] rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-900 shadow-2xl space-y-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-start to-brand-end flex items-center justify-center text-white shadow-md shadow-brand/30">
              <CloudUpload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl text-ink-900 dark:text-cream-paper">
                Import Local Progress to Cloud?
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-cream-muted mt-2 leading-relaxed">
                We discovered your completed lab experiments, quiz scores, and glossary bookmarks on this browser.
                Would you like to import them to your account now so they stay synchronized across all devices?
              </p>
            </div>

            <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-3.5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-xs font-sans text-indigo-900 dark:text-indigo-200 font-medium">
                Your existing local progress will be safely preserved and merged.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleMigrate}
                disabled={migrationLoading}
                className="flex-1 btn-brand-gradient py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand/20 flex items-center justify-center gap-2"
              >
                {migrationLoading ? (
                  <span>Syncing...</span>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Import to My Account</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={dismissMigrationPrompt}
                className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-ink-600 dark:text-cream-muted hover:bg-cream-soft dark:hover:bg-darklab-card transition-colors"
              >
                Keep Local
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Auth Dialog */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-[#14141E] rounded-3xl p-6 sm:p-8 border border-cream-border dark:border-darklab-border shadow-2xl relative overflow-hidden"
          >
            {/* Top Decorative Color Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-start via-brand-mid to-brand-end" />

            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-5 right-5 p-2 rounded-xl text-ink-400 hover:text-ink-800 dark:text-cream-muted dark:hover:text-white hover:bg-cream-soft dark:hover:bg-darklab-card transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-start to-brand-end flex items-center justify-center text-white font-display font-black text-xs shadow-sm shadow-brand/20">
                  DSD
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ECCOR2PC203
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
                {authModalMode === 'signin' ? 'Welcome Back, Student' : 'Create Student Account'}
              </h2>
              <p className="text-xs text-ink-500 dark:text-cream-muted">
                {authModalMode === 'signin'
                  ? 'Sign in to access cloud-synced lab progress, saved circuits, and the AI tutor.'
                  : 'Register with your college email to track syllabus completion and save breadboards.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-cream-soft dark:bg-darklab-card rounded-2xl mb-5 text-xs font-bold font-sans">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className={`py-2 rounded-xl transition-all ${
                  authModalMode === 'signin'
                    ? 'bg-white dark:bg-darklab-base text-ink-900 dark:text-white shadow-xs font-black'
                    : 'text-ink-600 dark:text-cream-muted hover:text-ink-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className={`py-2 rounded-xl transition-all ${
                  authModalMode === 'signup'
                    ? 'bg-white dark:bg-darklab-base text-ink-900 dark:text-white shadow-xs font-black'
                    : 'text-ink-600 dark:text-cream-muted hover:text-ink-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Fallback / Offline Notice Banner */}
            {!isConfigured && (
              <div className="mb-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Demo Mode Active</span>
                </div>
                <p>
                  Supabase keys have not been configured in <code className="font-mono font-bold">.env.local</code> yet.
                  You can use the instant demo student button below to preview accounts right away.
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-1.5 px-3 rounded-xl bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-bold hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ Instant Demo Student Login</span>
                </button>
              </div>
            )}

            {/* Error / Success Messages */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@sakec.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 btn-brand-gradient py-2.5 px-4 rounded-2xl text-xs font-bold font-sans shadow-md shadow-brand/20 flex items-center justify-center gap-2 group"
              >
                <span>{loading ? 'Processing...' : authModalMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-border dark:border-darklab-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white dark:bg-[#14141E] px-2 text-ink-400 dark:text-cream-muted">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-2xl bg-cream-soft/70 dark:bg-darklab-card border border-cream-border dark:border-darklab-border hover:border-brand-mid/50 text-xs font-bold text-ink-800 dark:text-cream-paper transition-all flex items-center justify-center gap-2.5 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

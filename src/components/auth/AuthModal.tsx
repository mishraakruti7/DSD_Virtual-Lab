// ==============================================================================
// AuthModal Component: Student & Faculty Authentication Dialog
// Includes Role Selector, Faculty Access Code, Duplicate Email Handling,
// Real Password Complexity Verification, and Forgot-Password Recovery.
// ==============================================================================

import React, { useState, useEffect } from 'react';
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
  GraduationCap,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  MailCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/database.types';
import { playSuccessChime, playErrorClick } from '../../utils/soundEffects';

interface AuthModalProps {
  onNavigateTab?: (tab: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNavigateTab }) => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    demoSignIn,
    resetPasswordForEmail,
    isConfigured,
    showMigrationPrompt,
    importLocalDataToCloud,
    dismissMigrationPrompt,
    migrationLoading,
  } = useAuth();

  // Active view: 'signin' | 'signup' | 'forgot' | 'verify_notice'
  const [viewMode, setViewMode] = useState<'signin' | 'signup' | 'forgot' | 'verify_notice'>('signin');
  const [signupRole, setSignupRole] = useState<'student' | 'faculty'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // Sync initial mode
  useEffect(() => {
    if (authModalMode === 'signup') {
      setViewMode('signup');
    } else {
      setViewMode('signin');
    }
    setErrorMsg(null);
    setIsDuplicateEmail(false);
    setConsentChecked(false);
    setAgeConfirmed(false);
  }, [authModalMode, authModalOpen]);

  if (!authModalOpen && !showMigrationPrompt) return null;

  // Password policy checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const isPasswordValid = hasMinLength && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsDuplicateEmail(false);
    setSuccessMsg(null);

    // Enforce password policy & statutory consent on signup
    if (viewMode === 'signup') {
      if (!isPasswordValid) {
        setErrorMsg('Password must be at least 8 characters and contain at least 1 number.');
        playErrorClick();
        return;
      }
      if (!consentChecked || !ageConfirmed) {
        setErrorMsg('Please accept the Privacy Notice & Terms and confirm that you are 18+ to proceed.');
        playErrorClick();
        return;
      }
    }

    setLoading(true);

    try {
      if (viewMode === 'signin') {
        const { error, role } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message || 'Failed to sign in. Please verify your email and password.');
          playErrorClick();
        } else {
          playSuccessChime();
          if (role === 'faculty') {
            setSuccessMsg('Faculty account verified. Redirecting...');
            setTimeout(() => onNavigateTab?.('faculty'), 500);
          } else if (role === 'admin') {
            setSuccessMsg('Administrator account verified. Redirecting...');
            setTimeout(() => onNavigateTab?.('admin'), 500);
          }
        }
      } else if (viewMode === 'signup') {
        const { error, needsEmailVerification } = await signUp(
          email,
          password,
          displayName,
          signupRole,
          accessCode
        );

        if (error) {
          const msg = error.message || '';
          if (msg.toLowerCase().includes('already registered')) {
            setIsDuplicateEmail(true);
            setErrorMsg('An account with this email already exists. Try signing in instead.');
          } else {
            setErrorMsg(msg || 'Failed to create account.');
          }
          playErrorClick();
        } else {
          // Record consent grant in local audit register
          try {
            const consentEntry = {
              document: 'privacy-policy-v1.0.0',
              terms: 'terms-of-service-v1.0.0',
              granted: true,
              ageConfirmed: true,
              timestamp: new Date().toISOString(),
              email,
            };
            const existingConsents = JSON.parse(localStorage.getItem('dsd_consent_audit_local') || '[]');
            existingConsents.push(consentEntry);
            localStorage.setItem('dsd_consent_audit_local', JSON.stringify(existingConsents));
          } catch {
            // storage write failure silent fallback
          }

          playSuccessChime();
          if (needsEmailVerification) {
            setViewMode('verify_notice');
          } else {
            setSuccessMsg(
              signupRole === 'faculty'
                ? 'Faculty account created successfully! You may now sign in.'
                : 'Account created successfully! Welcome to Virtual DSD Lab.'
            );
          }
        }
      } else if (viewMode === 'forgot') {
        const { error } = await resetPasswordForEmail(email);
        if (error) {
          setErrorMsg(error.message || 'Could not send recovery link.');
          playErrorClick();
        } else {
          setSuccessMsg('Recovery email sent! Check your inbox for the password reset link.');
          playSuccessChime();
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
        playErrorClick();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole = 'student') => {
    if (!import.meta.env.DEV) return;
    if (role === 'faculty') {
      demoSignIn('Prof. Rajesh Verma (Faculty)', 'rajesh.verma@sakec.ac.in', 'faculty');
      closeAuthModal();
      playSuccessChime();
      onNavigateTab?.('faculty');
    } else if (role === 'admin') {
      demoSignIn('Lab Administrator', 'admin@sakec.ac.in', 'admin');
      closeAuthModal();
      playSuccessChime();
      onNavigateTab?.('admin');
    } else {
      demoSignIn('Priya Sharma (Student)', 'priya.sharma@sakec.ac.in', 'student');
      closeAuthModal();
      playSuccessChime();
    }
  };

  const handleMigrate = async () => {
    const res = await importLocalDataToCloud();
    if (res.success) {
      playSuccessChime();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md">
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
          /* Main Authentication Dialog */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-[#14141E] rounded-3xl p-6 sm:p-8 border border-cream-border dark:border-darklab-border shadow-2xl relative overflow-hidden"
          >
            {/* Top Color Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-start via-brand-mid to-brand-end" />

            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-5 right-5 p-2 rounded-xl text-ink-400 hover:text-ink-800 dark:text-cream-muted dark:hover:text-white hover:bg-cream-soft dark:hover:bg-darklab-card transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Area */}
            <div className="space-y-1 mb-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ECCOR2PC203
                </span>
                <span className="text-[11px] font-sans text-ink-500 dark:text-cream-muted font-medium">
                  SAKEC Course Portal
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
                {viewMode === 'signin' && 'Welcome Back'}
                {viewMode === 'signup' && 'Create Your Account'}
                {viewMode === 'forgot' && 'Reset Password'}
                {viewMode === 'verify_notice' && 'Verify Your Email'}
              </h2>

              <p className="text-xs text-ink-500 dark:text-cream-muted leading-relaxed">
                {viewMode === 'signin' && 'Sign in to access your cloud-synced practicals, quiz progress, and the DSD Tutor.'}
                {viewMode === 'signup' && 'Register as a Student or verified Faculty member to participate in the virtual lab.'}
                {viewMode === 'forgot' && 'Enter your college email address to receive a secure password recovery link.'}
                {viewMode === 'verify_notice' && 'A verification link has been sent to confirm your institutional email.'}
              </p>
            </div>

            {/* View Mode Switcher (Sign In vs Create Account) */}
            {(viewMode === 'signin' || viewMode === 'signup') && (
              <div className="grid grid-cols-2 p-1 bg-cream-soft dark:bg-darklab-card rounded-2xl mb-5 text-xs font-bold font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-xl transition-all ${
                    viewMode === 'signin'
                      ? 'bg-white dark:bg-darklab-base text-ink-900 dark:text-white shadow-xs font-black'
                      : 'text-ink-600 dark:text-cream-muted hover:text-ink-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-xl transition-all ${
                    viewMode === 'signup'
                      ? 'bg-white dark:bg-darklab-base text-ink-900 dark:text-white shadow-xs font-black'
                      : 'text-ink-600 dark:text-cream-muted hover:text-ink-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error Message with One-Click Duplicate Switcher */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
                {isDuplicateEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('signin');
                      setErrorMsg(null);
                      setIsDuplicateEmail(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-rose-200 dark:bg-rose-900 text-rose-950 dark:text-rose-100 font-bold hover:bg-rose-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Switch to Sign In &rarr;</span>
                  </button>
                )}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Verification Notice Screen */}
            {viewMode === 'verify_notice' ? (
              <div className="space-y-4 py-2 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800 shadow-xs">
                  <MailCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-ink-900 dark:text-cream-paper">
                    Verification Email Sent to:
                  </p>
                  <p className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">
                    {email}
                  </p>
                  <p className="text-xs text-ink-500 dark:text-cream-muted pt-2 leading-relaxed">
                    Please open your email inbox and click the verification link to activate your account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('signin');
                    setErrorMsg(null);
                  }}
                  className="w-full py-2.5 rounded-xl btn-brand-gradient text-white text-xs font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              /* Main Form */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* SIGNUP STEP 1: I am a... [ Student / Faculty ] */}
                {viewMode === 'signup' && (
                  <div className="space-y-1.5 pb-1">
                    <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper">
                      I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignupRole('student')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                          signupRole === 'student'
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-brand-mid text-brand-600 dark:text-brand-300 ring-2 ring-brand-mid/20'
                            : 'bg-cream-soft dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink-600 dark:text-cream-muted hover:border-brand-mid/50'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="leading-tight">Student</div>
                          <div className="text-[10px] text-ink-400 font-normal">Labs & Practicals</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignupRole('faculty')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                          signupRole === 'faculty'
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-brand-mid text-brand-600 dark:text-brand-300 ring-2 ring-brand-mid/20'
                            : 'bg-cream-soft dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink-600 dark:text-cream-muted hover:border-brand-mid/50'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="leading-tight">Faculty</div>
                          <div className="text-[10px] text-ink-400 font-normal">Class Analytics</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Faculty Access Code (Only visible when Faculty role is chosen) */}
                {viewMode === 'signup' && signupRole === 'faculty' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1.5"
                  >
                    <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      Faculty Access Code (Required)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                      <input
                        type="password"
                        required
                        placeholder="Enter departmental access code"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-darklab-base border border-indigo-200 dark:border-indigo-700 text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid"
                      />
                    </div>
                    <p className="text-[10px] text-indigo-700 dark:text-indigo-300 leading-tight">
                      This secret code is provided to authorized SAKEC course faculty for class administration.
                    </p>
                  </motion.div>
                )}

                {/* Display Name (Signup only) */}
                {viewMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper mb-1">
                    College Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      type="email"
                      required
                      placeholder={signupRole === 'faculty' ? 'faculty@sakec.ac.in' : 'student@sakec.ac.in'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                    />
                  </div>
                </div>

                {/* Password Field (Not needed for forgot password view) */}
                {viewMode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper">
                        Password
                      </label>
                      {viewMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setViewMode('forgot');
                            setErrorMsg(null);
                          }}
                          className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-cream-soft/60 dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Policy Inline Checklist on Signup */}
                    {viewMode === 'signup' && (
                      <div className="mt-2 p-2.5 rounded-xl bg-cream-soft/80 dark:bg-darklab-base/80 border border-cream-border dark:border-darklab-border text-[11px] space-y-1">
                        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-ink-400 dark:text-cream-muted'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>At least 8 characters long</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-ink-400 dark:text-cream-muted'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Contains at least 1 number</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Statutory DPDP Consent & Age Verification Notice (Signup Only) */}
                {viewMode === 'signup' && (
                  <div className="space-y-3 pt-2 border-t border-cream-border dark:border-darklab-border">
                    {/* Plain language notice */}
                    <div className="p-3 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-[11px] leading-relaxed text-cyan-950 dark:text-cyan-200">
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-cyan-900 dark:text-cyan-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>What We Store & Why (Data Minimisation)</span>
                      </div>
                      <p>
                        We only store your college email, display name, experiment progress, quiz scores, and saved circuits to grade your lab work. We never collect phone numbers, dates of birth, biometrics, or tracking cookies. Profile photos are not stored (initials are used).
                      </p>
                    </div>

                    {/* Checkbox 1: Privacy Notice & Terms (Unticked, unbundled) */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-left group">
                      <input
                        type="checkbox"
                        id="signup-consent-checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-cream-border dark:border-darklab-border text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-[11px] text-ink-700 dark:text-cream-paper leading-tight">
                        I have read the{' '}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-700 dark:text-cyan-400 font-bold underline hover:text-cyan-800"
                        >
                          Privacy Notice
                        </a>{' '}
                        and agree to the{' '}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-700 dark:text-cyan-400 font-bold underline hover:text-cyan-800"
                        >
                          Terms of Use
                        </a>{' '}
                        (opens in new tab).
                      </span>
                    </label>

                    {/* Checkbox 2: 18+ Confirmation (Unticked) */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-left group">
                      <input
                        type="checkbox"
                        id="signup-age-checkbox"
                        checked={ageConfirmed}
                        onChange={(e) => setAgeConfirmed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-cream-border dark:border-darklab-border text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-[11px] text-ink-700 dark:text-cream-paper leading-tight">
                        I confirm that I am <strong>18 years of age or older</strong> (or have verifiable parental/guardian consent).
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || (viewMode === 'signup' && (!isPasswordValid || !consentChecked || !ageConfirmed))}
                  className="w-full mt-2 btn-brand-gradient py-2.5 px-4 rounded-2xl text-xs font-bold font-sans shadow-md shadow-brand/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {loading
                      ? 'Processing...'
                      : viewMode === 'signin'
                      ? 'Sign In'
                      : viewMode === 'signup'
                      ? signupRole === 'faculty'
                        ? 'Register as Faculty'
                        : 'Create Student Account'
                      : 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Back to sign in link from forgot password view */}
                {viewMode === 'forgot' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('signin')}
                      className="text-xs font-bold text-ink-600 dark:text-cream-muted hover:text-brand-600"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Google OAuth Button (Only in signin / signup) */}
            {(viewMode === 'signin' || viewMode === 'signup') && (
              <>
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
              </>
            )}

            {/* DEV ONLY Fallback Quick Evaluator Row: STRICTLY inaccessible in production */}
            {import.meta.env.DEV && (
              <div className="mt-4 pt-3 border-t border-cream-border dark:border-darklab-border text-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-mono font-bold tracking-wider block mb-1.5">
                  [DEV MODE ONLY] Quick Test Login
                </span>
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-sans">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('student')}
                    className="px-2 py-0.5 rounded-lg bg-cream-soft dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:text-brand-600 font-bold border border-cream-border dark:border-darklab-border"
                  >
                    ⚡ Student
                  </button>
                  <span className="text-ink-300 dark:text-darklab-border">•</span>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('faculty')}
                    className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 font-bold border border-indigo-200 dark:border-indigo-800"
                  >
                    🎓 Faculty
                  </button>
                  <span className="text-ink-300 dark:text-darklab-border">•</span>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:text-purple-900 font-bold border border-purple-200 dark:border-purple-800"
                  >
                    🛡️ Admin
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

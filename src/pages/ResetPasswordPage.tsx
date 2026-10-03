// ==============================================================================
// ResetPasswordPage: Secure Password Recovery & Reset Form
// Handles the redirect after a student or faculty clicks the email recovery link.
// Enforces production password complexity (min 8 chars, 1 number).
// ==============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playSuccessChime, playErrorClick } from '../utils/soundEffects';

export const ResetPasswordPage: React.FC<{
  onGoHome?: () => void;
  onNavigateTab?: (tab: string, extraId?: string | number) => void;
}> = ({ onGoHome, onNavigateTab }) => {
  const { updatePassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password Policy Checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isValid = hasMinLength && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        setErrorMsg(error.message || 'Failed to update password. Your recovery link may have expired.');
        playErrorClick();
      } else {
        setIsSuccess(true);
        playSuccessChime();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      playErrorClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-darklab-card rounded-3xl p-6 sm:p-8 border border-cream-border dark:border-darklab-border shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-ink-900 dark:text-cream-paper">
            Reset Account Password
          </h2>
          <p className="text-xs text-ink-500 dark:text-cream-muted max-w-xs mx-auto">
            Choose a strong new password for your Virtual DSD Lab account.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-5 text-center py-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-sm">Password Updated Successfully!</span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                You can now sign in using your new credentials.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab ? onNavigateTab('home') : onGoHome ? onGoHome() : (window.location.href = '/')}
              className="w-full py-2.5 px-4 rounded-xl btn-brand-gradient text-white text-xs font-bold shadow-md shadow-brand/20 flex items-center justify-center gap-2"
            >
              <span>Proceed to Portal Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters with numbers"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-ink-700 dark:text-cream-paper mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-cream-paper focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                />
              </div>
            </div>

            {/* Password Policy Inline Checklist */}
            <div className="p-3 rounded-2xl bg-cream-soft/80 dark:bg-darklab-base/80 border border-cream-border dark:border-darklab-border text-[11px] space-y-1.5 font-sans">
              <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-ink-400 dark:text-cream-muted'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>At least 8 characters long</span>
              </div>
              <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-ink-400 dark:text-cream-muted'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Contains at least 1 number (0-9)</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-ink-400 dark:text-cream-muted'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Both passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full btn-brand-gradient py-2.5 px-4 rounded-xl text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// ==============================================================================
// UserMenu Component: User avatar, profile dropdown, and authentication trigger
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  Sparkles,
  Cloud,
  CheckCircle,
  Award,
  Layers,
  ChevronDown,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  onNavigateTab?: (tab: any, extraId?: string | number) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigateTab }) => {
  const { user, profile, role, isFacultyOrAdmin, isAdmin, switchDemoRole, openAuthModal, signOut, isConfigured } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal('signin')}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white text-xs sm:text-sm font-sans font-bold shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/40 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all select-none shrink-0"
        title="Sign In to Save Progress & Chat History"
      >
        <User className="w-3.5 h-3.5 text-white" />
        <span>Sign In</span>
      </button>
    );
  }

  // Generate initials from name or email
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl bg-cream-soft dark:bg-darklab-card border border-cream-border dark:border-darklab-border hover:border-brand-mid/50 text-xs font-sans font-bold transition-all shadow-xs shrink-0"
        aria-label="Account Menu"
        aria-expanded={dropdownOpen}
      >
        {/* Avatar with initials or picture */}
        <div
          className={`w-7 h-7 rounded-lg text-white text-xs font-display font-black flex items-center justify-center shadow-xs ${
            role === 'admin'
              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
              : role === 'faculty'
              ? 'bg-gradient-to-tr from-indigo-600 to-sky-600'
              : 'bg-gradient-to-tr from-brand-start via-brand-mid to-brand-end'
          }`}
        >
          {initials || (role === 'admin' ? 'A' : role === 'faculty' ? 'F' : 'S')}
        </div>

        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="max-w-[110px] truncate text-ink-900 dark:text-cream-paper">
            {displayName}
          </span>
          <span
            className={`text-[9px] uppercase font-mono font-extrabold ${
              role === 'admin'
                ? 'text-purple-600 dark:text-purple-400'
                : role === 'faculty'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-brand-600 dark:text-brand-400'
            }`}
          >
            {role}
          </span>
        </div>

        {/* Cloud status dot */}
        <span
          className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950 animate-pulse shrink-0"
          title={isConfigured ? 'Cloud Sync Active' : 'Demo Account Active'}
        />

        <ChevronDown className="w-3.5 h-3.5 text-ink-400 dark:text-cream-muted" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-darklab-card border-2 border-indigo-100 dark:border-darklab-border rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn space-y-1 text-xs">
          {/* User Details Header */}
          <div className="px-4 py-2.5 border-b border-cream-border dark:border-darklab-border">
            <div className="flex items-center justify-between">
              <p className="font-display font-extrabold text-sm text-ink-900 dark:text-cream-paper truncate">
                {displayName}
              </p>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full capitalize ${
                  role === 'admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                    : role === 'faculty'
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}
              >
                {role}
              </span>
            </div>
            <p className="text-[11px] text-ink-500 dark:text-cream-muted truncate font-mono mt-0.5">
              {user.email}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <Cloud className="w-3 h-3" />
              <span>{isConfigured ? 'Supabase Cloud Connected' : 'Local Demo Account'}</span>
            </div>
          </div>

          {/* Role-Specific Portals */}
          {onNavigateTab && (
            <div className="py-1">
              {isFacultyOrAdmin && (
                <button
                  onClick={() => {
                    onNavigateTab('faculty');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-bold transition-colors text-left"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <div className="flex-1">
                    <p className="leading-tight">Faculty Dashboard</p>
                    <p className="text-[10px] text-ink-400 dark:text-cream-muted font-normal">Class Roster & Lab Analytics</p>
                  </div>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => {
                    onNavigateTab('admin');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-bold transition-colors text-left"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <p className="leading-tight">Admin Management</p>
                    <p className="text-[10px] text-ink-400 dark:text-cream-muted font-normal">Manage Roles & System Health</p>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  onNavigateTab('progress');
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-ink-800 dark:text-cream-paper hover:bg-cream-soft dark:hover:bg-darklab-base font-bold transition-colors text-left"
              >
                <Award className="w-4 h-4 text-brand-500" />
                <span>My Progress & Achievements</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('breadboard');
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-ink-800 dark:text-cream-paper hover:bg-cream-soft dark:hover:bg-darklab-base font-bold transition-colors text-left"
              >
                <Layers className="w-4 h-4 text-purple-500" />
                <span>My Saved Circuits</span>
              </button>
            </div>
          )}

          {/* Quick Role Switcher for Testing */}
          <div className="px-4 py-2 bg-cream-soft/70 dark:bg-darklab-base/60 border-t border-cream-border dark:border-darklab-border text-[11px]">
            <div className="text-[10px] uppercase font-bold text-ink-500 dark:text-cream-muted mb-1.5 flex items-center justify-between">
              <span>Switch Active Role</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">({role})</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => switchDemoRole('student')}
                className={`py-1 rounded-lg text-center font-bold text-[10px] transition-colors ${
                  role === 'student'
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:bg-cream-soft border border-cream-border dark:border-darklab-border'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('faculty');
                  onNavigateTab?.('faculty');
                }}
                className={`py-1 rounded-lg text-center font-bold text-[10px] transition-colors ${
                  role === 'faculty'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:bg-cream-soft border border-cream-border dark:border-darklab-border'
                }`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('admin');
                  onNavigateTab?.('admin');
                }}
                className={`py-1 rounded-lg text-center font-bold text-[10px] transition-colors ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-darklab-card text-ink-700 dark:text-cream-muted hover:bg-cream-soft border border-cream-border dark:border-darklab-border'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-1 border-t border-cream-border dark:border-darklab-border">
            <button
              onClick={async () => {
                setDropdownOpen(false);
                await signOut();
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

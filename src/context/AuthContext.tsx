// ==============================================================================
// Authentication Context for Virtual DSD Lab
// ==============================================================================
// Manages student auth state, session persistence, Google OAuth,
// demo login fallback, and automatic cloud-sync migration prompt.
// ==============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Profile, UserRole } from '../types/database.types';
import {
  fetchCloudProgress,
  migrateLocalStorageToCloud,
} from '../services/cloudSync';
import { useCourseStore } from '../store/useCourseStore';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  isFacultyOrAdmin: boolean;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  showMigrationPrompt: boolean;
  migrationLoading: boolean;

  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; role?: UserRole }>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
    role?: UserRole,
    accessCode?: string
  ) => Promise<{ error: Error | null; needsEmailVerification?: boolean }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  demoSignIn: (name?: string, email?: string, demoRole?: UserRole) => void;
  switchDemoRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
  importLocalDataToCloud: () => Promise<{ success: boolean; importedItems?: number; error?: string }>;
  dismissMigrationPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);

  const configured = isSupabaseConfigured();

  // Load user profile & sync progress on login
  const handleUserSession = async (currentSession: Session | null) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);

    if (currentUser && configured) {
      try {
        // Fetch or create profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (profileData) {
          if (profileData.is_active === false) {
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            setProfile(null);
            return;
          }
          setProfile({
            ...profileData,
            role: (profileData.role as UserRole) || 'student'
          } as Profile);
        } else {
          // Generate fallback profile
          const fallbackProfile: Profile = {
            id: currentUser.id,
            display_name:
              currentUser.user_metadata?.full_name ||
              currentUser.user_metadata?.name ||
              currentUser.email?.split('@')[0] ||
              'Student',
            avatar_url: currentUser.user_metadata?.avatar_url || null,
            role: (currentUser.user_metadata?.role as UserRole) || 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(fallbackProfile);
        }

        // Check cloud progress
        const cloudData = await fetchCloudProgress(currentUser.id);
        const localState = useCourseStore.getState().studentProgress;
        const hasLocalProgress =
          localState.completedLabs.length > 0 ||
          localState.completedQuizzes.length > 0 ||
          localState.bookmarkedTerms.length > 0;

        if (!cloudData && hasLocalProgress) {
          // Offer migration prompt to import local progress to the cloud
          setShowMigrationPrompt(true);
        } else if (cloudData) {
          // Cloud has progress: hydrate store
          useCourseStore.setState((state) => ({
            studentProgress: {
              ...state.studentProgress,
              completedLabs: cloudData.completedLabs || state.studentProgress.completedLabs,
              bookmarkedTerms: cloudData.bookmarkedTerms || state.studentProgress.bookmarkedTerms,
              achievements: cloudData.achievements || state.studentProgress.achievements,
              completedQuizzes: cloudData.completedQuizzes || state.studentProgress.completedQuizzes,
            },
          }));
        }
      } catch (e) {
        console.warn('Error syncing profile:', e);
      }
    } else if (!currentUser) {
      setProfile(null);
      setShowMigrationPrompt(false);
    }
  };

  // Check initial session & subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    if (configured) {
      supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        if (!mounted) return;
        handleUserSession(initialSession).finally(() => setLoading(false));
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!mounted) return;
        handleUserSession(newSession);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Check if there is a local demo user saved
      try {
        const demoUser = localStorage.getItem('dsd_demo_auth_user');
        if (demoUser) {
          const parsed = JSON.parse(demoUser);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch {
        // Ignore
      }
      setLoading(false);
    }
  }, [configured]);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null; role?: UserRole }> => {
    if (!configured) {
      if (import.meta.env.DEV) {
        demoSignIn('Student Explorer', email);
        closeAuthModal();
        return { error: null, role: 'student' };
      }
      return { error: new Error('Backend service is temporarily unavailable. Please contact the administrator.') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };

      // Look up role and active status from profiles table
      let userRole: UserRole = 'student';
      if (data.session?.user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', data.session.user.id)
          .maybeSingle();

        if (prof) {
          if (prof.is_active === false) {
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            setProfile(null);
            return { error: new Error('Your account has been deactivated by the administrator.') };
          }
          if (prof.role) {
            userRole = prof.role as UserRole;
          }
        }
      }

      await handleUserSession(data.session);
      closeAuthModal();
      return { error: null, role: userRole };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
    role: UserRole = 'student',
    accessCode?: string
  ): Promise<{ error: Error | null; needsEmailVerification?: boolean }> => {
    // 1. Faculty Signup (verified via Edge Function)
    if (role === 'faculty') {
      if (!configured) {
        if (import.meta.env.DEV) {
          demoSignIn(displayName || 'Prof. Faculty Member', email, 'faculty');
          closeAuthModal();
          return { error: null, needsEmailVerification: false };
        }
        return { error: new Error('Backend service is temporarily unavailable.') };
      }

      try {
        const { data, error } = await supabase.functions.invoke('faculty-signup', {
          body: { email, password, displayName: displayName || email.split('@')[0], accessCode },
        });

        if (error) {
          return { error: new Error(error.message || 'Faculty registration failed.') };
        }
        if (data?.error) {
          return { error: new Error(data.error) };
        }

        return { error: null, needsEmailVerification: false };
      } catch (err: any) {
        return { error: err };
      }
    }

    // 2. Student Signup
    if (!configured) {
      if (import.meta.env.DEV) {
        demoSignIn(displayName || 'New Student', email, 'student');
        closeAuthModal();
        return { error: null, needsEmailVerification: false };
      }
      return { error: new Error('Backend service is temporarily unavailable. Please contact the administrator.') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            role: 'student',
          },
        },
      });
      if (error) return { error };

      const needsEmailVerification = !data.session;
      if (data.session) {
        await handleUserSession(data.session);
        closeAuthModal();
      }
      return { error: null, needsEmailVerification };
    } catch (err: any) {
      return { error: err };
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    if (!configured) {
      return { error: new Error('Password reset requires cloud backend configuration.') };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#reset-password`,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!configured) {
      return { error: new Error('Password update requires cloud backend configuration.') };
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    if (!configured) {
      if (import.meta.env.DEV) {
        demoSignIn('Google Student', 'student.google@sakec.ac.in', 'student');
        closeAuthModal();
        return { error: null };
      }
      return { error: new Error('Google sign-in is not configured.') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) return { error };
      if (data?.url) {
        window.location.href = data.url;
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Demo sign-in: ONLY accessible in DEV mode
  const demoSignIn = (
    name = 'Priya Sharma (SAKEC)',
    email = 'priya.sharma@sakec.ac.in',
    demoRole: UserRole = 'student'
  ) => {
    if (!import.meta.env.DEV) {
      console.error('Demo authentication is strictly disabled in production.');
      return;
    }

    const mockUser = {
      id: demoRole === 'admin' ? 'demo-admin-id' : demoRole === 'faculty' ? 'demo-faculty-id' : 'demo-student-id-1234',
      email,
      app_metadata: {},
      user_metadata: { full_name: name, role: demoRole },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockProfile: Profile = {
      id: mockUser.id,
      display_name: name,
      avatar_url: null,
      role: demoRole,
      institution: 'Shah & Anchor Kutchhi Engineering College',
      department: 'Electronics & Computer Science',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setProfile(mockProfile);

    try {
      localStorage.setItem(
        'dsd_demo_auth_user',
        JSON.stringify({ user: mockUser, profile: mockProfile })
      );
    } catch {
      // Ignore
    }

    // Check if local progress exists to offer import preview
    const local = useCourseStore.getState().studentProgress;
    if (local.completedLabs.length > 0 || local.completedQuizzes.length > 0) {
      setShowMigrationPrompt(true);
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    if (!profile) return;
    const updated: Profile = { ...profile, role: newRole };
    setProfile(updated);
    if (user) {
      const updatedUser = {
        ...user,
        user_metadata: { ...user.user_metadata, role: newRole }
      } as User;
      setUser(updatedUser);
      try {
        localStorage.setItem(
          'dsd_demo_auth_user',
          JSON.stringify({ user: updatedUser, profile: updated })
        );
      } catch {
        // Ignore
      }
    }
  };

  const signOut = async () => {
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    } else {
      localStorage.removeItem('dsd_demo_auth_user');
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setShowMigrationPrompt(false);
  };

  const importLocalDataToCloud = async () => {
    if (!user) return { success: false, error: 'No user signed in' };

    setMigrationLoading(true);
    try {
      const localProgress = useCourseStore.getState().studentProgress;
      const result = await migrateLocalStorageToCloud(user.id, localProgress);
      setShowMigrationPrompt(false);
      return result;
    } finally {
      setMigrationLoading(false);
    }
  };

  const dismissMigrationPrompt = () => {
    setShowMigrationPrompt(false);
  };

  const role: UserRole | null = profile?.role ?? (user ? 'student' : null);
  const isFacultyOrAdmin = role === 'faculty' || role === 'admin';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isFacultyOrAdmin,
        isAdmin,
        loading,
        isConfigured: configured,
        authModalOpen,
        authModalMode,
        showMigrationPrompt,
        migrationLoading,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        resetPasswordForEmail,
        updatePassword,
        signInWithGoogle,
        demoSignIn,
        switchDemoRole,
        signOut,
        importLocalDataToCloud,
        dismissMigrationPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

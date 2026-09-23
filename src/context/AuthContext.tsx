// ==============================================================================
// Authentication Context for Virtual DSD Lab
// ==============================================================================
// Manages student auth state, session persistence, Google OAuth,
// demo login fallback, and automatic cloud-sync migration prompt.
// ==============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Profile } from '../types/database.types';
import {
  fetchCloudProgress,
  migrateLocalStorageToCloud,
} from '../services/cloudSync';
import { useCourseStore } from '../store/useCourseStore';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  showMigrationPrompt: boolean;
  migrationLoading: boolean;

  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  demoSignIn: (name?: string, email?: string) => void;
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
          setProfile(profileData as Profile);
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

  const signIn = async (email: string, password: string) => {
    if (!configured) {
      demoSignIn('Student Explorer', email);
      closeAuthModal();
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      await handleUserSession(data.session);
      closeAuthModal();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!configured) {
      demoSignIn(displayName || 'New Student', email);
      closeAuthModal();
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });
      if (error) return { error };
      await handleUserSession(data.session);
      closeAuthModal();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    if (!configured) {
      demoSignIn('Google Student', 'student.google@sakec.ac.in');
      closeAuthModal();
      return { error: null };
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

  // Demo sign-in for testing when Supabase keys are not configured yet
  const demoSignIn = (name = 'Priya Sharma (SAKEC)', email = 'priya.sharma@sakec.ac.in') => {
    const mockUser = {
      id: 'demo-student-id-1234',
      email,
      app_metadata: {},
      user_metadata: { full_name: name },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockProfile: Profile = {
      id: mockUser.id,
      display_name: name,
      avatar_url: null,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
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
        signInWithGoogle,
        demoSignIn,
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

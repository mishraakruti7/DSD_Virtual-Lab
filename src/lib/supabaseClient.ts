// ==============================================================================
// Supabase Client Initialization with Graceful Offline/Local Fallback
// ==============================================================================
// Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from environment.
// If missing or set to placeholder values, exports safe fallback client so
// the entire Virtual DSD Lab continues running offline without errors.
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid URL and non-placeholder key
export function isSupabaseConfigured(): boolean {
  if (!rawUrl || !rawAnonKey) return false;
  if (
    rawUrl.includes('your-project-id') ||
    rawUrl.includes('example.com') ||
    rawAnonKey.includes('your-anon-public-key') ||
    rawAnonKey.length < 20
  ) {
    return false;
  }
  try {
    new URL(rawUrl);
    return true;
  } catch {
    return false;
  }
}

export const SUPABASE_CONFIGURED = isSupabaseConfigured();

// Use real client or fallback dummy client
let clientInstance: SupabaseClient;

if (SUPABASE_CONFIGURED) {
  clientInstance = createClient(rawUrl, rawAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // Safe mock client preventing runtime fatal errors when keys are unconfigured
  const mockDummy = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error('Supabase is not configured yet. Add your credentials in .env.local'),
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: new Error('Supabase is not configured yet. Add your credentials in .env.local'),
      }),
      signInWithOAuth: async () => ({
        data: { url: null, provider: 'google' },
        error: new Error('Supabase is not configured yet. Add your credentials in .env.local'),
      }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
          order: async () => ({ data: [], error: null }),
        }),
        order: async () => ({ data: [], error: null }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
    functions: {
      invoke: async () => ({
        data: null,
        error: new Error('Edge function not configured yet.'),
      }),
    },
  } as unknown as SupabaseClient;

  clientInstance = mockDummy;
}

export const supabase = clientInstance;

// Helper to retrieve active user ID (Supabase Auth or Demo User)
export async function getActiveUserId(): Promise<string | null> {
  if (!SUPABASE_CONFIGURED) {
    try {
      const demo = localStorage.getItem('dsd_demo_auth_user');
      if (demo) return JSON.parse(demo).user?.id || null;
    } catch {
      return null;
    }
    return null;
  }
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch {
    return null;
  }
}

export default supabase;

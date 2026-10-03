// ==============================================================================
// Supabase Edge Function: faculty-signup
// Verifies faculty access code server-side and provisions a faculty user.
// Uses SUPABASE_SERVICE_ROLE_KEY to set role = 'faculty' atomically.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FacultySignupPayload {
  email: string;
  password: string;
  displayName: string;
  accessCode: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const expectedAccessCode = Deno.env.get('FACULTY_ACCESS_CODE') || 'SAKEC_FACULTY_2026';

    const body: FacultySignupPayload = await req.json();
    const { email, password, displayName, accessCode } = body;

    // Validate presence
    if (!email || !password || !accessCode) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and faculty access code are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Server-side code verification
    if (accessCode.trim() !== expectedAccessCode.trim()) {
      return new Response(
        JSON.stringify({ error: 'Invalid faculty access code — contact your admin.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Password validation (min 8 chars, at least 1 digit)
    if (password.length < 8 || !/\d/.test(password)) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters and contain at least 1 number.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Create user via Admin API
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName || email.split('@')[0],
        role: 'faculty',
      },
    });

    if (createError) {
      // Check for duplicate email
      if (createError.message?.toLowerCase().includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'An account with this email already exists. Try signing in instead.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!newUser.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create user record.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure role = 'faculty' in profiles table
    await adminClient
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        display_name: displayName || email.split('@')[0],
        role: 'faculty',
        is_active: true,
        institution: 'Shah & Anchor Kutchhi Engineering College',
        department: 'Electronics & Computer Science',
        updated_at: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Faculty account created successfully. You may now sign in.',
        user: { id: newUser.user.id, email: newUser.user.email, role: 'faculty' },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

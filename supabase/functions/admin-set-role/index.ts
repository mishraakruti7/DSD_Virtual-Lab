// ==============================================================================
// Supabase Edge Function: admin-set-role
// Securely promotes/demotes a user's role (student, faculty, admin).
// Only callable by authenticated users who have the 'admin' role in public.profiles.
// Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS and perform the update.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetRolePayload {
  targetUserId: string;
  newRole: 'student' | 'faculty' | 'admin';
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Create client with user's JWT to verify caller's identity
    const userClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: userAuthError } = await userClient.auth.getUser();
    if (userAuthError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verify caller has admin role in public.profiles table
    const { data: callerProfile, error: profileError } = await userClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || callerProfile?.role !== 'admin') {
      return new Response(
        JSON.stringify({
          error: 'Forbidden: Only users with the admin role may change user roles.',
          callerRole: callerProfile?.role || 'none',
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse request payload
    const body: SetRolePayload = await req.json();
    const { targetUserId, newRole } = body;

    const validRoles = ['student', 'faculty', 'admin'];
    if (!targetUserId || !validRoles.includes(newRole)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload. targetUserId and valid newRole (student|faculty|admin) required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Perform update using service role client (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data: updatedProfile, error: updateError } = await adminClient
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId)
      .select('id, email, display_name, role, updated_at')
      .single();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Database update failed: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully set user ${targetUserId} role to ${newRole}`,
        updatedUser: updatedProfile,
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

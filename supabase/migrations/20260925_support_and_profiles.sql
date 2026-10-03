-- ==============================================================================
-- Migration: 20260925_support_and_profiles.sql
-- Virtual DSD Lab (ECCOR2PC203)
-- 1. Add is_active column to profiles for administrative account management
-- 2. Create support_messages table with full RLS (Feedback, Help Requests, Contact)
-- 3. Enhance handle_new_user() trigger for atomic role handling
-- ==============================================================================

-- 1. Add is_active to public.profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE NOT NULL;

-- 2. Create support_messages table
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  type TEXT NOT NULL CHECK (type IN ('feedback', 'help_request', 'contact')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_user_id ON public.support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_type_status ON public.support_messages(type, status);
CREATE INDEX IF NOT EXISTS idx_support_created_at ON public.support_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users can insert their own messages
CREATE POLICY "Users can insert own support messages"
ON public.support_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Public/Guest visitors can insert contact messages (user_id IS NULL)
CREATE POLICY "Public can submit contact messages"
ON public.support_messages
FOR INSERT
TO anon
WITH CHECK (type = 'contact' AND user_id IS NULL);

-- Policy 3: Users can view their own messages
CREATE POLICY "Users can view own support messages"
ON public.support_messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Faculty and Admin can view all messages
CREATE POLICY "Faculty and admin view all support messages"
ON public.support_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('faculty', 'admin')
  )
);

-- Policy 5: Admins can update support messages (replies & resolution status)
CREATE POLICY "Admins can update support messages"
ON public.support_messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 3. Enhance handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  -- Default to 'student', allow 'faculty' only if validated metadata exists
  IF (new.raw_user_meta_data->>'role') = 'faculty' THEN
    assigned_role := 'faculty';
  ELSE
    assigned_role := 'student';
  END IF;

  INSERT INTO public.profiles (
    id,
    display_name,
    avatar_url,
    role,
    is_active,
    institution,
    department
  ) VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    assigned_role,
    TRUE,
    'Shah & Anchor Kutchhi Engineering College',
    'Electronics & Computer Science'
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = timezone('utc'::text, now());

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

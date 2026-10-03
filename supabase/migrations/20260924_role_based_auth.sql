-- ==============================================================================
-- Migration: 20260924_role_based_auth.sql
-- Role-Based Authentication & Access Control (Student / Faculty / Admin)
-- Virtual DSD Laboratory (ECCOR2PC203)
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Add role column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student'
  CHECK (role IN ('student', 'faculty', 'admin'));

-- 2. Update the handle_new_user() trigger function
-- Guarantees new signups ALWAYS default to 'student' (no client override)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'student' -- Explicitly hardcoded: only admin can promote via service-role Edge Function
  )
  ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Row Level Security: Faculty and Admin read permissions across student records
-- A) Profiles: Faculty/admin can view all student profiles
DROP POLICY IF EXISTS "Faculty and admin can view all profiles" ON public.profiles;
CREATE POLICY "Faculty and admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  );

-- B) Progress: Faculty/admin can view all student progress
DROP POLICY IF EXISTS "Faculty and admin can view all student progress" ON public.progress;
CREATE POLICY "Faculty and admin can view all student progress"
  ON public.progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  );

-- C) Quiz Attempts: Faculty/admin can view all student quiz attempts
DROP POLICY IF EXISTS "Faculty and admin can view all student quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Faculty and admin can view all student quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  );

-- D) Saved Circuits: Faculty/admin can view all student saved circuits
DROP POLICY IF EXISTS "Faculty and admin can view all student saved circuits" ON public.saved_circuits;
CREATE POLICY "Faculty and admin can view all student saved circuits"
  ON public.saved_circuits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  );

-- 4. Faculty Reports Metadata Table
CREATE TABLE IF NOT EXISTS public.faculty_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'class_progress' | 'quiz_summary' | 'full'
  format TEXT NOT NULL DEFAULT 'csv', -- 'csv' | 'pdf'
  filters JSONB DEFAULT '{}'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  file_url TEXT -- if exported to storage or cloud blob
);

ALTER TABLE public.faculty_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Faculty and admin can manage their own reports" ON public.faculty_reports;
CREATE POLICY "Faculty and admin can manage their own reports"
  ON public.faculty_reports FOR ALL
  USING (
    auth.uid() = generated_by
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  )
  WITH CHECK (
    auth.uid() = generated_by
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  );

-- ==============================================================================
-- MANUAL STEP FOR INITIAL ADMIN ACCOUNT:
-- Run this in SQL Editor with your admin user ID:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-id>';
-- ==============================================================================

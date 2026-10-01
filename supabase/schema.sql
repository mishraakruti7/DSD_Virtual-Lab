-- ==============================================================================
-- Virtual DSD Lab (ECCOR2PC203) - Supabase Database Schema with Row Level Security
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all required tables, triggers, and Row Level Security (RLS) policies.
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- Table: profiles
-- Stores student profile information linked directly to Supabase Auth users.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  institution TEXT DEFAULT 'Shah & Anchor Kutchhi Engineering College',
  department TEXT DEFAULT 'Electronics & Computer Science',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Table: progress
-- Tracks student completion of modules, experiments (Labs 1-12), and theory topics.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT TRUE NOT NULL,
  progress_data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_topic UNIQUE (user_id, topic_id)
);

-- ==============================================================================
-- Table: quiz_attempts
-- Stores history of quiz scores, total questions, and Bloom's taxonomy breakdown.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  bloom_breakdown JSONB DEFAULT '{}'::jsonb,
  taken_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Table: saved_circuits
-- Stores virtual breadboard circuit wirings and custom student projects.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_circuits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  circuit_json JSONB NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Table: chat_history
-- Persists conversations between students and the DSD Tutor chatbot.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  topic_context TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Table: chat_usage
-- Enforces server-side rate limits (max 30 messages / hour per user).
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_identifier TEXT, -- Fallback for anonymous users (e.g. hashed IP)
  message_count INTEGER DEFAULT 1 NOT NULL,
  window_start TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_or_client UNIQUE (user_id, client_identifier)
);

-- ADDED: Table: chat_feedback
CREATE TABLE IF NOT EXISTS public.chat_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
  feedback_text TEXT,
  topic_context TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add roles to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin'));

UPDATE public.profiles
SET role = 'student'
WHERE role IS NULL;

-- Table: modules
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  order_number INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: quiz_questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  marks INTEGER DEFAULT 1
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.is_admin_or_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Admin role check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Policies (Idempotent: Drop then Create)
DROP POLICY IF EXISTS "Anyone can view modules" ON public.modules;
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Teachers can manage modules" ON public.modules;
CREATE POLICY "Teachers can manage modules" ON public.modules FOR ALL USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Teachers can manage lessons" ON public.lessons;
CREATE POLICY "Teachers can manage lessons" ON public.lessons FOR ALL USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Anyone can view quizzes" ON public.quizzes;
CREATE POLICY "Anyone can view quizzes" ON public.quizzes FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Teachers can manage quizzes" ON public.quizzes;
CREATE POLICY "Teachers can manage quizzes" ON public.quizzes FOR ALL USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Anyone can view quiz questions" ON public.quiz_questions;
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Teachers can manage quiz questions" ON public.quiz_questions;
CREATE POLICY "Teachers can manage quiz questions" ON public.quiz_questions FOR ALL USING (public.is_admin_or_teacher());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON public.quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON public.quiz_questions(quiz_id);

CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_circuits_user ON public.saved_circuits(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_conv ON public.chat_history(user_id, conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_usage_user_window ON public.chat_usage(user_id, window_start);

-- Trigger function to prevent role escalation
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: only admins can change user roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- ==============================================================================
-- Auto-create profile trigger on new user signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures students can ONLY read and write their own data.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Teachers can view all profiles" ON public.profiles;
CREATE POLICY "Teachers can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- 2. Progress Policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.progress;
CREATE POLICY "Users can view their own progress"
  ON public.progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all progress" ON public.progress;
CREATE POLICY "Teachers can view all progress"
  ON public.progress FOR SELECT
  USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.progress;
CREATE POLICY "Users can insert their own progress"
  ON public.progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.progress;
CREATE POLICY "Users can update their own progress"
  ON public.progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own progress" ON public.progress;
CREATE POLICY "Users can delete their own progress"
  ON public.progress FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Quiz Attempts Policies
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Teachers can view all quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can insert their own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Saved Circuits Policies
DROP POLICY IF EXISTS "Users can view their own saved circuits" ON public.saved_circuits;
CREATE POLICY "Users can view their own saved circuits"
  ON public.saved_circuits FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved circuits" ON public.saved_circuits;
CREATE POLICY "Users can insert their own saved circuits"
  ON public.saved_circuits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own saved circuits" ON public.saved_circuits;
CREATE POLICY "Users can update their own saved circuits"
  ON public.saved_circuits FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved circuits" ON public.saved_circuits;
CREATE POLICY "Users can delete their own saved circuits"
  ON public.saved_circuits FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Chat History Policies
DROP POLICY IF EXISTS "Users can view their own chat history" ON public.chat_history;
CREATE POLICY "Users can view their own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat history" ON public.chat_history;
CREATE POLICY "Users can insert their own chat history"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own chat history" ON public.chat_history;
CREATE POLICY "Users can delete their own chat history"
  ON public.chat_history FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Chat Usage Policies
-- Users can only read their own usage records.
-- The service role bypasses RLS automatically; no permissive policy needed.
DROP POLICY IF EXISTS "Users can read their own usage" ON public.chat_usage;
CREATE POLICY "Users can read their own usage"
  ON public.chat_usage FOR SELECT
  USING (auth.uid() = user_id);

-- 7. Chat Feedback Policies
DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.chat_feedback;
CREATE POLICY "Authenticated users can submit feedback"
  ON public.chat_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own feedback" ON public.chat_feedback;
CREATE POLICY "Users can view their own feedback"
  ON public.chat_feedback FOR SELECT
  USING (auth.uid() = user_id);

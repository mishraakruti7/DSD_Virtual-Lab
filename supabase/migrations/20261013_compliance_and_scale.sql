-- ==============================================================================
-- Migration: 20261013_compliance_and_scale.sql
-- India DPDP Act 2023 / Rules 2025 Institutional Compliance & Scaling for 1000+ Users
-- ==============================================================================
-- Includes:
-- 1. consent_records table (audit-proof consent tracking)
-- 2. audit_log table (tamper-evident administrative action logging)
-- 3. Composite performance indexes for high-throughput concurrency
-- 4. Fast student_progress_summary Materialized View
-- 5. Optimized Row Level Security (RLS) policies using (select auth.uid())
-- ==============================================================================

-- 1. Table: consent_records
-- Tracks explicit, unbundled user consent under India DPDP Act 2023 & Rules 2025.
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('general_privacy', 'tutor_chat_storage', 'age_verification', 'data_export')),
  consented BOOLEAN NOT NULL DEFAULT TRUE,
  consented_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  policy_version TEXT NOT NULL DEFAULT 'v1.0.0',
  ip_hash TEXT,
  user_agent_hash TEXT
);

-- 2. Table: audit_log
-- Audit log recording administrative data access, role promotions, and unmask events.
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Performance Composite Indexes for Scaling (1000+ Students)
CREATE INDEX IF NOT EXISTS idx_progress_user_topic ON public.progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_saved_circuits_user_updated ON public.saved_circuits(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_taken ON public.quiz_attempts(user_id, taken_at DESC);
CREATE INDEX IF NOT EXISTS idx_consent_records_user_type ON public.consent_records(user_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_created ON public.audit_log(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON public.profiles(role, is_active);

-- 4. Materialized View for Instant Faculty Reports without N+1 Table Scans
CREATE MATERIALIZED VIEW IF NOT EXISTS public.student_progress_summary AS
SELECT
  p.id AS student_id,
  p.display_name,
  p.institution,
  p.department,
  COUNT(DISTINCT pr.id) FILTER (WHERE pr.completed = TRUE AND pr.topic_id LIKE 'lab-%') AS completed_labs_count,
  COUNT(DISTINCT qa.id) AS total_quizzes_taken,
  COALESCE(ROUND(AVG(qa.score)::numeric, 1), 0.0) AS average_quiz_score,
  COUNT(DISTINCT sc.id) AS saved_circuits_count,
  GREATEST(MAX(pr.updated_at), MAX(qa.taken_at), MAX(sc.updated_at), p.updated_at) AS last_active_at
FROM public.profiles p
LEFT JOIN public.progress pr ON pr.user_id = p.id
LEFT JOIN public.quiz_attempts qa ON qa.user_id = p.id
LEFT JOIN public.saved_circuits sc ON sc.user_id = p.id
WHERE p.role = 'student'
GROUP BY p.id, p.display_name, p.institution, p.department, p.updated_at;

-- Create Unique Index on Materialized View to support CONCURRENT refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_progress_summary_id ON public.student_progress_summary(student_id);

-- Function to Refresh Materialized View
CREATE OR REPLACE FUNCTION public.refresh_student_progress_summary()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.student_progress_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable Row Level Security (RLS) on new tables
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 6. Optimized RLS Policies (using (select auth.uid()) to avoid per-row function evaluation)

-- consent_records: Users can view & manage their own consent; faculty/admins can audit
DROP POLICY IF EXISTS "Users can view their own consent records" ON public.consent_records;
CREATE POLICY "Users can view their own consent records"
  ON public.consent_records FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own consent records" ON public.consent_records;
CREATE POLICY "Users can insert their own consent records"
  ON public.consent_records FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Faculty and admins can view all consent records" ON public.consent_records;
CREATE POLICY "Faculty and admins can view all consent records"
  ON public.consent_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('faculty', 'admin')
    )
  );

-- audit_log: Only faculty and admins can read audit logs; anyone authenticated can append
DROP POLICY IF EXISTS "Faculty and admins can view audit logs" ON public.audit_log;
CREATE POLICY "Faculty and admins can view audit logs"
  ON public.audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('faculty', 'admin')
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create audit log entries" ON public.audit_log;
CREATE POLICY "Authenticated users can create audit log entries"
  ON public.audit_log FOR INSERT
  WITH CHECK (actor_id = (SELECT auth.uid()));

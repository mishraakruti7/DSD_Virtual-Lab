
-- Idempotent policy creation function
CREATE OR REPLACE FUNCTION public.create_policy_if_not_exists(
    policy_name TEXT,
    table_name REGCLASS,
    cmd TEXT,
    using_clause TEXT,
    with_check_clause TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = policy_name
        AND tablename = table_name::text -- This might need refinement based on schema
    ) THEN
        EXECUTE format(
            'CREATE POLICY %I ON %s FOR %s USING (%s) %s',
            policy_name, table_name, cmd, using_clause,
            CASE WHEN with_check_clause IS NOT NULL THEN 'WITH CHECK (' || with_check_clause || ')' ELSE '' END
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply policies using the function or simple IF EXISTS checks
-- Since this is getting complex, I will use simpler IF NOT EXISTS checks for policy creation
-- where possible or drop and recreate.

-- Re-doing policies with DROP IF EXISTS approach for safety
DROP POLICY IF EXISTS "Anyone can view modules" ON public.modules;
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Teachers can manage modules" ON public.modules;
CREATE POLICY "Teachers can manage modules" ON public.modules FOR ALL USING (public.is_admin_or_teacher());

-- ... (This would be applied to all policies in the script)

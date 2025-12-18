-- RLS durumunu kontrol et
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
    AND tablename IN ('users', 'students', 'assignments', 'daily_logs', 'trial_exams', 'subject_results', 'books')
ORDER BY 
    tablename;

-- Aktif politikaları kontrol et
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- HALİLHOCA - RLS'i Devre Dışı Bırakma
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- Tüm tablolarda RLS'i devre dışı bırak
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE trial_exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE subject_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;

-- Mevcut politikaları kaldır (opsiyonel, ama temiz olması için)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Students can view their own profile" ON students;
DROP POLICY IF EXISTS "Coaches can view their students" ON students;
DROP POLICY IF EXISTS "Coaches can insert students" ON students;
DROP POLICY IF EXISTS "Coaches can update their students" ON students;
DROP POLICY IF EXISTS "Coaches can delete their students" ON students;
DROP POLICY IF EXISTS "Students can view their assignments" ON assignments;
DROP POLICY IF EXISTS "Coaches can view their students' assignments" ON assignments;
DROP POLICY IF EXISTS "Coaches can create assignments" ON assignments;
DROP POLICY IF EXISTS "Coaches can update assignments" ON assignments;
DROP POLICY IF EXISTS "Students can update their own assignments" ON assignments;
DROP POLICY IF EXISTS "Coaches can delete assignments" ON assignments;
DROP POLICY IF EXISTS "Students can view their logs" ON daily_logs;
DROP POLICY IF EXISTS "Coaches can view their students' logs" ON daily_logs;
DROP POLICY IF EXISTS "Students can create their own logs" ON daily_logs;
DROP POLICY IF EXISTS "Students can delete their own logs" ON daily_logs;
DROP POLICY IF EXISTS "Students can view their exams" ON trial_exams;
DROP POLICY IF EXISTS "Coaches can view their students' exams" ON trial_exams;
DROP POLICY IF EXISTS "Students can create their own exams" ON trial_exams;
DROP POLICY IF EXISTS "Coaches can create exams for students" ON trial_exams;
DROP POLICY IF EXISTS "Students can delete their own exams" ON trial_exams;
DROP POLICY IF EXISTS "Subject results follow trial exam access" ON subject_results;
DROP POLICY IF EXISTS "Students can view their books" ON books;
DROP POLICY IF EXISTS "Coaches can view their students' books" ON books;
DROP POLICY IF EXISTS "Coaches can create books for students" ON books;
DROP POLICY IF EXISTS "Coaches can delete books" ON books;

-- Başarı mesajı
SELECT 'RLS successfully disabled on all tables' AS status;

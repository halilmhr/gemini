-- Tüm mevcut politikaları kaldır
-- Assignments
DROP POLICY IF EXISTS "Coaches can create assignments" ON assignments;
DROP POLICY IF EXISTS "Coaches can delete assignments" ON assignments;
DROP POLICY IF EXISTS "Coaches can update assignments" ON assignments;
DROP POLICY IF EXISTS "Coaches can view their students' assignments" ON assignments;
DROP POLICY IF EXISTS "Students can update their own assignments" ON assignments;
DROP POLICY IF EXISTS "Students can view their assignments" ON assignments;

-- Books
DROP POLICY IF EXISTS "Coaches can create books for students" ON books;
DROP POLICY IF EXISTS "Coaches can delete books" ON books;
DROP POLICY IF EXISTS "Coaches can view their students' books" ON books;
DROP POLICY IF EXISTS "Students can view their books" ON books;

-- Daily Logs
DROP POLICY IF EXISTS "Coaches can view their students' logs" ON daily_logs;
DROP POLICY IF EXISTS "Students can create their own logs" ON daily_logs;
DROP POLICY IF EXISTS "Students can delete their own logs" ON daily_logs;
DROP POLICY IF EXISTS "Students can view their logs" ON daily_logs;

-- Students
DROP POLICY IF EXISTS "Coaches can delete their students" ON students;
DROP POLICY IF EXISTS "Coaches can insert students" ON students;
DROP POLICY IF EXISTS "Coaches can update their students" ON students;
DROP POLICY IF EXISTS "Coaches can view their students" ON students;
DROP POLICY IF EXISTS "Students can view their own profile" ON students;

-- Subject Results
DROP POLICY IF EXISTS "Delete subject results with trial exam" ON subject_results;
DROP POLICY IF EXISTS "Insert subject results with trial exam" ON subject_results;
DROP POLICY IF EXISTS "View subject results with trial exam access" ON subject_results;

-- Trial Exams
DROP POLICY IF EXISTS "Coaches can view their students' exams" ON trial_exams;
DROP POLICY IF EXISTS "Students can create their own exams" ON trial_exams;
DROP POLICY IF EXISTS "Students can delete their own exams" ON trial_exams;
DROP POLICY IF EXISTS "Students can update their own exams" ON trial_exams;
DROP POLICY IF EXISTS "Students can view their exams" ON trial_exams;

-- Users
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;

-- Şimdi basit anonim erişim politikaları ekle (herkes her şeyi yapabilir)
CREATE POLICY "Allow all access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON daily_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON trial_exams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON subject_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON books FOR ALL USING (true) WITH CHECK (true);

-- Başarı mesajı
SELECT 'All restrictive policies removed and anonymous access enabled' AS status;

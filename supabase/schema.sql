-- HALİLHOCA - Supabase Database Schema
-- This schema supports a student coaching platform with assignments, daily logs, trial exams, and topic tracking

-- Enable UUID extension for auto-generating IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (both coaches and students)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('coach', 'student')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table (extended profile for students)
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL,
  field TEXT,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  completed_topics TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily logs table (question solving logs)
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  subject TEXT NOT NULL,
  questions_solved INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trial exams table
CREATE TABLE trial_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('TYT', 'AYT')),
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_incorrect INTEGER NOT NULL DEFAULT 0,
  total_blank INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subject results for trial exams (related to trial_exams)
CREATE TABLE subject_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trial_exam_id UUID NOT NULL REFERENCES trial_exams(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  correct INTEGER NOT NULL DEFAULT 0,
  incorrect INTEGER NOT NULL DEFAULT 0,
  blank INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================

CREATE INDEX idx_students_coach_id ON students(coach_id);
CREATE INDEX idx_assignments_student_id ON assignments(student_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_daily_logs_student_id ON daily_logs(student_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(date);
CREATE INDEX idx_trial_exams_student_id ON trial_exams(student_id);
CREATE INDEX idx_trial_exams_date ON trial_exams(date);
CREATE INDEX idx_subject_results_trial_exam_id ON subject_results(trial_exam_id);
CREATE INDEX idx_books_student_id ON books(student_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Students can view their own profile" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Coaches can view their students" ON students
  FOR SELECT USING (
    coach_id = auth.uid()
  );

CREATE POLICY "Coaches can insert students" ON students
  FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update their students" ON students
  FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "Coaches can delete their students" ON students
  FOR DELETE USING (coach_id = auth.uid());

-- Assignments policies
CREATE POLICY "Students can view their assignments" ON assignments
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Coaches can view their students' assignments" ON assignments
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

CREATE POLICY "Coaches can create assignments" ON assignments
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

CREATE POLICY "Coaches can update assignments" ON assignments
  FOR UPDATE USING (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

CREATE POLICY "Students can update their own assignments" ON assignments
  FOR UPDATE USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Coaches can delete assignments" ON assignments
  FOR DELETE USING (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

-- Daily logs policies
CREATE POLICY "Students can view their logs" ON daily_logs
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Coaches can view their students' logs" ON daily_logs
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

CREATE POLICY "Students can create their own logs" ON daily_logs
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Students can delete their own logs" ON daily_logs
  FOR DELETE USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

-- Trial exams policies
CREATE POLICY "Students can view their exams" ON trial_exams
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Coaches can view their students' exams" ON trial_exams
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

CREATE POLICY "Students can create their own exams" ON trial_exams
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Students can update their own exams" ON trial_exams
  FOR UPDATE USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Students can delete their own exams" ON trial_exams
  FOR DELETE USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

-- Subject results policies
CREATE POLICY "View subject results with trial exam access" ON subject_results
  FOR SELECT USING (
    trial_exam_id IN (
      SELECT id FROM trial_exams WHERE 
        student_id = auth.uid() OR 
        student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
    )
  );

CREATE POLICY "Insert subject results with trial exam" ON subject_results
  FOR INSERT WITH CHECK (
    trial_exam_id IN (
      SELECT id FROM trial_exams WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Delete subject results with trial exam" ON subject_results
  FOR DELETE USING (
    trial_exam_id IN (
      SELECT id FROM trial_exams WHERE student_id = auth.uid()
    )
  );

-- Books policies
CREATE POLICY "Students can view their books" ON books
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE id = auth.uid())
  );

CREATE POLICY "Coaches can view their students' books" ON books
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

CREATE POLICY "Coaches can create books for students" ON books
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

CREATE POLICY "Coaches can delete books" ON books
  FOR DELETE USING (
    student_id IN (SELECT id FROM students WHERE coach_id = auth.uid())
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trial_exams_updated_at BEFORE UPDATE ON trial_exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (optional - for testing)
-- =====================================================

-- Insert sample coach (password is 'sifre' - in production use proper hashing)
-- Note: You'll need to handle password hashing in your application
INSERT INTO users (id, email, password_hash, role, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'koc@example.com', 'hashed_sifre', 'coach', 'Koç Yönetici');

-- Insert sample student user
INSERT INTO users (id, email, password_hash, role, name) VALUES
  ('00000000-0000-0000-0000-000000000002', 'ogrenci@example.com', 'hashed_sifre', 'student', 'Örnek Öğrenci');

-- Insert sample student profile
INSERT INTO students (id, coach_id, exam_type, field, subjects, completed_topics) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'TYT & AYT', 'Sayısal', 
   ARRAY['Türkçe', 'Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji'],
   ARRAY['Matematik-Temel Kavramlar', 'Türkçe-Sözcükte Anlam']);

-- Note: For production, remove sample data and use Supabase Auth for user management

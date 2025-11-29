import { useState, useEffect, useCallback } from 'react';
import type { User, Student, UserRole, DailyLog, TrialExam, Assignment, Book } from '../types';
import { getSubjectsForStudent, EXAM_TYPES, AYT_FIELDS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Simple pseudo-hash for development (in production, use Supabase Auth)
const pseudoHash = (password: string) => `hashed_${password}`;

const useAppDataWithSupabase = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useSupabase] = useState(isSupabaseConfigured());

  // =====================================================
  // INITIALIZATION & DATA LOADING
  // =====================================================
  
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (useSupabase) {
          await loadDataFromSupabase();
        } else {
          loadDataFromLocalStorage();
        }
      } catch (error) {
        console.error("Failed to load data", error);
        // Fallback to localStorage if Supabase fails
        if (useSupabase) {
          console.warn("Falling back to localStorage due to Supabase error");
          loadDataFromLocalStorage();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [useSupabase]);

  const loadDataFromLocalStorage = () => {
    const storedUsers = localStorage.getItem('app_users');
    const storedStudents = localStorage.getItem('app_students');
    
    let initialUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    let initialStudents: Student[] = storedStudents ? JSON.parse(storedStudents) : [];

    if (initialUsers.length === 0) {
      // Create default data
      const coachId = `coach_${Date.now()}`;
      const defaultCoach: User = {
        id: coachId,
        name: 'Koç Yönetici',
        email: 'koc@example.com',
        passwordHash: pseudoHash('sifre'),
        role: 'coach',
      };
      initialUsers.push(defaultCoach);

      const studentId = `student_${Date.now() + 1}`;
      const defaultStudentUser: User = {
        id: studentId,
        name: 'Örnek Öğrenci',
        email: 'ogrenci@example.com',
        passwordHash: pseudoHash('sifre'),
        role: 'student'
      };
      initialUsers.push(defaultStudentUser);

      const defaultStudent: Student = {
        id: studentId,
        name: 'Örnek Öğrenci',
        coachId: coachId,
        examType: EXAM_TYPES.TYT_AYT,
        field: AYT_FIELDS.SAYISAL,
        subjects: getSubjectsForStudent(EXAM_TYPES.TYT_AYT, AYT_FIELDS.SAYISAL),
        assignments: [{
          id: `assign_default_1`,
          title: 'Haftalık TYT Matematik Testi',
          description: 'Temel kavramlar konusundan 100 soru çözülecek.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isCompleted: false,
        }],
        dailyLogs: [{
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subject: 'Matematik',
          questionsSolved: 50,
        }],
        trialExams: [{
          id: `trial_default_1`,
          name: 'TYT Deneme 1',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalCorrect: 80,
          totalIncorrect: 15,
          totalBlank: 5,
          subjectResults: [
            {subject: 'Türkçe', correct: 30, incorrect: 5, blank: 5},
            {subject: 'Matematik', correct: 25, incorrect: 5, blank: 0},
            {subject: 'Fizik', correct: 15, incorrect: 2, blank: 3},
            {subject: 'Kimya', correct: 10, incorrect: 3, blank: 2},
          ]
        }],
        completedTopics: ['Matematik-Temel Kavramlar', 'Türkçe-Sözcükte Anlam'],
        books: [{id: `book_default_1`, name: '3D TYT Matematik Soru Bankası'}]
      };
      initialStudents.push(defaultStudent);
    }
    
    setUsers(initialUsers);
    setStudents(initialStudents);
  };

  const loadDataFromSupabase = async () => {
    console.log('🔄 Loading data from Supabase...');
    
    // Load all users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*');

    console.log('👥 Users from Supabase:', usersData);
    if (usersError) {
      console.error('❌ Error loading users:', usersError);
      throw usersError;
    }

    const loadedUsers: User[] = (usersData || []).map(u => ({
      id: u.id,
      email: u.email,
      passwordHash: u.password_hash,
      role: u.role as UserRole,
      name: u.name,
    }));

    // Load all students with their related data
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select(`
        *,
        assignments(*),
        daily_logs(*),
        trial_exams(*, subject_results(*)),
        books(*)
      `);

    if (studentsError) throw studentsError;

    const loadedStudents: Student[] = (studentsData || []).map((s: any) => ({
      id: s.id,
      coachId: s.coach_id,
      name: loadedUsers.find(u => u.id === s.id)?.name || '',
      examType: s.exam_type,
      field: s.field,
      subjects: s.subjects || [],
      completedTopics: s.completed_topics || [],
      assignments: (s.assignments || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description || '',
        dueDate: a.due_date,
        isCompleted: a.is_completed,
      })),
      dailyLogs: (s.daily_logs || []).map((dl: any) => ({
        date: dl.date,
        subject: dl.subject,
        questionsSolved: dl.questions_solved,
      })),
      trialExams: (s.trial_exams || []).map((te: any) => ({
        id: te.id,
        name: te.name,
        date: te.date,
        type: te.type,
        totalCorrect: te.total_correct,
        totalIncorrect: te.total_incorrect,
        totalBlank: te.total_blank,
        subjectResults: (te.subject_results || []).map((sr: any) => ({
          subject: sr.subject,
          correct: sr.correct,
          incorrect: sr.incorrect,
          blank: sr.blank,
        })),
      })),
      books: (s.books || []).map((b: any) => ({
        id: b.id,
        name: b.name,
      })),
    }));

    setUsers(loadedUsers);
    setStudents(loadedStudents);
  };

  // =====================================================
  // PERSISTENCE
  // =====================================================
  
  useEffect(() => {
    if (!isLoading && !useSupabase) {
      localStorage.setItem('app_users', JSON.stringify(users));
      localStorage.setItem('app_students', JSON.stringify(students));
    }
  }, [users, students, isLoading, useSupabase]);

  // =====================================================
  // AUTH FUNCTIONS
  // =====================================================

  const login = useCallback((email: string, password: string): User | null => {
    console.log('🔐 Login attempt:', email);
    console.log('📊 Total users in state:', users.length);
    console.log('👥 Users:', users);
    console.log('🔑 Looking for password hash:', pseudoHash(password));
    
    const user = users.find(u => {
      console.log(`  Checking: ${u.email} | ${u.passwordHash} === ${pseudoHash(password)}?`, u.email === email && u.passwordHash === pseudoHash(password));
      return u.email === email && u.passwordHash === pseudoHash(password);
    });
    
    if (user) {
      console.log('✅ Login successful!', user);
      setCurrentUser(user);
      return user;
    }
    console.log('❌ Login failed - user not found');
    return null;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // =====================================================
  // STUDENT MANAGEMENT
  // =====================================================

  const addStudent = useCallback(async (
    studentData: Omit<Student, 'id' | 'assignments' | 'dailyLogs' | 'trialExams' | 'completedTopics' | 'books'>,
    userData: {email: string, password: string}
  ) => {
    if (useSupabase) {
      // Insert into Supabase
      const studentId = crypto.randomUUID();
      
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: studentId,
          email: userData.email,
          password_hash: pseudoHash(userData.password),
          role: 'student',
          name: studentData.name,
        });

      if (userError) {
        console.error('Error creating user:', userError);
        return;
      }

      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: studentId,
          coach_id: studentData.coachId,
          exam_type: studentData.examType,
          field: studentData.field,
          subjects: studentData.subjects,
          completed_topics: [],
        });

      if (studentError) {
        console.error('Error creating student:', studentError);
        return;
      }

      // Reload data
      await loadDataFromSupabase();
    } else {
      // Local storage fallback
      const studentId = `student_${Date.now()}`;
      const newStudentUser: User = {
        id: studentId,
        name: studentData.name,
        email: userData.email,
        passwordHash: pseudoHash(userData.password),
        role: 'student'
      };
      const newStudent: Student = {
        ...studentData,
        id: studentId,
        assignments: [],
        dailyLogs: [],
        trialExams: [],
        completedTopics: [],
        books: []
      };
      setUsers(prev => [...prev, newStudentUser]);
      setStudents(prev => [...prev, newStudent]);
    }
  }, [useSupabase]);

  const updateStudent = useCallback(async (updatedStudent: Student) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('students')
        .update({
          exam_type: updatedStudent.examType,
          field: updatedStudent.field,
          subjects: updatedStudent.subjects,
          completed_topics: updatedStudent.completedTopics,
        })
        .eq('id', updatedStudent.id);

      if (error) {
        console.error('Error updating student:', error);
        return;
      }

      // Update user name
      await supabase
        .from('users')
        .update({ name: updatedStudent.name })
        .eq('id', updatedStudent.id);

      await loadDataFromSupabase();
    } else {
      setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      setUsers(prev => prev.map(u => u.id === updatedStudent.id ? { ...u, name: updatedStudent.name } : u));
    }
  }, [useSupabase]);

  const deleteStudent = useCallback(async (studentId: string) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.error('Error deleting student:', error);
        return;
      }

      await loadDataFromSupabase();
    } else {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      setUsers(prev => prev.filter(u => u.id !== studentId));
    }
  }, [useSupabase]);

  // =====================================================
  // ASSIGNMENT MANAGEMENT
  // =====================================================

  const addAssignment = useCallback(async (studentId: string, assignmentData: Omit<Assignment, 'id' | 'isCompleted'>) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('assignments')
        .insert({
          student_id: studentId,
          title: assignmentData.title,
          description: assignmentData.description,
          due_date: assignmentData.dueDate,
          is_completed: false,
        });

      if (error) {
        console.error('Error adding assignment:', error);
        return;
      }

      await loadDataFromSupabase();
    } else {
      const newAssignment: Assignment = {
        ...assignmentData,
        id: `assign_${Date.now()}`,
        isCompleted: false,
      };
      setStudents(prev => prev.map(s => s.id === studentId ? {...s, assignments: [...s.assignments, newAssignment]} : s));
    }
  }, [useSupabase]);

  const updateAssignment = useCallback(async (studentId: string, updatedAssignment: Assignment) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('assignments')
        .update({
          title: updatedAssignment.title,
          description: updatedAssignment.description,
          due_date: updatedAssignment.dueDate,
          is_completed: updatedAssignment.isCompleted,
        })
        .eq('id', updatedAssignment.id);

      if (error) {
        console.error('Error updating assignment:', error);
        return;
      }

      await loadDataFromSupabase();
    } else {
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            assignments: s.assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a)
          };
        }
        return s;
      }));
    }
  }, [useSupabase]);

  const deleteAssignment = useCallback(async (studentId: string, assignmentId: string) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        console.error('Error deleting assignment:', error);
        return;
      }

      await loadDataFromSupabase();
    } else {
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            assignments: s.assignments.filter(a => a.id !== assignmentId)
          }
        }
        return s;
      }));
    }
  }, [useSupabase]);

  const toggleAssignmentCompletion = useCallback(async (studentId: string, assignmentId: string) => {
    // Optimistic UI update - hemen UI'ı güncelle
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          assignments: s.assignments.map(a => a.id === assignmentId ? {...a, isCompleted: !a.isCompleted} : a)
        }
      }
      return s;
    }));

    if (useSupabase) {
      // Arka planda Supabase'i güncelle
      const student = students.find(s => s.id === studentId);
      const assignment = student?.assignments.find(a => a.id === assignmentId);
      
      if (!assignment) return;

      const { error } = await supabase
        .from('assignments')
        .update({ is_completed: !assignment.isCompleted })
        .eq('id', assignmentId);

      if (error) {
        console.error('Error toggling assignment:', error);
        // Hata durumunda geri al
        setStudents(prev => prev.map(s => {
          if (s.id === studentId) {
            return {
              ...s,
              assignments: s.assignments.map(a => a.id === assignmentId ? {...a, isCompleted: assignment.isCompleted} : a)
            }
          }
          return s;
        }));
      }
    }
  }, [useSupabase, students]);

  // =====================================================
  // BOOK MANAGEMENT
  // =====================================================

  const addBook = useCallback(async (studentId: string, bookName: string) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('books')
        .insert({
          student_id: studentId,
          name: bookName,
        });

      if (error) {
        console.error('Error adding book:', error);
        return;
      }

      await loadDataFromSupabase();
    } else {
      const newBook: Book = {
        id: `book_${Date.now()}`,
        name: bookName,
      };
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const books = s.books || [];
          return {...s, books: [...books, newBook]};
        }
        return s;
      }));
    }
  }, [useSupabase]);

  const deleteBook = useCallback(async (studentId: string, bookId: string) => {
    if (useSupabase) {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) {
        console.error('Error deleting book:', error);
        return;
      }

      await loadDataFromSupabase();
    } else {
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return {...s, books: (s.books || []).filter(b => b.id !== bookId)};
        }
        return s;
      }));
    }
  }, [useSupabase]);

  // =====================================================
  // DAILY LOGS
  // =====================================================

  const addDailyLog = useCallback(async (studentId: string, logsData: { subject: string; questionsSolved: number }[]) => {
    const date = new Date().toISOString().split('T')[0];
    const validLogs = logsData.filter(log => log.questionsSolved > 0);

    if (validLogs.length === 0) return;

    if (useSupabase) {
      const { error } = await supabase
        .from('daily_logs')
        .insert(
          validLogs.map(log => ({
            student_id: studentId,
            date: date,
            subject: log.subject,
            questions_solved: log.questionsSolved,
          }))
        );

      if (error) {
        console.error('Error adding daily logs:', error);
        return;
      }

      await loadDataFromSupabase();
    } else {
      const newLogs: DailyLog[] = validLogs.map(logData => ({
        ...logData,
        date: date
      }));

      setStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, dailyLogs: [...s.dailyLogs, ...newLogs] } : s
      ));
    }
  }, [useSupabase]);

  // =====================================================
  // TRIAL EXAMS
  // =====================================================

  const addTrialExam = useCallback(async (studentId: string, examData: Omit<TrialExam, 'id' | 'date'>) => {
    const date = new Date().toISOString().split('T')[0];

    if (useSupabase) {
      const examId = crypto.randomUUID();

      const { error: examError } = await supabase
        .from('trial_exams')
        .insert({
          id: examId,
          student_id: studentId,
          name: examData.name,
          date: date,
          type: examData.type,
          total_correct: examData.totalCorrect,
          total_incorrect: examData.totalIncorrect,
          total_blank: examData.totalBlank,
        });

      if (examError) {
        console.error('Error adding trial exam:', examError);
        return;
      }

      // Add subject results
      if (examData.subjectResults.length > 0) {
        const { error: resultsError } = await supabase
          .from('subject_results')
          .insert(
            examData.subjectResults.map(sr => ({
              trial_exam_id: examId,
              subject: sr.subject,
              correct: sr.correct,
              incorrect: sr.incorrect,
              blank: sr.blank || 0,
            }))
          );

        if (resultsError) {
          console.error('Error adding subject results:', resultsError);
        }
      }

      await loadDataFromSupabase();
    } else {
      const newExam: TrialExam = {
        ...examData,
        id: `trial_${Date.now()}`,
        date: date
      };
      setStudents(prev => prev.map(s => s.id === studentId ? {...s, trialExams: [...s.trialExams, newExam]} : s));
    }
  }, [useSupabase]);

  // =====================================================
  // TOPIC COMPLETION
  // =====================================================

  const toggleTopicCompletion = useCallback(async (studentId: string, topicKey: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const completed = student.completedTopics.includes(topicKey);
    const newCompletedTopics = completed 
      ? student.completedTopics.filter(t => t !== topicKey)
      : [...student.completedTopics, topicKey];

    // Optimistic UI update - hemen UI'ı güncelle
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {...s, completedTopics: newCompletedTopics};
      }
      return s;
    }));

    if (useSupabase) {
      // Arka planda Supabase'i güncelle
      const { error } = await supabase
        .from('students')
        .update({ completed_topics: newCompletedTopics })
        .eq('id', studentId);

      if (error) {
        console.error('Error toggling topic:', error);
        // Hata durumunda geri al
        setStudents(prev => prev.map(s => {
          if (s.id === studentId) {
            return {...s, completedTopics: student.completedTopics};
          }
          return s;
        }));
      }
    }
  }, [useSupabase, students]);

  return {
    users,
    students,
    currentUser,
    isLoading,
    login,
    logout,
    addStudent,
    updateStudent,
    deleteStudent,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentCompletion,
    addBook,
    deleteBook,
    addDailyLog,
    addTrialExam,
    toggleTopicCompletion,
  };
};

export default useAppDataWithSupabase;

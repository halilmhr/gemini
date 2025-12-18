import { useState, useEffect, useCallback } from 'react';
import type { User, Student, UserRole, DailyLog, TrialExam, Assignment, Book } from '../types';
import { getSubjectsForStudent, EXAM_TYPES, AYT_FIELDS } from '../constants';

// In a real app, this would be a proper hash. For this example, it's just a simple pseudo-hash.
const pseudoHash = (password: string) => `hashed_${password}`;

const useAppData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('app_users');
      const storedStudents = localStorage.getItem('app_students');
      
      let initialUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      let initialStudents: Student[] = storedStudents ? JSON.parse(storedStudents) : [];

      if (initialUsers.length === 0) {
        // Create a default coach if none exist
        const coachId = `coach_${Date.now()}`;
        const defaultCoach: User = {
          id: coachId,
          name: 'Koç Yönetici',
          email: 'koc@example.com',
          passwordHash: pseudoHash('sifre'),
          role: 'coach',
        };
        initialUsers.push(defaultCoach);

        // Create a default student linked to the coach
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

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Persist state changes to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('app_users', JSON.stringify(users));
      localStorage.setItem('app_students', JSON.stringify(students));
    }
  }, [users, students, isLoading]);

  const login = useCallback((email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.passwordHash === pseudoHash(password));
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addStudent = useCallback((studentData: Omit<Student, 'id' | 'assignments' | 'dailyLogs' | 'trialExams' | 'completedTopics' | 'books'>, userData: {email: string, password: string}) => {
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
  }, []);
  
  const updateStudent = useCallback((updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    // Also update the name in the users list
    setUsers(prev => prev.map(u => u.id === updatedStudent.id ? { ...u, name: updatedStudent.name } : u));
  }, []);
  
  const deleteStudent = useCallback((studentId: string) => {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      setUsers(prev => prev.filter(u => u.id !== studentId));
  }, []);

  const addAssignment = useCallback((studentId: string, assignmentData: Omit<Assignment, 'id' | 'isCompleted'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign_${Date.now()}`,
      isCompleted: false,
    };
    setStudents(prev => prev.map(s => s.id === studentId ? {...s, assignments: [...s.assignments, newAssignment]} : s));
  }, []);

  const updateAssignment = useCallback((studentId: string, updatedAssignment: Assignment) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          assignments: s.assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a)
        };
      }
      return s;
    }));
  }, []);

  const deleteAssignment = useCallback((studentId: string, assignmentId: string) => {
    setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
            return {
                ...s,
                assignments: s.assignments.filter(a => a.id !== assignmentId)
            }
        }
        return s;
    }));
  }, []);

  const toggleAssignmentCompletion = useCallback((studentId: string, assignmentId: string) => {
      setStudents(prev => prev.map(s => {
          if (s.id === studentId) {
              return {
                  ...s,
                  assignments: s.assignments.map(a => a.id === assignmentId ? {...a, isCompleted: !a.isCompleted} : a)
              }
          }
          return s;
      }));
  }, []);

  const addBook = useCallback((studentId: string, bookName: string) => {
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
  }, []);

  const deleteBook = useCallback((studentId: string, bookId: string) => {
      setStudents(prev => prev.map(s => {
          if (s.id === studentId) {
              return {...s, books: (s.books || []).filter(b => b.id !== bookId)};
          }
          return s;
      }))
  }, []);
  
  const addDailyLog = useCallback((studentId: string, logsData: { subject: string; questionsSolved: number }[]) => {
      const date = new Date().toISOString().split('T')[0];
      const newLogs: DailyLog[] = logsData
          .filter(log => log.questionsSolved > 0)
          .map(logData => ({
              ...logData,
              date: date
          }));

      if (newLogs.length > 0) {
          setStudents(prev => prev.map(s =>
              s.id === studentId ? { ...s, dailyLogs: [...s.dailyLogs, ...newLogs] } : s
          ));
      }
  }, []);

  const addTrialExam = useCallback((studentId: string, examData: Omit<TrialExam, 'id' | 'date'>) => {
      const newExam: TrialExam = {
          ...examData,
          id: `trial_${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
      };
      setStudents(prev => prev.map(s => s.id === studentId ? {...s, trialExams: [...s.trialExams, newExam]} : s));
  }, []);

  const toggleTopicCompletion = useCallback((studentId: string, topicKey: string) => {
      setStudents(prev => prev.map(s => {
          if (s.id === studentId) {
              const completed = s.completedTopics.includes(topicKey);
              const newCompletedTopics = completed 
                  ? s.completedTopics.filter(t => t !== topicKey)
                  : [...s.completedTopics, topicKey];
              return {...s, completedTopics: newCompletedTopics};
          }
          return s;
      }));
  }, []);


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
    toggleTopicCompletion
  };
};

export default useAppData;
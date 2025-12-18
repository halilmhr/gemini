
export type UserRole = 'coach' | 'student';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, never store plain text passwords
  role: UserRole;
  name: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  subject: string;
  questionsSolved: number;
}

export interface SubjectResult {
  subject: string;
  correct: number;
  incorrect: number;
  blank?: number;
}

export interface TrialExam {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type?: 'TYT' | 'AYT';
  totalCorrect: number;
  totalIncorrect: number;
  totalBlank: number;
  subjectResults: SubjectResult[];
}

export interface Book {
  id: string;
  name: string;
}

export interface Student {
  id: string; // This will be the same as their user ID
  coachId: string;
  name: string;
  examType: string;
  field?: string;
  grade?: number; // 5-12 arası sınıf seviyesi
  subjects: string[];
  assignments: Assignment[];
  dailyLogs: DailyLog[];
  trialExams: TrialExam[];
  completedTopics: string[];
  books: Book[];
}
export type UserRole = 'coach' | 'student';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
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
  date: string;
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
  date: string;
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
  id: string;
  coachId: string;
  name: string;
  examType: string;
  field?: string;
  subjects: string[];
  assignments: Assignment[];
  dailyLogs: DailyLog[];
  trialExams: TrialExam[];
  completedTopics: string[];
  books: Book[];
}

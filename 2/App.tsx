

import React, { useState, createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import useAppData from './hooks/useAppData';
import type { User, Student, Assignment, TrialExam, SubjectResult, UserRole } from './types';
import { EXAM_TYPES, AYT_FIELDS, SUBJECTS_DATA, getSubjectsForStudent, TYT_SUBJECTS } from './constants';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Brush, PieChart, Pie, Cell } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

// --- ICONS --- //
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.25 18.5l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.25 18.5l-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
    </svg>
);

// --- CONTEXT --- //
type AppContextType = ReturnType<typeof useAppData>;
const AppContext = createContext<AppContextType | null>(null);
const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within an AppProvider");
    return context;
}

// --- SHARED UI COMPONENTS --- //
const Card: React.FC<{ children: React.ReactNode; className?: string; [key: string]: any; }> = ({ children, className, ...rest }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${className}`} {...rest}>{children}</div>
);

const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string; type?: 'button' | 'submit' | 'reset'; variant?: 'primary' | 'secondary'; disabled?: boolean }> = ({ onClick, children, className, type = 'button', variant = 'primary', disabled = false }) => {
    const baseClasses = "font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
    const variantClasses = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white';
    return (
        <button type={type} onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-down" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-600">
                    <h3 className="text-2xl font-bold text-blue-400">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" {...props} />
    </div>
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" {...props} />
    </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
        <select className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" {...props}>
            {children}
        </select>
    </div>
);

// --- AUTHENTICATION FLOW --- //
const RoleSelectionScreen: React.FC<{ onSelectRole: (role: UserRole) => void }> = ({ onSelectRole }) => (
    <div className="min-h-screen flex items-center justify-center bg-dark">
        <Card className="w-full max-w-md text-center">
            <h1 className="text-3xl font-bold text-blue-400 mb-8">Platforma Hoş Geldiniz</h1>
            <p className="text-gray-400 mb-6">Lütfen giriş türünü seçin:</p>
            <div className="flex flex-col gap-4">
                <Button onClick={() => onSelectRole('coach')} className="w-full py-3 text-lg">Koç Girişi</Button>
                <Button onClick={() => onSelectRole('student')} className="w-full py-3 text-lg" variant="secondary">Öğrenci Girişi</Button>
            </div>
        </Card>
    </div>
);

const LoginForm: React.FC<{ role: UserRole; onBack: () => void }> = ({ role, onBack }) => {
    const { login } = useApp();
    const isCoach = role === 'coach';
    const defaultEmail = isCoach ? 'koc@example.com' : 'ogrenci@example.com';
    const defaultPassword = 'sifre';

    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState(defaultPassword);
    const [error, setError] = useState('');

    const title = isCoach ? 'Koç Girişi' : 'Öğrenci Girişi';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = login(email, password);
        if (!user || user.role !== role) {
            setError('Geçersiz e-posta veya şifre.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark">
            <Card className="w-full max-w-md">
                <button onClick={onBack} className="text-blue-400 hover:underline mb-4 text-sm">&larr; Geri</button>
                <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">{title}</h1>
                <form onSubmit={handleSubmit}>
                    <Input label="E-posta" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={defaultEmail} required />
                    <Input label="Şifre" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={defaultPassword} required />
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <Button type="submit" className="w-full">Giriş Yap</Button>
                </form>
                <div className="mt-4 p-3 bg-gray-700 rounded-lg text-center text-sm">
                    <p className="text-gray-300">Varsayılan {isCoach ? 'Koç' : 'Öğrenci'} Girişi:</p>
                    <p className="text-gray-400">E-posta: <span className="font-mono">{defaultEmail}</span></p>
                    <p className="text-gray-400">Şifre: <span className="font-mono">{defaultPassword}</span></p>
                </div>
            </Card>
        </div>
    );
};

// --- REUSABLE CALENDAR COMPONENT --- //
interface CalendarDayData {
    status?: 'completed' | 'pending' | 'overdue';
    intensity?: number;
}
interface CalendarProps {
    dataByDate: Record<string, CalendarDayData>;
    onDateSelect: (date: Date) => void;
    selectedDate: Date;
    currentMonth: Date;
    onMonthChange: (offset: number) => void;
    colorScheme?: 'assignment' | 'question';
}

const Calendar: React.FC<CalendarProps> = ({ dataByDate, onDateSelect, selectedDate, currentMonth, onMonthChange, colorScheme = 'assignment' }) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const todayString = new Date().toISOString().split('T')[0];
    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const calendarDays = [];

    // Day headers
    dayNames.forEach(day => {
        calendarDays.push(<div key={`header-${day}`} className="text-center font-bold text-gray-400 text-sm">{day}</div>);
    });

    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
    for (let i = 0; i < startOffset; i++) {
        calendarDays.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const isToday = todayString === dateString;
        const isSelected = selectedDate.toISOString().split('T')[0] === dateString;
        const dayData = dataByDate[dateString];

        let dayBgClass = 'hover:bg-gray-700';
        let textColorClass = 'text-white';
        let style: React.CSSProperties = {};

        if (colorScheme === 'assignment' && dayData?.status) {
            const statusColors = {
                overdue: 'bg-red-700/80 hover:bg-red-600',
                completed: 'bg-green-700/80 hover:bg-green-600',
                pending: 'bg-yellow-600/80 hover:bg-yellow-500',
            };
            dayBgClass = statusColors[dayData.status];
            if (dayData.status === 'pending') textColorClass = 'text-black';
        } else if (colorScheme === 'question' && dayData?.intensity) {
            dayBgClass = `bg-blue-800 hover:bg-blue-700`;
            style = { opacity: dayData.intensity };
        }
        
        if (isToday && !isSelected) {
             dayBgClass += colorScheme === 'question' ? ' ring-2 ring-blue-500' : ' bg-gray-600';
        }

        if (isSelected) {
            dayBgClass = 'bg-blue-600 scale-110';
            textColorClass = 'text-white';
            style = {}; // Override intensity style for selected date
        }

        calendarDays.push(
            <button
                key={day}
                onClick={() => onDateSelect(date)}
                className={`text-center aspect-square flex items-center justify-center rounded-lg transition-all transform font-semibold ${dayBgClass} ${textColorClass}`}
                style={style}
            >
                <span className={colorScheme === 'question' ? 'relative z-10' : ''}>{day}</span>
            </button>
        );
    }

    return (
        <Card className="max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => onMonthChange(-1)} variant="secondary">&lt;</Button>
                <h3 className="text-xl font-bold text-blue-400">
                    {currentMonth.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                </h3>
                <Button onClick={() => onMonthChange(1)} variant="secondary">&gt;</Button>
            </div>
            <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
        </Card>
    );
}

// --- STUDENT VIEW --- //
const StudentDashboard = () => {
    const { currentUser, students, logout, addDailyLog, addTrialExam, toggleTopicCompletion, toggleAssignmentCompletion } = useApp();
    const studentData = useMemo(() => students.find(s => s.id === currentUser?.id), [students, currentUser]);

    const [activeTab, setActiveTab] = useState('assignments');
    const [isDailyLogOpen, setDailyLogOpen] = useState(false);
    const [isExamLogOpen, setExamLogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [dailyLogs, setDailyLogs] = useState<Record<string, string>>({});
    const [examName, setExamName] = useState('');
    const [trialExamType, setTrialExamType] = useState<'TYT' | 'AYT'>('TYT');
    const [examResults, setExamResults] = useState<SubjectResult[]>([]);

    if (!studentData) return <div className="min-h-screen flex items-center justify-center">Öğrenci verileri yükleniyor...</div>;

    const subjectsForTrialExam = useMemo(() => {
        if (studentData.examType !== EXAM_TYPES.TYT_AYT) return studentData.subjects;

        const tytSubjectKeys = Object.keys(TYT_SUBJECTS);
        const aytSubjectKeys = Object.keys(SUBJECTS_DATA[EXAM_TYPES.TYT_AYT]).filter(s => s.includes('(AYT)') || s === 'Türk Dili ve Edebiyatı' || s === 'Felsefe Grubu');

        const relevantSubjects = trialExamType === 'TYT' ? tytSubjectKeys : aytSubjectKeys;
        return (studentData.subjects || []).filter(s => relevantSubjects.includes(s));
    }, [studentData.examType, studentData.subjects, trialExamType]);

    useEffect(() => {
        if (isExamLogOpen) {
            setExamResults(subjectsForTrialExam.map(subject => ({ subject, correct: 0, incorrect: 0, blank: 0 })));
        }
    }, [isExamLogOpen, subjectsForTrialExam]);

    const assignmentsByDate = useMemo(() => {
        const todayString = new Date().toISOString().split('T')[0];
        return (studentData.assignments || []).reduce((acc: Record<string, { status: 'completed' | 'pending' | 'overdue' }>, assignment) => {
            const date = assignment.dueDate.split('T')[0];
            const isOverdue = !assignment.isCompleted && date < todayString;
            const allCompleted = (studentData.assignments || []).filter(a => a.dueDate === assignment.dueDate).every(a => a.isCompleted);
            
            acc[date] = {
                status: isOverdue ? 'overdue' : (allCompleted ? 'completed' : 'pending')
            };
            return acc;
        }, {});
    }, [studentData.assignments]);

    const assignmentsForSelectedDay = useMemo(() => {
        const dateString = selectedDate.toISOString().split('T')[0];
        return (studentData.assignments || []).filter(a => a.dueDate === dateString);
    }, [selectedDate, studentData.assignments]);

    const handleSubjectResultChange = (index: number, field: keyof Omit<SubjectResult, 'subject'>, value: number) => {
        setExamResults(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const handleDailyLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const logsData = Object.entries(dailyLogs)
            .map(([subject, questionsSolved]) => ({ subject, questionsSolved: parseInt(questionsSolved, 10) || 0 }))
            .filter(log => log.questionsSolved > 0);

        if (logsData.length > 0) {
            addDailyLog(studentData.id, logsData);
            setDailyLogOpen(false);
            setDailyLogs({});
        }
    };

    const handleExamLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalCorrect = examResults.reduce((sum, r) => sum + Number(r.correct), 0);
        const totalIncorrect = examResults.reduce((sum, r) => sum + Number(r.incorrect), 0);
        const totalBlank = examResults.reduce((sum, r) => sum + Number(r.blank || 0), 0);

        addTrialExam(studentData.id, {
            name: examName,
            type: studentData.examType === EXAM_TYPES.TYT_AYT ? trialExamType : undefined,
            totalCorrect, totalIncorrect, totalBlank, subjectResults: examResults,
        });
        setExamLogOpen(false);
        setExamName('');
    };

    const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
        <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === tabName ? 'bg-gray-800 text-blue-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
            {label}
        </button>
    );

    return (
        <div className="p-4 sm:p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white">Hoş Geldin, {studentData.name}</h1>
                    <p className="text-gray-400">Kişisel panelin</p>
                </div>
                <Button onClick={logout} variant="secondary" className="flex items-center gap-2">
                    <LogoutIcon className="h-5 w-5" /> Çıkış Yap
                </Button>
            </header>

            <div className="flex gap-4 mb-6">
                <Button onClick={() => setDailyLogOpen(true)}>Günlük Soru Ekle</Button>
                <Button onClick={() => setExamLogOpen(true)}>Deneme Sınavı Ekle</Button>
            </div>

            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-2">
                    <TabButton tabName="assignments" label="Ödevler" />
                    <TabButton tabName="subjects" label="Konu Takibi" />
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'assignments' && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <Calendar
                                dataByDate={assignmentsByDate}
                                onDateSelect={setSelectedDate}
                                selectedDate={selectedDate}
                                currentMonth={currentMonth}
                                onMonthChange={(offset) => setCurrentMonth(prev => {
                                    const newDate = new Date(prev);
                                    newDate.setDate(1);
                                    newDate.setMonth(newDate.getMonth() + offset);
                                    return newDate;
                                })}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <h3 className="text-lg font-bold text-blue-400 mb-2 border-b border-gray-600 pb-2">
                                    {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h3>
                                <h4 className="font-semibold text-gray-300 mb-2">Günün Ödevleri:</h4>
                                <ul className="space-y-3 max-h-96 overflow-y-auto">
                                    {assignmentsForSelectedDay.length > 0 ? assignmentsForSelectedDay.map(a => (
                                        <li key={a.id} className="bg-gray-700 p-3 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className={`font-semibold ${a.isCompleted ? 'line-through text-gray-500' : ''}`}>{a.title}</p>
                                                    <p className="text-sm text-gray-400">{a.description}</p>
                                                </div>
                                                <button onClick={() => toggleAssignmentCompletion(studentData.id, a.id)} title="Tamamlandı olarak işaretle">
                                                    {a.isCompleted ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-gray-500 hover:text-green-400" />}
                                                </button>
                                            </div>
                                        </li>
                                    )) : <p className="text-gray-400">Bu gün için atanmış ödev yok.</p>}
                                </ul>
                            </Card>
                        </div>
                    </div>
                )}
                {activeTab === 'subjects' && (
                    <Card>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">Ders & Konu İlerlemesi</h2>
                        <div className="space-y-2">
                            {(Object.keys(SUBJECTS_DATA[studentData.examType] || {})).filter(subj => (studentData.subjects || []).includes(subj)).map(subject => (
                                <details key={subject} className="bg-gray-700 rounded-lg">
                                    <summary className="cursor-pointer p-4 font-semibold text-lg text-white list-none flex justify-between items-center">
                                        {subject}
                                        <span>&#9662;</span>
                                    </summary>
                                    <div className="p-4 border-t border-gray-600">
                                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {(SUBJECTS_DATA[studentData.examType][subject] || []).map(topic => {
                                                const topicKey = `${subject}-${topic}`;
                                                const isCompleted = (studentData.completedTopics || []).includes(topicKey);
                                                return (
                                                    <li key={topicKey}>
                                                        <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-600">
                                                            <input type="checkbox" checked={isCompleted} onChange={() => toggleTopicCompletion(studentData.id, topicKey)} className="form-checkbox h-5 w-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500" />
                                                            <span className={`${isCompleted ? 'line-through text-gray-500' : 'text-gray-300'}`}>{topic}</span>
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={isDailyLogOpen} onClose={() => { setDailyLogOpen(false); setDailyLogs({}); }} title="Günlük Soru Sayısı Ekle">
                <form onSubmit={handleDailyLogSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0 max-h-96 overflow-y-auto pr-2">
                        {(studentData.subjects || []).map(subject => (
                            <Input key={subject} id={`log-${subject}`} label={subject} type="number" placeholder="Soru sayısı" value={dailyLogs[subject] || ''} onChange={e => setDailyLogs(prev => ({ ...prev, [subject]: e.target.value }))} min="0" />
                        ))}
                    </div>
                    <Button type="submit" className="w-full mt-6">Kaydet</Button>
                </form>
            </Modal>

            <Modal isOpen={isExamLogOpen} onClose={() => setExamLogOpen(false)} title="Deneme Sınavı Sonucu Ekle">
                <form onSubmit={handleExamLogSubmit}>
                    <Input label="Sınav Adı" id="examName" type="text" value={examName} onChange={e => setExamName(e.target.value)} placeholder="Örn: Özdebir TYT Deneme 1" required />
                    {studentData.examType === EXAM_TYPES.TYT_AYT && (
                        <Select label="Sınav Tipi" id="trialExamType" value={trialExamType} onChange={e => setTrialExamType(e.target.value as 'TYT' | 'AYT')}>
                            <option value="TYT">TYT</option>
                            <option value="AYT">AYT</option>
                        </Select>
                    )}
                    <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-300">Ders Sonuçları</h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {(examResults || []).map((result, index) => (
                            <div key={index} className="grid grid-cols-10 gap-2 items-center p-2 bg-gray-700 rounded-lg">
                                <span className="col-span-4 font-semibold text-gray-300 truncate" title={result.subject}>{result.subject}</span>
                                <div className="col-span-2"><Input label="" type="number" placeholder="D" value={result.correct} onChange={e => handleSubjectResultChange(index, 'correct', parseInt(e.target.value) || 0)} min="0" /></div>
                                <div className="col-span-2"><Input label="" type="number" placeholder="Y" value={result.incorrect} onChange={e => handleSubjectResultChange(index, 'incorrect', parseInt(e.target.value) || 0)} min="0" /></div>
                                <div className="col-span-2"><Input label="" type="number" placeholder="B" value={result.blank || ''} onChange={e => handleSubjectResultChange(index, 'blank', parseInt(e.target.value) || 0)} min="0" /></div>
                            </div>
                        ))}
                    </div>
                    <Button type="submit" className="w-full mt-6">Sınavı Kaydet</Button>
                </form>
            </Modal>
        </div>
    );
};

// --- COACH VIEW --- //
const AddStudentModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { addStudent, currentUser } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [examType, setExamType] = useState('');
    const [field, setField] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !name || !email || !password || !examType) return;

        addStudent({
            name,
            coachId: currentUser.id,
            examType,
            field: examType === EXAM_TYPES.TYT_AYT ? field : undefined,
            subjects: getSubjectsForStudent(examType, field)
        }, { email, password });
        onClose();
        setName(''); setEmail(''); setPassword(''); setExamType(''); setField(''); // Reset form
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Öğrenci Ekle">
            <form onSubmit={handleSubmit}>
                <Input label="Tam Ad" id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                <Input label="E-posta" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Input label="Şifre" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <Select label="Sınav Türü" id="examType" value={examType} onChange={e => setExamType(e.target.value)} required>
                    <option value="">Sınav türü seçin</option>
                    {Object.values(EXAM_TYPES).map(et => <option key={et} value={et}>{et}</option>)}
                </Select>
                {examType === EXAM_TYPES.TYT_AYT && (
                    <Select label="Alan" id="field" value={field} onChange={e => setField(e.target.value)} required>
                        <option value="">Alan seçin</option>
                        {Object.values(AYT_FIELDS).map(f => <option key={f} value={f}>{f}</option>)}
                    </Select>
                )}
                <Button type="submit" className="w-full mt-4">Öğrenci Ekle</Button>
            </form>
        </Modal>
    );
};

type GeneratedAssignment = { day: number; title: string; description: string; subject?: string; };

const StudentDetailPage: React.FC<{ student: Student; onBack: () => void }> = ({ student: initialStudent, onBack }) => {
    const { users, students, addAssignment, updateAssignment, deleteAssignment, toggleAssignmentCompletion, updateStudent, deleteStudent } = useApp();
    const student = useMemo(() => students.find(s => s.id === initialStudent.id) || initialStudent, [students, initialStudent.id]);

    const [activeTab, setActiveTab] = useState('reports');
    const [activeReportTab, setActiveReportTab] = useState('deneme');
    const [examTypeFilter, setExamTypeFilter] = useState<'all' | 'TYT' | 'AYT'>('all');

    // Modals state
    const [modal, setModal] = useState<'assignment' | 'aiPlanner' | null>(null);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

    // Student Info Edit State
    const [editedStudent, setEditedStudent] = useState(student);
    const [tempSubjects, setTempSubjects] = useState<string[]>(student.subjects);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // Assignment & Question Calendar state
    const [assignmentCalendarDate, setAssignmentCalendarDate] = useState(new Date());
    const [assignmentCalendarMonth, setAssignmentCalendarMonth] = useState(new Date());
    const [questionCalendarDate, setQuestionCalendarDate] = useState(new Date());
    const [questionCalendarMonth, setQuestionCalendarMonth] = useState(new Date());

    // AI Planner State
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiDifficulty, setAiDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Orta');
    const [aiPrioritySubjects, setAiPrioritySubjects] = useState<string[]>([]);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<GeneratedAssignment[] | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);
    
    // Assignment form state
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [assignmentDueDate, setAssignmentDueDate] = useState('');

    const aiExamplePrompts = [
        "Geometri konularından üçgenler ve analitik geometriye ağırlık ver.",
        "Paragraf çözme hızını artırmak için günlük 50 paragraf sorusu hedefi koy.",
        "Genel tekrar ve deneme sınavı odaklı bir program hazırla."
    ];

    useEffect(() => {
        setEditedStudent(student);
        setTempSubjects(student.subjects);
    }, [student]);
    
    // Handlers
    const handleAddAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        addAssignment(student.id, { title: assignmentTitle, description: assignmentDesc, dueDate: assignmentDueDate });
        setModal(null);
        setAssignmentTitle(''); setAssignmentDesc(''); setAssignmentDueDate('');
    };

    const handleUpdateAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAssignment) return;
        updateAssignment(student.id, editingAssignment);
        setEditingAssignment(null);
        setModal(null);
    };

    const handleDeleteAssignment = () => {
        if (!assignmentToDelete) return;
        deleteAssignment(student.id, assignmentToDelete.id);
        setAssignmentToDelete(null);
    }
    
    const handleUpdateStudent = (e: React.FormEvent) => {
        e.preventDefault();
        const finalStudentData = {
            ...editedStudent,
            subjects: tempSubjects,
            completedTopics: (editedStudent.completedTopics || []).filter(topicKey => tempSubjects.includes(topicKey.split('-')[0])),
        };
        updateStudent(finalStudentData);
        setIsEditingInfo(false);
    };

    const handleGeneratePlan = async () => {
        setIsGeneratingPlan(true);
        setAiError(null);
        setGeneratedPlan(null);
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });
            
            // Hoca açıklama yazmadıysa, uyarı ver
            if (!aiPrompt.trim()) {
                setAiError("Lütfen planlama talimatı yazın. Hangi dersleri eklemek istediğinizi belirtin.");
                setIsGeneratingPlan(false);
                return;
            }
            
            let fullPrompt = `Öğrencinin sınav türü: ${student.examType}. Sorumlu olduğu tüm dersler: ${(student.subjects || []).join(', ')}. 
            
ÖNEMLİ KURALLAR:
1. SADECE koçun açıklamasında bahsettiği dersleri plana ekle. Koç hangi dersleri istiyorsa SADECE onları kullan.
2. Koçun açıklamasında bahsetmediği dersleri kesinlikle ekleme.
3. Her gün için ayrı bir görev oluştur (her görev bir ders/konu olmalı).
4. Her görevin başlığı ders adını içermeli (örn: "Matematik - Türev", "Fizik - Newton Kanunları").

Koçun bu haftaki plan için isteği: "${aiPrompt}"
Planın zorluk seviyesi: ${aiDifficulty}`;
            
            if (aiPrioritySubjects.length > 0) {
                fullPrompt += `\nÖncelikli dersler: ${aiPrioritySubjects.join(', ')}`;
            }
            
            fullPrompt += `\n\n7 günlük bir ders çalışma planı oluştur. Her gün için ayrı bir görev tanımla ve her görev bir ders/konuyu temsil etsin.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT, properties: {
                            plan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                                day: { type: Type.NUMBER, description: "Planın günü (1-7 arası)" },
                                title: { type: Type.STRING, description: "Görevin başlığı - Ders adı ve konu içermeli" },
                                description: { type: Type.STRING, description: "Görevin detaylı açıklaması - Hangi konular çalışılacak, kaç soru çözülecek vb." },
                                subject: { type: Type.STRING, description: "Dersin adı (örn: Matematik, Fizik, Kimya)" },
                            }, required: ["day", "title", "description", "subject"] } }
                        }, required: ["plan"]
                    },
                }
            });
            
            let jsonString = response.text.trim();
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.substring(7, jsonString.length - 3).trim();
            } else if (jsonString.startsWith('```')) {
                jsonString = jsonString.substring(3, jsonString.length - 3).trim();
            }
// FIX: The result of JSON.parse is `any`, which can lead to type-related issues.
// Casting the parsed object to a more specific type makes the code safer.
            const resultJson = JSON.parse(jsonString) as { plan: GeneratedAssignment[] };

            if (resultJson && Array.isArray(resultJson.plan)) {
                setGeneratedPlan(resultJson.plan);
            } else {
                console.error("Invalid plan structure in AI response", resultJson);
                setAiError("Yapay zeka geçersiz bir plan formatı döndürdü.");
            }
        } catch (error) {
            console.error("Error generating plan:", error);
            setAiError("Plan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsGeneratingPlan(false);
        }
    };
    
    const handleSaveAiPlan = () => {
        if (!generatedPlan) return;
        const today = new Date();
        generatedPlan.forEach(task => {
            const taskDate = new Date(today);
            taskDate.setDate(today.getDate() + task.day - 1);
            addAssignment(student.id, { title: task.title, description: task.description, dueDate: taskDate.toISOString().split('T')[0] });
        });
        setModal(null);
        setGeneratedPlan(null);
    };

    // Memoized Data
    const assignmentsByDate = useMemo(() => {
        const todayString = new Date().toISOString().split('T')[0];
        return (student.assignments || []).reduce((acc: Record<string, CalendarDayData>, assignment) => {
            const date = assignment.dueDate.split('T')[0];
            const assignmentsOnDate = (student.assignments || []).filter(a => a.dueDate === date);
            const allCompleted = assignmentsOnDate.every(a => a.isCompleted);
            const isOverdue = !assignment.isCompleted && date < todayString;

            acc[date] = { status: isOverdue ? 'overdue' : (allCompleted ? 'completed' : 'pending') };
            return acc;
        }, {});
    }, [student.assignments]);
    
    const assignmentsForSelectedDay = useMemo(() => {
        const dateString = assignmentCalendarDate.toISOString().split('T')[0];
        return (student.assignments || []).filter(a => a.dueDate === dateString);
    }, [assignmentCalendarDate, student.assignments]);
    
    const dailyLogsByDate = useMemo(() => {
        const logs: Record<string, { total: number; subjects: Record<string, number> }> = {};
        (student.dailyLogs || []).forEach(log => {
            const date = log.date.split('T')[0];
            if (!logs[date]) logs[date] = { total: 0, subjects: {} };
            logs[date].total += log.questionsSolved;
            logs[date].subjects[log.subject] = (logs[date].subjects[log.subject] || 0) + log.questionsSolved;
        });
        const maxQuestions = Math.max(1, ...Object.values(logs).map(d => d.total));
        
        return Object.entries(logs).reduce((acc: Record<string, CalendarDayData>, [date, data]) => {
            acc[date] = { intensity: Math.min(1, Math.max(0.1, data.total / maxQuestions)) };
            return acc;
        }, {});
    }, [student.dailyLogs]);

    const logsForSelectedQuestionDate = useMemo(() => {
        const dateString = questionCalendarDate.toISOString().split('T')[0];
        const logData = (student.dailyLogs || []).filter(log => log.date === dateString);
        if(logData.length === 0) return null;

        const subjects: Record<string, number> = {};
        let total = 0;
        logData.forEach(log => {
            subjects[log.subject] = (subjects[log.subject] || 0) + log.questionsSolved;
            total += log.questionsSolved;
        });
        return { total, subjects };
    }, [questionCalendarDate, student.dailyLogs]);

    // Render components
    const ReportTabButton: React.FC<{ tabName: string, label: string }> = ({ tabName, label }) => (
        <button onClick={() => setActiveReportTab(tabName)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeReportTab === tabName ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {label}
        </button>
    );

    const DetailPageTabButton: React.FC<{ tabName: string, label: string }> = ({ tabName, label }) => (
        <button onClick={() => setActiveTab(tabName)} className={`px-6 py-3 font-semibold text-lg border-b-2 transition-all ${activeTab === tabName ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
            {label}
        </button>
    );

    const DailyQuestionsChart = () => {
        const data = useMemo(() => {
            const aggregated: { [date: string]: number } = {};
            (student.dailyLogs || []).forEach(log => {
                aggregated[log.date] = (aggregated[log.date] || 0) + log.questionsSolved;
            });
            return Object.entries(aggregated).map(([date, questions]) => ({ date, questions })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }, [student.dailyLogs]);
        if (data.length === 0) return <p className="text-gray-400 text-center p-8">Henüz günlük soru girişi yapılmamış.</p>
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="date" stroke="#a0aec0" tickFormatter={(tick) => new Date(tick).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} />
                    <Legend />
                    <Bar dataKey="questions" name="Çözülen Soru" fill="#3b82f6"><LabelList dataKey="questions" position="top" style={{ fill: '#a0aec0' }} /></Bar>
                    <Brush dataKey="date" height={30} stroke="#3b82f6" tickFormatter={(tick) => new Date(tick).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const SubjectQuestionDistributionChart = () => {
        const data = useMemo(() => {
            const subjectMap: { [key: string]: number } = {};
            (student.dailyLogs || []).forEach(log => {
                subjectMap[log.subject] = (subjectMap[log.subject] || 0) + log.questionsSolved;
            });
            return Object.entries(subjectMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        }, [student.dailyLogs]);
        if (data.length === 0) return <p className="text-gray-400 text-center p-8">Henüz derslere göre soru girişi yapılmamış.</p>
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];
        return (
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                        {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const TrialExamChart = () => {
        const data = useMemo(() => (student.trialExams || [])
            .filter(exam => examTypeFilter === 'all' || exam.type === examTypeFilter)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(exam => ({ name: exam.name, date: exam.date, 'Net': exam.totalCorrect - (exam.totalIncorrect / 4) }))
        , [student.trialExams, examTypeFilter]);
        if (data.length === 0) return <p className="text-gray-400 text-center p-8">Bu filtreye uygun deneme sınavı sonucu bulunamadı.</p>;
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="date" stroke="#a0aec0" tickFormatter={(tick) => new Date(tick).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })} />
                    <YAxis stroke="#a0aec0" domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} />
                    <Legend />
                    <Line type="monotone" dataKey="Net" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <button onClick={onBack} className="text-blue-400 hover:underline mb-4">&larr; Tüm Öğrenciler</button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white">{student.name}</h1>
                        <p className="text-gray-400">{student.examType} {student.field ? `- ${student.field}` : ''}</p>
                    </div>
                    <Button onClick={() => setModal('aiPlanner')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                        <SparklesIcon className="h-5 w-5" /> Yapay Zeka ile Plan Oluştur
                    </Button>
                </div>
            </header>

            <div className="border-b border-gray-700">
                <nav className="flex space-x-4">
                    <DetailPageTabButton tabName="reports" label="Raporlar" />
                    <DetailPageTabButton tabName="assignments" label="Ödev Takvimi" />
                    <DetailPageTabButton tabName="questions" label="Soru Takvimi" />
                    <DetailPageTabButton tabName="info" label="Öğrenci Bilgileri" />
                </nav>
            </div>

            <div className="mt-8">
                {activeTab === 'reports' && (
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg">
                                <ReportTabButton tabName="deneme" label="Deneme Sınavı Raporu" />
                                <ReportTabButton tabName="soru" label="Soru Sayısı Raporu" />
                            </div>
                            {activeReportTab === 'deneme' && student.examType === EXAM_TYPES.TYT_AYT && (
                                <select value={examTypeFilter} onChange={(e) => setExamTypeFilter(e.target.value as any)} className="bg-gray-700 text-white rounded-md p-1 border-gray-600 text-sm">
                                    <option value="all">Tümü</option><option value="TYT">TYT</option><option value="AYT">AYT</option>
                                </select>
                            )}
                        </div>
                        {activeReportTab === 'deneme' && <TrialExamChart />}
                        {activeReportTab === 'soru' && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div><h3 className="text-xl font-bold text-center mb-4 text-blue-400">Günlük Soru Sayısı Grafiği</h3><DailyQuestionsChart /></div>
                                <div><h3 className="text-xl font-bold text-center mb-4 text-blue-400">Derslere Göre Soru Dağılımı</h3><SubjectQuestionDistributionChart /></div>
                            </div>
                        )}
                    </Card>
                )}
                {activeTab === 'assignments' && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                             <Calendar
                                dataByDate={assignmentsByDate}
                                onDateSelect={setAssignmentCalendarDate}
                                selectedDate={assignmentCalendarDate}
                                currentMonth={assignmentCalendarMonth}
                                onMonthChange={(offset) => setAssignmentCalendarMonth(prev => { const d = new Date(prev); d.setDate(1); d.setMonth(d.getMonth() + offset); return d; })}
                                colorScheme="assignment"
                            />
                             <Button onClick={() => { setAssignmentDueDate(assignmentCalendarDate.toISOString().split('T')[0]); setModal('assignment'); }} className="w-full mt-4 flex items-center justify-center gap-2">
                                <PlusIcon className="h-5 w-5" /> {assignmentCalendarDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} için Ödev Ekle
                            </Button>
                        </div>
                        <div className="lg:col-span-2">
                             <Card className="h-full">
                                <h3 className="text-lg font-bold text-blue-400 mb-2 border-b border-gray-600 pb-2">{assignmentCalendarDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })} Ödevleri</h3>
                                <ul className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
                                    {assignmentsForSelectedDay.length > 0 ? assignmentsForSelectedDay.map(a => (
                                        <li key={a.id} className="bg-gray-700 p-3 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className={`font-semibold ${a.isCompleted ? 'line-through text-gray-500' : ''}`}>{a.title}</p>
                                                    <p className="text-sm text-gray-400">{a.description}</p>
                                                </div>
                                                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                                    <button onClick={() => { setEditingAssignment(a); setModal('assignment'); }} className="text-gray-400 hover:text-blue-400"><EditIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => setAssignmentToDelete(a)} className="text-gray-400 hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => toggleAssignmentCompletion(student.id, a.id)} title={a.isCompleted ? "Bekliyor yap" : "Tamamla"}>
                                                        {a.isCompleted ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-gray-500 hover:text-green-400" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    )) : <p className="text-gray-400">Bu gün için atanmış ödev yok.</p>}
                                </ul>
                            </Card>
                        </div>
                    </div>
                )}
                {activeTab === 'questions' && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                             <Calendar
                                dataByDate={dailyLogsByDate}
                                onDateSelect={setQuestionCalendarDate}
                                selectedDate={questionCalendarDate}
                                currentMonth={questionCalendarMonth}
                                onMonthChange={(offset) => setQuestionCalendarMonth(prev => { const d = new Date(prev); d.setDate(1); d.setMonth(d.getMonth() + offset); return d; })}
                                colorScheme="question"
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <h3 className="text-lg font-bold text-blue-400 mb-2 border-b border-gray-600 pb-2">{questionCalendarDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })} Detayları</h3>
                                {logsForSelectedQuestionDate ? (
                                    <>
                                        <p className="text-2xl font-bold text-white mb-4">Toplam: {logsForSelectedQuestionDate.total} Soru</p>
                                        <ul className="space-y-2 max-h-[24rem] overflow-y-auto pr-2">
                                            {Object.entries(logsForSelectedQuestionDate.subjects).map(([subject, count]) => (
                                                <li key={subject} className="flex justify-between bg-gray-700 p-2 rounded-md"><span className="text-gray-300">{subject}</span><span className="font-semibold text-white">{count}</span></li>
                                            ))}
                                        </ul>
                                    </>
                                ) : <p className="text-gray-400">Bu gün için soru girişi yapılmamış.</p>}
                            </Card>
                        </div>
                    </div>
                )}
                {activeTab === 'info' && (
                    <Card>
                        <form onSubmit={handleUpdateStudent}>
                            {isEditingInfo ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-6 text-blue-400">Öğrenci Bilgilerini Düzenle</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Tam Ad" name="name" value={editedStudent.name} onChange={e => setEditedStudent(p => ({...p, name: e.target.value}))} />
                                        <p className="block text-gray-300 text-sm font-bold mb-2">E-posta (değiştirilemez): <span className="text-gray-400 font-normal">{users.find(u => u.id === student.id)?.email}</span></p>
                                        <Select label="Sınav Tipi" name="examType" value={editedStudent.examType} onChange={e => {
                                            const newType = e.target.value;
                                            setEditedStudent(p => ({...p, examType: newType, field: newType !== EXAM_TYPES.TYT_AYT ? undefined : p.field}));
                                            setTempSubjects(getSubjectsForStudent(newType, editedStudent.field));
                                        }}>
                                            {Object.values(EXAM_TYPES).map(et => <option key={et} value={et}>{et}</option>)}
                                        </Select>
                                        {editedStudent.examType === EXAM_TYPES.TYT_AYT && (
                                            <Select label="Alan" name="field" value={editedStudent.field || ''} onChange={e => {
                                                const newField = e.target.value;
                                                setEditedStudent(p => ({...p, field: newField}));
                                                setTempSubjects(getSubjectsForStudent(editedStudent.examType, newField));
                                            }}>
                                                {Object.values(AYT_FIELDS).map(f => <option key={f} value={f}>{f}</option>)}
                                            </Select>
                                        )}
                                    </div>
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold text-blue-400 mb-4">Sorumlu Olduğu Dersler</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-4 bg-gray-900 rounded-lg">
                                            {(Object.keys(SUBJECTS_DATA[editedStudent.examType] || {})).map(subject => (
                                                <label key={subject} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={(tempSubjects || []).includes(subject)} onChange={() => setTempSubjects(p => (p || []).includes(subject) ? p.filter(s => s !== subject) : [...(p || []), subject])} className="form-checkbox h-5 w-5 text-blue-600" /><span className="text-gray-300">{subject}</span></label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end gap-4"><Button type="button" variant="secondary" onClick={() => setIsEditingInfo(false)}>İptal</Button><Button type="submit">Kaydet</Button></div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start">
                                        <div><h2 className="text-2xl font-bold mb-4 text-blue-400">Öğrenci Detayları</h2><p><strong className="text-gray-400">E-posta:</strong> {users.find(u => u.id === student.id)?.email}</p><p><strong className="text-gray-400">Sınav:</strong> {student.examType} {student.field ? `- ${student.field}` : ''}</p></div>
                                        <Button onClick={() => setIsEditingInfo(true)} className="flex items-center gap-2"><EditIcon className="h-5 w-5" /> Düzenle</Button>
                                    </div>
                                    <div className="mt-8"><h3 className="text-xl font-bold text-blue-400 mb-4">Sorumlu Olduğu Dersler</h3><ul className="list-disc list-inside columns-2 sm:columns-3 lg:columns-4">{(student.subjects || []).map(s => <li key={s} className="text-gray-300">{s}</li>)}</ul></div>
                                    <div className="mt-8 pt-4 border-t border-gray-700"><h3 className="text-xl font-bold text-red-400 mb-4">Tehlikeli Alan</h3><Button onClick={() => { if(window.confirm('Öğrenciyi silmek istediğinizden emin misiniz?')) { deleteStudent(student.id); onBack(); } }} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"><TrashIcon className="h-5 w-5" /> Öğrenciyi Sil</Button></div>
                                </>
                            )}
                        </form>
                    </Card>
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={modal === 'assignment'} onClose={() => { setModal(null); setEditingAssignment(null); }} title={editingAssignment ? "Ödevi Güncelle" : "Yeni Ödev Ekle"}>
                <form onSubmit={editingAssignment ? handleUpdateAssignment : handleAddAssignment}>
                    <Input label="Başlık" id="assTitle" type="text" value={editingAssignment ? editingAssignment.title : assignmentTitle} onChange={e => editingAssignment ? setEditingAssignment({ ...editingAssignment, title: e.target.value }) : setAssignmentTitle(e.target.value)} required />
                    <TextArea label="Açıklama" id="assDesc" value={editingAssignment ? editingAssignment.description : assignmentDesc} onChange={e => editingAssignment ? setEditingAssignment({ ...editingAssignment, description: e.target.value }) : setAssignmentDesc(e.target.value)} required />
                    <Input label="Teslim Tarihi" id="assDueDate" type="date" value={editingAssignment ? editingAssignment.dueDate.split('T')[0] : assignmentDueDate} onChange={e => editingAssignment ? setEditingAssignment({ ...editingAssignment, dueDate: e.target.value }) : setAssignmentDueDate(e.target.value)} required />
                    <Button type="submit" className="w-full mt-4">{editingAssignment ? "Güncelle" : "Ekle"}</Button>
                </form>
            </Modal>
            
            {assignmentToDelete && (
                 <Modal isOpen={!!assignmentToDelete} onClose={() => setAssignmentToDelete(null)} title="Ödevi Sil">
                    <div>
                        <p className="text-gray-300 mb-6">"{assignmentToDelete.title}" başlıklı ödevi silmek istediğinizden emin misiniz?</p>
                        <div className="flex justify-end gap-4">
                            <Button variant="secondary" onClick={() => setAssignmentToDelete(null)}>İptal</Button>
                            <Button onClick={handleDeleteAssignment} className="bg-red-600 hover:bg-red-700">Sil</Button>
                        </div>
                    </div>
                </Modal>
            )}
            
            <Modal isOpen={modal === 'aiPlanner'} onClose={() => setModal(null)} title="Yapay Zeka ile Haftalık Plan Oluştur">
                <div>
                    {!generatedPlan ? (
                        <>
                            <TextArea label="Planlama Talimatı" id="aiPrompt" rows={3} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder={`Örn: ${aiExamplePrompts[0]}`} />
                             <div className="my-2 text-sm text-gray-400">
                                Örnekler: {aiExamplePrompts.map((p, i) => (<button key={i} type="button" onClick={() => setAiPrompt(p)} className="text-left text-blue-400 hover:underline mr-2">&#8226; {p}</button>))}
                            </div>
                            <Select label="Zorluk Seviyesi" id="aiDifficulty" value={aiDifficulty} onChange={e => setAiDifficulty(e.target.value as any)}>
                                <option>Kolay</option><option>Orta</option><option>Zor</option>
                            </Select>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Öncelikli Dersler (İsteğe bağlı)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-gray-900 rounded-lg max-h-40 overflow-y-auto">
                                    {(student.subjects || []).map(s => (
                                        <label key={s} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={aiPrioritySubjects.includes(s)} onChange={() => setAiPrioritySubjects(p => p.includes(s) ? p.filter(sub => sub !== s) : [...p, s])} className="form-checkbox" /><span>{s}</span></label>
                                    ))}
                                </div>
                            </div>
                            {aiError && <p className="text-red-500 mt-4">{aiError}</p>}
                            <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan} className="w-full mt-6">
                                {isGeneratingPlan ? 'Plan Oluşturuluyor...' : 'Plan Oluştur'}
                            </Button>
                        </>
                    ) : (
                         <>
                            <h3 className="text-xl font-bold text-blue-400 mb-4">Oluşturulan Plan</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 bg-gray-900 p-4 rounded-lg">
                                {generatedPlan.map((task, index) => (
                                    <div key={index} className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-700 shadow-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                                    {task.day}
                                                </div>
                                                <h5 className="font-bold text-white text-lg">{task.title}</h5>
                                            </div>
                                            {task.subject && (
                                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                    {task.subject}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-300 text-sm ml-11 leading-relaxed">{task.description}</p>
                                    </div>
                                ))}
                            </div>
                             <div className="flex justify-end gap-4 mt-6">
                                <Button variant="secondary" onClick={() => setGeneratedPlan(null)}>Geri Dön</Button>
                                <Button onClick={handleSaveAiPlan}>Planı Kaydet</Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

        </div>
    );
};

const CoachDashboard: React.FC = () => {
    const { currentUser, students, logout } = useApp();
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);

    if (!currentUser) return null;

    const myStudents = students.filter(s => s.coachId === currentUser.id);

    if (selectedStudent) {
        return <StudentDetailPage student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    return (
        <div className="p-4 sm:p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white">Koç Paneli</h1>
                    <p className="text-gray-400">Hoş Geldin, {currentUser.name}</p>
                </div>
                 <div className="flex items-center gap-4">
                    <Button onClick={() => setAddStudentModalOpen(true)} className="flex items-center gap-2">
                        <PlusIcon className="h-5 w-5" /> Öğrenci Ekle
                    </Button>
                    <Button onClick={logout} variant="secondary" className="flex items-center gap-2">
                        <LogoutIcon className="h-5 w-5" /> Çıkış Yap
                    </Button>
                </div>
            </header>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Öğrencilerin</h2>
                {myStudents.length > 0 ? (
                    <ul className="divide-y divide-gray-700">
                        {myStudents.map(student => (
                            <li key={student.id} onClick={() => setSelectedStudent(student)} className="flex justify-between items-center p-4 -mx-4 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold"><UserIcon className="h-6 w-6" /></div>
                                    <div>
                                        <p className="font-semibold text-lg text-white">{student.name}</p>
                                        <p className="text-gray-400 text-sm">{student.examType} {student.field ? ` - ${student.field}`: ''}</p>
                                    </div>
                                </div>
                                <span className="text-blue-400 font-semibold">&rarr;</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">Henüz öğrenciniz bulunmuyor. Eklemek için yukarıdaki butonu kullanın.</p>
                )}
            </Card>

            <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setAddStudentModalOpen(false)} />
        </div>
    );
};

// --- MAIN APP COMPONENT --- //
const App: React.FC = () => {
    const appData = useAppData();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    useEffect(() => {
        // When user logs out, go back to role selection
        if (!appData.currentUser) {
            setSelectedRole(null);
        }
    }, [appData.currentUser]);

    const renderContent = () => {
        if (appData.isLoading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
        
        if (appData.currentUser) {
            if (appData.currentUser.role === 'coach') return <CoachDashboard />;
            if (appData.currentUser.role === 'student') return <StudentDashboard />;
        }
        
        if (selectedRole) {
            return <LoginForm role={selectedRole} onBack={() => setSelectedRole(null)} />;
        }
        
        return <RoleSelectionScreen onSelectRole={setSelectedRole} />;
    };
    
    return (
        <AppContext.Provider value={appData}>
            {renderContent()}
        </AppContext.Provider>
    );
};

export default App;
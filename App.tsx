





import React, { useState, createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import useAppDataWithSupabase from './hooks/useAppDataWithSupabase';
import { generateStudyPlan, GeneratedAssignment } from './lib/aiService';
import type { User, Student, Assignment, TrialExam, Book, SubjectResult, UserRole } from './types';
import { EXAM_TYPES, AYT_FIELDS, SUBJECTS_DATA, getSubjectsForStudent, getSubjectsDataKey, TYT_SUBJECTS, getLocalDateString, DAILY_STUDY_HOURS, AI_PROMPT_TEMPLATES, getYouTubeSearchUrl, getYouTubeChannelsForSubject } from './constants';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Brush, PieChart, Pie, Cell } from 'recharts';

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
const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
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


// --- CONTEXT --- //
type AppContextType = ReturnType<typeof useAppDataWithSupabase>;
const AppContext = createContext<AppContextType | null>(null);
const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within an AppProvider");
    return context;
}

// --- SHARED COMPONENTS --- //
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>{children}</div>
);

const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string; type?: 'button' | 'submit' | 'reset'; variant?: 'primary' | 'secondary' }> = ({ onClick, children, className, type = 'button', variant = 'primary' }) => {
    const baseClasses = "font-bold py-2 px-3 sm:px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 active:scale-100 text-sm sm:text-base";
    const variantClasses = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white';
    return (
        <button type={type} onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
            {children}
        </button>
    );
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-3 sm:p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-4 sm:p-6 relative animate-fade-in-down max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 border-b border-gray-600">
                    <h3 className="text-lg sm:text-2xl font-bold text-blue-400">{title}</h3>
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

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
        <select className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" {...props}>
            {children}
        </select>
    </div>
);


// --- LOGIN COMPONENT --- //
const RoleSelectionScreen: React.FC<{ onSelectRole: (role: UserRole) => void }> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark">
            <Card className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-blue-400 mb-8">Platforma Hoş Geldiniz</h1>
                <p className="text-gray-400 mb-6">Lütfen giriş türünü seçin:</p>
                <div className="flex flex-col gap-4">
                    <Button onClick={() => onSelectRole('coach')} className="w-full py-3 text-lg">
                        Koç Girişi
                    </Button>
                    <Button onClick={() => onSelectRole('student')} className="w-full py-3 text-lg" variant="secondary">
                        Öğrenci Girişi
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const LoginForm: React.FC<{ role: UserRole; onBack: () => void }> = ({ role, onBack }) => {
    const { login } = useApp();
    const isCoach = role === 'coach';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                    <Input label="E-posta" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta adresinizi girin" required />
                    <Input label="Şifre" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifrenizi girin" required />
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <Button type="submit" className="w-full">Giriş Yap</Button>
                </form>
            </Card>
        </div>
    );
};


// --- STUDENT VIEW --- //
const StudentDashboard = () => {
    const { currentUser, students, logout, addDailyLog, addTrialExam, toggleTopicCompletion, toggleAssignmentCompletion } = useApp();
    const studentData = useMemo(() => students.find(s => s.id === currentUser?.id), [students, currentUser]);

    const [activeTab, setActiveTab] = useState('assignments');

    // State for modals
    const [isDailyLogOpen, setDailyLogOpen] = useState(false);
    const [isExamLogOpen, setExamLogOpen] = useState(false);

    // Calendar state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());

    // State for forms
    const [dailyLogs, setDailyLogs] = useState<Record<string, string>>({});
    const [examName, setExamName] = useState('');
    const [trialExamType, setTrialExamType] = useState<'TYT' | 'AYT'>('TYT');
    const [examResults, setExamResults] = useState<SubjectResult[]>([]);

    if (!studentData) return <div>Öğrenci verileri yükleniyor...</div>;

    const subjectsForTrialExam = useMemo(() => {
        if (studentData.examType !== EXAM_TYPES.TYT_AYT) {
            return studentData.subjects;
        }

        const tytSubjectKeys = Object.keys(TYT_SUBJECTS);
        const aytSubjectKeys = ['Matematik (AYT)', 'Geometri', 'Fizik (AYT)', 'Kimya (AYT)', 'Biyoloji (AYT)', 'Türk Dili ve Edebiyatı', 'Tarih (AYT)', 'Coğrafya (AYT)', 'Felsefe Grubu'];

        let relevantSubjects: string[];
        if (trialExamType === 'TYT') {
            relevantSubjects = tytSubjectKeys;
        } else { // 'AYT'
            relevantSubjects = aytSubjectKeys;
        }

        return studentData.subjects.filter(s => relevantSubjects.includes(s));
    }, [studentData.examType, studentData.subjects, trialExamType]);

    useEffect(() => {
        if (isExamLogOpen) {
            setExamResults(subjectsForTrialExam.map(subject => ({
                subject,
                correct: 0,
                incorrect: 0,
                blank: 0
            })));
        }
    }, [isExamLogOpen, subjectsForTrialExam]);

    // --- Calendar Logic ---
    const assignmentsByDate = useMemo(() => {
        return studentData.assignments.reduce((acc, assignment) => {
            const date = assignment.dueDate; // Artık zaten YYYY-MM-DD formatında
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(assignment);
            return acc;
        }, {} as Record<string, Assignment[]>);
    }, [studentData.assignments]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid issues with different month lengths
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const todayString = getLocalDateString();
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
            const dateString = getLocalDateString(date);
            const isToday = getLocalDateString() === dateString;
            const isSelected = getLocalDateString(selectedDate) === dateString;

            const dailyAssignments = assignmentsByDate[dateString] || [];
            let dayStatus: 'completed' | 'pending' | 'overdue' | null = null;
            if (dailyAssignments.length > 0) {
                const isOverdue = dailyAssignments.some(a => !a.isCompleted && a.dueDate < todayString);
                const allCompleted = dailyAssignments.every(a => a.isCompleted);
                if (isOverdue) {
                    dayStatus = 'overdue';
                } else if (allCompleted) {
                    dayStatus = 'completed';
                } else {
                    dayStatus = 'pending';
                }
            }

            let dayBgClass = 'hover:bg-gray-700';
            let textColorClass = 'text-white';

            if (dayStatus === 'overdue') {
                dayBgClass = 'bg-red-700/80 hover:bg-red-600';
            } else if (dayStatus === 'completed') {
                dayBgClass = 'bg-green-700/80 hover:bg-green-600';
            } else if (dayStatus === 'pending') {
                dayBgClass = 'bg-yellow-600/80 hover:bg-yellow-500';
                textColorClass = 'text-black';
            } else if (isToday && !isSelected) {
                dayBgClass = 'bg-gray-600';
            }

            if (isSelected) {
                dayBgClass = 'bg-blue-600 scale-110';
                textColorClass = 'text-white'; // Ensure selected day has white text
            }

            calendarDays.push(
                <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`text-center aspect-square flex items-center justify-center rounded-lg transition-all transform font-semibold
                        ${dayBgClass}
                        ${textColorClass}
                    `}
                >
                    {day}
                </button>
            );
        }

        return <div className="grid grid-cols-7 gap-1">{calendarDays}</div>;
    };

    const assignmentsForSelectedDay = useMemo(() => {
        const dateString = getLocalDateString(selectedDate);
        return assignmentsByDate[dateString] || [];
    }, [selectedDate, assignmentsByDate]);


    // FIX: Use a constrained generic to ensure type safety and use an immutable update pattern.
    const handleSubjectResultChange = <K extends keyof SubjectResult>(index: number, field: K, value: SubjectResult[K]) => {
        setExamResults(prevResults => prevResults.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const handleDailyLogChange = (subject: string, value: string) => {
        setDailyLogs(prev => ({ ...prev, [subject]: value }));
    };

    const handleDailyLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const logsData = Object.entries(dailyLogs)
            .map(([subject, questionsSolved]) => ({
                subject,
                questionsSolved: parseInt(String(questionsSolved)) || 0,
            }))
            .filter(log => log.questionsSolved > 0);

        if (logsData.length > 0) {
            addDailyLog(studentData.id, logsData);
            setDailyLogOpen(false);
            setDailyLogs({});
        }
    };

    const openExamModal = () => {
        setTrialExamType('TYT');
        setExamName('');
        setExamLogOpen(true);
    };

    const closeExamModal = () => {
        setExamLogOpen(false);
        setExamName('');
        setExamResults([]);
    };

    const handleExamLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalCorrect = examResults.reduce((sum, r) => sum + Number(r.correct), 0);
        const totalIncorrect = examResults.reduce((sum, r) => sum + Number(r.incorrect), 0);
        const totalBlank = examResults.reduce((sum, r) => sum + Number(r.blank || 0), 0);

        addTrialExam(studentData.id, {
            name: examName,
            type: studentData.examType === EXAM_TYPES.TYT_AYT ? trialExamType : undefined,
            totalCorrect,
            totalIncorrect,
            totalBlank,
            subjectResults: examResults,
        });
        closeExamModal();
    };

    const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-semibold transition-all rounded-lg whitespace-nowrap ${activeTab === tabName
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Modern Header - Mobil Uyumlu */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-lg sm:text-2xl font-bold text-white">{studentData.name.charAt(0)}</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-base sm:text-2xl font-bold text-white truncate">Hoş Geldin, {studentData.name}</h1>
                                <p className="text-xs sm:text-sm text-gray-400 truncate">{studentData.examType}</p>
                            </div>
                        </div>
                        <Button
                            onClick={logout}
                            variant="secondary"
                            className="flex items-center gap-1.5 sm:gap-2 hover:bg-gray-700 h-8 sm:h-10 px-2 sm:px-4 flex-shrink-0"
                        >
                            <LogoutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline text-sm sm:text-base">Çıkış</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Action Buttons - Mobil Uyumlu */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    <Button
                        onClick={() => setDailyLogOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 w-full sm:w-auto"
                    >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm sm:text-base">Günlük Soru Ekle</span>
                    </Button>
                    <Button
                        onClick={openExamModal}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 w-full sm:w-auto"
                    >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm sm:text-base">Deneme Sınavı Ekle</span>
                    </Button>
                </div>

                {/* Tab Navigation - Mobil Uyumlu */}
                <div className="mb-4 sm:mb-8">
                    <nav className="flex gap-1 sm:gap-2 p-1 bg-gray-800/50 rounded-lg sm:rounded-xl backdrop-blur-sm border border-gray-700">
                        <TabButton tabName="assignments" label="📝 Ödevler" />
                        {studentData.examType !== EXAM_TYPES.GENEL_TAKIP && <TabButton tabName="subjects" label="📚 Konu Takibi" />}
                    </nav>
                </div>

                <div className="mt-4 sm:mt-6">
                    {activeTab === 'assignments' && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                            {/* Takvim - Mobil Uyumlu */}
                            <div className="lg:col-span-3">
                                <Card className="max-w-lg mx-auto bg-gray-800/50 backdrop-blur-sm border-gray-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <Button onClick={() => changeMonth(-1)} variant="secondary" className="h-8 sm:h-10 w-8 sm:w-10 p-0 flex items-center justify-center">&lt;</Button>
                                        <h3 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                            {currentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <Button onClick={() => changeMonth(1)} variant="secondary" className="h-8 sm:h-10 w-8 sm:w-10 p-0 flex items-center justify-center">&gt;</Button>
                                    </div>
                                    {renderCalendar()}
                                </Card>
                            </div>

                            {/* Günün Ödevleri - Mobil Uyumlu */}
                            <div className="lg:col-span-2">
                                <Card className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700">
                                    <h3 className="text-sm sm:text-lg font-bold text-blue-400 mb-2 border-b border-gray-600 pb-2 truncate">
                                        {selectedDate.toLocaleDateString('tr-TR', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </h3>
                                    <h4 className="font-semibold text-gray-300 mb-2 text-xs sm:text-base">Günün Ödevleri:</h4>
                                    <ul className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                                        {assignmentsForSelectedDay.length > 0 ? assignmentsForSelectedDay.map(a => (
                                            <li key={a.id}>
                                                <details className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all group">
                                                    <summary className="cursor-pointer p-2.5 sm:p-3 list-none">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <span className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0">▶</span>
                                                                <p className={`font-semibold text-sm sm:text-base truncate ${a.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>{a.title}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${a.isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                                    {a.isCompleted ? '✓' : '⏱'}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); toggleAssignmentCompletion(studentData.id, a.id); }}
                                                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${a.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-blue-400'}`}
                                                                    title="Tamamlandı olarak işaretle"
                                                                >
                                                                    {a.isCompleted && <span className="text-white text-xs">✔</span>}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </summary>
                                                    <div className="px-3 pb-3 pt-0 border-t border-gray-600 mt-2">
                                                        <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap mb-3">{a.description}</p>
                                                        {a.youtubeUrl && (
                                                            <a
                                                                href={a.youtubeUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                                </svg>
                                                                📺 Video İzle
                                                            </a>
                                                        )}
                                                    </div>
                                                </details>
                                            </li>
                                        )) : (
                                            <div className="text-center py-6 sm:py-8">
                                                <svg className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-gray-400 text-sm">Bu gün için atanmış ödev yok</p>
                                            </div>
                                        )}
                                    </ul>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'subjects' && studentData.examType !== EXAM_TYPES.GENEL_TAKIP && (
                        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                            <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">📚 Ders & Konu İlerlemesi</h2>
                            <div className="space-y-2 sm:space-y-3">
                                {(Object.keys(SUBJECTS_DATA[studentData.examType] || {})).filter(subj => studentData.subjects.includes(subj)).map(subject => (
                                    <details key={subject} className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all group">
                                        <summary className="cursor-pointer p-3 sm:p-4 font-semibold text-sm sm:text-lg text-white list-none flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate">{subject}</span>
                                                {/* Popüler Kanallar */}
                                                <div className="hidden sm:flex gap-1">
                                                    {getYouTubeChannelsForSubject(subject).slice(0, 2).map(channel => (
                                                        <a
                                                            key={channel.name}
                                                            href={channel.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={e => e.stopPropagation()}
                                                            className="text-xs bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2 py-0.5 rounded-full transition-all"
                                                            title={channel.name}
                                                        >
                                                            {channel.icon}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2">▼</span>
                                        </summary>
                                        <div className="p-3 sm:p-4 border-t border-gray-600">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {SUBJECTS_DATA[studentData.examType][subject].map(topic => {
                                                    const topicKey = `${subject}-${topic}`;
                                                    const isCompleted = studentData.completedTopics.includes(topicKey);
                                                    return (
                                                        <li key={topicKey} className="flex items-center justify-between gap-1">
                                                            <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 rounded hover:bg-gray-600 transition-colors flex-1 min-w-0">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isCompleted}
                                                                    onChange={() => toggleTopicCompletion(studentData.id, topicKey)}
                                                                    className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 flex-shrink-0"
                                                                />
                                                                <span className={`text-xs sm:text-sm truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-300'}`}>{topic}</span>
                                                            </label>
                                                            <a
                                                                href={getYouTubeSearchUrl(subject, topic)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-all flex-shrink-0"
                                                                title="YouTube'da video ara"
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                                </svg>
                                                            </a>
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
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {studentData.subjects.map(subject => (
                                <div key={subject} className="grid grid-cols-2 gap-4 items-center">
                                    <label htmlFor={`log-${subject}`} className="font-semibold text-gray-300">{subject}</label>
                                    <Input
                                        id={`log-${subject}`}
                                        label=""
                                        type="number"
                                        placeholder="Soru sayısı"
                                        value={dailyLogs[subject] || ''}
                                        onChange={e => handleDailyLogChange(subject, e.target.value)}
                                        min="0"
                                    />
                                </div>
                            ))}
                        </div>
                        <Button type="submit" className="w-full mt-6">Kaydet</Button>
                    </form>
                </Modal>

                <Modal isOpen={isExamLogOpen} onClose={closeExamModal} title="Deneme Sınavı Sonucu Ekle">
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
                            {examResults.map((result, index) => (
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
    const [grade, setGrade] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !name || !email || !password || !examType || !grade) return;

        const studentSubjects = getSubjectsForStudent(examType, field, parseInt(grade));

        addStudent({
            name,
            coachId: currentUser.id,
            examType,
            field: examType === EXAM_TYPES.TYT_AYT ? field : undefined,
            grade: parseInt(grade),
            subjects: studentSubjects
        }, { email, password });
        onClose();
        // Reset form
        setName(''); setEmail(''); setPassword(''); setExamType(''); setField(''); setGrade('');
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
                <Select label="Sınıf" id="grade" value={grade} onChange={e => setGrade(e.target.value)} required>
                    <option value="">Sınıf seçin</option>
                    {[5, 6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>{g}. Sınıf</option>)}
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

const StudentDetailPage: React.FC<{ student: Student; onBack: () => void }> = ({ student: initialStudent, onBack }) => {
    const { students, addAssignment, updateAssignment, addBook, deleteBook, toggleAssignmentCompletion, updateStudent, deleteAssignment, deleteStudent } = useApp();

    const student = useMemo(() => students.find(s => s.id === initialStudent.id) || initialStudent, [students, initialStudent.id]);

    const [activeTab, setActiveTab] = useState('reports');
    const [activeReportTab, setActiveReportTab] = useState('deneme');
    const [examTypeFilter, setExamTypeFilter] = useState<'all' | 'TYT' | 'AYT'>('all');
    const [modal, setModal] = useState<'assignment' | 'book' | 'ai-plan' | null>(null);

    // AI Plan state
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiDifficulty, setAiDifficulty] = useState('Orta');
    const [aiPrioritySubjects, setAiPrioritySubjects] = useState<string[]>([]);
    const [aiPlanDuration, setAiPlanDuration] = useState(7);
    const [aiDailyHours, setAiDailyHours] = useState(3);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<GeneratedAssignment[] | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const [editedStudent, setEditedStudent] = useState(student);
    const [tempSubjects, setTempSubjects] = useState<string[]>(student.subjects);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // Assignment Calendar state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // Question Calendar state
    const [questionCalendarSelectedDate, setQuestionCalendarSelectedDate] = useState(new Date());
    const [questionCalendarCurrentDate, setQuestionCalendarCurrentDate] = useState(new Date());


    useEffect(() => {
        setEditedStudent(student);
        setTempSubjects(student.subjects);
    }, [student]);

    // Assignment form state
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [assignmentDueDate, setAssignmentDueDate] = useState('');

    // Book form state
    const [bookName, setBookName] = useState('');

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
    };

    const handleAddBook = (e: React.FormEvent) => {
        e.preventDefault();
        addBook(student.id, bookName);
        setModal(null);
        setBookName('');
    }

    const handleGeneratePlan = async () => {
        setIsGeneratingPlan(true);
        setAiError(null);
        setGeneratedPlan(null);
        try {
            if (!aiPrompt.trim()) {
                setAiError("Lütfen planlama talimatı yazın. Hangi dersleri eklemek istediğinizi belirtin.");
                setIsGeneratingPlan(false);
                return;
            }

            const plan = await generateStudyPlan({
                examType: student.examType,
                subjects: student.subjects,
                prompt: aiPrompt,
                difficulty: aiDifficulty,
                prioritySubjects: aiPrioritySubjects.length > 0 ? aiPrioritySubjects : undefined,
                planDuration: aiPlanDuration,
                dailyHours: aiDailyHours
            });

            setGeneratedPlan(plan);
        } catch (error) {
            console.error("Error generating plan:", error);
            setAiError(error instanceof Error ? error.message : "Plan oluşturulurken bir hata oluştu. Lütfen API key'i kontrol edin ve tekrar deneyin.");
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

            // YouTube linkini ayrı bir alan olarak kaydet
            const youtubeUrl = task.topic ? getYouTubeSearchUrl(task.subject, task.topic) : undefined;

            addAssignment(student.id, {
                title: task.title,
                description: task.description,
                dueDate: getLocalDateString(taskDate),
                youtubeUrl: youtubeUrl
            });
        });
        setModal(null);
        setGeneratedPlan(null);
        setAiPrompt('');
    };

    const handleStudentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setEditedStudent(prev => {
            const updatedInfo = { ...prev, [name]: value };

            if (name === 'examType' || name === 'field') {
                if (name === 'examType' && value !== EXAM_TYPES.TYT_AYT) {
                    updatedInfo.field = '';
                }
                const newSubjects = getSubjectsForStudent(updatedInfo.examType, updatedInfo.field);
                setTempSubjects(newSubjects);
            }
            return updatedInfo;
        });
    };

    const handleSubjectToggle = (subject: string) => {
        setTempSubjects(prev =>
            prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
        );
    };

    const handleUpdateStudent = (e: React.FormEvent) => {
        e.preventDefault();

        const finalStudentData = {
            ...editedStudent,
            subjects: tempSubjects,
            completedTopics: (editedStudent.completedTopics || []).filter(topicKey => {
                const [subjectName] = topicKey.split('-');
                return tempSubjects.includes(subjectName);
            }),
        };

        updateStudent(finalStudentData);
        setIsEditingInfo(false);
        alert('Öğrenci bilgileri güncellendi!');
    };

    const handleCancelEdit = () => {
        setEditedStudent(student);
        setTempSubjects(student.subjects);
        setIsEditingInfo(false);
    }

    // --- Assignment Calendar Logic ---
    const assignmentsByDate = useMemo(() => {
        return student.assignments.reduce((acc, assignment) => {
            const date = assignment.dueDate.split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(assignment);
            return acc;
        }, {} as Record<string, Assignment[]>);
    }, [student.assignments]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid issues with different month lengths
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const todayString = getLocalDateString();
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
            const dateString = getLocalDateString(date);
            const isToday = getLocalDateString() === dateString;
            const isSelected = getLocalDateString(selectedDate) === dateString;

            const dailyAssignments = assignmentsByDate[dateString] || [];
            let dayStatus: 'completed' | 'pending' | 'overdue' | null = null;
            if (dailyAssignments.length > 0) {
                const isOverdue = dailyAssignments.some(a => !a.isCompleted && a.dueDate < todayString);
                const allCompleted = dailyAssignments.every(a => a.isCompleted);
                if (isOverdue) {
                    dayStatus = 'overdue';
                } else if (allCompleted) {
                    dayStatus = 'completed';
                } else {
                    dayStatus = 'pending';
                }
            }

            let dayBgClass = 'hover:bg-gray-700';
            let textColorClass = 'text-white';

            if (dayStatus === 'overdue') {
                dayBgClass = 'bg-red-700/80 hover:bg-red-600';
            } else if (dayStatus === 'completed') {
                dayBgClass = 'bg-green-700/80 hover:bg-green-600';
            } else if (dayStatus === 'pending') {
                dayBgClass = 'bg-yellow-600/80 hover:bg-yellow-500';
                textColorClass = 'text-black';
            } else if (isToday && !isSelected) {
                dayBgClass = 'bg-gray-600';
            }

            if (isSelected) {
                dayBgClass = 'bg-blue-600 scale-110';
                textColorClass = 'text-white'; // Ensure selected day has white text
            }

            calendarDays.push(
                <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`text-center aspect-square flex items-center justify-center rounded-lg transition-all transform font-semibold
                        ${dayBgClass}
                        ${textColorClass}
                    `}
                >
                    {day}
                </button>
            );
        }

        return <div className="grid grid-cols-7 gap-1">{calendarDays}</div>;
    };

    const assignmentsForSelectedDay = useMemo(() => {
        const dateString = getLocalDateString(selectedDate);
        return assignmentsByDate[dateString] || [];
    }, [selectedDate, assignmentsByDate]);

    const openAssignmentModalForSelectedDate = () => {
        setAssignmentDueDate(getLocalDateString(selectedDate));
        setModal('assignment');
    };

    // --- Question Calendar Logic ---
    const dailyLogsByDate = useMemo(() => {
        // FIX: Explicitly typing the accumulator for the reduce function ensures that TypeScript
        // correctly infers the object shape, preventing errors when accessing properties like `total` later.
        // FIX: Define an initial value with a specific type for the reduce accumulator to prevent type errors.
        const initialValue: Record<string, { total: number; subjects: Record<string, number> }> = {};
        return student.dailyLogs.reduce((acc, log) => {
            const date = log.date.split('T')[0]; // Ensure date is just YYYY-MM-DD
            if (!acc[date]) {
                acc[date] = { total: 0, subjects: {} };
            }
            acc[date].total += log.questionsSolved;
            acc[date].subjects[log.subject] = (acc[date].subjects[log.subject] || 0) + log.questionsSolved;
            return acc;
        }, initialValue);
    }, [student.dailyLogs]);

    const logsForSelectedQuestionDate = useMemo(() => {
        const dateString = getLocalDateString(questionCalendarSelectedDate);
        return dailyLogsByDate[dateString] || null;
    }, [questionCalendarSelectedDate, dailyLogsByDate]);

    const maxQuestionsInADay = useMemo(() => {
        if (Object.keys(dailyLogsByDate).length === 0) return 1; // avoid division by zero
        return Math.max(1, ...Object.values(dailyLogsByDate).map((d: { total: number; subjects: Record<string, number> }) => d.total));
    }, [dailyLogsByDate]);


    const changeQuestionCalendarMonth = (offset: number) => {
        setQuestionCalendarCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const renderQuestionCalendar = () => {
        const year = questionCalendarCurrentDate.getFullYear();
        const month = questionCalendarCurrentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        const calendarDays = [];

        dayNames.forEach(day => {
            calendarDays.push(<div key={`q-header-${day}`} className="text-center font-bold text-gray-400 text-sm">{day}</div>);
        });

        const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
        for (let i = 0; i < startOffset; i++) {
            calendarDays.push(<div key={`q-empty-${i}`} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = getLocalDateString(date);
            const isToday = getLocalDateString() === dateString;
            const isSelected = getLocalDateString(questionCalendarSelectedDate) === dateString;

            const dailyLog = dailyLogsByDate[dateString];

            let dayBgClass = 'hover:bg-gray-700';
            let textColorClass = 'text-white';
            let style: React.CSSProperties = {};

            if (dailyLog) {
                const intensity = Math.min(1, Math.max(0.1, dailyLog.total / maxQuestionsInADay));
                dayBgClass = `bg-blue-800 hover:bg-blue-700`;
                style = { opacity: intensity };
            }

            if (isToday && !isSelected) {
                dayBgClass += ' ring-2 ring-blue-500';
            }

            if (isSelected) {
                dayBgClass = 'bg-blue-600 scale-110 ring-2 ring-blue-300';
                textColorClass = 'text-white';
                style = {};
            }

            calendarDays.push(
                <button
                    key={`q-day-${day}`}
                    onClick={() => setQuestionCalendarSelectedDate(date)}
                    className={`text-center aspect-square flex items-center justify-center rounded-lg transition-all transform font-semibold ${dayBgClass} ${textColorClass}`}
                    style={style}
                >
                    <span className="relative z-10">{day}</span>
                </button>
            );
        }

        return <div className="grid grid-cols-7 gap-1">{calendarDays}</div>;
    };


    // --- Report Components --- //
    const DailyQuestionsChart = () => {
        const data = useMemo(() => student.dailyLogs.reduce((acc, log) => {
            const existing = acc.find(item => item.date === log.date);
            if (existing) {
                existing.questions += log.questionsSolved;
            } else {
                acc.push({ date: log.date, questions: log.questionsSolved });
            }
            return acc;
        }, [] as { date: string; questions: number }[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [student.dailyLogs]);

        const formatDateTick = (tickItem: string) => {
            return new Date(tickItem).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        }

        if (data.length === 0) return <p className="text-gray-400 text-center p-8">Henüz günlük soru girişi yapılmamış.</p>

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis
                        dataKey="date"
                        stroke="#a0aec0"
                        angle={-45}
                        textAnchor="end"
                        tickFormatter={formatDateTick}
                        interval="preserveStartEnd"
                    />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#e2e8f0' }}
                        // FIX: The recharts Tooltip's labelFormatter can receive an 'unknown' type, which is not compatible with the `new Date()` constructor.
                        // This type guard ensures the label is a valid type before being used.
                        // FIX: Added a type guard to safely handle the 'unknown' type of the label from recharts before passing it to the Date constructor.
                        labelFormatter={(label: unknown) => {
                            if (typeof label === 'string' || typeof label === 'number' || label instanceof Date) {
                                return new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                            }
                            return String(label);
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 30 }} />
                    <Bar dataKey="questions" name="Soru Sayısı" fill="#4299e1" />
                    {data.length > 20 && <Brush dataKey="date" height={30} stroke="#3b82f6" tickFormatter={formatDateTick} y={230} />}
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const QuestionsBySubjectChart = () => {
        const data = useMemo(() => {
            const subjectMap: Record<string, number> = {};
            student.dailyLogs.forEach(log => {
                subjectMap[log.subject] = (subjectMap[log.subject] || 0) + log.questionsSolved;
            });
            return Object.entries(subjectMap)
                .map(([name, questions]) => ({ name, questions }))
                .sort((a, b) => b.questions - a.questions);
        }, [student.dailyLogs]);

        if (data.length === 0) return <p className="text-gray-400 text-center p-8">Ders bazında soru verisi bulunmuyor.</p>;

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#e2e8f0' }}
                        formatter={(value) => [value, 'Çözülen Soru']}
                    />
                    <Legend />
                    <Bar dataKey="questions" name="Toplam Soru" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const TrialExamProgressChart: React.FC<{ exams: TrialExam[] }> = ({ exams }) => {
        const data = useMemo(() => exams
            .map((exam, index) => ({
                name: exam.name || `Deneme ${index + 1}`,
                net: exam.totalCorrect - (exam.totalIncorrect / 4),
                date: exam.date,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [exams]);

        const formatTick = (name: string) => name.length > 15 ? `${name.substring(0, 12)}...` : name;

        if (data.length === 0) return <p className="text-gray-400 text-center p-8">Henüz deneme sınavı girişi yapılmamış.</p>

        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis
                        dataKey="name"
                        stroke="#a0aec0"
                        angle={-45}
                        textAnchor="end"
                        tickFormatter={formatTick}
                        interval={0}
                    />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ paddingTop: 30 }} />
                    <Line type="monotone" dataKey="net" name="Net" stroke="#48bb78" activeDot={{ r: 8 }} />
                    {data.length > 10 && <Brush dataKey="name" height={30} stroke="#3b82f6" y={230} />}
                </LineChart>
            </ResponsiveContainer>
        );
    }

    const SubjectCompletionChart = () => {
        const data = useMemo(() => student.subjects.map(subject => {
            const allTopics = SUBJECTS_DATA[student.examType]?.[subject] || [];
            const completedTopicsForSubject = student.completedTopics.filter(
                topicKey => topicKey.startsWith(`${subject}-`)
            ).length;
            const totalTopicsForSubject = allTopics.length;
            const percentage = totalTopicsForSubject > 0 ? (completedTopicsForSubject / totalTopicsForSubject) * 100 : 0;
            return {
                name: subject,
                percentage: Math.round(percentage),
            };
        }).sort((a, b) => a.percentage - b.percentage), [student.subjects, student.completedTopics, student.examType]);

        if (data.length === 0) return <p className="text-gray-400 text-center p-8">Öğrenciye atanmış ders bulunmuyor.</p>

        const yAxisTickFormatter = (name: string) => name.length > 20 ? `${name.substring(0, 18)}...` : name;

        return (
            <ResponsiveContainer width="100%" height={150 + data.length * 30}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis type="number" domain={[0, 100]} stroke="#a0aec0" tickFormatter={(tick) => `${tick}%`} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#a0aec0"
                        width={150}
                        tick={{ fontSize: 12 }}
                        tickFormatter={yAxisTickFormatter}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#e2e8f0' }}
                        formatter={(value) => [`${value}%`, 'Tamamlanma']}
                    />
                    <Legend />
                    <Bar dataKey="percentage" name="Tamamlanma Oranı" fill="#48bb78">
                        <LabelList dataKey="percentage" position="right" formatter={(value: number) => `${value}%`} style={{ fill: '#e2e8f0', fontSize: 12 }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    };

    const DetailedSubjectTopics = () => (
        <div className="space-y-4">
            {student.subjects.map(subject => {
                const topics = SUBJECTS_DATA[student.examType]?.[subject] || [];
                const completedCount = topics.filter(topic => student.completedTopics.includes(`${subject}-${topic}`)).length;
                const totalTopics = topics.length;

                if (totalTopics === 0) return null;

                const progress = (completedCount / totalTopics) * 100;

                return (
                    <details key={subject} className="bg-gray-700 rounded-lg open:bg-gray-700/80 transition">
                        <summary className="cursor-pointer p-4 font-semibold text-lg text-white list-none flex justify-between items-center">
                            <div className="flex items-center gap-4 w-1/3">
                                {subject}
                                <span className="text-sm font-normal text-gray-400">({completedCount} / {totalTopics})</span>
                            </div>
                            <div className="w-2/3 flex items-center gap-2">
                                <div className="w-full bg-gray-600 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-300">{Math.round(progress)}%</span>
                            </div>
                        </summary>
                        <div className="p-4 border-t border-gray-600">
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                                {topics.map(topic => {
                                    const topicKey = `${subject}-${topic}`;
                                    const isCompleted = student.completedTopics.includes(topicKey);
                                    return (
                                        <li key={topicKey} className="flex items-center justify-between gap-2">
                                            <div className="flex items-center space-x-3 min-w-0">
                                                {isCompleted ?
                                                    <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" /> :
                                                    <CircleIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                }
                                                <span className={`truncate ${isCompleted ? 'text-gray-200' : 'text-gray-400'}`}>{topic}</span>
                                            </div>
                                            <a
                                                href={getYouTubeSearchUrl(subject, topic)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-all flex-shrink-0"
                                                title="YouTube'da video ara"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </details>
                );
            })}
            {student.subjects.length === 0 && <p className="text-gray-400">Bu öğrenciye atanmış ders bulunmuyor.</p>}
        </div>
    );

    const AssignmentReport = () => {
        const { total, completed, rate, overdue } = useMemo(() => {
            const totalAssignments = student.assignments.length;
            const completedAssignments = student.assignments.filter(a => a.isCompleted).length;
            const todayString = getLocalDateString();
            const overdueAssignments = student.assignments.filter(a => !a.isCompleted && a.dueDate < todayString).length;
            const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
            return {
                total: totalAssignments,
                completed: completedAssignments,
                rate: completionRate,
                overdue: overdueAssignments,
            }
        }, [student.assignments]);

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-blue-400">Ödev İstatistikleri</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="text-center">
                            <p className="text-4xl font-bold text-blue-400">{total}</p>
                            <p className="text-gray-400">Toplam Ödev</p>
                        </Card>
                        <Card className="text-center">
                            <p className="text-4xl font-bold text-green-400">{completed}</p>
                            <p className="text-gray-400">Tamamlanan</p>
                        </Card>
                        <Card className="text-center">
                            <p className="text-4xl font-bold text-yellow-400">{rate}%</p>
                            <p className="text-gray-400">Tamamlanma Oranı</p>
                        </Card>
                        <Card className="text-center">
                            <p className="text-4xl font-bold text-red-400">{overdue}</p>
                            <p className="text-gray-400">Geciken</p>
                        </Card>
                    </div>
                </div>
                <Card className="max-w-lg mx-auto">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">Ödev Takvimi</h3>
                    {renderCalendar()}
                </Card>
            </div>
        )
    }

    const filteredTrialExams = useMemo(() => {
        if (student.examType !== EXAM_TYPES.TYT_AYT || examTypeFilter === 'all') {
            return student.trialExams;
        }
        return student.trialExams.filter(exam => exam.type === examTypeFilter);
    }, [student.trialExams, student.examType, examTypeFilter]);

    const TrialExamsReport: React.FC<{ exams: TrialExam[] }> = ({ exams }) => {
        if (exams.length === 0) {
            return <Card><p className="text-gray-400 text-center py-4">Filtreye uygun kaydedilmiş deneme sınavı yok.</p></Card>;
        }

        const calculateNet = (correct: number, incorrect: number) => correct - (incorrect / 4);

        const sortedExams = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return (
            <div className="space-y-4">
                {sortedExams.map(exam => {
                    const totalNet = calculateNet(exam.totalCorrect, exam.totalIncorrect);
                    return (
                        <details key={exam.id} className="bg-gray-700 rounded-lg open:bg-gray-700/80 transition">
                            <summary className="cursor-pointer p-4 font-semibold text-lg text-white list-none flex justify-between items-center">
                                <div>
                                    <span>{exam.name}</span>
                                    {exam.type && (
                                        <span className="ml-2 text-xs font-semibold uppercase bg-blue-500 text-white px-2 py-1 rounded-full align-middle">
                                            {exam.type}
                                        </span>
                                    )}
                                    <span className="text-sm font-normal text-gray-400 ml-2">({new Date(exam.date).toLocaleDateString('tr-TR')})</span>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-green-400">{exam.totalCorrect} D</span>
                                    <span className="text-red-400">{exam.totalIncorrect} Y</span>
                                    <span className="text-gray-400">{exam.totalBlank} B</span>
                                    <span className="font-bold text-blue-400">{totalNet.toFixed(2)} Net</span>
                                </div>
                            </summary>
                            <div className="p-4 border-t border-gray-600">
                                <div className="grid grid-cols-6 gap-2 font-bold text-gray-400 text-sm mb-2 px-2">
                                    <span className="col-span-2">Ders</span>
                                    <span>Doğru</span>
                                    <span>Yanlış</span>
                                    <span>Boş</span>
                                    <span>Net</span>
                                </div>
                                <ul className="space-y-1">
                                    {exam.subjectResults.map(res => (
                                        <li key={res.subject} className="grid grid-cols-6 gap-2 bg-gray-800 p-2 rounded items-center">
                                            <span className="col-span-2 font-semibold">{res.subject}</span>
                                            <span className="text-green-400">{res.correct}</span>
                                            <span className="text-red-400">{res.incorrect}</span>
                                            <span className="text-gray-400">{res.blank || 0}</span>
                                            <span className="font-semibold text-blue-400">{calculateNet(res.correct, res.incorrect).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    );
                })}
            </div>
        );
    };

    const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-semibold transition-all rounded-lg whitespace-nowrap ${activeTab === tabName
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
        >
            {label}
        </button>
    );

    const ReportTabButton: React.FC<{ name: string, label: string }> = ({ name, label }) => (
        <button onClick={() => setActiveReportTab(name)} className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeReportTab === name ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {label}
        </button>
    );

    const ExamTypeFilterButton: React.FC<{ name: 'all' | 'TYT' | 'AYT'; label: string; }> = ({ name, label }) => (
        <button
            onClick={() => setExamTypeFilter(name)}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${examTypeFilter === name ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Modern Header */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            onClick={onBack}
                            variant="secondary"
                            className="flex items-center gap-1.5 sm:gap-2 hover:bg-gray-700 h-8 sm:h-10 px-2 sm:px-4 flex-shrink-0"
                        >
                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm sm:text-base">Geri</span>
                        </Button>

                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-lg sm:text-2xl font-bold text-white">{student.name.charAt(0)}</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-base sm:text-2xl font-bold text-white truncate">{student.name}</h1>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                                    <span className="truncate">{student.examType}</span>
                                    {student.field && (
                                        <>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="truncate hidden sm:inline">{student.field}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {student.dailyLogs.length > 0 && (
                                <div className="flex items-center gap-1.5 sm:gap-2 bg-green-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs font-medium text-green-400 hidden sm:inline">Aktif</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Tab Navigation - Mobil Uyumlu */}
                <div className="mb-4 sm:mb-8">
                    <nav className="flex gap-1 sm:gap-2 p-1 bg-gray-800/50 rounded-lg sm:rounded-xl backdrop-blur-sm border border-gray-700 overflow-x-auto">
                        <TabButton tabName="reports" label="📊 Raporlar" />
                        <TabButton tabName="assignments" label="📝 Ödevler" />
                        <TabButton tabName="books" label="📚 Kitaplar" />
                        <TabButton tabName="info" label="👤 Bilgiler" />
                    </nav>
                </div>

                <div className="mt-4 sm:mt-6">
                    {activeTab === 'reports' && (
                        <div>
                            <div className="p-1.5 sm:p-2 bg-gray-900/50 rounded-lg flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 self-start overflow-x-auto">
                                <ReportTabButton name="deneme" label="Deneme Raporu" />
                                <ReportTabButton name="soru" label="Soru Sayısı Raporu" />
                                {student.examType !== EXAM_TYPES.GENEL_TAKIP && <ReportTabButton name="konu" label="Konu Raporu" />}
                                <ReportTabButton name="odev" label="Ödev Raporu" />
                            </div>

                            {activeReportTab === 'deneme' && (
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 animate-fade-in-down">
                                    {student.examType === EXAM_TYPES.TYT_AYT && (
                                        <div className="p-1.5 sm:p-2 bg-gray-900/50 rounded-lg flex gap-1.5 sm:gap-2 self-start overflow-x-auto">
                                            <ExamTypeFilterButton name="all" label="Tümü" />
                                            <ExamTypeFilterButton name="TYT" label="TYT" />
                                            <ExamTypeFilterButton name="AYT" label="AYT" />
                                        </div>
                                    )}
                                    <Card>
                                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-400">
                                            Deneme Sınavı Netleri {student.examType === EXAM_TYPES.TYT_AYT && examTypeFilter !== 'all' && `(${examTypeFilter})`}
                                        </h3>
                                        <TrialExamProgressChart exams={filteredTrialExams} />
                                    </Card>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-400">
                                            Deneme Sınavları {student.examType === EXAM_TYPES.TYT_AYT && examTypeFilter !== 'all' && `(${examTypeFilter})`}
                                        </h3>
                                        <TrialExamsReport exams={filteredTrialExams} />
                                    </div>
                                </div>
                            )}
                            {activeReportTab === 'soru' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-down">
                                    {/* Left Column: Calendar and Daily Details */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <Card>
                                            <div className="flex justify-between items-center mb-4">
                                                <Button onClick={() => changeQuestionCalendarMonth(-1)} variant="secondary">&lt;</Button>
                                                <h3 className="text-xl font-bold text-blue-400">
                                                    {questionCalendarCurrentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                                                </h3>
                                                <Button onClick={() => changeQuestionCalendarMonth(1)} variant="secondary">&gt;</Button>
                                            </div>
                                            {renderQuestionCalendar()}
                                        </Card>
                                        <Card>
                                            <h3 className="text-lg font-bold text-blue-400 mb-2 border-b border-gray-600 pb-2">
                                                {questionCalendarSelectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })} Günü Raporu
                                            </h3>
                                            {logsForSelectedQuestionDate ? (
                                                <div>
                                                    <p className="text-2xl font-bold text-white mb-4">Toplam {logsForSelectedQuestionDate.total} Soru</p>
                                                    <ul className="space-y-2">
                                                        {Object.entries(logsForSelectedQuestionDate.subjects).map(([subject, count]) => (
                                                            <li key={subject} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                                                                <span className="text-gray-300">{subject}</span>
                                                                <span className="font-semibold text-white">{count} soru</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="text-gray-400">Bu gün için soru girişi yapılmamış.</p>
                                            )}
                                        </Card>
                                    </div>

                                    {/* Right Column: Charts */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card>
                                            <h3 className="text-xl font-bold mb-4 text-blue-400">Günlük Çözülen Toplam Sorular (Genel Bakış)</h3>
                                            <DailyQuestionsChart />
                                        </Card>
                                        <Card>
                                            <h3 className="text-xl font-bold mb-4 text-blue-400">Tüm Zamanlar Soru Dağılımı</h3>
                                            <QuestionsBySubjectChart />
                                        </Card>
                                    </div>
                                </div>
                            )}
                            {activeReportTab === 'konu' && student.examType !== EXAM_TYPES.GENEL_TAKIP && (
                                <div className="grid grid-cols-1 gap-6 animate-fade-in-down">
                                    <Card>
                                        <h3 className="text-xl font-bold mb-4 text-blue-400">Derslere Göre Konu Tamamlama Oranı</h3>
                                        <SubjectCompletionChart />
                                    </Card>
                                    <Card>
                                        <h3 className="text-xl font-bold mb-4 text-blue-400">Konu İlerleme Detayları</h3>
                                        <DetailedSubjectTopics />
                                    </Card>
                                </div>
                            )}
                            {activeReportTab === 'odev' && (
                                <div className="animate-fade-in-down">
                                    <AssignmentReport />
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'assignments' && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-3">
                                <Card className="max-w-lg mx-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <Button onClick={() => changeMonth(-1)} variant="secondary">&lt;</Button>
                                        <h3 className="text-xl font-bold text-blue-400">
                                            {currentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <Button onClick={() => changeMonth(1)} variant="secondary">&gt;</Button>
                                    </div>
                                    {renderCalendar()}
                                </Card>
                            </div>
                            <div className="lg:col-span-2">
                                <Card className="h-full">
                                    <h3 className="text-lg font-bold text-blue-400 mb-2 border-b border-gray-600 pb-2">
                                        {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </h3>
                                    <Button onClick={() => setModal('ai-plan')} className="w-full mb-2 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <span>🤖</span> AI ile Plan Oluştur
                                    </Button>
                                    <Button onClick={openAssignmentModalForSelectedDate} className="w-full mb-4 flex items-center justify-center gap-2">
                                        <PlusIcon className="h-5 w-5" /> Bu Güne Ödev Ekle
                                    </Button>
                                    <h4 className="font-semibold text-gray-300 mb-2">Günün Ödevleri:</h4>
                                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                                        {assignmentsForSelectedDay.length > 0 ? assignmentsForSelectedDay.map(a => (
                                            <li key={a.id} className="bg-gray-700 p-3 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-grow mr-2">
                                                        <button
                                                            onClick={() => setExpandedAssignmentId(prev => prev === a.id ? null : a.id)}
                                                            className={`font-semibold text-left w-full focus:outline-none transition-colors ${a.isCompleted ? 'line-through text-gray-500' : 'hover:text-blue-400'}`}
                                                            aria-expanded={expandedAssignmentId === a.id}
                                                            aria-controls={`assignment-desc-${a.id}`}
                                                        >
                                                            {a.title}
                                                        </button>
                                                        {expandedAssignmentId === a.id && (
                                                            <p
                                                                id={`assignment-desc-${a.id}`}
                                                                className="text-sm text-gray-400 mt-2 pt-2 border-t border-gray-600"
                                                            >
                                                                {a.description || "Bu ödev için açıklama yok."}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center flex-shrink-0 ml-2 space-x-3">
                                                        <button
                                                            onClick={() => toggleAssignmentCompletion(student.id, a.id)}
                                                            className="text-gray-400 hover:text-white"
                                                            title="Tamamlanma durumunu değiştir"
                                                        >
                                                            {a.isCompleted ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-gray-500" />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingAssignment(a)}
                                                            className="text-gray-400 hover:text-blue-400"
                                                            title="Ödevi düzenle"
                                                        >
                                                            <EditIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setAssignmentToDelete(a)}
                                                            className="text-gray-400 hover:text-red-500"
                                                            title="Ödevi sil"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className={`mt-2 inline-block px-2 py-1 text-xs font-bold rounded-full ${a.isCompleted ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>{a.isCompleted ? 'Tamamlandı' : 'Bekliyor'}</span>
                                            </li>
                                        )) : <p className="text-gray-400">Bu gün için atanmış ödev yok.</p>}
                                    </ul>
                                </Card>
                            </div>
                        </div>
                    )}
                    {activeTab === 'books' && (
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-blue-400">Öğrencinin Kitapları</h3>
                                <Button onClick={() => setModal('book')} className="flex items-center gap-2"><PlusIcon className="h-5 w-5" />Kitap Ekle</Button>
                            </div>
                            <ul className="space-y-3">
                                {(student.books || []).length > 0 ? student.books.map(b => (
                                    <li key={b.id} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                                        <p className="font-semibold">{b.name}</p>
                                        <button onClick={() => deleteBook(student.id, b.id)} className="text-red-400 hover:text-red-600">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </li>
                                )) : <p>Henüz kitap eklenmemiş.</p>}
                            </ul>
                        </Card>
                    )}
                    {activeTab === 'info' && (
                        <Card>
                            {isEditingInfo ? (
                                <>
                                    <h3 className="text-xl font-bold text-blue-400 mb-4">Öğrenci Bilgilerini Düzenle</h3>
                                    <form onSubmit={handleUpdateStudent}>
                                        <Input
                                            label="Tam Ad"
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={editedStudent.name}
                                            onChange={handleStudentInfoChange}
                                            required
                                        />
                                        <Select
                                            label="Sınav Türü"
                                            id="examType"
                                            name="examType"
                                            value={editedStudent.examType}
                                            onChange={handleStudentInfoChange}
                                            required
                                        >
                                            <option value="">Sınav türü seçin</option>
                                            {Object.values(EXAM_TYPES).map(et => <option key={et} value={et}>{et}</option>)}
                                        </Select>
                                        {editedStudent.examType === EXAM_TYPES.TYT_AYT && (
                                            <Select
                                                label="Alan"
                                                id="field"
                                                name="field"
                                                value={editedStudent.field || ''}
                                                onChange={handleStudentInfoChange}
                                                required
                                            >
                                                <option value="">Alan seçin</option>
                                                {Object.values(AYT_FIELDS).map(f => <option key={f} value={f}>{f}</option>)}
                                            </Select>
                                        )}

                                        <div className="mt-6">
                                            <h4 className="text-lg font-semibold text-gray-300 mb-2">Atanacak Dersleri Düzenle</h4>
                                            <p className="text-sm text-gray-400 mb-3">Öğrencinin sınav türüne göre önerilen dersler aşağıdadır. İstediğiniz dersi çıkarabilir veya ekleyebilirsiniz.</p>
                                            <div className="flex flex-wrap gap-2 p-3 bg-gray-700 rounded-lg max-h-48 overflow-y-auto">
                                                {getSubjectsForStudent(editedStudent.examType, editedStudent.field).map(subj => (
                                                    <label key={subj} className="flex items-center space-x-2 cursor-pointer bg-gray-600 px-3 py-1 rounded-full hover:bg-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempSubjects.includes(subj)}
                                                            onChange={() => handleSubjectToggle(subj)}
                                                            className="form-checkbox h-4 w-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="text-white text-sm font-medium">{subj}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-6">
                                            <Button type="submit" className="w-full">Değişiklikleri Kaydet</Button>
                                            <Button type="button" variant="secondary" onClick={handleCancelEdit} className="w-full">İptal</Button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-blue-400">Öğrenci Bilgileri</h3>
                                        <Button onClick={() => setIsEditingInfo(true)}>Düzenle</Button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-400 font-bold">Tam Ad</p>
                                            <p className="text-lg text-gray-200">{student.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 font-bold">Sınav Türü</p>
                                            <p className="text-lg text-gray-200">{student.examType}</p>
                                        </div>
                                        {student.field && (
                                            <div>
                                                <p className="text-sm text-gray-400 font-bold">Alan</p>
                                                <p className="text-lg text-gray-200">{student.field}</p>
                                            </div>
                                        )}
                                        <div className="pt-2">
                                            <p className="text-sm text-gray-400 font-bold mb-2">Atanan Dersler</p>
                                            <div className="flex flex-wrap gap-2">
                                                {student.subjects.map(subj => (
                                                    <span key={subj} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm font-medium">{subj}</span>
                                                ))}
                                                {student.subjects.length === 0 && <p className="text-gray-400">Atanmış ders bulunmuyor.</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-red-500/30">
                                        <h4 className="text-lg font-bold text-red-400 mb-2">Tehlikeli Alan</h4>
                                        <p className="text-sm text-gray-400 mb-4">Bu işlem geri alınamaz. Lütfen dikkatli olun.</p>
                                        <Button
                                            onClick={() => setDeleteConfirmOpen(true)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Bu Öğrenciyi Sil
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card>
                    )}
                </div>

                {/* Modals */}
                <Modal isOpen={modal === 'assignment'} onClose={() => setModal(null)} title="Yeni Ödev Oluştur">
                    <form onSubmit={handleAddAssignment}>
                        <Input label="Başlık" value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} required />
                        <Input label="Açıklama" value={assignmentDesc} onChange={e => setAssignmentDesc(e.target.value)} />
                        <Input label="Bitiş Tarihi" type="date" value={assignmentDueDate} onChange={e => setAssignmentDueDate(e.target.value)} required />
                        <Button type="submit" className="w-full mt-4">Ata</Button>
                    </form>
                </Modal>
                <Modal isOpen={!!editingAssignment} onClose={() => setEditingAssignment(null)} title="Ödevi Düzenle">
                    {editingAssignment && (
                        <form onSubmit={handleUpdateAssignment}>
                            <Input
                                label="Başlık"
                                id="edit-title"
                                value={editingAssignment.title}
                                onChange={e => setEditingAssignment(prev => prev ? { ...prev, title: e.target.value } : null)}
                                required
                            />
                            <Input
                                label="Açıklama"
                                id="edit-desc"
                                value={editingAssignment.description}
                                onChange={e => setEditingAssignment(prev => prev ? { ...prev, description: e.target.value } : null)}
                            />
                            <Input
                                label="Bitiş Tarihi"
                                id="edit-due-date"
                                type="date"
                                value={editingAssignment.dueDate.split('T')[0]}
                                onChange={e => setEditingAssignment(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                                required
                            />
                            <Button type="submit" className="w-full mt-4">Güncelle</Button>
                        </form>
                    )}
                </Modal>
                <Modal isOpen={modal === 'book'} onClose={() => setModal(null)} title="Yeni Kitap Ekle">
                    <form onSubmit={handleAddBook}>
                        <Input label="Kitap Adı" value={bookName} onChange={e => setBookName(e.target.value)} required />
                        <Button type="submit" className="w-full mt-4">Kitap Ekle</Button>
                    </form>
                </Modal>
                <Modal
                    isOpen={!!assignmentToDelete}
                    onClose={() => setAssignmentToDelete(null)}
                    title="Ödevi Sil"
                >
                    <div>
                        <p className="text-gray-300 mb-6">
                            <span className="font-bold text-white">"{assignmentToDelete?.title}"</span> başlıklı ödevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex justify-end gap-4">
                            <Button variant="secondary" onClick={() => setAssignmentToDelete(null)}>
                                İptal
                            </Button>
                            <Button
                                onClick={() => {
                                    if (assignmentToDelete) {
                                        deleteAssignment(student.id, assignmentToDelete.id);
                                        setAssignmentToDelete(null);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Evet, Sil
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={isDeleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    title="Öğrenciyi Sil"
                >
                    <div>
                        <p className="text-gray-300 mb-6">
                            <span className="font-bold text-white">"{student.name}"</span> adlı öğrenciyi kalıcı olarak silmek istediğinizden emin misiniz? Bu öğrenciye ait tüm veriler (ödevler, raporlar, sınav sonuçları) silinecektir. Bu işlem geri alınamaz.
                        </p>
                        <div className="flex justify-end gap-4">
                            <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>
                                İptal
                            </Button>
                            <Button
                                onClick={() => {
                                    deleteStudent(student.id);
                                    setDeleteConfirmOpen(false);
                                    onBack();
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Evet, Kalıcı Olarak Sil
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* AI Plan Modal */}
                <Modal isOpen={modal === 'ai-plan'} onClose={() => setModal(null)} title="🤖 Yapay Zeka ile Ders Planı Oluştur">
                    <div className="space-y-4">
                        {!generatedPlan ? (
                            <>
                                {/* Hazır Şablonlar */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">📋 Hazır Şablonlar (Tek Tıkla Doldur)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AI_PROMPT_TEMPLATES.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => setAiPrompt(template.prompt)}
                                                className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-blue-600 border border-gray-600 hover:border-blue-500 rounded-full text-gray-300 hover:text-white transition-all"
                                            >
                                                {template.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Bu plan için ne öğretmek istiyorsunuz?</label>
                                    <textarea
                                        value={aiPrompt}
                                        onChange={e => setAiPrompt(e.target.value)}
                                        placeholder="Örn: Matematik'te Türev, Integral ve Limit konularını kapsamlı şekilde çalış. Fizik'ten de Mekanik problemleri çöz."
                                        className="w-full h-24 p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Plan Süresi ve Günlük Saat */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">📅 Kaç Günlük Plan?</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max="60"
                                                value={aiPlanDuration}
                                                onChange={e => setAiPlanDuration(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
                                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-400 text-sm whitespace-nowrap">gün</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">⏰ Günlük Çalışma</label>
                                        <select
                                            value={aiDailyHours}
                                            onChange={e => setAiDailyHours(Number(e.target.value))}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {DAILY_STUDY_HOURS.map(hours => (
                                                <option key={hours.value} value={hours.value}>{hours.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Zorluk Seviyesi</label>
                                    <select
                                        value={aiDifficulty}
                                        onChange={e => setAiDifficulty(e.target.value)}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option>Kolay</option>
                                        <option>Orta</option>
                                        <option>Zor</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Öncelikli Dersler (İsteğe Bağlı)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {student.subjects.slice(0, 6).map(subject => (
                                            <label key={subject} className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full border transition-all ${aiPrioritySubjects.includes(subject) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={aiPrioritySubjects.includes(subject)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setAiPrioritySubjects([...aiPrioritySubjects, subject]);
                                                        } else {
                                                            setAiPrioritySubjects(aiPrioritySubjects.filter(s => s !== subject));
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                                <span className="text-sm">{subject}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {aiError && (
                                    <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-red-400 text-sm">
                                        ❌ {aiError}
                                    </div>
                                )}

                                <Button
                                    onClick={handleGeneratePlan}
                                    disabled={isGeneratingPlan}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    {isGeneratingPlan ? '⏳ Yapay Zeka Plan Oluşturuyor...' : `✨ ${aiPlanDuration} Günlük Plan Oluştur`}
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="bg-green-500/10 border border-green-500/50 rounded p-3 text-green-400 text-sm mb-4">
                                    ✅ {aiPlanDuration} günlük plan başarıyla oluşturuldu! (Günlük {aiDailyHours} saat)
                                </div>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {generatedPlan.map((task, index) => (
                                        <div key={index} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-blue-400">
                                                        📅 Gün {task.day}: {task.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                                                </div>
                                                {task.topic && (
                                                    <a
                                                        href={getYouTubeSearchUrl(task.subject, task.topic)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all flex-shrink-0"
                                                        title={`${task.topic} için YouTube'da video ara`}
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                        </svg>
                                                        Video İzle
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setGeneratedPlan(null);
                                            setAiPrompt('');
                                        }}
                                        className="flex-1"
                                    >
                                        İptal
                                    </Button>
                                    <Button
                                        onClick={handleSaveAiPlan}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                    >
                                        💾 Planı Kaydet
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

const CoachDashboard = () => {
    const { students, currentUser, logout } = useApp();
    const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const coachStudents = useMemo(() => students.filter(s => s.coachId === currentUser?.id), [students, currentUser]);

    const recentAssignments = useMemo(() => {
        return coachStudents
            .flatMap(s => s.assignments.map(a => ({ ...a, studentName: s.name })))
            .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
            .slice(0, 5);
    }, [coachStudents]);

    const stats = useMemo(() => {
        const totalStudents = coachStudents.length;
        const totalAssignments = coachStudents.reduce((acc, s) => acc + s.assignments.length, 0);
        const completedAssignments = coachStudents.reduce((acc, s) => acc + s.assignments.filter(a => a.isCompleted).length, 0);
        const activeStudents = coachStudents.filter(s => s.dailyLogs.length > 0).length;

        return { totalStudents, totalAssignments, completedAssignments, activeStudents };
    }, [coachStudents]);

    if (selectedStudent) {
        return <StudentDetailPage student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Modern Header - Mobil Uyumlu */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-xl sm:text-2xl font-bold text-white">K</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">Koç Paneli</h1>
                                <p className="text-xs sm:text-sm text-gray-400 truncate">Hoş geldiniz, {currentUser?.name}</p>
                            </div>
                        </div>
                        <Button
                            onClick={logout}
                            variant="secondary"
                            className="flex items-center gap-1 sm:gap-2 hover:bg-gray-700 px-2 sm:px-4 py-2 flex-shrink-0"
                        >
                            <LogoutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">Çıkış</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Stats Cards - Mobil Uyumlu */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-400 text-xs sm:text-sm font-medium">Toplam Öğrenci</h3>
                            <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalStudents}</p>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">Kayıtlı öğrenci sayısı</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-400 text-xs sm:text-sm font-medium">Aktif Öğrenci</h3>
                            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{stats.activeStudents}</p>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">Soru çözen öğrenci</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-400 text-xs sm:text-sm font-medium">Toplam Görev</h3>
                            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalAssignments}</p>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">Atanan görev sayısı</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-400 text-xs sm:text-sm font-medium">Tamamlanan</h3>
                            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{stats.completedAssignments}</p>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">Tamamlanan görev</p>
                    </div>
                </div>

                {/* Main Content Grid - Mobil Uyumlu */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Students List */}
                    <div className="lg:col-span-2">
                        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white">Öğrencilerim</h2>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{coachStudents.length} kayıtlı öğrenci</p>
                                </div>
                                <Button
                                    onClick={() => setAddStudentModalOpen(true)}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
                                >
                                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="text-sm sm:text-base">Yeni Öğrenci</span>
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {coachStudents.length > 0 ? coachStudents.map(student => {
                                    const completionRate = student.assignments.length > 0
                                        ? Math.round((student.assignments.filter(a => a.isCompleted).length / student.assignments.length) * 100)
                                        : 0;

                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => setSelectedStudent(student)}
                                            className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-blue-500/50 p-3 sm:p-5 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 group"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-lg sm:text-xl font-bold text-white">{student.name.charAt(0)}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-base sm:text-lg text-white truncate">{student.name}</p>
                                                            {student.dailyLogs.length > 0 && (
                                                                <span className="h-2 w-2 bg-green-400 rounded-full flex-shrink-0"></span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs sm:text-sm text-gray-400 truncate">{student.examType}</p>
                                                            {student.field && (
                                                                <>
                                                                    <span className="text-gray-600 hidden sm:inline">•</span>
                                                                    <p className="text-xs sm:text-sm text-gray-400 truncate hidden sm:block">{student.field}</p>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="mt-2 sm:mt-3">
                                                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                                <span className="truncate">Görev Tamamlama</span>
                                                                <span className="ml-2 flex-shrink-0">{completionRate}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${completionRate}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0">
                                                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-8 sm:py-12 px-4">
                                        <UserIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
                                        <p className="text-gray-400 text-base sm:text-lg mb-1 sm:mb-2">Henüz öğrenci eklemediniz</p>
                                        <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">İlk öğrencinizi ekleyerek başlayın</p>
                                        <Button onClick={() => setAddStudentModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 w-full sm:w-auto">
                                            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" /> İlk Öğrenciyi Ekle
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activities - Mobil Uyumlu */}
                    <div className="space-y-4 sm:space-y-6">
                        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-lg sm:text-xl font-bold text-white">Son Aktiviteler</h2>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                {recentAssignments.length > 0 ? recentAssignments.map(a => (
                                    <div key={a.id} className="bg-gray-700/50 border border-gray-600 p-3 sm:p-4 rounded-lg hover:border-blue-500/30 transition-colors">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <p className="font-semibold text-sm sm:text-base text-white line-clamp-2">{a.title}</p>
                                            {a.isCompleted && (
                                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">Tamamlandı</span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-400 mb-1 truncate">👤 {a.studentName}</p>
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate">{new Date(a.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-6 sm:py-8">
                                        <svg className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-2 sm:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <p className="text-gray-400 text-xs sm:text-sm">Henüz aktivite yok</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Quick Actions - Mobil Uyumlu */}
                        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20 backdrop-blur-sm">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Hızlı İşlemler</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setAddStudentModalOpen(true)}
                                    className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-blue-500/50 p-2.5 sm:p-3 rounded-lg text-left transition-all flex items-center gap-2 sm:gap-3 group"
                                >
                                    <div className="h-9 w-9 sm:h-10 sm:w-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors flex-shrink-0">
                                        <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm sm:text-base text-white">Yeni Öğrenci</p>
                                        <p className="text-xs text-gray-400 hidden sm:block">Sisteme öğrenci ekle</p>
                                    </div>
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setAddStudentModalOpen(false)} />
        </div>
    );
};

// --- MAIN APP COMPONENT --- //

const AppContent: React.FC<{
    loginRole: UserRole | null;
    setLoginRole: (role: UserRole | null) => void;
}> = ({ loginRole, setLoginRole }) => {
    const { currentUser, isLoading, isCheckingSession } = useApp();

    if (isLoading || isCheckingSession) {
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    if (!currentUser) {
        if (!loginRole) {
            return <RoleSelectionScreen onSelectRole={setLoginRole} />;
        }
        return <LoginForm role={loginRole} onBack={() => setLoginRole(null)} />;
    }

    if (currentUser.role === 'coach') {
        return <CoachDashboard />;
    }

    if (currentUser.role === 'student') {
        return <StudentDashboard />;
    }

    return <div>Hata: Bilinmeyen kullanıcı rolü.</div>;
};


function App() {
    const appData = useAppDataWithSupabase();
    const [loginRole, setLoginRole] = useState<UserRole | null>(null);

    const handleLogout = useCallback(() => {
        appData.logout();
        setLoginRole(null);
    }, [appData]);

    const contextValue = useMemo(() => (
        appData.currentUser
            ? { ...appData, logout: handleLogout }
            : appData
    ), [appData, handleLogout]);

    return (
        <AppContext.Provider value={contextValue}>
            <div className="min-h-screen bg-dark">
                <AppContent loginRole={loginRole} setLoginRole={setLoginRole} />
            </div>
        </AppContext.Provider>
    );
}

export default App;


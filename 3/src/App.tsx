import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { generateStudyPlan } from './lib/aiService';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  subject: string;
}

interface StudyPlan {
  day: number;
  title: string;
  description: string;
  subject: string;
}

function App() {
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  
  // AI Plan States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Orta');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [prioritySubjects, setPrioritySubjects] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    const storedName = localStorage.getItem('studentName');
    if (storedId && storedName) {
      setStudentId(storedId);
      setStudentName(storedName);
      setIsLoggedIn(true);
      loadAssignments(storedId);
      loadStudentSubjects(storedId);
    }
  }, []);

  const loadAssignments = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('student_id', id)
      .order('dueDate', { ascending: true });
    
    if (!error && data) {
      setAssignments(data);
    }
    setLoading(false);
  };

  const loadStudentSubjects = async (id: string) => {
    const { data } = await supabase
      .from('students')
      .select('subjects')
      .eq('id', id)
      .single();
    
    if (data && data.subjects) {
      setSubjects(data.subjects);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim() && studentName.trim()) {
      localStorage.setItem('studentId', studentId);
      localStorage.setItem('studentName', studentName);
      setIsLoggedIn(true);
      loadAssignments(studentId);
      loadStudentSubjects(studentId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    setIsLoggedIn(false);
    setStudentId('');
    setStudentName('');
    setAssignments([]);
  };

  const toggleAssignment = async (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    const { error } = await supabase
      .from('assignments')
      .update({ isCompleted: !assignment.isCompleted })
      .eq('id', id);

    if (!error) {
      setAssignments(assignments.map(a =>
        a.id === id ? { ...a, isCompleted: !a.isCompleted } : a
      ));
    }
  };

  const handleGeneratePlan = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Lütfen çalışma planı için talimat yazın');
      return;
    }

    setIsGenerating(true);
    setAiError(null);
    setGeneratedPlan(null);

    try {
      const plan = await generateStudyPlan({
        examType: 'TYT & AYT',
        subjects: subjects,
        prompt: aiPrompt,
        difficulty: aiDifficulty,
        prioritySubjects: prioritySubjects.length > 0 ? prioritySubjects : undefined
      });
      
      setGeneratedPlan(plan);
    } catch (error) {
      console.error('Plan oluşturma hatası:', error);
      setAiError(error instanceof Error ? error.message : 'Plan oluşturulurken hata oluştu');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    const today = new Date();
    const newAssignments = generatedPlan.map(task => ({
      student_id: studentId,
      title: task.title,
      description: task.description,
      subject: task.subject,
      dueDate: new Date(today.getTime() + (task.day - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isCompleted: false
    }));

    const { error } = await supabase
      .from('assignments')
      .insert(newAssignments);

    if (!error) {
      loadAssignments(studentId);
      setShowAiModal(false);
      setGeneratedPlan(null);
      setAiPrompt('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎓 Öğrenci Portalı</h1>
            <p className="text-gray-600">AI Destekli Çalışma Planı</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Öğrenci ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Öğrenci ID'nizi girin"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Adınız</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Adınızı girin"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Merhaba, {studentName}! 👋</h1>
              <p className="text-gray-600 mt-1">AI destekli çalışma planınız hazır</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>

        {/* AI Plan Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAiModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🤖</span>
            <span>AI ile Çalışma Planı Oluştur</span>
          </button>
        </div>

        {/* Assignments */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Ödevlerim</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Yükleniyor...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Henüz ödeviniz yok</p>
              <p className="text-gray-400 mt-2">AI ile çalışma planı oluşturun!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    assignment.isCompleted
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={assignment.isCompleted}
                      onChange={() => toggleAssignment(assignment.id)}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${assignment.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {assignment.title}
                      </h3>
                      <p className={`text-sm mt-1 ${assignment.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                        {assignment.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-purple-600 font-semibold">{assignment.subject}</span>
                        <span className="text-gray-500">📅 {new Date(assignment.dueDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Modal */}
        {showAiModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">🤖 AI Çalışma Planı</h2>
                  <button
                    onClick={() => {
                      setShowAiModal(false);
                      setGeneratedPlan(null);
                      setAiError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {!generatedPlan ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-blue-800">
                      <p className="font-semibold mb-2">💡 İpucu:</p>
                      <p>Hangi dersleri ve konuları çalışmak istediğinizi belirtin</p>
                      <p className="mt-1 text-xs">Örn: "Türkçe'de Sözcükte Anlam ve Cümlede Anlam konularına yoğunlaş"</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Bu hafta ne çalışmak istiyorsunuz?</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        placeholder="Örn: Matematik'te Türev ve İntegral konularını çalış. Fizik'ten de Newton Kanunları problemleri çöz."
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Zorluk Seviyesi</label>
                      <select
                        value={aiDifficulty}
                        onChange={(e) => setAiDifficulty(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option>Kolay</option>
                        <option>Orta</option>
                        <option>Zor</option>
                      </select>
                    </div>

                    {subjects.length > 0 && (
                      <div>
                        <label className="block font-semibold text-gray-700 mb-2">Öncelikli Dersler (İsteğe Bağlı)</label>
                        <div className="space-y-2">
                          {subjects.slice(0, 6).map(subject => (
                            <label key={subject} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={prioritySubjects.includes(subject)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setPrioritySubjects([...prioritySubjects, subject]);
                                  } else {
                                    setPrioritySubjects(prioritySubjects.filter(s => s !== subject));
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-700">{subject}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiError && (
                      <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-700">
                        ❌ {aiError}
                      </div>
                    )}

                    <button
                      onClick={handleGeneratePlan}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? '⏳ Plan Oluşturuluyor...' : '✨ Planı Oluştur'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-green-800">
                      ✅ 7 günlük çalışma planınız hazır!
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {generatedPlan.map((task, index) => (
                        <div key={index} className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                              {task.day}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{task.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                                {task.subject}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setGeneratedPlan(null);
                          setAiPrompt('');
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        İptal
                      </button>
                      <button
                        onClick={handleSavePlan}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                      >
                        💾 Planı Kaydet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

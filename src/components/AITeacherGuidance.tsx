import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle2,
  Printer,
  Save,
  Share2,
  Lightbulb,
  Users,
  Target,
  Clock,
  Layers,
  HelpCircle,
  Edit3,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { UserRole, Student, SavedLessonPlan } from '../types';
import {
  generateCurriculumLessonPlan,
  generateCurriculumQuiz,
  LessonPlanResult,
  QuizGenerationResult,
} from '../utils/aiCurriculum';

interface AITeacherGuidanceProps {
  currentRole: UserRole;
  students: Student[];
  savedPlans: SavedLessonPlan[];
  onSavePlan: (plan: SavedLessonPlan) => void;
}

export const AITeacherGuidance: React.FC<AITeacherGuidanceProps> = ({
  currentRole,
  students,
  savedPlans,
  onSavePlan,
}) => {
  const [activeTab, setActiveTab] = useState<'lesson_planner' | 'quiz_generator' | 'cohort_summary' | 'repository'>('lesson_planner');

  // Lesson Plan Form State
  const [grade, setGrade] = useState('Grade 10');
  const [subject, setSubject] = useState('Physics & Science');
  const [chapter, setChapter] = useState('Forces & Laws of Motion');
  const [topic, setTopic] = useState('Newton’s Second Law (F = m × a)');
  const [duration, setDuration] = useState(45);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlanResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  // Editable Plan Fields
  const [editExplanation, setEditExplanation] = useState('');
  const [editAnalogy, setEditAnalogy] = useState('');
  const [editHomework, setEditHomework] = useState('');

  // Quiz Generator State
  const [quizTopic, setQuizTopic] = useState('Quadratic Curves & Modeling');
  const [quizSubject, setQuizSubject] = useState('Advanced Mathematics');
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizGenerationResult | null>(null);

  const handleGenerateLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);

    setTimeout(() => {
      const plan = generateCurriculumLessonPlan({
        grade,
        subject,
        chapter,
        topic,
        durationMinutes: duration,
      });

      setGeneratedPlan(plan);
      setEditExplanation(plan.simpleExplanation);
      setEditAnalogy(plan.realWorldAnalogy);
      setEditHomework(plan.homeworkSuggestion);
      setIsGeneratingPlan(false);
      setIsEditing(false);
    }, 600);
  };

  const handleSaveToRepository = () => {
    if (!generatedPlan) return;

    const planToSave: SavedLessonPlan = {
      id: `lp-${Date.now()}`,
      title: generatedPlan.title,
      grade: generatedPlan.grade,
      subject: generatedPlan.subject,
      chapter,
      topic: generatedPlan.topic,
      createdAt: new Date().toISOString().split('T')[0],
      teacherName: currentRole === 'admin' ? 'Dr. Arthur Sterling' : 'Dr. Robert Hawthorne',
      objectives: generatedPlan.objectives,
      simpleExplanation: editExplanation || generatedPlan.simpleExplanation,
      realWorldAnalogy: editAnalogy || generatedPlan.realWorldAnalogy,
      differentiatedStrategies: generatedPlan.differentiatedStrategies,
      classroomActivities: generatedPlan.classroomActivities,
      homeworkSuggestion: editHomework || generatedPlan.homeworkSuggestion,
    };

    onSavePlan(planToSave);
    setSaveNotice('Lesson plan saved to the official school curriculum repository!');
    setTimeout(() => setSaveNotice(''), 4000);
  };

  const handleGenerateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const quiz = generateCurriculumQuiz(quizSubject, quizTopic, grade);
    setGeneratedQuiz(quiz);
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI TEACHER GUIDANCE ASSISTANT
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Instructional Planning & Pedagogy Copilot
          </h2>
          <p className="text-sm text-slate-500">
            Automate daily lesson plans, differentiate strategies for student learning levels, and craft curriculum assessments.
          </p>
        </div>

        {/* Sub-module Navigation */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('lesson_planner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'lesson_planner'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lesson Planner
          </button>
          <button
            onClick={() => setActiveTab('quiz_generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'quiz_generator'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quiz & Worksheets
          </button>
          <button
            onClick={() => setActiveTab('cohort_summary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'cohort_summary'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cohort Analytics
          </button>
          <button
            onClick={() => setActiveTab('repository')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'repository'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Plans ({savedPlans.length})
          </button>
        </div>
      </div>

      {saveNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* ----------------- TAB 1: LESSON PLANNER ----------------- */}
      {activeTab === 'lesson_planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form: Topic & Parameters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs h-fit space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Lesson Parameters</h3>
            </div>

            <form onSubmit={handleGenerateLessonPlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class / Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Advanced Mathematics">Advanced Mathematics</option>
                  <option value="Physics & Science">Physics & Science</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="World History">World History</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curriculum Chapter</label>
                <input
                  type="text"
                  required
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specific Lesson Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Period Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value={45}>Standard Period (45 minutes)</option>
                  <option value={60}>Block Period (60 minutes)</option>
                  <option value={90}>Double Period / Lab (90 minutes)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingPlan}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                {isGeneratingPlan ? 'Synthesizing Lesson Plan...' : 'Generate Daily Lesson Plan'}
              </button>
            </form>
          </div>

          {/* Right: Generated Lesson Plan Display & In-Place Editor */}
          <div className="lg:col-span-2 space-y-4">
            {generatedPlan ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                {/* Plan Header & Review Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {generatedPlan.grade} • {generatedPlan.subject}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{generatedPlan.title}</h3>
                    <p className="text-xs text-slate-400">Chapter: {chapter} • {duration} Minutes</p>
                  </div>

                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                        isEditing
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {isEditing ? 'Done Editing' : 'Edit Content'}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                    <button
                      onClick={handleSaveToRepository}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Plan
                    </button>
                  </div>
                </div>

                {/* 1. Learning Objectives */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600" /> Instructional Objectives
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                    {generatedPlan.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. Simple English Explanation & Real World Analogy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Simple English Explanation:</span>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={editExplanation}
                        onChange={(e) => setEditExplanation(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                      />
                    ) : (
                      <p className="text-slate-600 leading-relaxed">{editExplanation || generatedPlan.simpleExplanation}</p>
                    )}
                  </div>

                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Real-World Analogy:
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={editAnalogy}
                        onChange={(e) => setEditAnalogy(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                      />
                    ) : (
                      <p className="text-amber-800 italic leading-relaxed">{editAnalogy || generatedPlan.realWorldAnalogy}</p>
                    )}
                  </div>
                </div>

                {/* 3. Differentiated Strategies for 3 Learning Levels */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" /> Differentiated Strategies (By Learning Level)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 text-[11px] block text-indigo-700 mb-1">
                        1. Foundational
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {generatedPlan.differentiatedStrategies.foundational}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 text-[11px] block text-emerald-700 mb-1">
                        2. Intermediate
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {generatedPlan.differentiatedStrategies.intermediate}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 text-[11px] block text-purple-700 mb-1">
                        3. Advanced / Honors
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {generatedPlan.differentiatedStrategies.advanced}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Lesson Timing Schedule */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-600" /> Timing & Activity Breakdown
                  </h4>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Phase</th>
                          <th className="py-2 px-3">Duration</th>
                          <th className="py-2 px-3">Pedagogical Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {generatedPlan.timingBreakdown.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2 px-3 font-bold text-slate-800">{t.phase}</td>
                            <td className="py-2 px-3 text-slate-500 font-mono">{t.duration}</td>
                            <td className="py-2 px-3 text-slate-600">{t.activity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Homework & Formative Check */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Recommended Homework Assignment:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editHomework}
                      onChange={(e) => setEditHomework(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-slate-600">{editHomework || generatedPlan.homeworkSuggestion}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">AI Lesson Plan Canvas Ready</h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Select your class, subject, and topic on the left to generate an aligned lesson plan with activities, timing schedules, and differentiated levels.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: QUIZ & WORKSHEET CREATOR ----------------- */}
      {activeTab === 'quiz_generator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Worksheet & MCQ Question Paper Generator</h3>
              <p className="text-xs text-slate-500">
                Generate concept check quizzes with answer keys and guidance hints for class practice.
              </p>
            </div>

            <form onSubmit={handleGenerateQuiz} className="flex items-center gap-2">
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="Enter topic name..."
                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg w-64"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
              >
                Generate Quiz
              </button>
            </form>
          </div>

          {generatedQuiz ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{generatedQuiz.title}</span>
                <span className="text-xs text-slate-500">3 Questions • Answer Key Included</span>
              </div>

              <div className="space-y-4">
                {generatedQuiz.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        Q{idx + 1}. {q.question}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border text-[11px] ${
                            oIdx === q.correctAnswerIndex
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex justify-between">
                      <span>Hint: {q.hint}</span>
                      <span className="text-emerald-700 font-semibold">
                        Correct: Option {String.fromCharCode(65 + q.correctAnswerIndex)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Click "Generate Quiz" to craft formative multiple-choice questions for any topic.
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 3: COHORT SUMMARY ----------------- */}
      {activeTab === 'cohort_summary' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Student Cohort Intelligence Summary</h3>
              <p className="text-xs text-slate-500">
                Automated synthesis of current attendance, term test results, and remedial recommendations.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
              Grade 10-A Cohort ({students.length} students)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-900">Academic Honors Leaders</span>
              <p className="text-emerald-800 text-[11px]">
                Sophia Chen (GPA 4.0, 98.2% attendance) and Marcus Vance (GPA 3.84, 96.5% attendance) demonstrate superior mastery across STEM units.
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900">Attendance Risk Watch</span>
              <p className="text-amber-800 text-[11px]">
                Noah Kowalski (72.5% attendance) requires home contact notification to prevent mandatory exam disqualification.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1">
              <span className="font-bold text-indigo-900">Curriculum Pacing</span>
              <p className="text-indigo-800 text-[11px]">
                Class average is running 4 days ahead of scheduled benchmarks in Algebra and Physics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 4: REPOSITORY ----------------- */}
      {activeTab === 'repository' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Saved School Curriculum Plans</h3>
          {savedPlans.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No lesson plans saved yet. Generate a lesson plan above and click "Save Plan".
            </p>
          ) : (
            <div className="space-y-3">
              {savedPlans.map((sp) => (
                <div key={sp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sp.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{sp.createdAt}</span>
                  </div>
                  <div className="text-slate-500">
                    {sp.grade} • {sp.subject} • Author: {sp.teacherName}
                  </div>
                  <p className="text-slate-600 italic">{sp.simpleExplanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

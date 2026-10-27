import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Target,
  Flame,
  ChevronRight,
  RotateCcw,
  Star,
  Check,
} from 'lucide-react';
import { UserRole, LearningProgress, DailyGoal } from '../types';

interface StudentLearningDashboardProps {
  currentRole: UserRole;
  studentName?: string;
  onNavigateToTutor: () => void;
}

export const StudentLearningDashboard: React.FC<StudentLearningDashboardProps> = ({
  currentRole,
  studentName = 'Marcus Vance',
  onNavigateToTutor,
}) => {
  const [subjectsProgress, setSubjectsProgress] = useState<LearningProgress[]>([
    {
      subject: 'Advanced Mathematics',
      completedLessons: 18,
      totalLessons: 24,
      quizScore: 92,
      recommendedTopic: 'Quadratic vertex derivation & bridge arches',
    },
    {
      subject: 'Physics & Science',
      completedLessons: 15,
      totalLessons: 22,
      quizScore: 89,
      recommendedTopic: 'Thermal conduction rates across alloy rods',
    },
    {
      subject: 'English Literature',
      completedLessons: 20,
      totalLessons: 22,
      quizScore: 94,
      recommendedTopic: 'Dramatic irony analysis in Macbeth Act III',
    },
    {
      subject: 'Computer Science',
      completedLessons: 22,
      totalLessons: 24,
      quizScore: 98,
      recommendedTopic: 'Binary search tree recursion limits',
    },
    {
      subject: 'World History',
      completedLessons: 14,
      totalLessons: 20,
      quizScore: 86,
      recommendedTopic: 'Industrial Revolution economic turning points',
    },
  ]);

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
    { id: 'g1', title: 'Complete Math Quiz on Quadratic Curves', completed: true, xp: 50, subject: 'Mathematics' },
    { id: 'g2', title: 'Listen to Physics Tutor explanation for Newton’s 2nd Law', completed: true, xp: 30, subject: 'Physics' },
    { id: 'g3', title: 'Submit 750-word Macbeth Soliloquy critique', completed: false, xp: 70, subject: 'Literature' },
    { id: 'g4', title: 'Practice 5 Kannada vocabulary academic phrases', completed: false, xp: 40, subject: 'Kannada' },
  ]);

  const toggleGoal = (id: string) => {
    setDailyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const totalXP = dailyGoals.reduce((sum, g) => (g.completed ? sum + g.xp : sum), 120);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            STUDENT LEARNING & PROGRESS HUB
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Mastery Roadmap • {studentName}
          </h2>
          <p className="text-sm text-slate-500">
            Track syllabus completion, examine quiz scores, review AI-targeted study recommendations, and achieve daily learning goals.
          </p>
        </div>

        <button
          onClick={onNavigateToTutor}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4" /> Open AI Socratic Tutor
        </button>
      </div>

      {/* Gamification & Daily Goals Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-xs border border-indigo-800 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-medium text-indigo-300">Daily Study Streak</span>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              <h3 className="text-2xl font-bold">5 Days Active</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">Top 5% consistency in Grade 10-A</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
            🔥
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-medium text-slate-500">Curriculum Mastery XP</span>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-5 h-5 text-amber-500" />
              <h3 className="text-2xl font-bold text-slate-900">{totalXP} XP</h3>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Scholar Tier II</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-medium text-slate-500">Average Quiz Score</span>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">91.8%</h3>
            <p className="text-xs text-slate-400 mt-1">Based on 14 completed AI quizzes</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Roadmaps & Daily Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject Syllabus Completion & AI Revision Targets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Subject Syllabus & Learning Progress</h3>
              <p className="text-xs text-slate-500">Term 1 Coursework & Examination Readiness</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
              Fall Term 2026
            </span>
          </div>

          <div className="space-y-4">
            {subjectsProgress.map((sub) => {
              const pct = Math.round((sub.completedLessons / sub.totalLessons) * 100);
              return (
                <div key={sub.subject} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sub.subject}</h4>
                      <p className="text-xs text-slate-500">
                        {sub.completedLessons} of {sub.totalLessons} Lessons Completed • Quiz Average: {sub.quizScore}%
                      </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">{pct}% Mastered</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  {/* AI Recommended Next Topic */}
                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Recommended Revision: <strong>{sub.recommendedTopic}</strong></span>
                    </span>
                    <button
                      onClick={onNavigateToTutor}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline ml-2 shrink-0"
                    >
                      Study Topic
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Daily Study Goals & Badges */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Today’s Learning Goals</h3>
              <span className="text-xs text-slate-400">
                {dailyGoals.filter((g) => g.completed).length} / {dailyGoals.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                    goal.completed
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-700 line-through opacity-80'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                        goal.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {goal.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span>{goal.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 shrink-0">+{goal.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Honors Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">Earned Academic Badges</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl block mb-1">📐</span>
                <span className="font-bold text-slate-800 block text-[11px]">Math Explorer</span>
                <span className="text-[10px] text-slate-400">Term 1 Honor</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl block mb-1">⚡</span>
                <span className="font-bold text-slate-800 block text-[11px]">Physics Pioneer</span>
                <span className="text-[10px] text-slate-400">Lab Excellence</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl block mb-1">🎙️</span>
                <span className="font-bold text-slate-800 block text-[11px]">Voice Scholar</span>
                <span className="text-[10px] text-slate-400">Kannada & English</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl block mb-1">🏆</span>
                <span className="font-bold text-slate-800 block text-[11px]">Quiz Champion</span>
                <span className="text-[10px] text-slate-400">&gt;90% Average</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Volume2,
  Mic,
  Send,
  BookOpen,
  ArrowRight,
  Languages,
  Award,
  RotateCcw,
} from 'lucide-react';
import { UserRole } from '../types';
import { generateSocraticTutorResponse, TutorResponse } from '../utils/aiCurriculum';
import { speakText, stopSpeaking, VoiceLanguage } from '../utils/voiceService';

interface AIStudentTutorProps {
  currentRole: UserRole;
  studentName?: string;
}

export const AIStudentTutor: React.FC<AIStudentTutorProps> = ({
  currentRole,
  studentName = 'Marcus Vance',
}) => {
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [selectedSubject, setSelectedSubject] = useState('Advanced Mathematics');
  const [questionInput, setQuestionInput] = useState('How do I solve quadratic equations like x² - 5x + 6 = 0?');
  const [selectedLang, setSelectedLang] = useState<VoiceLanguage>('en');

  const [tutorResult, setTutorResult] = useState<TutorResponse | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showingHintOnly, setShowingHintOnly] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAskTutor = (hintOnly: boolean = false) => {
    if (!questionInput.trim()) return;
    setIsAnswering(true);
    setShowingHintOnly(hintOnly);
    setSelectedQuizOption(null);
    stopSpeaking();
    setIsSpeaking(false);

    setTimeout(() => {
      const res = generateSocraticTutorResponse(questionInput, selectedSubject, selectedGrade, hintOnly);
      setTutorResult(res);
      setIsAnswering(false);
    }, 500);
  };

  const handleReadAloud = (text: string) => {
    const textToSpeak = selectedLang === 'kn' && tutorResult?.kannadaTranslation ? tutorResult.kannadaTranslation : text;
    speakText(
      textToSpeak,
      selectedLang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const sampleQuestions = [
    { label: 'Quadratic Equations', query: 'How do I solve quadratic equations like x² - 5x + 6 = 0?' },
    { label: 'Newton’s 2nd Law', query: 'Can you explain F = m × a and why it is important?' },
    { label: 'Photosynthesis Process', query: 'What happens in light and dark reactions of photosynthesis?' },
    { label: 'Kannada Translation (ಕನ್ನಡ)', query: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ಹಂತಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸಿ (Explain photosynthesis in Kannada)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI SOCRATIC STUDENT TUTOR
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Personal 1-on-1 Learning Companion
          </h2>
          <p className="text-sm text-slate-500">
            Ask questions, get step-by-step guidance, request hints before seeing solutions, and practice interactive questions.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <Languages className="w-4 h-4 text-indigo-600 ml-1.5" />
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedLang === 'en'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang('kn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedLang === 'kn'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Question Prompt & Subject Picker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Study Scope</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Class / Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
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
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Advanced Mathematics">Advanced Mathematics</option>
                <option value="Physics & Science">Physics & Science</option>
                <option value="English Literature">English Literature</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="World History">World History</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Question or Topic</label>
              <textarea
                rows={3}
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask your tutor anything..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Actions: Hint first vs Step-by-Step */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAskTutor(true)}
                disabled={isAnswering}
                className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                Give Me a Hint First
              </button>

              <button
                type="button"
                onClick={() => handleAskTutor(false)}
                disabled={isAnswering}
                className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explain Step-by-Step
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sample Inquiries:
            </span>
            {sampleQuestions.map((sq) => (
              <button
                key={sq.label}
                onClick={() => {
                  setQuestionInput(sq.query);
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] text-slate-600 font-medium transition"
              >
                • {sq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Socratic Tutor Response Card */}
        <div className="lg:col-span-2 space-y-4">
          {tutorResult ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Encouragement Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                  <span className="text-xs font-bold text-emerald-800">{tutorResult.encouragement}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReadAloud(tutorResult.stepExplanation)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                  </button>
                  {isSpeaking && (
                    <button
                      onClick={() => {
                        stopSpeaking();
                        setIsSpeaking(false);
                      }}
                      className="px-2 py-1 text-xs text-rose-600 font-semibold"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>

              {/* Step by step or Hint */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  {showingHintOnly ? 'Guided Thinking Hint' : 'Step-by-Step Educational Explanation'}
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {tutorResult.stepExplanation}
                </div>
              </div>

              {/* Kannada Translation Section if selected or available */}
              {tutorResult.kannadaTranslation && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                  <span className="font-bold text-indigo-700 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5" /> ಕನ್ನಡ ವಿವರಣೆ (Kannada Explanation):
                  </span>
                  <p className="leading-relaxed font-sans">{tutorResult.kannadaTranslation}</p>
                </div>
              )}

              {/* Hint Reveal Button if currently on hint only */}
              {showingHintOnly && (
                <button
                  onClick={() => setShowingHintOnly(false)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" /> Got it! Now reveal full step-by-step solution
                </button>
              )}

              {/* Interactive Practice Question */}
              <div className="p-4 rounded-xl border border-slate-200 bg-amber-50/40 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-600" /> Instant Practice Check
                </div>
                <p className="text-xs text-slate-800">{tutorResult.practiceQuestion}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedQuizOption(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                        selectedQuizOption === i
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {selectedQuizOption !== null && (
                  <div className="pt-2 text-xs text-emerald-800 font-medium flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Good attempt! Review how varying the variables affects proportional growth.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">AI Tutor Ready to Help</h4>
              <p className="text-xs text-slate-500 max-w-md">
                Type your homework or exam revision question on the left and select "Give Me a Hint First" or "Explain Step-by-Step" to receive personalized tutoring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

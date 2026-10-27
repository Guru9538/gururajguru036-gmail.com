import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Languages,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Radio,
  BookOpen,
  Calendar,
  School,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { UserRole, AISettings } from '../types';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  createSpeechRecognizer,
  speakText,
  stopSpeaking,
  VoiceLanguage,
} from '../utils/voiceService';
import { generateSocraticTutorResponse } from '../utils/aiCurriculum';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: VoiceLanguage;
  kannadaTranslation?: string;
  timestamp: string;
}

interface AIVoiceAssistantProps {
  currentRole: UserRole;
  aiSettings: AISettings;
}

export const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({
  currentRole,
  aiSettings,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>('en');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [micError, setMicError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text:
        'Namaste & Hello! I am Crestview AI Voice Assistant. You can speak or type your academic questions in English or Kannada (ಕನ್ನಡ). How can I help you today?',
      language: 'en',
      kannadaTranslation:
        'ನಮಸ್ಕಾರ! ನಾನು ಕ್ರೆಸ್ಟ್‌ವ್ಯೂ ಎಐ ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್. ನೀವು ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.',
      timestamp: 'Just now',
    },
  ]);

  const recognizerRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      recognizerRef.current?.stop();
    };
  }, []);

  const handleStartListening = () => {
    setMicError(null);
    stopSpeaking();
    setIsSpeakingState(false);

    if (!isSpeechRecognitionSupported()) {
      setMicError('Speech recognition is not supported in this browser. Please use the text input below.');
      return;
    }

    const recognizer = createSpeechRecognizer(selectedLanguage, {
      onStart: () => {
        setIsListening(true);
        setTranscript('');
      },
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          handleSendQuery(text);
          recognizerRef.current?.stop();
          setIsListening(false);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setMicError(err);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    recognizerRef.current = recognizer;
    recognizer?.start();
  };

  const handleStopListening = () => {
    recognizerRef.current?.stop();
    setIsListening(false);
    if (transcript.trim()) {
      handleSendQuery(transcript);
    }
  };

  const handleSendQuery = (queryText: string) => {
    const query = queryText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      language: selectedLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput('');
    setTranscript('');
    setIsProcessing(true);

    // AI Generation
    setTimeout(() => {
      const tutor = generateSocraticTutorResponse(query, 'General Science & Math', 'Grade 10');
      let reply = tutor.stepExplanation;
      if (query.toLowerCase().includes('timetable')) {
        reply = 'Today is Monday. Your morning classes for Grade 10-A are: Period 1: Advanced Math (08:30 AM), Period 2: Physics Lab (09:20 AM), Period 3: English Literature (10:20 AM), Period 4: Computer Science (11:10 AM).';
      } else if (query.toLowerCase().includes('attendance')) {
        reply = 'Crestview Academy requires a minimum of 75% attendance for term examination eligibility. Students below 75% are flagged for academic counselor review.';
      } else if (query.toLowerCase().includes('principal') || query.toLowerCase().includes('school')) {
        reply = 'Crestview Preparatory Academy is headed by Principal Dr. Arthur Sterling. Campus office hours are Mon–Fri, 8:00 AM – 4:00 PM.';
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        language: selectedLanguage,
        kannadaTranslation: tutor.kannadaTranslation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsProcessing(false);

      // Auto read aloud if voice enabled
      const textToSpeak = selectedLanguage === 'kn' && tutor.kannadaTranslation ? tutor.kannadaTranslation : reply;
      speakText(
        textToSpeak,
        selectedLanguage,
        () => setIsSpeakingState(true),
        () => setIsSpeakingState(false)
      );
    }, 600);
  };

  const handleReadAloud = (msg: ChatMessage) => {
    const textToSpeak = selectedLanguage === 'kn' && msg.kannadaTranslation ? msg.kannadaTranslation : msg.text;
    speakText(
      textToSpeak,
      selectedLanguage,
      () => setIsSpeakingState(true),
      () => setIsSpeakingState(false)
    );
  };

  const handleStopSpeakingAloud = () => {
    stopSpeaking();
    setIsSpeakingState(false);
  };

  const suggestedPrompts = [
    { label: 'Explain Newton’s Second Law', query: 'Explain Newton’s Second Law of Motion with everyday examples' },
    { label: 'Quadratic Equations Formula', query: 'How do I solve quadratic equations step by step?' },
    { label: 'Today’s Timetable', query: 'What is today’s timetable schedule for Grade 10-A?' },
    { label: 'Attendance Rule', query: 'What is the attendance threshold requirement for examinations?' },
    { label: 'Photosynthesis (ಕನ್ನಡ)', query: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಎಂದರೇನು? Explain photosynthesis in Kannada' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI VOICE ASSISTANT
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Interactive AI Voice Agent
          </h2>
          <p className="text-sm text-slate-500">
            Speak directly with your AI academic assistant in English or Kannada (ಕನ್ನಡ) for real-time explanations.
          </p>
        </div>

        {/* Language Selection Toggle */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <Languages className="w-4 h-4 text-indigo-600 ml-2" />
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedLanguage === 'en'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English (en-IN)
          </button>
          <button
            onClick={() => setSelectedLanguage('kn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedLanguage === 'kn'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>
      </div>

      {/* Voice Status Alert & Mic Notification */}
      {micError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{micError}</span>
          </div>
          <button
            onClick={() => setMicError(null)}
            className="text-xs text-rose-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Interactive Voice Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chat & Conversation Transcript Box */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AI
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Academic Voice Feed</h4>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Mode: {selectedLanguage === 'en' ? 'English' : 'Kannada (ಕನ್ನಡ)'}
                </p>
              </div>
            </div>

            {isSpeakingState && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-indigo-600 animate-pulse flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Speaking aloud...
                </span>
                <button
                  onClick={handleStopSpeakingAloud}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-[11px] font-semibold transition"
                >
                  Stop Voice
                </button>
              </div>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {m.kannadaTranslation && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-indigo-900 font-medium bg-indigo-50/60 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-0.5">
                        ಕನ್ನಡ ಅನುವಾದ (Kannada):
                      </span>
                      {m.kannadaTranslation}
                    </div>
                  )}

                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.sender === 'assistant' && (
                      <button
                        onClick={() => handleReadAloud(m)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 ml-3"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" /> Listen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 w-fit">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span>AI Voice Assistant is analyzing curriculum and preparing response...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Box: Text fallback & send */}
          <div className="p-3 border-t border-slate-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(textInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  selectedLanguage === 'kn'
                    ? 'ಇಲ್ಲಿ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ...'
                    : 'Type a question or press the microphone to speak...'
                }
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition shadow-xs"
                title="Send text"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Large Mic Visualizer & Interactive Voice Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Voice Interaction Hub</h3>
            <p className="text-xs text-slate-500">
              Hold or tap the microphone to speak questions. Release when done.
            </p>
          </div>

          {/* Central Interactive Microphone Button */}
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="relative">
              {/* Pulsing radar waves when listening */}
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-40 scale-125"></div>
              )}
              {isSpeakingState && (
                <div className="absolute inset-0 rounded-full bg-indigo-400 animate-pulse opacity-40 scale-110"></div>
              )}

              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                aria-label={isListening ? 'Stop listening' : 'Start microphone'}
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
                  isListening
                    ? 'bg-rose-600 ring-8 ring-rose-100 animate-pulse'
                    : isSpeakingState
                    ? 'bg-indigo-600 ring-8 ring-indigo-100'
                    : 'bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-9 h-9 animate-bounce" />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-9 h-9" />
                    <span className="text-[10px] font-semibold mt-1">Tap to Speak</span>
                  </>
                )}
              </button>
            </div>

            {/* Transcript Preview */}
            <div className="text-center w-full min-h-[44px]">
              {isListening ? (
                <p className="text-xs font-semibold text-rose-600 animate-pulse">
                  Listening to your voice... {transcript && `"${transcript}"`}
                </p>
              ) : isSpeakingState ? (
                <p className="text-xs font-semibold text-indigo-600 flex items-center justify-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Speaking response aloud...
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Microphone is ready • Press button to speak
                </p>
              )}
            </div>
          </div>

          {/* Quick Academic Topics / Voice Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Suggested Voice Queries
            </span>
            <div className="space-y-1.5">
              {suggestedPrompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSendQuery(p.query)}
                  className="w-full p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-left text-xs font-medium text-slate-700 transition flex items-center justify-between"
                >
                  <span className="truncate">{p.label}</span>
                  <Radio className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Information badge */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Technology & Privacy:</p>
            <p>
              Uses browser-native Web Speech API. Audio is processed directly in the browser; no voice data is stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

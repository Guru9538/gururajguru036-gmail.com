import React from 'react';
import { Shield, Sparkles, Mic, Cpu, Lock, CheckCircle2, X } from 'lucide-react';
import { AISettings } from '../types';

interface AdminAIControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onUpdateSettings: (newSettings: AISettings) => void;
}

export const AdminAIControlsModal: React.FC<AdminAIControlsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Administrator AI Controls & Governance</h3>
              <p className="text-xs text-slate-500">Configure institutional policies and provider controls</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Main Global Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Enable AI System for School</span>
              <span className="text-slate-500 text-[11px]">
                Controls access to AI Teacher Guidance, Voice Agent, and Student Tutor.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.isAIEnabled}
              onChange={(e) => onUpdateSettings({ ...settings, isAIEnabled: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Voice Assistant Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">AI Voice Assistant (Microphone & TTS)</span>
              <span className="text-slate-500 text-[11px]">
                Allows speech recognition and text-to-speech audio in browser.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.voiceAssistantEnabled}
              onChange={(e) => onUpdateSettings({ ...settings, voiceAssistantEnabled: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Kannada Multilingual Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Kannada (ಕನ್ನಡ) Voice & Translation Support</span>
              <span className="text-slate-500 text-[11px]">
                Enables regional language teaching support for state syllabus alignment.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.supportKannada}
              onChange={(e) => onUpdateSettings({ ...settings, supportKannada: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Provider Selection */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 block">AI Provider Engine</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, selectedProvider: 'hybrid_gemini' })}
                className={`p-3 rounded-xl border text-left transition ${
                  settings.selectedProvider === 'hybrid_gemini'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold">Hybrid Gemini Engine</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Google Gemini + Curriculum Grounding
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, selectedProvider: 'local_curriculum' })}
                className={`p-3 rounded-xl border text-left transition ${
                  settings.selectedProvider === 'local_curriculum'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold">Local Curriculum Engine</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Zero external API calls, offline-ready
                </span>
              </button>
            </div>
          </div>

          {/* Privacy Statement */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Student Data Protection: All AI interactions are isolated by role and anonymized. No personal records, grades, or contact details are transmitted to external services.
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

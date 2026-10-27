export type VoiceLanguage = 'en' | 'kn';

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

/**
 * Checks if browser supports Speech Recognition.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Checks if browser supports Speech Synthesis (Text-to-Speech).
 */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Creates a Speech Recognition instance configured for the selected language.
 */
export function createSpeechRecognizer(
  language: VoiceLanguage,
  callbacks: {
    onStart: () => void;
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (errorText: string) => void;
    onEnd: () => void;
  }
): { start: () => void; stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    callbacks.onError('Voice recognition is not supported in this browser. Please use text input.');
    return null;
  }

  try {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition: SpeechRecognitionInstance = new SpeechRec();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';

    recognition.onstart = () => {
      callbacks.onStart();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      callbacks.onResult(final || interim, Boolean(final));
    };

    recognition.onerror = (event: any) => {
      let message = 'Speech recognition error occurred.';
      if (event.error === 'not-allowed') {
        message = 'Microphone permission denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        message = 'No speech detected. Please press the mic and speak clearly.';
      } else if (event.error === 'network') {
        message = 'Network connectivity issue during voice recognition.';
      }
      callbacks.onError(message);
    };

    recognition.onend = () => {
      callbacks.onEnd();
    };

    return {
      start: () => {
        try {
          recognition.start();
        } catch (e) {
          // Already started
        }
      },
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {
          //
        }
      },
    };
  } catch (err: any) {
    callbacks.onError('Failed to initialize speech recognition: ' + (err?.message || 'Unknown error'));
    return null;
  }
}

/**
 * Speaks the text aloud using browser SpeechSynthesis with language selection.
 */
export function speakText(
  text: string,
  language: VoiceLanguage,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (!isSpeechSynthesisSupported()) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text of markdown characters before speaking
  const cleanText = text
    .replace(/[#*_`~>-]/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
  utterance.rate = 0.95; // Slightly measured rate for clear teaching
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  // Find suitable voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetPrefix = language === 'kn' ? 'kn' : 'en';
  const matchedVoice = voices.find((v) => v.lang.startsWith(targetPrefix));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stops any current speech output.
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

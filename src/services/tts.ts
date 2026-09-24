/**
 * Text-to-Speech (TTS) Service using native browser Web Speech API
 * Provides natural pronunciation of English words, definitions, and example sentences.
 */

let selectedVoice: SpeechSynthesisVoice | null = null;
let isVoiceInitialized = false;

const initVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    selectedVoice =
      voices.find((v) => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];
    isVoiceInitialized = true;
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  initVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    initVoices();
  };
}

export interface PlaySpeechOptions {
  rate?: number; // 0.8 - 1.0 (default 0.9 for clarity)
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export const speakEnglishText = (
  text: string,
  options: PlaySpeechOptions = {}
): (() => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    options.onError?.(new Error('SpeechSynthesis not supported'));
    return () => {};
  }

  // Cancel any ongoing speech to avoid overlapping
  window.speechSynthesis.cancel();

  // Clean text from mathematical notations or extra symbols if necessary for pronunciation
  const cleanText = text
    .replace(/\$/g, '')
    .replace(/\^2/g, ' squared')
    .replace(/\^3/g, ' cubed')
    .replace(/\\pi/g, 'pi')
    .replace(/\\approx/g, 'approximately')
    .replace(/\\le/g, 'less than or equal to')
    .replace(/\\ge/g, 'greater than or equal to')
    .replace(/\\pm/g, 'plus or minus')
    .trim();

  if (!cleanText) return () => {};

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = options.rate ?? 0.9;
  utterance.pitch = options.pitch ?? 1.0;

  if (!isVoiceInitialized) {
    initVoices();
  }
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    if (e.error === 'canceled' || e.error === 'interrupted') return;
    console.warn('Speech synthesis error:', e);
    options.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
    options.onEnd?.();
  };
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiTier = 
  | 'gemini-2.5-flash-lite'   // Tier 1: Ultra-fast hints & short validation
  | 'gemini-2.5-flash'        // Tier 2: Real-time Socratic chat & instant solutions
  | 'gemini-3.1-pro'          // Tier 3: Complex multi-step KaTeX math breakdowns
  | 'gemini-3.6-flash'        // Tier 4: High-throughput diagnostic assessment
  | 'gemini-3.8-flash';       // Tier 5: 5-layer adaptive study roadmap generation

export interface GeminiTaskConfig {
  task: 'instant_hint' | 'tutor_chat' | 'solution_step' | 'plan_generation';
  preferredModel: GeminiTier;
  fallbackModels: GeminiTier[];
}

export const TASK_CONFIGS: Record<GeminiTaskConfig['task'], GeminiTaskConfig> = {
  instant_hint: {
    task: 'instant_hint',
    preferredModel: 'gemini-3.6-flash',
    fallbackModels: ['gemini-3.8-flash', 'gemini-3.1-pro', 'gemini-2.5-flash-lite'],
  },
  tutor_chat: {
    task: 'tutor_chat',
    preferredModel: 'gemini-3.6-flash',
    fallbackModels: ['gemini-3.8-flash', 'gemini-3.1-pro', 'gemini-2.5-flash'],
  },
  solution_step: {
    task: 'solution_step',
    preferredModel: 'gemini-3.6-flash',
    fallbackModels: ['gemini-3.8-flash', 'gemini-3.1-pro', 'gemini-2.5-flash'],
  },
  plan_generation: {
    task: 'plan_generation',
    preferredModel: 'gemini-3.6-flash',
    fallbackModels: ['gemini-3.8-flash', 'gemini-3.1-pro', 'gemini-2.5-flash'],
  },
};

/**
 * Read API Key from Vite environment variables (e.g. .env.local).
 * Falls back to user-provided key in localStorage if set, otherwise returns an empty string.
 */
export function getGeminiApiKey(): string {
  try {
    const local = localStorage.getItem('gemini_api_key');
    if (local && local.trim()) return local.trim();
  } catch {}

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof envKey === 'string' && envKey.trim() !== '') {
    return envKey.trim();
  }

  return '';
}

export function setGeminiApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed);
      cachedClient = new GoogleGenerativeAI(trimmed);
    } else {
      localStorage.removeItem('gemini_api_key');
      cachedClient = null;
    }
  } catch (e) {
    console.error('Error saving gemini api key', e);
  }
}

export function hasValidApiKey(): boolean {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 10);
}

let cachedClient: GoogleGenerativeAI | null = null;

export function resetGeminiClient(): void {
  cachedClient = null;
}

export function getGeminiClient(): GoogleGenerativeAI {
  const key = getGeminiApiKey();
  if (!key) {
    throw new Error(
      'Gemini API key is not configured. Please define VITE_GEMINI_API_KEY in your .env.local file or configure it in settings.'
    );
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenerativeAI(key);
  }
  return cachedClient;
}

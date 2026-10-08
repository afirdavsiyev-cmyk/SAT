import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  hasValidApiKey,
  getGeminiClient,
  resetGeminiClient,
} from './gemini';

describe('src/lib/gemini.ts - API Key Configuration', () => {
  const originalEnv = import.meta.env.VITE_GEMINI_API_KEY;

  beforeEach(() => {
    localStorage.clear();
    resetGeminiClient();
  });

  afterEach(() => {
    localStorage.clear();
    resetGeminiClient();
    vi.unstubAllEnvs();
  });

  it('returns empty string when no API key is set in environment or localStorage', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    expect(getGeminiApiKey()).toBe('');
    expect(hasValidApiKey()).toBe(false);
  });

  it('reads API key from import.meta.env.VITE_GEMINI_API_KEY', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'AIzaSyFakeKeyFromEnv12345');
    expect(getGeminiApiKey()).toBe('AIzaSyFakeKeyFromEnv12345');
    expect(hasValidApiKey()).toBe(true);
  });

  it('allows localStorage override when user sets a key', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'AIzaSyDefaultEnvKey');
    setGeminiApiKey('AIzaSyCustomUserKey98765');

    expect(getGeminiApiKey()).toBe('AIzaSyCustomUserKey98765');
    expect(hasValidApiKey()).toBe(true);
  });

  it('clears localStorage key and client when empty string is passed to setGeminiApiKey', () => {
    setGeminiApiKey('AIzaSyTemporaryKey123');
    expect(localStorage.getItem('gemini_api_key')).toBe('AIzaSyTemporaryKey123');

    setGeminiApiKey('');
    expect(localStorage.getItem('gemini_api_key')).toBeNull();
  });

  it('throws descriptive error from getGeminiClient when key is not configured', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    expect(() => getGeminiClient()).toThrowError(/Gemini API key is not configured/);
  });

  it('initializes and caches GoogleGenerativeAI client when key is configured', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'AIzaSyValidGeminiKeyForClientTest');
    const client1 = getGeminiClient();
    const client2 = getGeminiClient();

    expect(client1).toBeDefined();
    expect(client1).toBe(client2); // Same cached instance
  });

  it('recognizes valid Google AI Studio keys with AQ. prefix', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'AQ.Ab8RN6IcdcL0jcULHnfk4L1NdghzL0DSGs8fFP_q2SPpgrgh6A');
    expect(getGeminiApiKey()).toBe('AQ.Ab8RN6IcdcL0jcULHnfk4L1NdghzL0DSGs8fFP_q2SPpgrgh6A');
    expect(hasValidApiKey()).toBe(true);
  });
});

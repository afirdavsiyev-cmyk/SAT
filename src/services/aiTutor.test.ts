import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getTutorReplyDetailed,
  getTutorReply,
  hasGroqApiKey,
  getGroqApiKey,
  GROQ_API_ENDPOINT,
  GROQ_MODELS_ENDPOINT,
  CANDIDATE_MODELS,
} from './aiTutor';

describe('aiTutor Service - Groq Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('verifies strict Groq API endpoint formats', () => {
    expect(GROQ_API_ENDPOINT).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(GROQ_MODELS_ENDPOINT).toBe('https://api.groq.com/openai/v1/models');
  });

  it('includes active and verified Groq candidate models in fallback list', () => {
    expect(CANDIDATE_MODELS).toContain('qwen/qwen3.8-27b');
    expect(CANDIDATE_MODELS).toContain('llama-3.1-8b-instant');
    expect(CANDIDATE_MODELS).toContain('llama-3.3-70b-versatile');
    expect(CANDIDATE_MODELS).toContain('openai/gpt-oss-120b');
    // Ensure decommissioned models are NOT in candidate list
    expect(CANDIDATE_MODELS).not.toContain('llama3-70b-8192');
    expect(CANDIDATE_MODELS).not.toContain('llama3-8b-8192');
  });

  it('reads API key from import.meta.env and detects presence correctly', () => {
    expect(typeof hasGroqApiKey()).toBe('boolean');
    expect(typeof getGroqApiKey()).toBe('string');
  });

  it('successfully completes chat using the active model and strict endpoint', async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url === GROQ_MODELS_ENDPOINT) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 'qwen/qwen3.8-27b' }] }),
        });
      }
      if (url === GROQ_API_ENDPOINT) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: 'In standard vertex form: $f(x) = a(x - h)^2 + k$.',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    vi.stubGlobal('fetch', mockFetch);

    const result = await getTutorReplyDetailed([
      { role: 'user', content: 'What is vertex form?' },
    ]);

    expect(result.content).toBe('In standard vertex form: $f(x) = a(x - h)^2 + k$.');
    expect(result.modelUsed).toBe('qwen/qwen3.8-27b');

    // Verify endpoint called strictly
    const chatCall = mockFetch.mock.calls.find((call) => call[0] === GROQ_API_ENDPOINT);
    expect(chatCall).toBeDefined();
    expect(chatCall![1].method).toBe('POST');
  });

  it('falls back cleanly to next model when primary model returns an error (e.g. 404)', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url === GROQ_MODELS_ENDPOINT) {
        // Return 404 on models endpoint so it falls back to static candidate chain
        return Promise.resolve({ ok: false, status: 404, statusText: 'Not Found', text: () => Promise.resolve('Not found') });
      }
      if (url === GROQ_API_ENDPOINT) {
        callCount++;
        if (callCount === 1) {
          // First candidate model fails with 404
          return Promise.resolve({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: () => Promise.resolve({ error: { message: 'The model does not exist or you do not have access to it.' } }),
          });
        }
        // Second candidate model succeeds
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: 'Fallback response: $x = 4$',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    vi.stubGlobal('fetch', mockFetch);

    const result = await getTutorReplyDetailed([
      { role: 'user', content: 'Solve x - 4 = 0' },
    ]);

    expect(result.content).toBe('Fallback response: $x = 4$');
    expect(callCount).toBe(2);

    // Verify clean error logging
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[HTTP 404 Not Found] The model does not exist or you do not have access to it.')
    );

    consoleWarnSpy.mockRestore();
  });

  it('handles reasoning models that output into message.reasoning if content is empty', async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url === GROQ_MODELS_ENDPOINT) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 'openai/gpt-oss-120b' }] }),
        });
      }
      if (url === GROQ_API_ENDPOINT) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: '',
                    reasoning: 'The equation $x^2 = 9$ gives $x = \\pm 3$.',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    vi.stubGlobal('fetch', mockFetch);

    const reply = await getTutorReply([{ role: 'user', content: 'Solve x^2 = 9' }]);
    expect(reply).toBe('The equation $x^2 = 9$ gives $x = \\pm 3$.');
  });

  it('throws an informative error if all candidate models fail', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url === GROQ_MODELS_ENDPOINT) {
        return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: () => Promise.resolve({ error: { message: 'Rate limit exceeded (TPM quota)' } }),
      });
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(
      getTutorReplyDetailed([{ role: 'user', content: 'Help' }])
    ).rejects.toThrow(/All AI tutor models failed.*Rate limit exceeded/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Rate limit exceeded (TPM quota)')
    );

    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

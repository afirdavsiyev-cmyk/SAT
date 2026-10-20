export interface TutorMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TutorReplyResult {
  content: string;
  modelUsed: string;
}

/**
 * Strict Groq OpenAI-compatible Chat Completions API Endpoint.
 */
export const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_MODELS_ENDPOINT = 'https://api.groq.com/openai/v1/models';

/**
 * Verified candidate models on Groq:
 * - Active on current project key: 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'
 * - Active on standard tier Groq keys: 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'llama-3.2-3b-preview', 'llama-3.2-1b-preview'
 * (Note: Decommissioned models like 'llama3-70b-8192' and 'llama3-8b-8192' are excluded as Groq returns 400).
 */
export const CANDIDATE_MODELS: string[] = [
  'qwen/qwen3.8-27b',
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'llama-3.2-3b-preview',
  'llama-3.2-1b-preview',
];

/**
 * Retrieves the Groq API key from environment variables.
 * Emits a clear console warning if missing or undefined.
 */
export function getGroqApiKey(): string {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    console.warn(
      '[Groq AI Tutor] Warning: VITE_GROQ_API_KEY is missing or undefined in environment variables (.env / .env.local). Live Groq AI tutoring will be disabled.'
    );
    return '';
  }
  return apiKey.trim();
}

/**
 * Checks if a valid non-empty Groq API key is defined in the environment.
 */
export function hasGroqApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  return Boolean(apiKey && typeof apiKey === 'string' && apiKey.trim().length > 0);
}

// In-memory cache for dynamically discovered accessible models
let cachedAvailableModels: string[] | null = null;
let isDiscovering = false;

/**
 * Discovers accessible models for the configured Groq API key to prioritize active models
 * and avoid 404 errors across different Groq organization/key access tiers.
 */
async function getPrioritizedModels(apiKey: string): Promise<string[]> {
  if (cachedAvailableModels && cachedAvailableModels.length > 0) {
    return cachedAvailableModels;
  }

  if (isDiscovering) {
    return CANDIDATE_MODELS;
  }

  isDiscovering = true;
  try {
    const res = await fetch(GROQ_MODELS_ENDPOINT, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (res.ok) {
      const json = await res.json();
      const remoteModelIds = new Set<string>((json.data || []).map((m: any) => m.id));

      // Match candidates that the key definitely has access to
      const matched = CANDIDATE_MODELS.filter((m) => remoteModelIds.has(m));
      if (matched.length > 0) {
        const others = CANDIDATE_MODELS.filter((m) => !remoteModelIds.has(m));
        cachedAvailableModels = [...matched, ...others];
        isDiscovering = false;
        return cachedAvailableModels;
      }
    } else {
      const errText = await res.text().catch(() => res.statusText);
      console.warn(`[Groq AI Tutor] Failed to query models endpoint (${res.status}): ${errText}`);
    }
  } catch (err: any) {
    console.warn('[Groq AI Tutor] Network error while discovering available models:', err?.message || err);
  } finally {
    isDiscovering = false;
  }

  return CANDIDATE_MODELS;
}

/**
 * Executes chat completions across the prioritized candidate model chain.
 * Validates endpoint, checks API key, logs specific API errors cleanly, and avoids silent canned failures.
 */
export async function getTutorReplyDetailed(messages: TutorMessage[]): Promise<TutorReplyResult> {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is not defined in environment variables (.env / .env.local)');
  }

  const modelChain = await getPrioritizedModels(apiKey);

  const callGroq = async (modelName: string) => {
    return await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.6,
        max_tokens: 800,
      }),
    });
  };

  let lastError = '';

  for (const model of modelChain) {
    try {
      const res = await callGroq(model);

      if (res.ok) {
        const data = await res.json();
        const message = data.choices?.[0]?.message;
        const content = message?.content;
        const reply =
          content && content.trim().length > 0
            ? content.trim()
            : message?.reasoning && message.reasoning.trim().length > 0
            ? message.reasoning.trim()
            : '';

        if (reply.length > 0) {
          return { content: reply, modelUsed: model };
        }
      }

      // Parse error body cleanly
      let errorDetails = '';
      try {
        const errJson = await res.json();
        errorDetails = errJson.error?.message || errJson.message || JSON.stringify(errJson);
      } catch {
        errorDetails = await res.text().catch(() => res.statusText || `HTTP ${res.status}`);
      }

      lastError = `[HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''}] ${errorDetails}`.trim();
      console.warn(`[Groq AI Tutor] Model '${model}' failed: ${lastError}. Trying next candidate fallback...`);
    } catch (err: any) {
      lastError = err?.message || 'Network fetch error';
      console.warn(`[Groq AI Tutor] Network error calling '${model}': ${lastError}. Trying next candidate fallback...`);
    }
  }

  console.error(`[Groq AI Tutor] All candidate models failed. Last error: ${lastError}`);
  throw new Error(`All AI tutor models failed. Last error: ${lastError}`);
}

export async function getTutorReply(messages: TutorMessage[]): Promise<string> {
  const result = await getTutorReplyDetailed(messages);
  return result.content;
}

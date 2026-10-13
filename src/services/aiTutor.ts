export interface TutorMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TutorReplyResult {
  content: string;
  modelUsed: string;
}

const CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant"
];

export async function getTutorReplyDetailed(messages: TutorMessage[]): Promise<TutorReplyResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY is not defined in .env.local");
  }

  const callGroq = async (modelName: string) => {
    return await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.6,
        max_tokens: 700,
      }),
    });
  };

  let lastError = "";

  for (const model of CANDIDATE_MODELS) {
    try {
      const res = await callGroq(model);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return { content: content.trim(), modelUsed: model };
        }
      }

      // Check error details for logging
      const errJson = await res.json().catch(() => ({}));
      lastError = errJson.error?.message || `Status ${res.status}`;
      console.warn(`[Groq AI Tutor] Model '${model}' failed (${lastError}). Trying next fallback...`);
    } catch (err: any) {
      lastError = err?.message || "Network error";
      console.warn(`[Groq AI Tutor] Error calling '${model}': ${lastError}. Trying next fallback...`);
    }
  }

  throw new Error(`All AI tutor models failed. Last error: ${lastError}`);
}

export async function getTutorReply(messages: TutorMessage[]): Promise<string> {
  const result = await getTutorReplyDetailed(messages);
  return result.content;
}

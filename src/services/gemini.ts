import { Question } from '../types';
import { getGeminiApiKey, setGeminiApiKey } from '../lib/gemini';

export { getGeminiApiKey, setGeminiApiKey };

export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
}

export const generateTutorResponse = async (
  userMessage: string,
  question: Question,
  chatHistory: ChatMessage[] = []
): Promise<string> => {
  const apiKey = getGeminiApiKey();

  // If API key is present, make real call to Google Gemini 2.5 Flash API
  if (apiKey) {
    try {
      const systemInstruction = `You are ScoreUP AI, an elite Digital SAT Math Tutor. You help students understand concepts deeply using the Socratic method.
Always reference the active question context:
- Question #${question.number} (${question.domain}, ${question.difficulty}): ${question.prompt}
- Options: ${question.options ? question.options.map(o => `${o.id}: ${o.text}`).join(', ') : 'Student-produced input'}
- Correct Answer: ${question.correctAnswer}
- Official Explanation: ${question.explanation}

Guidelines:
- When a student asks for a hint, provide targeted intuition rather than spoiling the answer immediately.
- Explain Desmos shortcuts if asked.
- Format equations clearly using standard math notation or Markdown.
- Keep responses encouraging, concise, and focused on SAT Math strategy.`;

      const formattedContents = [
        ...chatHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: formattedContents,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error (${response.status})`);
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (candidateText) {
        return candidateText;
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, using fallback tutor response:', err);
    }
  }

  // Smart Socratic fallback if no key or API error
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('desmos')) {
    return `📈 **Desmos Speed Strategy for Question #${question.number}**:\n\n1. Type the main function or equation into Desmos: \`${question.desmosEquation || 'y = x^2 - 6x + 13'}\`.\n2. Click directly on the graph to reveal the vertex $(x, y)$ or axis intercept points.\n3. The vertex or intersection point gives you the exact answer instantly without manual algebra!`;
  }

  if (lowerMsg.includes('hint')) {
    return `🔍 **Socratic Hint for Question #${question.number}**:\n\nLook closely at the domain: **${question.domain}**.\n${question.hint || 'Think about completing the square or checking vertex coordinates.'}\n\nWhat pattern do you notice when you inspect the equation structure?`;
  }

  if (lowerMsg.includes('strategy')) {
    return `🎯 **SAT Math Strategy**:\n\n- **Step 1**: Identify what the question asks for.\n- **Step 2**: Test key values or plug options A, B, C, D directly into the equation.\n- **Step 3**: Use Desmos for graphing questions to save up to 60 seconds per question.`;
  }

  // Default step-by-step walkthrough fallback
  return `💡 **Step-by-Step Resolution for Question #${question.number}** (${question.domain}):\n\n${question.explanation}`;
};

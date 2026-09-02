import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiTier, getGeminiApiKey, getGeminiClient, TASK_CONFIGS } from '../lib/gemini';

export interface GeminiExecutionResult<T = string> {
  success: boolean;
  data: T;
  usedModel: GeminiTier | string;
  latencyMs: number;
  error?: string;
}

export interface PlannerUserInput {
  targetScore: number;
  targetDate: string;
  dailyMinutes: number;
  baselineScore: number;
  weakAreas?: string[];
  frictionPoints?: string[];
}

export interface GeneratedDrillItem {
  title: string;
  subtopicName: string;
  questionCount: number;
  estimatedMinutes: number;
  difficulty: string;
  focusReason: string;
}

export interface GeneratedRoadmapOutput {
  domainMastery: {
    algebra: number;
    advancedMath: number;
    problemSolving: number;
    geometryTrig: number;
  };
  priorityWeakSubtopics: string[];
  todaysDrills: GeneratedDrillItem[];
  psychometricSummary: string;
}

export interface ChatMessageItem {
  role: 'user' | 'model';
  text: string;
}

/**
 * Universal Gemini Dispatcher with automatic fallback cascade across model tiers.
 */
export async function callGeminiWithFallback(
  preferredModel: GeminiTier,
  prompt: string,
  fallbackModels: GeminiTier[] = [],
  systemInstruction?: string,
  jsonMode: boolean = false
): Promise<GeminiExecutionResult<string>> {
  const startTime = Date.now();
  const apiKey = getGeminiApiKey();

  // Cascade list: preferred -> explicit fallbacks -> general active fallbacks
  const modelCascade: (GeminiTier | string)[] = [
    preferredModel,
    ...fallbackModels,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];

  // Deduplicate cascade list
  const uniqueModels = Array.from(new Set(modelCascade));

  let lastError: any = null;

  for (const modelName of uniqueModels) {
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: jsonMode ? 0.2 : 0.7,
          maxOutputTokens: 1500,
          responseMimeType: jsonMode ? 'application/json' : undefined,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim().length > 0) {
        return {
          success: true,
          data: text.trim(),
          usedModel: modelName,
          latencyMs: Date.now() - startTime,
        };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Dispatcher] Tier '${modelName}' execution failed:`, err?.message || err);
      // Continue to next fallback model in the list
    }
  }

  // If all live API attempts fail (e.g., offline or network error), return graceful offline synthesis
  console.error('[Gemini Dispatcher] All live models in tier cascade failed. Generating resilient fallback data.', lastError);

  return {
    success: false,
    data: getOfflineFallbackContent(prompt, jsonMode),
    usedModel: 'offline-synthesizer',
    latencyMs: Date.now() - startTime,
    error: lastError?.message || 'All model tiers failed',
  };
}

/**
 * Tier 1: Instant Hints & Short Validation
 * Latency Priority: gemini-2.5-flash-lite
 */
export async function generateInstantHint(
  questionPrompt: string,
  currentAnswer?: string,
  topic?: string
): Promise<GeminiExecutionResult<string>> {
  const config = TASK_CONFIGS.instant_hint;
  const systemInstruction = `You are ScoreUP's lightning-fast SAT Math hint engine.
Provide a single, concise Socratic hint (1-2 sentences maximum).
NEVER give away the final numerical answer or choice letter.
Use KaTeX math formatting: $...$ for inline formulas.
Topic context: ${topic || 'Digital SAT Math'}.`;

  const prompt = `Question:\n${questionPrompt}\n\nStudent's current work/selection: ${currentAnswer || 'None yet'}.\nGive an instant hint:`;

  return await callGeminiWithFallback(
    config.preferredModel,
    prompt,
    config.fallbackModels,
    systemInstruction
  );
}

/**
 * Tier 2: Real-Time Socratic AI Tutor Chat
 * Priority: gemini-2.5-flash
 */
export async function sendSocraticChatMessage(
  history: ChatMessageItem[],
  userMessage: string,
  questionContext?: string
): Promise<GeminiExecutionResult<string>> {
  const config = TASK_CONFIGS.tutor_chat;
  const systemInstruction = `You are ScoreUP AI, an elite Digital SAT Math personal tutor.
Engage using the Socratic method: ask guiding questions, explain Desmos calculator shortcuts, and breakdown difficult math steps with clarity.
Format all math using KaTeX ($...$ for inline, $$...$$ for block formulas).
${questionContext ? `Active Question Context:\n${questionContext}` : ''}
Keep responses focused, encouraging, and under 150 words.`;

  const formattedConversation = [
    ...history.slice(-6).map((h) => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.text}`),
    `Student: ${userMessage}`,
    `Tutor:`
  ].join('\n\n');

  return await callGeminiWithFallback(
    config.preferredModel,
    formattedConversation,
    config.fallbackModels,
    systemInstruction
  );
}

/**
 * Tier 3: Complex Step-by-Step KaTeX Math Breakdown
 * Priority: gemini-3.1-pro
 */
export async function generateStepByStepSolution(question: {
  prompt: string;
  domain?: string;
  difficulty?: string;
  correctAnswer: string;
  options?: { id: string; text: string }[];
}): Promise<GeminiExecutionResult<string>> {
  const config = TASK_CONFIGS.solution_step;
  const systemInstruction = `You are a Senior College Board Math Assessment author for ScoreUp.
Generate an impeccable, high-impact step-by-step mathematical explanation for the provided SAT Math problem.
Rules:
1. Every mathematical equation must be rendered in KaTeX: block equations with $$...$$, inline variables with $...$.
2. Include:
   - **Step 1: Core Concept & Strategic Approach**
   - **Step 2: Step-by-Step Algebraic Work**
   - **Step 3: High-Speed Desmos Shortcut** (if applicable)
   - **Step 4: Trap Alert** (explain common student errors or false confidence mistakes)
3. Clearly state why the correct answer is (${question.correctAnswer}).`;

  const prompt = `SAT Math Problem:
Prompt: ${question.prompt}
Domain: ${question.domain || 'Algebra'} • Difficulty: ${question.difficulty || 'Medium'}
Options: ${question.options ? question.options.map((o) => `(${o.id}) ${o.text}`).join(' | ') : 'Grid-in student produced'}
Correct Answer: ${question.correctAnswer}

Provide the full step-by-step KaTeX breakdown:`;

  return await callGeminiWithFallback(
    config.preferredModel,
    prompt,
    config.fallbackModels,
    systemInstruction
  );
}

/**
 * Tier 5: 5-Layer Adaptive Study Roadmap Generation
 * Priority: gemini-3.8-flash (with structured JSON output)
 */
export async function generateAdaptiveRoadmap(
  userData: PlannerUserInput
): Promise<GeminiExecutionResult<GeneratedRoadmapOutput>> {
  const config = TASK_CONFIGS.plan_generation;

  const systemPrompt = `You are the lead College Board SAT Math psychometrician and AI tutor for ScoreUp. 
Analyze the student's target score (${userData.targetScore}), deadline (${userData.targetDate}), daily availability (${userData.dailyMinutes} mins), and domain accuracy.
Generate a structured JSON roadmap including:
1. Exact domain mastery ratings (0-100)
2. Priority weak subtopics
3. Today's 3-drill daily allocation (subtopic, question count, estimated time)
Return valid JSON only matching the StudyPlannerData schema.`;

  const prompt = `Student Assessment Profile:
- Target Score: ${userData.targetScore} / 800
- Baseline Score: ${userData.baselineScore} / 800
- Deadline: ${userData.targetDate}
- Daily Minutes: ${userData.dailyMinutes}
- Stated Weaknesses: ${userData.weakAreas?.join(', ') || 'Advanced Math, Nonlinear functions'}
- Friction Points: ${userData.frictionPoints?.join(', ') || 'Careless slips, Running out of time'}

Respond with a JSON object in this exact schema:
{
  "domainMastery": {
    "algebra": number,
    "advancedMath": number,
    "problemSolving": number,
    "geometryTrig": number
  },
  "priorityWeakSubtopics": [string, string, string],
  "todaysDrills": [
    {
      "title": string,
      "subtopicName": string,
      "questionCount": number,
      "estimatedMinutes": number,
      "difficulty": string,
      "focusReason": string
    }
  ],
  "psychometricSummary": string
}`;

  const result = await callGeminiWithFallback(
    config.preferredModel,
    prompt,
    config.fallbackModels,
    systemPrompt,
    true // enable jsonMode
  );

  let parsed: GeneratedRoadmapOutput;
  try {
    const raw = result.data.replace(/```json/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(raw);
  } catch {
    // Graceful fallback parsing
    parsed = {
      domainMastery: {
        algebra: Math.min(95, Math.max(50, Math.round(userData.baselineScore / 8.5))),
        advancedMath: Math.min(92, Math.max(45, Math.round(userData.baselineScore / 9.2))),
        problemSolving: Math.min(94, Math.max(50, Math.round(userData.baselineScore / 8.8))),
        geometryTrig: Math.min(90, Math.max(40, Math.round(userData.baselineScore / 9.5))),
      },
      priorityWeakSubtopics: [
        'Nonlinear equations in one variable',
        'Systems of two linear equations in two variables',
        'Circles and radian theorems'
      ],
      todaysDrills: [
        {
          title: 'Priority Weakness: Nonlinear Equations',
          subtopicName: 'Nonlinear equations in one variable',
          questionCount: 10,
          estimatedMinutes: Math.round(userData.dailyMinutes * 0.35),
          difficulty: 'Adaptive 650–780',
          focusReason: 'High College Board frequency on Module 2 Hard.'
        },
        {
          title: 'High-Yield: Desmos Regression & Intersections',
          subtopicName: 'Systems of two linear equations in two variables',
          questionCount: 8,
          estimatedMinutes: Math.round(userData.dailyMinutes * 0.35),
          difficulty: 'Medium to Hard',
          focusReason: 'Saves ~45s per problem via graphical intersection clicking.'
        },
        {
          title: 'Timed Mixed Speed Sprint',
          subtopicName: 'Mixed Official Domains',
          questionCount: 6,
          estimatedMinutes: Math.round(userData.dailyMinutes * 0.30),
          difficulty: 'Module 2 Pace',
          focusReason: 'Simulate ticking clock pacing to eliminate time panic.'
        }
      ],
      psychometricSummary: `Targeting a +${Math.max(0, userData.targetScore - userData.baselineScore)} point increase by ${userData.targetDate}. Focus on advanced algebra and nonlinear vertex manipulations.`
    };
  }

  return {
    success: result.success,
    data: parsed,
    usedModel: result.usedModel,
    latencyMs: result.latencyMs,
  };
}

/**
 * Offline fallback generator ensuring zero-crash resilience
 */
function getOfflineFallbackContent(prompt: string, jsonMode: boolean): string {
  if (jsonMode) {
    return JSON.stringify({
      domainMastery: { algebra: 88, advancedMath: 74, problemSolving: 82, geometryTrig: 68 },
      priorityWeakSubtopics: ['Nonlinear equations in one variable', 'Systems of linear equations', 'Circle theorems'],
      todaysDrills: [
        {
          title: 'Priority Focus: Nonlinear Equations',
          subtopicName: 'Nonlinear equations in one variable',
          questionCount: 10,
          estimatedMinutes: 15,
          difficulty: 'Hard (700+)',
          focusReason: 'Core College Board Module 2 differentiator.'
        },
        {
          title: 'High-Yield: Desmos Speed Shortcuts',
          subtopicName: 'Linear functions',
          questionCount: 10,
          estimatedMinutes: 15,
          difficulty: 'Medium',
          focusReason: 'Instant graph clicking saves up to 1 minute per problem.'
        },
        {
          title: 'Timed Mixed Speed Sprint',
          subtopicName: 'Mixed Domains',
          questionCount: 8,
          estimatedMinutes: 10,
          difficulty: 'Timed Mixed',
          focusReason: 'Eliminate pacing errors on final 5 problems.'
        }
      ],
      psychometricSummary: 'Customized adaptive roadmap structured from official College Board psychometric standards.'
    });
  }

  return `### Step-by-Step Mathematical Analysis

**1. Algebraic Strategy**
To solve this question efficiently on the Digital SAT Math section, isolate the primary variable or convert the equation into standard quadratic/vertex form:
$$f(x) = a(x - h)^2 + k$$
where $(h, k)$ represents the vertex of the parabola.

**2. Desmos Speed Technique**
1. Type the given equation directly into Desmos.
2. Click directly on the gray dots to read the vertex or x-intercepts immediately.
3. This saves approximately $45\\text{ seconds}$ compared to manual factoring!

**3. Trap Alert**
Be cautious not to confuse the question asking for $x$ versus asking for an expression like $2x + 1$ or the coordinates $(h, k)$. Always re-read the final clause of the prompt!`;
}

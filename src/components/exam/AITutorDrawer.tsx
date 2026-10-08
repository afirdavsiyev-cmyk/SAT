import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Send, Bot, Settings, Key, ExternalLink, Loader2, Zap } from 'lucide-react';
import { Question } from '../../types';
import { MathRenderer } from '../common/MathRenderer';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  generateInstantHint,
  generateStepByStepSolution,
  sendSocraticChatMessage,
  ChatMessageItem
} from '../../services/geminiService';
import { getGeminiApiKey } from '../../lib/gemini';

export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  modelUsed?: string;
}

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  isGeneralMode?: boolean;
}

function formatModelName(model: string): string {
  if (!model) return 'ScoreUP AI';
  if (model.includes('ScoreUP-AI') || model.includes('Local') || model.includes('offline')) return 'ScoreUP AI';
  if (model.includes('3.8-flash')) return '3.8 Flash';
  if (model.includes('3.6-flash')) return '3.6 Flash';
  if (model.includes('3.5-flash-lite')) return '3.5 Flash-Lite';
  if (model.includes('flash-latest')) return 'Flash';
  if (model.includes('2.5-flash-lite')) return '2.5 Flash-Lite';
  if (model.includes('2.5-flash')) return '2.5 Flash';
  return model.replace('gemini-', '');
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  question,
  isGeneralMode = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeModel, setActiveModel] = useState<string>('gemini-3.6-flash');

  const isExamContext = !isGeneralMode && !!question;

  // Initialize messages and key state when drawer opens or mode/question changes
  useEffect(() => {
    if (isExamContext && question) {
      setMessages([
        {
          sender: 'ai',
          text: `Hello! I'm **ScoreUP AI**, your Digital SAT Math personal tutor.\n\nI'm ready to assist with **Question #${question.number}** (${question.domain}, ${question.difficulty}). Select a quick action chip below or ask me any question!`,
          modelUsed: 'gemini-3.6-flash'
        }
      ]);
    } else {
      setMessages([
        {
          sender: 'ai',
          text: `Hello! I'm **ScoreUP AI**, your 24/7 Digital SAT Math tutor.\n\nHow can I help you master Digital SAT Math today? Ask me about any formula, Desmos shortcut, or topic!`,
          modelUsed: 'gemini-3.6-flash'
        }
      ]);
    }
  }, [question, isOpen, isGeneralMode, isExamContext]);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close AI Tutor when clicking outside (place not related to the AI tutor) or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // If click originated inside the AI tutor drawer, do nothing
      if (drawerRef.current && drawerRef.current.contains(target)) {
        return;
      }

      // If clicked on an AI tutor toggle button that explicitly handles open/close, let the button handle it
      if (target.closest('[data-ai-tutor-toggle="true"]')) {
        return;
      }

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const lowerText = textToSend.toLowerCase();

      // Tier 1: Instant Hint Route (Latency Priority)
      if (lowerText.includes('hint')) {
        const hintResult = await generateInstantHint(
          question?.prompt || 'Digital SAT Math concept',
          '',
          question?.domain || 'Advanced Math'
        );
        setActiveModel(hintResult.usedModel);
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: hintResult.data, modelUsed: hintResult.usedModel }
        ]);
        return;
      }

      // Tier 3: Step-by-Step KaTeX Solution Route
      if (lowerText.includes('step by step') || lowerText.includes('explain this question') || lowerText.includes('solution')) {
        const solutionResult = await generateStepByStepSolution({
          prompt: question?.prompt || 'SAT Math Question',
          domain: question?.domain,
          difficulty: question?.difficulty,
          correctAnswer: question?.correctAnswer || 'C',
          options: question?.options,
          explanation: question?.explanation
        });
        setActiveModel(solutionResult.usedModel);
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: solutionResult.data, modelUsed: solutionResult.usedModel }
        ]);
        return;
      }

      // Tier 2: Real-time Socratic Chat Route
      const chatHistoryItems: ChatMessageItem[] = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const contextPrompt = question
        ? `Question #${question.number} (${question.domain}, ${question.difficulty}):\n${question.prompt}\nCorrect Answer: ${question.correctAnswer}\nOfficial Explanation: ${question.explanation || 'None provided'}`
        : undefined;

      const chatResult = await sendSocraticChatMessage(chatHistoryItems, textToSend, contextPrompt);
      setActiveModel(chatResult.usedModel);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: chatResult.data, modelUsed: chatResult.usedModel }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an issue processing your request. Please try again.', modelUsed: 'offline' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const questionChips = [
    { label: "💡 Explain step by step", prompt: "Explain this question step by step." },
    { label: "🎯 Best strategy", prompt: "What is the best time-saving strategy for this question?" },
    { label: "💻 Desmos solution", prompt: "How do I solve this question using Desmos?" },
    { label: "🔍 Hint only", prompt: "Give me a subtle hint without spoiling the final answer." }
  ];

  const generalChips = [
    { label: "💡 Quadratic Vertex Form", prompt: "Explain quadratic vertex form f(x) = a(x-h)^2 + k with examples." },
    { label: "🎯 Desmos Speed Tips", prompt: "What are the top 5 Desmos shortcuts for the Digital SAT Math?" },
    { label: "💻 Circle Equations", prompt: "How do I convert a circle equation into standard form (x-h)^2 + (y-k)^2 = r^2?" },
    { label: "🏆 Boost to 800", prompt: "What is the best strategy to score 800 in SAT Math?" }
  ];

  const activeChips = isExamContext ? questionChips : generalChips;

  return (
    <>
      {/* Backdrop overlay for outside click detection (clicking place not related to AI tutor closes it) */}
      <div
        className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[0.5px] transition-opacity animate-in fade-in duration-150 cursor-pointer"
        onClick={onClose}
        aria-label="Close AI Tutor"
      />

      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-[#0c1017] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between select-none animate-in slide-in-from-right-4 duration-200 transition-colors text-slate-900 dark:text-white"
      >
      
      {/* Header */}
      <div className="bg-slate-50 dark:bg-[#080c14] px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 transition-colors">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800/50 dark:text-emerald-400 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">ScoreUP AI Tutor</h3>
              {/* Clean Model Indicator Badge matching screenshot */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40 font-mono shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                <span>Powered by Gemini {formatModelName(activeModel)}</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {isExamContext ? `Question #${question?.number} Context` : 'Digital SAT Math Tutor'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <ThemeToggle size="sm" />

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showSettings
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-white dark:border-slate-700/80'
            }`}
            title="Tiered Model Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tiered Model Routing Info Overlay */}
      {showSettings && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-3 z-20 animate-in fade-in duration-200 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Active Tiered Gemini Routing Pipeline</span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed font-mono">
            <div className="flex justify-between p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">⚡ Tier 1 (Hints):</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">gemini-3.5-flash-lite</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">💬 Tier 2 (Tutor Chat):</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">gemini-3.6-flash</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">📐 Tier 3 (KaTeX Solutions):</span>
              <span className="text-emerald-700 dark:text-teal-300 font-bold">gemini-3.6-flash</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">🗺️ Tier 5 (Roadmap Engine):</span>
              <span className="text-emerald-600 dark:text-emerald-300 font-bold">gemini-3.8-flash</span>
            </div>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white dark:bg-[#0c1017] transition-colors">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-100 text-slate-900 border border-slate-200/90 dark:bg-[#141b27] dark:text-slate-100 dark:border-slate-800 rounded-tl-none shadow-md'
              }`}
            >
              {msg.sender === 'ai' ? (
                <MathRenderer content={msg.text} />
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
            {msg.sender === 'ai' && (
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-1 px-1">
                via {formatModelName(msg.modelUsed || activeModel)}
              </span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs p-3 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
            <span>ScoreUP AI is reasoning with Gemini...</span>
          </div>
        )}
      </div>

      {/* Quick Action Chips & Input Area */}
      <div className="p-4 bg-slate-50 dark:bg-[#080c14] border-t border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
        {/* Chips matching screenshot */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {activeChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.prompt)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 dark:bg-[#111723] dark:hover:bg-slate-800/80 border border-slate-200 hover:border-emerald-300 dark:border-slate-800 dark:hover:border-emerald-500/50 text-[11px] font-medium text-slate-700 hover:text-emerald-900 dark:text-slate-300 dark:hover:text-white transition-all active:scale-95 disabled:opacity-50 shadow-sm"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isExamContext ? "Ask about formulas, steps, or shortcuts..." : "Ask any SAT Math question..."}
            disabled={isLoading}
            className="flex-1 bg-white dark:bg-[#111723] border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition-all disabled:opacity-40 shadow-md active:scale-95"
            title="Send Message to ScoreUP AI Tutor"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
    </>
  );
};

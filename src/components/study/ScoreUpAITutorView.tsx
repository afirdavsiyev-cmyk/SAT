import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  Settings,
  Key,
  ExternalLink,
  Loader2,
  Mic,
  Paperclip,
  ChevronRight,
  Calculator,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Flame
} from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import {
  generateInstantHint,
  generateStepByStepSolution,
  sendSocraticChatMessage,
  ChatMessageItem
} from '../../services/geminiService';
import { getGeminiApiKey, setGeminiApiKey } from '../../lib/gemini';

export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  modelUsed?: string;
}

function formatModelName(model: string): string {
  if (!model) return '2.5 Flash';
  if (model.includes('3.1-pro')) return '3.1 Pro';
  if (model.includes('3.8-flash')) return '3.8 Flash';
  if (model.includes('3.6-flash')) return '3.6 Flash';
  if (model.includes('2.5-flash-lite')) return '2.5 Flash-Lite';
  if (model.includes('2.5-flash')) return '2.5 Flash';
  if (model.includes('2.0-flash')) return '2.0 Flash';
  if (model.includes('1.5-flash')) return '1.5 Flash';
  return model.replace('gemini-', '');
}

export const ScoreUpAITutorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [activeModel, setActiveModel] = useState<string>('gemini-2.5-flash');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentKey = getGeminiApiKey();
    setHasApiKey(!!currentKey);
    setApiKeyInput(currentKey);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('gemini_api_key', apiKeyInput.trim());
    }
    setHasApiKey(!!apiKeyInput.trim());
    setShowSettings(false);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const lower = textToSend.toLowerCase();

      // Tier 1: Instant Hint
      if (lower.startsWith('hint') || lower.includes('quick hint')) {
        const res = await generateInstantHint(textToSend, '', 'SAT Math');
        setActiveModel(res.usedModel);
        setMessages((prev) => [...prev, { sender: 'ai', text: res.data, modelUsed: res.usedModel }]);
        return;
      }

      // Tier 3: Step-by-Step KaTeX Math Breakdown
      if (lower.includes('step by step') || lower.includes('solve this') || lower.includes('vertex form')) {
        const res = await generateStepByStepSolution({
          prompt: textToSend,
          domain: 'Advanced Math',
          difficulty: 'Hard',
          correctAnswer: 'Detailed Explanation'
        });
        setActiveModel(res.usedModel);
        setMessages((prev) => [...prev, { sender: 'ai', text: res.data, modelUsed: res.usedModel }]);
        return;
      }

      // Tier 2: Socratic Chat
      const historyItems: ChatMessageItem[] = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await sendSocraticChatMessage(historyItems, textToSend);
      setActiveModel(res.usedModel);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.data, modelUsed: res.usedModel }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.', modelUsed: 'offline' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const starterCards = [
    {
      icon: <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      title: "Quiz me on high-yield Desmos shortcuts",
      prompt: "Give me a quick 3-question interactive quiz on the most important Desmos calculator shortcuts for the Digital SAT Math section."
    },
    {
      icon: <Calculator className="w-5 h-5 text-orange-500 dark:text-emerald-400" />,
      title: "Explain how to solve quadratic vertex form problems",
      prompt: "Explain how to convert a quadratic equation into vertex form f(x) = a(x - h)^2 + k and find the maximum or minimum coordinates step by step."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      title: "Show me a hard level 4 circle equation question",
      prompt: "Give me a challenging 750+ level SAT Math practice question involving circle equations, completing the square, and radius calculations."
    },
    {
      icon: <Flame className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
      title: "Strategies to boost my Math score from 700 to 800",
      prompt: "What are the most effective strategic habits, pacing techniques, and error-check routines to push a SAT Math score from 700 to a perfect 800?"
    }
  ];

  return (
    <div className="h-full flex flex-col justify-between max-w-4xl mx-auto py-4 px-2 sm:px-6 relative select-none transition-colors">
      
      {/* Top Floating Control Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-white/[0.06] flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_24px_rgba(249,115,22,0.3)] dark:from-emerald-500 dark:to-teal-600 flex items-center justify-center text-white dark:text-slate-950 font-black">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">ScoreUP AI Tutor</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-500/30 font-mono shadow-sm">
                <span>⚡ Powered by Gemini</span>
                <span className="font-extrabold">{formatModelName(activeModel)}</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">24/7 Socratic SAT Math Assistant</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-amber-900/15 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-all ${
              showSettings
                ? 'bg-orange-600 text-white border-orange-500 shadow-sm dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-400'
                : 'bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-amber-900/15 dark:border-white/[0.08] shadow-sm'
            }`}
            title="Configure Gemini API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gemini Settings Modal Overlay */}
      {showSettings && (
        <div className="my-3 p-4 bg-white/95 dark:bg-slate-900/95 border border-orange-300 dark:border-emerald-500/40 rounded-2xl space-y-3 backdrop-blur-xl animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
              <Key className="w-4 h-4 text-orange-600 dark:text-emerald-400" />
              <span>Configure Google Gemini 2.5 Flash API Key</span>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-orange-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <form onSubmit={handleSaveApiKey} className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AIZASy... key here"
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-amber-900/15 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-orange-500 dark:focus:border-emerald-500 font-mono shadow-inner"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 transition-colors shadow-md shadow-orange-500/25 dark:shadow-glow-emerald"
            >
              Save Key
            </button>
          </form>
        </div>
      )}

      {/* Main Conversation Canvas */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
        
        {/* State 1: Zero Messages Initial Welcome View */}
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-8 py-6">
            
            {/* Center Animated Logo */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_24px_rgba(249,115,22,0.3)] dark:from-emerald-500 dark:to-teal-600 flex items-center justify-center text-white dark:text-slate-950">
                  <Bot className="w-10 h-10 stroke-[2.2]" />
                </div>
                <div className="absolute -inset-1.5 rounded-3xl border border-orange-400/30 dark:border-emerald-400/30 animate-pulse pointer-events-none" />
              </div>

              <div className="space-y-2 max-w-lg">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">ScoreUP AI</span> anything about SAT® Math
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your dedicated Socratic coach for instant algebraic breakdowns, Desmos shortcuts, and 800-level exam strategies.
                </p>
              </div>
            </div>

            {/* Starter Prompt Cards 2x2 Grid with Warm Frame Borders & Hover */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {starterCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSendMessage(card.prompt)}
                  className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/30 transition-all duration-200 cursor-pointer text-left flex items-center justify-between group active:scale-[0.98] shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-orange-50/80 dark:bg-white/[0.04] border border-orange-200 dark:border-transparent group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-700 dark:group-hover:text-emerald-300 transition-colors">
                      {card.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* State 2: Active Chat Thread */
          <div className="space-y-6">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-md rounded-br-sm dark:from-emerald-500 dark:to-teal-500 dark:text-slate-950'
                      : 'bg-white dark:bg-slate-900/90 border border-amber-900/10 dark:border-emerald-500/40 text-slate-800 dark:text-slate-100 space-y-3 shadow-sm hover:shadow-md dark:shadow-xl backdrop-blur-xl rounded-bl-sm transition-all'
                  }`}
                >
                  {m.sender === 'ai' ? (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-white/[0.06]">
                        <div className="flex items-center space-x-2 text-orange-700 dark:text-emerald-400 font-bold text-xs">
                          <div className="w-5 h-5 rounded-lg bg-orange-50 dark:bg-emerald-950 border border-orange-200 dark:border-emerald-800/50 flex items-center justify-center">
                            <Bot className="w-3 h-3 text-orange-600 dark:text-emerald-400" />
                          </div>
                          <span>ScoreUP AI</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(m.text, idx)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          title="Copy text"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-orange-500 dark:text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="prose-slate dark:prose-invert">
                        <MathRenderer content={m.text} />
                      </div>
                    </div>
                  ) : (
                    <span>{m.text}</span>
                  )}
                </div>
              </div>
            ))}

            {/* AI Loading Bubble */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-orange-300 dark:border-emerald-500/40 rounded-3xl p-4 flex items-center space-x-3 text-xs text-orange-700 dark:text-emerald-400 shadow-sm dark:shadow-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600 dark:text-emerald-400" />
                  <span>ScoreUP AI is computing mathematical breakdown...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

      </div>

      {/* Bottom Input Dock with Warm Border and Glow */}
      <div className="pt-2 flex-shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-amber-900/15 dark:border-emerald-500/40 rounded-2xl p-1.5 flex items-center space-x-2 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] dark:shadow-2xl focus-within:border-orange-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-orange-500/25 dark:focus-within:ring-emerald-500/25 transition-all"
        >
          {/* Quick Action Tools */}
          <button
            type="button"
            onClick={() => handleSendMessage("Show me a quick Desmos speed shortcut.")}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-emerald-400 hover:bg-orange-50 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
            title="Desmos Tips"
          >
            <Calculator className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-teal-400 hover:bg-orange-50 dark:hover:bg-white/[0.06] rounded-xl transition-colors hidden sm:block"
            title="Formula Query"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask ScoreUP AI anything about SAT Math, formulas, or Desmos..."
            className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none font-sans"
          />

          {/* Send Action Button */}
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold disabled:opacity-40 transition-all active:scale-95 shadow-md shadow-orange-500/25 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-glow-emerald flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Disclaimer Text */}
        <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 font-mono">
          ScoreUP AI is powered by Gemini 2.5/Flash. Check critical exam calculations.
        </p>
      </div>

    </div>
  );
};

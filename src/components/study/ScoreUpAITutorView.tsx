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
import { generateTutorResponse, getGeminiApiKey, setGeminiApiKey, ChatMessage } from '../../services/gemini';
import { Question } from '../../types';

export const ScoreUpAITutorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
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
    setGeminiApiKey(apiKeyInput);
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
      const activeQ: Question = {
        id: 'scoreup-general',
        number: 1,
        section: 'math',
        module: 1,
        domain: 'Advanced Math',
        difficulty: 'Hard',
        prompt: 'SAT Math Knowledge Query',
        correctAnswer: '',
        explanation: '',
        type: 'multiple_choice'
      };

      const aiReplyText = await generateTutorResponse(textToSend, activeQ, messages);
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReplyText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an error. Please try again or check your Gemini API key.' }
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
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "Quiz me on high-yield Desmos shortcuts",
      prompt: "Give me a quick 3-question interactive quiz on the most important Desmos calculator shortcuts for the Digital SAT Math section."
    },
    {
      icon: <Calculator className="w-5 h-5 text-emerald-400" />,
      title: "Explain how to solve quadratic vertex form problems",
      prompt: "Explain how to convert a quadratic equation into vertex form f(x) = a(x - h)^2 + k and find the maximum or minimum coordinates step by step."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      title: "Show me a hard level 4 circle equation question",
      prompt: "Give me a challenging 750+ level SAT Math practice question involving circle equations, completing the square, and radius calculations."
    },
    {
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      title: "Strategies to boost my Math score from 700 to 800",
      prompt: "What are the most effective strategic habits, pacing techniques, and error-check routines to push a SAT Math score from 700 to a perfect 800?"
    }
  ];

  return (
    <div className="h-full flex flex-col justify-between max-w-4xl mx-auto py-4 px-2 sm:px-6 relative select-none">
      
      {/* Top Floating Control Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-glow-emerald">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-white">ScoreUP AI Tutor</h2>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full uppercase font-mono ${
                hasApiKey ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {hasApiKey ? 'Gemini 2.5 Live' : 'Demo Mode'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">24/7 Socratic SAT Math Assistant</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-all ${
              showSettings
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border-white/[0.08]'
            }`}
            title="Configure Gemini API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gemini Settings Modal Overlay */}
      {showSettings && (
        <div className="my-3 p-4 bg-slate-900/95 border border-emerald-500/30 rounded-2xl space-y-3 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Configure Google Gemini 2.5 Flash API Key</span>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-400 hover:underline flex items-center space-x-1"
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
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-glow-emerald"
            >
              Save Key
            </button>
          </form>
        </div>
      )}

      {/* Main Conversation Canvas */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* State 1: Zero Messages Initial Welcome View */}
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-8 py-6">
            
            {/* Center Animated Logo */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-[0_0_45px_rgba(16,185,129,0.45)] text-slate-950">
                  <Bot className="w-10 h-10 stroke-[2.2]" />
                </div>
                <div className="absolute -inset-1.5 rounded-3xl border border-emerald-400/30 animate-pulse pointer-events-none" />
              </div>

              <div className="space-y-2 max-w-lg">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">ScoreUP AI</span> anything about SAT® Math
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Your dedicated Socratic coach for instant algebraic breakdowns, Desmos shortcuts, and 800-level exam strategies.
                </p>
              </div>
            </div>

            {/* Starter Prompt Cards 2x2 Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {starterCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSendMessage(card.prompt)}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-200 cursor-pointer text-left flex items-center justify-between group active:scale-[0.98] shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-white/[0.04] group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {card.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
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
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-semibold shadow-lg rounded-br-sm'
                      : 'bg-slate-900/90 border border-white/[0.08] text-slate-100 space-y-3 shadow-xl backdrop-blur-xl rounded-bl-sm'
                  }`}
                >
                  {m.sender === 'ai' ? (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                          <div className="w-5 h-5 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center">
                            <Bot className="w-3 h-3 text-emerald-400" />
                          </div>
                          <span>ScoreUP AI</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(m.text, idx)}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                          title="Copy text"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="prose-invert">
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
                <div className="bg-slate-900 border border-white/[0.08] rounded-3xl p-4 flex items-center space-x-3 text-xs text-emerald-400 shadow-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>ScoreUP AI is computing mathematical breakdown...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

      </div>

      {/* Bottom Input Dock */}
      <div className="pt-2 flex-shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-1.5 flex items-center space-x-2 shadow-2xl focus-within:border-emerald-500/50 focus-within:bg-white/[0.06] transition-all"
        >
          {/* Quick Action Tools */}
          <button
            type="button"
            onClick={() => handleSendMessage("Show me a quick Desmos speed shortcut.")}
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-white/[0.06] rounded-xl transition-colors"
            title="Desmos Tips"
          >
            <Calculator className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="p-2 text-slate-400 hover:text-teal-400 hover:bg-white/[0.06] rounded-xl transition-colors hidden sm:block"
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
            className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none font-sans"
          />

          {/* Send Action Button */}
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-40 transition-all active:scale-95 shadow-glow-emerald flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Disclaimer Text */}
        <p className="text-[10px] text-center text-slate-500 font-mono">
          ScoreUP AI is powered by Gemini 2.5/Flash. Check critical exam calculations.
        </p>
      </div>

    </div>
  );
};

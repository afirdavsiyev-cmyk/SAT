import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, Settings, Key, ExternalLink, Loader2, CheckCircle2, Lightbulb, Target, Calculator, Search } from 'lucide-react';
import { Question } from '../../types';
import { MathRenderer } from '../common/MathRenderer';
import { generateTutorResponse, getGeminiApiKey, setGeminiApiKey, ChatMessage } from '../../services/gemini';

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({ isOpen, onClose, question }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Initialize messages and key state when question changes or drawer opens
  useEffect(() => {
    const currentKey = getGeminiApiKey();
    setHasApiKey(!!currentKey);
    setApiKeyInput(currentKey);

    // Initial welcome message
    setMessages([
      {
        sender: 'ai',
        text: `Hello! I'm **Preppy AI**, your Digital SAT Math tutor.\n\nI'm ready to help with **Question #${question.number}** (${question.domain}). Select a quick action chip below or ask me any question!`
      }
    ]);
  }, [question, isOpen]);

  if (!isOpen) return null;

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
      const aiReplyText = await generateTutorResponse(textToSend, question, messages);
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReplyText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an error. Please try again or check your Gemini API key.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickChips = [
    { label: "💡 Explain step by step", prompt: "Explain this question step by step." },
    { label: "🎯 Best strategy", prompt: "What is the best time-saving strategy for this question?" },
    { label: "📈 Desmos solution", prompt: "How do I solve this question using Desmos?" },
    { label: "🔍 Hint only", prompt: "Give me a subtle hint without spoiling the final answer." }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between select-none">
      
      {/* Header */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-800/50 flex items-center justify-center text-teal-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-sm">Preppy AI Tutor</h3>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase font-mono ${
                hasApiKey ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {hasApiKey ? 'Gemini 2.5 Live' : 'Demo Mode'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Digital SAT Socratic Assistant</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-colors ${
              showSettings
                ? 'bg-teal-500 text-slate-950 border-teal-400'
                : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Configure Gemini API Key"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gemini Settings Modal Overlay */}
      {showSettings && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 z-20">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Key className="w-4 h-4 text-teal-400" />
            <span>Configure Google Gemini API Key</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Get your free Gemini API key from Google AI Studio to unlock live 24/7 AI tutoring.
          </p>

          <form onSubmit={handleSaveApiKey} className="space-y-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AIZASy... key here"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 font-mono"
            />
            <div className="flex items-center justify-between pt-1">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-teal-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Free Key at Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors"
              >
                Save Key
              </button>
            </div>
          </form>
        </div>
      )}

      {/* No API Key Banner */}
      {!hasApiKey && !showSettings && (
        <div className="bg-gradient-to-r from-teal-950 to-slate-950 border-b border-teal-800/40 p-3 flex items-center justify-between text-xs">
          <span className="text-slate-300 text-[11px]">
            💡 Add your <span className="text-teal-400 font-bold">Free Gemini API Key</span> for live responses.
          </span>
          <button
            onClick={() => setShowSettings(true)}
            className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold hover:bg-teal-500/30"
          >
            Add Key
          </button>
        </div>
      )}

      {/* Messages Scroll Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 space-y-2'
              }`}
            >
              {m.sender === 'ai' ? (
                <div>
                  <div className="flex items-center space-x-1.5 text-teal-400 font-bold mb-1.5 pb-1 border-b border-slate-900">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Preppy AI</span>
                  </div>
                  <MathRenderer content={m.text} />
                </div>
              ) : (
                <span>{m.text}</span>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center space-x-2 text-xs text-teal-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Preppy is analyzing Question #{question.number}...</span>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Quick-Action Chips */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(chip.prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 text-[11px] font-medium transition-all text-left flex-shrink-0 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Text Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center space-x-2 pt-1"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask Preppy AI a question..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

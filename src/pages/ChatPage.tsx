import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import {
  Send,
  Sparkles,
  Trash2,
  Bot,
  User,
  Zap,
  TrendingUp,
  Truck,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

export function ChatPage() {
  const { messages, isTyping, getAIResponse, clearChat } = useChatStore();
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput('');
    setIsSending(true);

    await getAIResponse(message);
    setIsSending(false);
    
    // Focus back on input
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Truck, label: t.chat.vehicleStatus, query: 'Show me vehicle status' },
    { icon: TrendingUp, label: t.chat.quickActions, query: 'Generate analytics report' },
    { icon: Zap, label: t.chat.planTrip, query: 'Plan a new trip' },
    { icon: Settings, label: t.chat.checkMaintenance, query: 'Check maintenance schedule' },
  ];

  const handleQuickAction = (query: string) => {
    setInput(query);
    inputRef.current?.focus();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Sparkles size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                FleetFlow {t.chat.aiAssistant}
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Beta</span>
              </h1>
              <p className="text-blue-100 text-sm">Your intelligent fleet management companion</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <Trash2 size={18} />
            {t.chat.clearChat}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-dark-card border border-dark-border rounded-2xl flex flex-col overflow-hidden shadow-xl">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-4 animate-slide-up',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-br from-purple-600 to-pink-600'
                )}
              >
                {message.role === 'user' ? (
                  <User size={20} className="text-white" />
                ) : (
                  <Bot size={20} className="text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'max-w-[70%] rounded-2xl px-5 py-3 shadow-lg',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                    : 'bg-dark-bg border border-dark-border text-gray-200'
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p
                  className={cn(
                    'text-xs mt-2',
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-dark-bg border border-dark-border rounded-2xl px-5 py-3 shadow-lg">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="px-6 py-4 border-t border-dark-border bg-dark-bg/30">
            <p className="text-sm text-gray-400 mb-3">{t.chat.quickActions}:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center gap-2 px-4 py-3 bg-dark-card hover:bg-dark-border border border-dark-border rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg group"
                >
                  <action.icon size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-300 font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-dark-border bg-dark-bg/50">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.chat.askAnything}
              disabled={isSending}
              className="flex-1 px-5 py-4 bg-dark-card border-2 border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2 group"
            >
              <Send size={20} className="group-hover:translate-x-0.5 transition-transform" />
              {isSending ? t.chat.sending : t.chat.send}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            FleetFlow AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

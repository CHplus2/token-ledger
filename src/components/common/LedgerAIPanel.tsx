import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Bot,
  User,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
}

export const LedgerAIPanel: React.FC = () => {
  const {
    isAIPanelOpen,
    setIsAIPanelOpen,
    aiContext,
    setActiveModule,
    unclassifiedCount,
    openBreaksCount,
    closeReadinessScore,
  } = useLedger();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `### Welcome to Ledger AI
I am your **institutional digital asset accounting advisor**. 

I provide **GAAP/IFRS** classification recommendations, reconciliation break diagnostics, and month-end close guidance for **Atlas Digital Treasury Ltd**.

**Recommended Quick Queries:**
- **"Why is Epoch 682 SOL reward unclassified?"**
- **"Diagnose the 2.0 ETH reconciliation break"**
- **"What items are blocking our August 2026 Close?"**
- **"Explain Solana SPL rent exemption accounting treatment"**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'Token Ledger Accounting Core',
    },
  ]);

  if (!isAIPanelOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}_u`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          contextType: aiContext.type,
          contextData: {
            ...aiContext.data,
            unclassifiedCount,
            openBreaksCount,
            closeReadinessScore,
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: `msg_${Date.now()}_a`,
        sender: 'assistant',
        text: data.answer || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider || 'Gemini 3.8 Flash',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `msg_${Date.now()}_err`,
        sender: 'assistant',
        text: `### Accounting Diagnostics Note
Unable to reach remote AI inference. Using deterministic rule recommendation:
- **Treatment:** Classify as Staking & Consensus Reward Income (Account 4200) with Dr 1230 Digital Assets.
- **Auditor Note:** Retain validator vote account timestamp and spot reference rate.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'Fallback Engine',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Why is Epoch 682 SOL reward unclassified?',
    'Diagnose the 2.0 ETH reconciliation break',
    'What is blocking our August close?',
    'Explain Solana treasury accounting advantages',
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#ffffff] border-l border-[#e2e8f0] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-16 px-6 bg-[#ffffff] text-slate-900 border-b border-[#e2e8f0] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide flex items-center gap-2">
              <span>Ledger AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-700 border border-purple-700/50">
                GAAP / IFRS
              </span>
            </div>
            <div className="text-[11px] text-slate-600">
              Institutional Advisory & Control Assistant
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAIPanelOpen(false)}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-[#f1f5f9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context Badge */}
      <div className="px-6 py-2 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between text-xs text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-purple-600" />
          <span>Active Context: <strong className="text-slate-900">{aiContext.type || 'General Subledger'}</strong></span>
        </div>
        <span className="text-[11px] text-slate-600">Read-Only Advisory</span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-xs'
                  : 'bg-[#f8fafc] border border-[#e2e8f0] text-slate-900 shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line prose-xs">
                {m.text}
              </div>
              <div
                className={`mt-2 flex items-center justify-between text-[10px] ${
                  m.sender === 'user' ? 'text-purple-700' : 'text-slate-600'
                }`}
              >
                <span>{m.timestamp}</span>
                {m.provider && <span>via {m.provider}</span>}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[#f1f5f9] border border-[#cbd5e1] flex items-center justify-center text-slate-900 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-slate-700">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Analyzing subledger entries, valuation data, and accounting policies...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-6 py-2.5 border-t border-[#e2e8f0] bg-[#ffffff] flex flex-wrap gap-1.5 shrink-0">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] hover:text-purple-700 hover:border-purple-500/50 border border-[#cbd5e1] text-slate-700 transition-colors shadow-2xs text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-[#e2e8f0] bg-[#ffffff] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Ledger AI regarding transactions, breaks, or IFRS..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-600 text-xs"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-600 mt-2 text-center">
          Ledger AI recommends accounting classifications. Humans approve all postings.
        </p>
      </div>
    </div>
  );
};

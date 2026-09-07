'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AIMessage, PlatformContext, fetchPlatformContext, processAIQuery } from '@/lib/aiEngine';
import AIMessageBubble from './AIMessageBubble';
import AISuggestions from './AISuggestions';

const WELCOME: AIMessage = {
  id: 'welcome',
  role: 'assistant',
  timestamp: new Date(),
  type: 'text',
  content: `👋 **Hello! I'm Synqoro AI** — your intelligent FM assistant.\n\nI'm connected to your live platform data and can help you with:\n• Work orders, assets & compliance\n• Fault diagnosis & troubleshooting\n• Maintenance planning & scheduling\n• Risk assessments & reports\n• Predictive maintenance insights\n\nType a question or pick a suggestion below to get started.`,
  data: null,
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ctx, setCtx] = useState<PlatformContext | null>(null);
  const [ctxLoading, setCtxLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [panel, setPanel] = useState<'chat' | 'insights' | 'fault'>('chat');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !ctx && !ctxLoading) {
      setCtxLoading(true);
      fetchPlatformContext().then(data => {
        setCtx(data);
        setCtxLoading(false);
      }).catch(() => {
        setCtx({ workOrders: [], assets: [], compliance: [], ppmSchedules: [], contractors: [], sites: [] });
        setCtxLoading(false);
      });
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = useCallback(async (text?: string) => {
    const query = (text || input).trim();
    if (!query) return;
    setInput('');
    const userMsg: AIMessage = { id: Date.now().toString(), role: 'user', timestamp: new Date(), type: 'text', content: query, data: null };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const response = processAIQuery(query, ctx || { workOrders: [], assets: [], compliance: [], ppmSchedules: [], contractors: [], sites: [] });
    setMessages(prev => [...prev, response]);
    setLoading(false);
  }, [input, ctx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const startVoice = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser'); return; }
    const recognition = new SR();
    recognition.lang = 'en-GB';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => sendMessage(transcript), 100);
    };
    recognition.start();
  };

  const clearChat = () => setMessages([WELCOME]);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${open ? 'bg-gray-800 rotate-45' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}
        title="Synqoro AI Assistant"
      >
        {open ? (
          <i className="ri-close-line text-white text-xl"></i>
        ) : (
          <i className="ri-sparkling-2-line text-white text-xl"></i>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: '580px' }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-sparkling-2-line text-white text-sm"></i>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Synqoro AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-blue-100 text-xs">{ctxLoading ? 'Loading data...' : 'Connected to live data'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors" title="Clear chat">
                <i className="ri-refresh-line text-sm"></i>
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                <i className="ri-close-line text-sm"></i>
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-100 flex-shrink-0">
            {[
              { k: 'chat', label: 'Chat', icon: 'ri-chat-3-line' },
              { k: 'insights', label: 'Insights', icon: 'ri-bar-chart-line' },
              { k: 'fault', label: 'Fault AI', icon: 'ri-tools-line' },
            ].map(t => (
              <button key={t.k} onClick={() => setPanel(t.k as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium cursor-pointer transition-colors ${panel === t.k ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <i className={t.icon}></i>{t.label}
              </button>
            ))}
          </div>

          {panel === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-gray-50/50">
                {messages.map(msg => <AIMessageBubble key={msg.id} msg={msg} />)}
                {loading && (
                  <div className="flex gap-2.5 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-sparkling-line text-white text-xs"></i>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <AISuggestions onSelect={q => sendMessage(q)} />
              <div className="p-3 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your FM platform..."
                    className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  />
                  <button onClick={startVoice}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${listening ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                    <i className={`${listening ? 'ri-mic-fill animate-pulse' : 'ri-mic-line'} text-sm`}></i>
                  </button>
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                    className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-40 transition-colors">
                    <i className="ri-send-plane-fill text-xs"></i>
                  </button>
                </div>
              </div>
            </>
          )}

          {panel === 'insights' && <InsightsPanel ctx={ctx} />}
          {panel === 'fault' && <FaultPanel onSend={q => { setPanel('chat'); sendMessage(q); }} />}
        </div>
      )}
    </>
  );
}

function InsightsPanel({ ctx }: { ctx: PlatformContext | null }) {
  if (!ctx) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <i className="ri-loader-4-line text-2xl animate-spin block mb-2"></i>
        <p className="text-sm">Loading insights...</p>
      </div>
    </div>
  );

  const overdueJobs = ctx.workOrders.filter(w => w.due_date && new Date(w.due_date) < new Date() && !['completed','cancelled'].includes(w.status)).length;
  const emergencyJobs = ctx.workOrders.filter(w => w.priority === 'emergency' && !['completed','cancelled'].includes(w.status)).length;
  const overdueCompliance = ctx.compliance.filter(c => c.status === 'overdue' || c.status === 'failed').length;
  const dueSoonCompliance = ctx.compliance.filter(c => c.status === 'due_soon').length;
  const completionRate = ctx.workOrders.length > 0 ? Math.round((ctx.workOrders.filter(w => w.status === 'completed').length / ctx.workOrders.length) * 100) : 0;
  const riskScore = Math.min(100, (overdueCompliance * 15) + (emergencyJobs * 20));
  const riskColor = riskScore >= 60 ? 'text-red-600' : riskScore >= 30 ? 'text-amber-600' : 'text-green-600';
  const riskBg = riskScore >= 60 ? 'bg-red-50 border-red-200' : riskScore >= 30 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200';

  const insights = [
    { label: 'AI Risk Score', value: `${riskScore}/100`, icon: 'ri-bar-chart-line', color: riskColor, bg: riskBg, sub: riskScore >= 60 ? 'High Risk' : riskScore >= 30 ? 'Medium Risk' : 'Low Risk' },
    { label: 'Overdue Jobs', value: overdueJobs, icon: 'ri-alarm-warning-line', color: overdueJobs > 0 ? 'text-red-600' : 'text-green-600', bg: overdueJobs > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200', sub: 'Work orders' },
    { label: 'Emergency Open', value: emergencyJobs, icon: 'ri-fire-line', color: emergencyJobs > 0 ? 'text-red-600' : 'text-green-600', bg: emergencyJobs > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200', sub: 'Active jobs' },
    { label: 'Compliance Issues', value: overdueCompliance + dueSoonCompliance, icon: 'ri-shield-check-line', color: overdueCompliance > 0 ? 'text-red-600' : 'text-amber-600', bg: overdueCompliance > 0 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200', sub: `${overdueCompliance} overdue, ${dueSoonCompliance} due soon` },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: 'ri-checkbox-circle-line', color: completionRate >= 70 ? 'text-green-600' : 'text-amber-600', bg: completionRate >= 70 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200', sub: 'Work orders' },
    { label: 'Total Assets', value: ctx.assets.length, icon: 'ri-database-2-line', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', sub: 'Tracked' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">Live AI Insights</p>
      <div className="grid grid-cols-2 gap-2">
        {insights.map(ins => (
          <div key={ins.label} className={`rounded-xl p-3 border ${ins.bg}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <i className={`${ins.icon} ${ins.color} text-sm`}></i>
              <span className="text-xs text-gray-500">{ins.label}</span>
            </div>
            <p className={`text-xl font-bold ${ins.color}`}>{ins.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{ins.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
        <p className="text-xs font-semibold text-blue-700 mb-1">🤖 AI Recommendation</p>
        <p className="text-xs text-gray-600">
          {overdueJobs > 0 || emergencyJobs > 0
            ? `Prioritise ${emergencyJobs} emergency jobs and ${overdueJobs} overdue work orders. Review compliance items expiring soon.`
            : 'Platform health is good. Continue regular monitoring and scheduled maintenance.'}
        </p>
      </div>
    </div>
  );
}

function FaultPanel({ onSend }: { onSend: (q: string) => void }) {
  const [faultInput, setFaultInput] = useState('');
  const FAULT_EXAMPLES = [
    'Boiler pressure dropping', 'AHU vibration issue', 'Fire alarm panel fault',
    'Lift door not closing', 'HVAC not cooling', 'Generator won\'t start',
  ];

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 border border-orange-100 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <i className="ri-tools-line text-orange-600"></i>
          <p className="text-sm font-semibold text-gray-800">AI Fault Diagnosis</p>
        </div>
        <p className="text-xs text-gray-600">Describe the fault or symptom and AI will provide likely causes, repair steps, safety warnings, and parts needed.</p>
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">Common faults:</p>
        <div className="flex flex-wrap gap-1.5">
          {FAULT_EXAMPLES.map(ex => (
            <button key={ex} onClick={() => onSend(ex)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-full text-xs text-gray-600 hover:text-orange-700 cursor-pointer transition-colors whitespace-nowrap">
              {ex}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <input value={faultInput} onChange={e => setFaultInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && faultInput.trim()) { onSend(faultInput); setFaultInput(''); } }}
          placeholder="Describe the fault..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400" />
        <button onClick={() => { if (faultInput.trim()) { onSend(faultInput); setFaultInput(''); } }}
          className="px-3 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 cursor-pointer whitespace-nowrap">
          Diagnose
        </button>
      </div>
    </div>
  );
}
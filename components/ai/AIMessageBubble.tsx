'use client';

import { AIMessage } from '@/lib/aiEngine';

export default function AIMessageBubble({ msg }: { msg: AIMessage }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs text-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 mb-4">
      <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <i className="ri-sparkling-line text-white text-xs"></i>
      </div>
      <div className="flex-1 min-w-0">
        {msg.type === 'table' && msg.data ? (
          <TableResponse msg={msg} />
        ) : msg.type === 'fault' && msg.data ? (
          <FaultResponse msg={msg} />
        ) : msg.type === 'report' || msg.type === 'insight' ? (
          <ReportResponse msg={msg} />
        ) : (
          <TextResponse msg={msg} />
        )}
        <p className="text-xs text-gray-400 mt-1 pl-1">
          {msg.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function TextResponse({ msg }: { msg: AIMessage }) {
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
      <FormattedText text={msg.content} />
    </div>
  );
}

function ReportResponse({ msg }: { msg: AIMessage }) {
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
      <FormattedText text={msg.content} />
    </div>
  );
}

function TableResponse({ msg }: { msg: AIMessage }) {
  const { headers, rows } = msg.data;
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <FormattedText text={msg.content} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h: string) => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.length === 0 ? (
              <tr><td colSpan={headers.length} className="px-3 py-4 text-center text-gray-400">No data found</td></tr>
            ) : rows.map((row: string[], i: number) => (
              <tr key={i} className="hover:bg-gray-50/50">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-gray-700 whitespace-nowrap">{cell || '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FaultResponse({ msg }: { msg: AIMessage }) {
  const d = msg.data;
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 border-b border-orange-100">
        <p className="text-sm font-bold text-gray-800">{msg.content}</p>
        <p className="text-xs text-orange-600 mt-0.5">⏱ Estimated time: {d.estimatedTime}</p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <Section title="🔍 Likely Causes" items={d.likelyCauses} color="text-orange-700" />
        <Section title="🔧 Suggested Repairs" items={d.suggestedRepairs} color="text-blue-700" />
        <Section title="⚠️ Safety Warnings" items={d.safetyWarnings} color="text-red-700" bg="bg-red-50 rounded-lg p-2" />
        <Section title="🛒 Recommended Parts" items={d.recommendedParts} color="text-purple-700" />
        <div>
          <p className="font-semibold text-gray-600 mb-1">💡 Maintenance Recommendation</p>
          <p className="text-gray-600 bg-blue-50 rounded-lg p-2">{d.recommendations}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, color, bg }: { title: string; items: string[]; color: string; bg?: string }) {
  return (
    <div className={bg || ''}>
      <p className={`font-semibold mb-1 ${color}`}>{title}</p>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-gray-600 flex gap-1.5">
            <span className="text-gray-300 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1"></div>;
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
}
'use client';

import { useState } from 'react';

interface AuditLog {
  id: string;
  user_id: string;
  user_email?: string;
  company_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  created_at: string;
}

interface SAAuditTabProps {
  logs: AuditLog[];
  loading: boolean;
}

const actionColors: Record<string, string> = {
  user_login: 'bg-blue-500/20 text-blue-300',
  user_logout: 'bg-gray-500/20 text-gray-400',
  suspend_company: 'bg-red-500/20 text-red-300',
  activate_company: 'bg-emerald-500/20 text-emerald-300',
  change_plan: 'bg-violet-500/20 text-violet-300',
  create_company: 'bg-cyan-500/20 text-cyan-300',
  role_change: 'bg-amber-500/20 text-amber-300',
  user_invite: 'bg-pink-500/20 text-pink-300',
};

export default function SAAuditTab({ logs, loading }: SAAuditTabProps) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const actions = ['all', ...Array.from(new Set(logs.map((l) => l.action)))];

  const filtered = logs.filter((l) => {
    const matchSearch = l.action.includes(search.toLowerCase()) || l.resource_type.includes(search.toLowerCase()) || (l.user_email || '').includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit logs..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.slice(0, 6).map((a) => (
            <button key={a} onClick={() => setActionFilter(a)} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${actionFilter === a ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}`}>
              {a === 'all' ? 'All Actions' : a.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Time', 'User', 'Action', 'Resource', 'Details'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse"></div></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No audit logs found</td></tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.user_email || (log.user_id ? log.user_id.slice(0, 8) + '...' : '—')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-500/20 text-gray-400'}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 capitalize">{log.resource_type}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
'use client'

import { useState, useEffect } from 'react'
import { fetchSupportAccessLogs } from '@/lib/enterprise-api'
import type { SupportAccessLog } from '@/lib/enterprise-types'

export default function EnterpriseSupportPage() {
  const [logs, setLogs] = useState<SupportAccessLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchSupportAccessLogs(50)
      setLogs(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  const activeSessions = logs.filter((l) => l.status === 'active')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Support Access</h1>
      <p className="text-gray-400 text-sm mb-8">Support session audit and remote access logs</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Total Sessions</p>
          <p className="text-2xl font-bold text-white">{logs.length}</p>
        </div>
        <div className="bg-[#111827] border border-emerald-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Active Now</p>
          <p className="text-2xl font-bold text-emerald-400">{activeSessions.length}</p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Total Commands</p>
          <p className="text-2xl font-bold text-white">{logs.reduce((s, l) => s + (l.commands_executed || 0), 0)}</p>
        </div>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-2 px-5 py-3 text-xs text-gray-500 font-medium border-b border-white/5 bg-white/[0.02]">
          <div>Agent</div>
          <div>Access Type</div>
          <div>Reason</div>
          <div>Session Start</div>
          <div>Duration</div>
          <div>Commands</div>
          <div>Status</div>
        </div>
        {logs.map((log) => {
          const duration = log.session_end
            ? Math.round((new Date(log.session_end).getTime() - new Date(log.session_start).getTime()) / 60000)
            : null

          return (
            <div key={log.id} className="grid grid-cols-7 gap-2 items-center px-5 py-3 border-b border-white/5 last:border-b-0">
              <div className="text-sm text-white">{log.support_agent_name || log.support_agent_id || '—'}</div>
              <div className="text-sm text-gray-300">{log.access_type}</div>
              <div className="text-sm text-gray-400 truncate">{log.access_reason || '—'}</div>
              <div className="text-xs text-gray-500">{new Date(log.session_start).toLocaleDateString()}</div>
              <div className="text-sm text-gray-300">{duration !== null ? `${duration}m` : 'Active'}</div>
              <div className="text-sm text-gray-300">{log.commands_executed}</div>
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  log.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-gray-500/10 text-gray-400'
                }`}>{log.status}</span>
              </div>
            </div>
          )
        })}
      </div>

      {activeSessions.length > 0 && (
        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 flex items-center justify-center text-blue-400">
              <i className="ri-information-line"></i>
            </div>
            <p className="text-sm text-blue-300">
              {activeSessions.length} active support session{activeSessions.length > 1 ? 's' : ''}. All actions are logged for audit purposes.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { fetchSyncEvents, fetchSyncConflicts } from '@/lib/enterprise-api'
import type { DeploymentSyncEvent, CloudSyncConflict } from '@/lib/enterprise-types'

export default function EnterpriseSyncPage() {
  const [events, setEvents] = useState<DeploymentSyncEvent[]>([])
  const [conflicts, setConflicts] = useState<CloudSyncConflict[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'events' | 'conflicts'>('events')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [e, c] = await Promise.all([
        fetchSyncEvents(undefined, 100),
        fetchSyncConflicts(undefined, 50),
      ])
      setEvents(e)
      setConflicts(c)
      setLoading(false)
    }
    load()
  }, [])

  const pending = events.filter((e) => e.sync_status === 'pending')
  const processed = events.filter((e) => e.sync_status === 'processed')
  const failed = events.filter((e) => e.sync_status === 'failed')

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Sync Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Monitor sync events and conflicts across all deployments</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Total Events</p>
          <p className="text-2xl font-bold text-white">{events.length}</p>
        </div>
        <div className="bg-[#111827] border border-emerald-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Processed</p>
          <p className="text-2xl font-bold text-emerald-400">{processed.length}</p>
        </div>
        <div className="bg-[#111827] border border-amber-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{pending.length}</p>
        </div>
        <div className="bg-[#111827] border border-red-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-400">{failed.length}</p>
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-[#111827] border border-white/5 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('events')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-colors ${tab === 'events' ? 'bg-violet-500/20 text-violet-300' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Sync Events ({events.length})
        </button>
        <button
          onClick={() => setTab('conflicts')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-colors ${tab === 'conflicts' ? 'bg-violet-500/20 text-violet-300' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Conflicts ({conflicts.length})
        </button>
      </div>

      {tab === 'events' && (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-gray-500 font-medium">
            <div className="col-span-2">Deployment</div>
            <div className="col-span-2">Event Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Retries</div>
            <div className="col-span-2">Last Error</div>
            <div className="col-span-2">Time</div>
          </div>
          {events.map((ev) => {
            const depName = (ev.client_deployments as { deployment_name?: string } | undefined)?.deployment_name || '—'
            return (
              <div key={ev.id} className="grid grid-cols-12 gap-2 items-center py-2.5 px-4 bg-[#111827] rounded-lg border border-white/5">
                <div className="col-span-2 text-sm text-white truncate">{depName}</div>
                <div className="col-span-2 text-sm text-gray-300">{ev.event_type}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    ev.sync_status === 'processed' ? 'bg-emerald-500/10 text-emerald-400' :
                    ev.sync_status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{ev.sync_status}</span>
                </div>
                <div className="col-span-2 text-sm text-gray-400">{ev.retry_count}</div>
                <div className="col-span-2 text-xs text-gray-500 truncate">{ev.last_error || '—'}</div>
                <div className="col-span-2 text-xs text-gray-600">{new Date(ev.created_at).toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'conflicts' && (
        <div className="space-y-1">
          <div className="grid grid-cols-10 gap-2 px-4 py-2 text-xs text-gray-500 font-medium">
            <div className="col-span-2">Table</div>
            <div className="col-span-2">Record ID</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Resolved By</div>
            <div className="col-span-2">Time</div>
          </div>
          {conflicts.length === 0 ? (
            <div className="bg-[#111827] border border-white/5 rounded-lg p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-emerald-400 text-xl"></i>
              </div>
              <p className="text-gray-400 text-sm">No sync conflicts found</p>
            </div>
          ) : (
            conflicts.map((c) => (
              <div key={c.id} className="grid grid-cols-10 gap-2 items-center py-2.5 px-4 bg-[#111827] rounded-lg border border-white/5">
                <div className="col-span-2 text-sm text-white">{c.table_name}</div>
                <div className="col-span-2 text-sm text-gray-300 font-mono">{c.record_id}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    c.conflict_status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>{c.conflict_status}</span>
                </div>
                <div className="col-span-2 text-sm text-gray-400">{c.resolved_by || '—'}</div>
                <div className="col-span-2 text-xs text-gray-600">{new Date(c.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
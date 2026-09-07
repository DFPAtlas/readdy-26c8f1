'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchDeployment, fetchDeploymentHealth, fetchSyncEvents, fetchDeploymentVersions } from '@/lib/enterprise-api'
import type { ClientDeployment, DeploymentHealth, DeploymentSyncEvent, DeploymentVersion } from '@/lib/enterprise-types'

export default function DeploymentDetailClient({ deploymentId }: { deploymentId: string }) {
  const [deployment, setDeployment] = useState<ClientDeployment | null>(null)
  const [health, setHealth] = useState<DeploymentHealth[]>([])
  const [syncEvents, setSyncEvents] = useState<DeploymentSyncEvent[]>([])
  const [versions, setVersions] = useState<DeploymentVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const id = parseInt(deploymentId)
      const [d, h, s, v] = await Promise.all([
        fetchDeployment(id),
        fetchDeploymentHealth(id),
        fetchSyncEvents(id, 20),
        fetchDeploymentVersions(id),
      ])
      setDeployment(d)
      setHealth(h)
      setSyncEvents(s)
      setVersions(v)
      setLoading(false)
    }
    load()
  }, [deploymentId])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          <div className="h-40 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!deployment) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <h2 className="text-lg font-semibold text-white mb-2">Deployment not found</h2>
          <Link href="/enterprise/deployments" className="text-violet-400 hover:text-violet-300 text-sm cursor-pointer">
            Back to deployments
          </Link>
        </div>
      </div>
    )
  }

  const clientName = (deployment.enterprise_clients as { client_name?: string } | undefined)?.client_name || 'Unknown'
  const clientId = deployment.enterprise_client_id

  function UsageBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = Math.min((value / max) * 100, 100)
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{label}</span>
          <span className="text-gray-400">{value}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Link href="/enterprise/deployments" className="text-gray-500 hover:text-gray-300 cursor-pointer">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-left-line"></i></div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{deployment.deployment_name}</h1>
          <p className="text-gray-400 text-sm">
            {clientName}
            {clientId && (
              <Link href={`/enterprise/clients/${clientId}`} className="text-violet-400 hover:text-violet-300 ml-2 cursor-pointer">
                View client →
              </Link>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2">Status</p>
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${deployment.is_online ? 'bg-emerald-400' : 'bg-red-400'} ${deployment.is_online ? '' : 'animate-pulse'}`}></div>
            <span className="text-white font-medium">{deployment.is_online ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2">Version</p>
          <p className="text-white font-medium">{deployment.app_version || deployment.deployment_version}</p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2">Sync Queue</p>
          <p className={`font-medium ${deployment.sync_queue_size > 0 ? 'text-amber-400' : 'text-white'}`}>{deployment.sync_queue_size}</p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2">Last Sync</p>
          <p className="text-white font-medium text-sm">
            {deployment.last_sync_success ? new Date(deployment.last_sync_success).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Resource Usage</h2>
          <div className="space-y-4">
            <UsageBar label="CPU" value={deployment.cpu_usage_pct || 0} max={100} color="bg-blue-500" />
            <UsageBar label="RAM" value={deployment.ram_usage_pct || 0} max={100} color="bg-violet-500" />
            <UsageBar label="Disk" value={deployment.disk_usage_pct || 0} max={100} color={deployment.disk_usage_pct && deployment.disk_usage_pct > 80 ? 'bg-red-500' : 'bg-emerald-500'} />
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">CPU Cores</p>
              <p className="text-white font-medium">{deployment.cpu_cores || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">RAM</p>
              <p className="text-white font-medium">{deployment.ram_gb ? `${deployment.ram_gb} GB` : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Disk</p>
              <p className="text-white font-medium">{deployment.disk_gb ? `${deployment.disk_gb} GB` : '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Service Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Database', status: deployment.db_status },
              { label: 'Supabase', status: deployment.supabase_status },
              { label: 'App', status: deployment.app_status },
              { label: 'Backup', status: deployment.backup_status },
            ].map((svc) => (
              <div key={svc.label} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg">
                <span className="text-sm text-gray-400">{svc.label}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  svc.status === 'healthy' || svc.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  svc.status === 'degraded' || svc.status === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                  svc.status === 'unknown' ? 'bg-gray-500/10 text-gray-400' :
                  'bg-red-500/10 text-red-400'
                }`}>{svc.status}</span>
              </div>
            ))}
          </div>
          {deployment.backup_last_success && (
            <p className="text-xs text-gray-600 mt-3">Last backup: {new Date(deployment.backup_last_success).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Health Checks ({health.length})</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {health.map((h) => (
              <div key={h.id} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${
                    h.status === 'healthy' || h.status === 'success' ? 'bg-emerald-400' :
                    h.status === 'degraded' || h.status === 'warning' ? 'bg-amber-400' :
                    'bg-red-400'
                  }`}></span>
                  <div>
                    <p className="text-sm text-white">{h.check_type}</p>
                    {h.message && <p className="text-xs text-gray-500">{h.message}</p>}
                  </div>
                </div>
                <span className="text-xs text-gray-600">{new Date(h.checked_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Sync Events ({syncEvents.length})</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {syncEvents.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${
                    ev.sync_status === 'processed' ? 'bg-emerald-400' :
                    ev.sync_status === 'pending' ? 'bg-amber-400' :
                    'bg-red-400'
                  }`}></span>
                  <div>
                    <p className="text-sm text-white">{ev.event_type}</p>
                    {ev.last_error && <p className="text-xs text-red-400">{ev.last_error}</p>}
                  </div>
                </div>
                <span className="text-xs text-gray-600">{new Date(ev.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
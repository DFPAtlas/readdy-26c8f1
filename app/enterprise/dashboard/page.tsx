'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { fetchEnterpriseDashboardStats, fetchAlerts, fetchAllDeployments } from '@/lib/enterprise-api'
import type { EnterpriseDashboardStats, DeploymentAlert, ClientDeployment } from '@/lib/enterprise-types'

function StatCard({ label, value, icon, color, href }: { label: string; value: number | string; icon: string; color: string; href?: string }) {
  const content = (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <i className={`${icon} text-white text-base`}></i>
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

function AlertRow({ alert }: { alert: DeploymentAlert }) {
  const severityColors: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }

  const deploymentName = (alert.client_deployments as { deployment_name?: string } | undefined)?.deployment_name || 'Unknown'
  const clientName = (alert.enterprise_clients as { client_name?: string } | undefined)?.client_name || 'Unknown'

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-[#111827] rounded-lg border border-white/5">
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${severityColors[alert.severity] || severityColors.info}`}>
          {alert.severity}
        </span>
        <div>
          <p className="text-sm text-white font-medium">{alert.title}</p>
          <p className="text-xs text-gray-500">
            {deploymentName} — {clientName} — {new Date(alert.created_at).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {alert.acknowledged ? (
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <div className="w-3 h-3 flex items-center justify-center"><i className="ri-checkbox-circle-line text-[10px]"></i></div>
            Acked
          </span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
        )}
      </div>
    </div>
  )
}

export default function EnterpriseDashboardPage() {
  const [stats, setStats] = useState<EnterpriseDashboardStats | null>(null)
  const [alerts, setAlerts] = useState<DeploymentAlert[]>([])
  const [deployments, setDeployments] = useState<ClientDeployment[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [s, a, d] = await Promise.all([
      fetchEnterpriseDashboardStats(),
      fetchAlerts(false, 10),
      fetchAllDeployments(),
    ])
    setStats(s)
    setAlerts(a)
    setDeployments(d)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-28 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Enterprise Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Central overview of all connected client deployments</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-refresh-line text-sm"></i>
          </div>
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Clients" value={stats?.totalClients || 0} icon="ri-building-2-line" color="bg-violet-500/20" href="/enterprise/clients" />
        <StatCard label="Online Deployments" value={stats?.onlineDeployments || 0} icon="ri-checkbox-circle-line" color="bg-emerald-500/20" href="/enterprise/deployments" />
        <StatCard label="Offline Deployments" value={stats?.offlineDeployments || 0} icon="ri-close-circle-line" color="bg-red-500/20" />
        <StatCard label="Sync Backlog" value={stats?.syncBacklog || 0} icon="ri-refresh-line" color="bg-amber-500/20" href="/enterprise/sync" />
        <StatCard label="Critical Alerts" value={stats?.criticalAlerts || 0} icon="ri-alert-line" color="bg-red-500/20" href="/enterprise/alerts" />

        <StatCard label="Licence Issues" value={stats?.licenceIssues || 0} icon="ri-key-2-line" color="bg-amber-500/20" href="/enterprise/licences" />
        <StatCard label="Failed Backups" value={stats?.failedBackups || 0} icon="ri-hard-drive-2-line" color="bg-red-500/20" />
        <StatCard label="Versions Outdated" value={stats?.outdatedVersions || 0} icon="ri-git-branch-line" color="bg-blue-500/20" href="/enterprise/versions" />
        <StatCard label="Storage Used" value={`${((stats?.totalStorageUsedMb || 0) / 1024).toFixed(1)} GB`} icon="ri-database-2-line" color="bg-indigo-500/20" />
        <StatCard
          label="Last Global Sync"
          value={stats?.lastGlobalSync ? new Date(stats.lastGlobalSync).toLocaleTimeString() : 'Never'}
          icon="ri-time-line"
          color="bg-slate-500/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
            <Link href="/enterprise/alerts" className="text-sm text-violet-400 hover:text-violet-300 cursor-pointer whitespace-nowrap">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="bg-[#111827] border border-white/5 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-emerald-400 text-xl"></i>
                </div>
                <p className="text-gray-400 text-sm">No active alerts. All systems healthy.</p>
              </div>
            ) : (
              alerts.slice(0, 6).map((alert) => <AlertRow key={alert.id} alert={alert} />)
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Deployments</h2>
            <Link href="/enterprise/deployments" className="text-sm text-violet-400 hover:text-violet-300 cursor-pointer whitespace-nowrap">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {deployments.slice(0, 6).map((dep) => (
              <Link
                key={dep.id}
                href={`/enterprise/deployments/${dep.id}`}
                className="flex items-center justify-between py-3 px-4 bg-[#111827] rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${dep.is_online ? 'bg-emerald-400' : 'bg-red-400'} ${dep.is_online ? '' : 'animate-pulse'}`}></div>
                  <div>
                    <p className="text-sm text-white font-medium">{dep.deployment_name}</p>
                    <p className="text-xs text-gray-500">
                      {dep.site_name || '—'} · v{dep.app_version || dep.deployment_version} · {dep.db_status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {dep.cpu_usage_pct ? `CPU ${dep.cpu_usage_pct}%` : '—'} · {dep.ram_usage_pct ? `RAM ${dep.ram_usage_pct}%` : '—'}
                  </p>
                  {dep.sync_queue_size > 0 && (
                    <p className="text-xs text-amber-400">{dep.sync_queue_size} pending sync</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
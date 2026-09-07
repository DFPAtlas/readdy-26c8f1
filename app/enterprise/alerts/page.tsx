'use client'

import { useState, useEffect } from 'react'
import { fetchAlerts, acknowledgeAlert, resolveAlert } from '@/lib/enterprise-api'
import type { DeploymentAlert } from '@/lib/enterprise-types'

export default function EnterpriseAlertsPage() {
  const [alerts, setAlerts] = useState<DeploymentAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [showResolved, setShowResolved] = useState(false)

  const loadAlerts = async () => {
    setLoading(true)
    const data = await fetchAlerts(showResolved ? undefined : false, 100)
    setAlerts(data)
    setLoading(false)
  }

  useEffect(() => { loadAlerts() }, [showResolved])

  const filtered = alerts.filter((a) => (filter === 'all' ? true : a.severity === filter))

  const handleAcknowledge = async (id: number) => {
    await acknowledgeAlert(id, 'enterprise-admin')
    loadAlerts()
  }

  const handleResolve = async (id: number) => {
    await resolveAlert(id)
    loadAlerts()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-gray-400 text-sm mt-1">{alerts.length} total · {alerts.filter((a) => !a.resolved).length} unresolved</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-violet-500 focus:ring-violet-500"
            />
            <span>Show resolved</span>
          </label>
          <div className="flex bg-[#111827] border border-white/5 rounded-lg p-1">
            {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-violet-500/20 text-violet-300' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((alert) => {
          const depName = (alert.client_deployments as { deployment_name?: string } | undefined)?.deployment_name || 'Unknown'
          const clientName = (alert.enterprise_clients as { client_name?: string } | undefined)?.client_name || 'Unknown'

          const severityConfig: Record<string, { bg: string; text: string; border: string }> = {
            critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
            warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
            info: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
          }
          const sc = severityConfig[alert.severity] || severityConfig.info

          return (
            <div key={alert.id} className={`p-4 bg-[#111827] rounded-xl border ${alert.resolved ? 'border-white/5 opacity-60' : sc.border}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${sc.bg} ${sc.text}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-500">{alert.alert_type}</span>
                    {alert.resolved && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400">Resolved</span>
                    )}
                  </div>
                  <p className="text-white font-medium">{alert.title}</p>
                  {alert.message && <p className="text-sm text-gray-400 mt-1">{alert.message}</p>}
                  <p className="text-xs text-gray-600 mt-2">
                    {depName} · {clientName} · {new Date(alert.created_at).toLocaleString()}
                    {alert.acknowledged_at && ` · Acked ${new Date(alert.acknowledged_at).toLocaleString()}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.acknowledged && !alert.resolved && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Acknowledge
                    </button>
                  )}
                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-[#111827] border border-white/5 rounded-xl p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <i className="ri-check-line text-emerald-400 text-2xl"></i>
            </div>
            <p className="text-white font-medium">No alerts matching filter</p>
            <p className="text-gray-500 text-sm mt-1">All clear</p>
          </div>
        )}
      </div>
    </div>
  )
}
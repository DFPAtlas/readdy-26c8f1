'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchEnterpriseClient, fetchDeploymentsByClient, fetchAlerts } from '@/lib/enterprise-api'
import type { EnterpriseClient, ClientDeployment, DeploymentAlert } from '@/lib/enterprise-types'

export default function ClientDetailClient({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<EnterpriseClient | null>(null)
  const [deployments, setDeployments] = useState<ClientDeployment[]>([])
  const [alerts, setAlerts] = useState<DeploymentAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const id = parseInt(clientId)
      const [c, d, a] = await Promise.all([
        fetchEnterpriseClient(id),
        fetchDeploymentsByClient(id),
        fetchAlerts(false, 20),
      ])
      setClient(c)
      setDeployments(d)
      setAlerts(a.filter((alert) => alert.enterprise_client_id === id))
      setLoading(false)
    }
    load()
  }, [clientId])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          <div className="h-40 bg-white/5 rounded-xl"></div>
          <div className="h-60 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
            <i className="ri-error-warning-line text-red-400 text-2xl"></i>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Client not found</h2>
          <Link href="/enterprise/clients" className="text-violet-400 hover:text-violet-300 text-sm cursor-pointer">
            Back to clients
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Link href="/enterprise/clients" className="text-gray-500 hover:text-gray-300 cursor-pointer">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-left-line"></i></div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{client.client_name}</h1>
          <p className="text-gray-400 text-sm">Deployment ID: {client.deployment_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Plan</p>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold capitalize text-lg">{client.plan_tier}</span>
            <span className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase border ${statusColors[client.licence_status] || statusColors.active}`}>
              {client.licence_status}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Max Users</p>
              <p className="text-white font-medium">{client.max_users}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Max Sites</p>
              <p className="text-white font-medium">{client.max_sites}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Support Tier</p>
              <p className="text-white font-medium capitalize">{client.support_tier}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Grace Period</p>
              <p className="text-white font-medium">{client.grace_period_days} days</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Contact</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-white">{client.contact_name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-white">{client.contact_email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Licence</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Key</p>
              <p className="text-white font-mono text-sm">{client.licence_key || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Started</p>
              <p className="text-white">{new Date(client.licence_start_date).toLocaleDateString()}</p>
            </div>
            {client.licence_renewal_date && (
              <div>
                <p className="text-xs text-gray-500">Renewal</p>
                <p className="text-white">{new Date(client.licence_renewal_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {client.enabled_modules && client.enabled_modules.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-white mb-3">Enabled Modules</h2>
          <div className="flex flex-wrap gap-2">
            {client.enabled_modules.map((mod) => (
              <span key={mod} className="px-3 py-1.5 bg-violet-500/10 text-violet-300 text-xs rounded-lg border border-violet-500/20 capitalize">
                {mod.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Deployments ({deployments.length})</h2>
          <div className="space-y-2">
            {deployments.map((dep) => (
              <Link
                key={dep.id}
                href={`/enterprise/deployments/${dep.id}`}
                className="flex items-center justify-between py-3 px-4 bg-[#111827] rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${dep.is_online ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  <div>
                    <p className="text-sm text-white">{dep.deployment_name}</p>
                    <p className="text-xs text-gray-500">{dep.site_name} · v{dep.app_version || dep.deployment_version}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{dep.db_status} · {dep.supabase_status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Recent Alerts ({alerts.length})</h2>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="bg-[#111827] border border-white/5 rounded-lg p-4">
                <p className="text-gray-500 text-sm text-center">No alerts for this client</p>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="py-2.5 px-4 bg-[#111827] rounded-lg border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                      alert.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                      alert.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>{alert.severity}</span>
                    <span className="text-[10px] text-gray-600">{new Date(alert.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-white mt-1">{alert.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
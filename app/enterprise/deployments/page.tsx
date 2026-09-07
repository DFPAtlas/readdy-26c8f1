'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchAllDeployments } from '@/lib/enterprise-api'
import type { ClientDeployment } from '@/lib/enterprise-types'

export default function EnterpriseDeploymentsPage() {
  const [deployments, setDeployments] = useState<ClientDeployment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchAllDeployments()
      setDeployments(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all'
    ? deployments
    : deployments.filter((d) => (filter === 'online' ? d.is_online : !d.is_online))

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Deployments</h1>
          <p className="text-gray-400 text-sm mt-1">{deployments.length} total · {deployments.filter((d) => d.is_online).length} online · {deployments.filter((d) => !d.is_online).length} offline</p>
        </div>
        <div className="flex bg-[#111827] border border-white/5 rounded-lg p-1">
          {(['all', 'online', 'offline'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-colors ${
                filter === f ? 'bg-violet-500/20 text-violet-300' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((dep) => {
          const clientName = (dep.enterprise_clients as { client_name?: string } | undefined)?.client_name || 'Unknown'

          return (
            <Link
              key={dep.id}
              href={`/enterprise/deployments/${dep.id}`}
              className="flex items-center justify-between p-5 bg-[#111827] rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${dep.is_online ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <i className={`${dep.is_online ? 'ri-server-line text-emerald-400' : 'ri-server-line text-red-400'} text-lg`}></i>
                </div>
                <div>
                  <p className="text-white font-medium">{dep.deployment_name}</p>
                  <p className="text-sm text-gray-500">
                    {clientName} · {dep.site_name || 'N/A'} · v{dep.app_version || dep.deployment_version}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      dep.db_status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' :
                      dep.db_status === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>DB: {dep.db_status}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      dep.supabase_status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>Supabase: {dep.supabase_status}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    CPU {dep.cpu_usage_pct || '—'}% · RAM {dep.ram_usage_pct || '—'}% · Disk {dep.disk_usage_pct || '—'}%
                  </p>
                </div>
                {dep.sync_queue_size > 0 && (
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg border border-amber-500/20">
                    {dep.sync_queue_size} pending
                  </span>
                )}
                <div className={`w-2.5 h-2.5 rounded-full ${dep.is_online ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                <div className="w-5 h-5 flex items-center justify-center text-gray-600">
                  <i className="ri-arrow-right-s-line"></i>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { fetchAllDeployments } from '@/lib/enterprise-api'
import type { ClientDeployment } from '@/lib/enterprise-types'

export default function EnterpriseHealthPage() {
  const [deployments, setDeployments] = useState<ClientDeployment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchAllDeployments()
      setDeployments(data)
      setLoading(false)
    }
    load()
  }, [])

  const healthy = deployments.filter((d) => d.db_status === 'healthy' && d.supabase_status === 'healthy' && d.app_status === 'healthy')
  const degraded = deployments.filter((d) =>
    (d.db_status === 'degraded' || d.supabase_status === 'degraded' || d.app_status === 'degraded' || d.db_status === 'warning' || d.supabase_status === 'warning' || d.app_status === 'warning') &&
    d.db_status !== 'critical' && d.supabase_status !== 'critical' && d.app_status !== 'critical'
  )
  const critical = deployments.filter((d) =>
    d.db_status === 'critical' || d.supabase_status === 'critical' || d.app_status === 'critical'
  )

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

  function StatusDot({ status }: { status: string }) {
    let color = 'bg-gray-500'
    if (status === 'healthy' || status === 'success') color = 'bg-emerald-400'
    else if (status === 'degraded' || status === 'warning') color = 'bg-amber-400'
    else if (status === 'critical' || status === 'failed') color = 'bg-red-400'
    return <span className={`w-2 h-2 rounded-full ${color} ${status === 'critical' ? 'animate-pulse' : ''}`}></span>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">System Health</h1>
      <p className="text-gray-400 text-sm mb-8">Health overview across all client deployments</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-xs mb-1">Total</p>
          <p className="text-3xl font-bold text-white">{deployments.length}</p>
        </div>
        <div className="bg-[#111827] border border-emerald-500/10 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-xs mb-1">Healthy</p>
          <p className="text-3xl font-bold text-emerald-400">{healthy.length}</p>
        </div>
        <div className="bg-[#111827] border border-amber-500/10 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-xs mb-1">Degraded</p>
          <p className="text-3xl font-bold text-amber-400">{degraded.length}</p>
        </div>
        <div className="bg-[#111827] border border-red-500/10 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-xs mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-400">{critical.length}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-10 gap-2 px-5 py-2 text-xs text-gray-500 font-medium">
          <div className="col-span-3">Deployment</div>
          <div className="col-span-2 text-center">Database</div>
          <div className="col-span-2 text-center">Supabase</div>
          <div className="col-span-2 text-center">App</div>
          <div className="text-center">Backup</div>
        </div>
        {deployments.map((dep) => (
          <div key={dep.id} className="grid grid-cols-10 gap-2 items-center py-3 px-5 bg-[#111827] rounded-lg border border-white/5">
            <div className="col-span-3">
              <p className="text-sm text-white font-medium">{dep.deployment_name}</p>
              <p className="text-xs text-gray-600">{dep.site_name}</p>
            </div>
            <div className="col-span-2 flex items-center justify-center space-x-2">
              <StatusDot status={dep.db_status} />
              <span className="text-sm text-gray-300 capitalize">{dep.db_status}</span>
            </div>
            <div className="col-span-2 flex items-center justify-center space-x-2">
              <StatusDot status={dep.supabase_status} />
              <span className="text-sm text-gray-300 capitalize">{dep.supabase_status}</span>
            </div>
            <div className="col-span-2 flex items-center justify-center space-x-2">
              <StatusDot status={dep.app_status} />
              <span className="text-sm text-gray-300 capitalize">{dep.app_status}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <StatusDot status={dep.backup_status} />
              <span className="text-sm text-gray-300 capitalize">{dep.backup_status}</span>
            </div>
          </div>
        ))}
      </div>

      {critical.length > 0 && (
        <div className="mt-8 p-5 bg-red-500/5 border border-red-500/10 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 flex items-center justify-center text-red-400">
              <i className="ri-error-warning-line"></i>
            </div>
            <h2 className="text-red-400 font-semibold text-sm">Critical Issues Requiring Attention ({critical.length})</h2>
          </div>
          {critical.map((dep) => (
            <div key={dep.id} className="text-sm text-gray-300 py-1">
              {dep.deployment_name}:{' '}
              {dep.db_status === 'critical' && 'Database critical. '}
              {dep.supabase_status === 'critical' && 'Supabase critical. '}
              {dep.app_status === 'critical' && 'App critical. '}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
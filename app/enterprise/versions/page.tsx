'use client'

import { useState, useEffect } from 'react'
import { fetchDeploymentVersions, fetchAllDeployments } from '@/lib/enterprise-api'
import type { DeploymentVersion, ClientDeployment } from '@/lib/enterprise-types'

export default function EnterpriseVersionsPage() {
  const [versions, setVersions] = useState<DeploymentVersion[]>([])
  const [deployments, setDeployments] = useState<ClientDeployment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [v, d] = await Promise.all([
        fetchDeploymentVersions(),
        fetchAllDeployments(),
      ])
      setVersions(v)
      setDeployments(d)
      setLoading(false)
    }
    load()
  }, [])

  const LATEST_VERSION = '3.2.1'

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const outdated = deployments.filter((d) => d.app_version && d.app_version < LATEST_VERSION)
  const versionCounts: Record<string, number> = {}
  deployments.forEach((d) => {
    const v = d.app_version || d.deployment_version || 'unknown'
    versionCounts[v] = (versionCounts[v] || 0) + 1
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Version Tracking</h1>
          <p className="text-gray-400 text-sm mt-1">Latest: v{LATEST_VERSION} · {outdated.length} deployments out of date</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Deployments</p>
          <p className="text-2xl font-bold text-white">{deployments.length}</p>
        </div>
        <div className="bg-[#111827] border border-emerald-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Up to Date</p>
          <p className="text-2xl font-bold text-emerald-400">{deployments.length - outdated.length}</p>
        </div>
        <div className="bg-[#111827] border border-amber-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Outdated</p>
          <p className="text-2xl font-bold text-amber-400">{outdated.length}</p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Latest Stable</p>
          <p className="text-2xl font-bold text-white">{LATEST_VERSION}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Version Distribution</h2>
          <div className="space-y-3">
            {Object.entries(versionCounts)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([version, count]) => {
                const pct = (count / deployments.length) * 100
                const isLatest = version === LATEST_VERSION
                return (
                  <div key={version} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className={`${isLatest ? 'text-emerald-400' : 'text-gray-300'}`}>
                        v{version} {isLatest && '(latest)'}
                      </span>
                      <span className="text-gray-500">{count} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isLatest ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Deployments</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {versions.slice(0, 10).map((v) => (
              <div key={v.id} className="py-2.5 px-3 bg-white/[0.02] rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">v{v.app_version}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    v.release_channel === 'stable' ? 'bg-emerald-500/10 text-emerald-400' :
                    v.release_channel === 'beta' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>{v.release_channel}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">{new Date(v.deployed_at).toLocaleDateString()}</p>
                  {v.release_notes && <p className="text-xs text-gray-600 truncate ml-2">{v.release_notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {outdated.length > 0 && (
        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 flex items-center justify-center text-amber-400">
              <i className="ri-error-warning-line"></i>
            </div>
            <h2 className="text-amber-400 font-semibold text-sm">Outdated Deployments ({outdated.length})</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {outdated.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between py-1.5 px-3 bg-white/[0.02] rounded">
                <span className="text-sm text-gray-300">{dep.deployment_name}</span>
                <span className="text-xs text-amber-400">v{dep.app_version || dep.deployment_version} → v{LATEST_VERSION}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
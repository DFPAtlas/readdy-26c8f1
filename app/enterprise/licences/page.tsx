'use client'

import { useState, useEffect } from 'react'
import { fetchLicenceStatuses } from '@/lib/enterprise-api'
import type { LicenceStatus } from '@/lib/enterprise-types'

export default function EnterpriseLicencesPage() {
  const [licences, setLicences] = useState<LicenceStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchLicenceStatuses()
      setLicences(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  const active = licences.filter((l) => l.status === 'active')
  const warning = licences.filter((l) => l.status === 'warning')
  const expiringSoon = licences.filter((l) => {
    if (!l.expires_at) return false
    const days = (new Date(l.expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    return days < 90 && days > 0
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Licence Management</h1>
      <p className="text-gray-400 text-sm mb-8">Subscription and licence status for all enterprise clients</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Total Licences</p>
          <p className="text-2xl font-bold text-white">{licences.length}</p>
        </div>
        <div className="bg-[#111827] border border-emerald-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{active.length}</p>
        </div>
        <div className="bg-[#111827] border border-amber-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Warning</p>
          <p className="text-2xl font-bold text-amber-400">{warning.length}</p>
        </div>
        <div className="bg-[#111827] border border-amber-500/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Expiring Soon (90d)</p>
          <p className="text-2xl font-bold text-amber-400">{expiringSoon.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {licences.map((lic) => {
          const daysUntilExpiry = lic.expires_at
            ? Math.ceil((new Date(lic.expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
            : null

          return (
            <div key={lic.id} className="p-5 bg-[#111827] rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-medium font-mono">{lic.licence_key}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="capitalize text-sm text-gray-400">{lic.plan_tier}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-sm text-gray-400 capitalize">{lic.support_tier} support</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium uppercase ${
                  lic.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  lic.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>{lic.status}</span>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs text-gray-500">Max Users</p>
                  <p className="text-white font-medium">{lic.max_users}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Max Sites</p>
                  <p className="text-white font-medium">{lic.max_sites}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className={`font-medium ${daysUntilExpiry !== null && daysUntilExpiry < 30 ? 'text-red-400' : daysUntilExpiry !== null && daysUntilExpiry < 90 ? 'text-amber-400' : 'text-white'}`}>
                    {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : 'Perpetual'}
                    {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                      <span className="text-xs text-gray-600 ml-1">({daysUntilExpiry}d)</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Grace Period</p>
                  <p className="text-white font-medium">{lic.grace_period_days} days</p>
                </div>
              </div>

              {lic.enabled_modules && lic.enabled_modules.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                  {lic.enabled_modules.map((mod) => (
                    <span key={mod} className="px-2 py-0.5 bg-violet-500/10 text-violet-300 text-[10px] rounded border border-violet-500/20 capitalize">
                      {mod.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
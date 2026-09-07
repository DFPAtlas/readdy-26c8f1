'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchAllEnterpriseClients, fetchDeploymentsByClient } from '@/lib/enterprise-api'
import type { EnterpriseClient, ClientDeployment } from '@/lib/enterprise-types'

export default function EnterpriseClientsPage() {
  const [clients, setClients] = useState<(EnterpriseClient & { deploymentCount?: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchAllEnterpriseClients()
      const enriched = await Promise.all(
        data.map(async (c) => {
          const deps = await fetchDeploymentsByClient(c.id)
          return { ...c, deploymentCount: deps.length }
        })
      )
      setClients(enriched)
      setLoading(false)
    }
    load()
  }, [])

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
    expired: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
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
          <h1 className="text-2xl font-bold text-white">Enterprise Clients</h1>
          <p className="text-gray-400 text-sm mt-1">{clients.length} total clients</p>
        </div>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/enterprise/clients/${client.id}`}
            className="flex items-center justify-between p-5 bg-[#111827] rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <i className="ri-building-2-line text-violet-400 text-lg"></i>
              </div>
              <div>
                <p className="text-white font-medium">{client.client_name}</p>
                <p className="text-sm text-gray-500">
                  {client.contact_email || 'No contact'} · {client.plan_tier} · {client.deploymentCount || 0} deployments
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase border ${statusColors[client.licence_status] || statusColors.active}`}>
                  {client.licence_status}
                </span>
                {client.licence_renewal_date && (
                  <p className="text-xs text-gray-600 mt-1">Renews {new Date(client.licence_renewal_date).toLocaleDateString()}</p>
                )}
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${client.is_online ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              <div className="w-5 h-5 flex items-center justify-center text-gray-600">
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
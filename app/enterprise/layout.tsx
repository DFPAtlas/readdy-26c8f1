'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const enterpriseNavItems = [
  { href: '/enterprise/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
  { href: '/enterprise/clients', icon: 'ri-building-2-line', label: 'Clients' },
  { href: '/enterprise/deployments', icon: 'ri-server-line', label: 'Deployments' },
  { href: '/enterprise/health', icon: 'ri-heart-pulse-line', label: 'Health' },
  { href: '/enterprise/sync', icon: 'ri-refresh-line', label: 'Sync' },
  { href: '/enterprise/alerts', icon: 'ri-alert-line', label: 'Alerts' },
  { href: '/enterprise/licences', icon: 'ri-key-2-line', label: 'Licences' },
  { href: '/enterprise/support', icon: 'ri-headphone-line', label: 'Support' },
  { href: '/enterprise/versions', icon: 'ri-git-branch-line', label: 'Versions' },
]

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-white">
      <div className="w-56 bg-[#060d1c] border-r border-white/5 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <Link href="/enterprise/dashboard" className="flex items-center space-x-2.5 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
              <i className="ri-cloud-fill text-white text-sm"></i>
            </div>
            <div>
              <span className="text-base font-bold text-white">Syn<span className="text-violet-400">qoro</span></span>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Enterprise Cloud</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-0.5">
            <div className="text-[10px] uppercase text-gray-600 pt-2 pb-1.5 px-2 font-semibold tracking-widest">ENTERPRISE</div>
            {enterpriseNavItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    active
                      ? 'bg-gradient-to-r from-violet-500/20 to-purple-600/10 text-violet-300 border border-violet-500/20'
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-sm ${active ? 'text-violet-400' : ''}`}></i>
                  </div>
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-300 cursor-pointer transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
              <i className="ri-arrow-left-line text-sm"></i>
            </div>
            <span className="text-sm whitespace-nowrap">Back to Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
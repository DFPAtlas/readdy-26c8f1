'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { signOut, getRoleLabel, getRoleColor } from '@/lib/auth';
import { checkAssetLimit, checkUserLimit } from '@/lib/subscription-limits';
import type { UserRole } from '@/lib/auth';
import { useState } from 'react';

const allNavItems = [
  { section: 'MAIN', items: [
    { href: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard', roles: [] },
    { href: '/client-dashboard', icon: 'ri-layout-grid-line', label: 'Client Dashboard', roles: [] },
    { href: '/ai-dashboard', icon: 'ri-sparkling-2-line', label: 'AI Intelligence Hub', roles: [] },
    { href: '/facilities', icon: 'ri-building-line', label: 'Facilities', roles: [] },
    { href: '/work-orders', icon: 'ri-tools-line', label: 'Work Orders', roles: [] },
    { href: '/work-orders/engineer', icon: 'ri-smartphone-line', label: 'Engineer View', roles: ['engineer', 'fm_manager', 'company_admin', 'super_admin', 'platform_owner'] },
    { href: '/work-orders/client-portal', icon: 'ri-user-line', label: 'Client Portal', roles: [] },
    { href: '/compliance', icon: 'ri-shield-check-line', label: 'Compliance & PPM', roles: [] },
    { href: '/maintenance', icon: 'ri-settings-line', label: 'Preventive Maintenance', roles: [] },
  ]},
  { section: 'ASSET MANAGEMENT', items: [
    { href: '/asset-register', icon: 'ri-database-2-line', label: 'Asset Register', roles: [] },
  ]},
  { section: 'DIGITAL TWIN', items: [
    { href: '/digital-twin', icon: 'ri-building-3-line', label: 'Digital Twin', roles: [] },
  ]},
  { section: 'MANAGEMENT', items: [
    { href: '/space-management', icon: 'ri-map-line', label: 'Space Management', roles: [] },
    { href: '/events', icon: 'ri-calendar-event-line', label: 'Events', roles: [] },
    { href: '/reception', icon: 'ri-customer-service-line', label: 'Reception', roles: [] },
    { href: '/post-room', icon: 'ri-mail-line', label: 'Post Room', roles: [] },
    { href: '/security', icon: 'ri-shield-check-line', label: 'Security', roles: [] },
    { href: '/hr', icon: 'ri-user-heart-line', label: 'HR', roles: ['company_admin', 'fm_manager', 'super_admin', 'platform_owner'] },
    { href: '/vendors', icon: 'ri-truck-line', label: 'Vendors', roles: [] },
    { href: '/payroll', icon: 'ri-money-dollar-circle-line', label: 'Payroll', roles: ['company_admin', 'finance_user', 'super_admin', 'platform_owner'] },
    { href: '/staff', icon: 'ri-team-line', label: 'Staff Management', roles: ['company_admin', 'fm_manager', 'super_admin', 'platform_owner'] },
  ]},
  { section: 'REPORTS', items: [
    { href: '/analytics', icon: 'ri-line-chart-line', label: 'Analytics', roles: [] },
  ]},
  { section: 'SETTINGS', items: [
    { href: '/users', icon: 'ri-user-line', label: 'Users', roles: ['company_admin', 'super_admin', 'platform_owner'] },
    { href: '/settings', icon: 'ri-settings-2-line', label: 'Settings', roles: ['company_admin', 'super_admin', 'platform_owner'] },
    { href: '/super-admin', icon: 'ri-shield-star-line', label: 'Super Admin', roles: ['super_admin', 'platform_owner'] },
    { href: '/enterprise/dashboard', icon: 'ri-cloud-fill', label: 'Enterprise Cloud', roles: ['super_admin', 'platform_owner'] },
    { href: '/', icon: 'ri-global-line', label: 'Landing Page', roles: ['super_admin', 'platform_owner'] },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, company, limits } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const role = (profile?.role || 'viewer') as UserRole;
  const assetCheck = limits ? checkAssetLimit(limits) : null;
  const userCheck = limits ? checkUserLimit(limits) : null;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } catch {
      setSigningOut(false);
    }
  };

  const isVisible = (roles: string[]) => {
    if (roles.length === 0) return true;
    return roles.includes(role);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="w-64 bg-[#060d1c] text-white flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-white/5">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <i className="ri-node-tree text-white text-sm"></i>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full border border-[#060d1c]"></div>
          </div>
          <div className="min-w-0">
            <span className="text-base font-bold text-white">Syn<span className="text-cyan-400">qoro</span></span>
            {company && <p className="text-xs text-gray-500 truncate">{company.name}</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-0.5">
          {allNavItems.map((group) => {
            const visibleItems = group.items.filter((item) => isVisible(item.roles));
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.section}>
                <div className="text-[10px] uppercase text-gray-600 pt-4 pb-1.5 px-2 font-semibold tracking-widest">{group.section}</div>
                {visibleItems.map((item) => {
                  const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        active
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/20'
                          : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                      }`}
                    >
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        <i className={`${item.icon} text-sm ${active ? 'text-cyan-400' : ''}`}></i>
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {limits && (assetCheck || userCheck) && (
        <div className="px-3 py-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase text-gray-600 font-semibold tracking-widest">PLAN USAGE</span>
            <span className="text-[10px] text-cyan-400 font-medium capitalize">{limits.plan}</span>
          </div>
          <div className="space-y-2.5">
            {assetCheck && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Assets</span>
                  <span className={`font-medium ${!assetCheck.allowed ? 'text-red-400' : 'text-gray-400'}`}>{assetCheck.current}/{assetCheck.max}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${!assetCheck.allowed ? 'bg-red-500' : assetCheck.percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(assetCheck.percentage, 100)}%` }} />
                </div>
                {!assetCheck.allowed && (
                  <Link href={assetCheck.upgradeUrl} className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer mt-0.5 transition-colors">
                    <span>Upgrade to unlock</span>
                    <div className="w-3 h-3 flex items-center justify-center">
                      <i className="ri-arrow-right-up-line text-[9px]"></i>
                    </div>
                  </Link>
                )}
              </div>
            )}
            {userCheck && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Users</span>
                  <span className={`font-medium ${!userCheck.allowed ? 'text-red-400' : 'text-gray-400'}`}>{userCheck.current}/{userCheck.max}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${!userCheck.allowed ? 'bg-red-500' : userCheck.percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(userCheck.percentage, 100)}%` }} />
                </div>
                {!userCheck.allowed && (
                  <Link href={userCheck.upgradeUrl} className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer mt-0.5 transition-colors">
                    <span>Upgrade to unlock</span>
                    <div className="w-3 h-3 flex items-center justify-center">
                      <i className="ri-arrow-right-up-line text-[9px]"></i>
                    </div>
                  </Link>
                )}
              </div>
            )}
            {(assetCheck && !assetCheck.allowed || userCheck && !userCheck.allowed) && (
              <Link href={assetCheck?.upgradeUrl || userCheck?.upgradeUrl || '/#pricing'} className="block text-center text-[10px] text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-md py-1.5 px-2 cursor-pointer transition-colors hover:bg-cyan-500/10">
                View plans →
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="p-3 border-t border-white/5">
        {profile && (
          <div className="flex items-center space-x-2 px-2 py-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{profile.full_name}</p>
              <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${getRoleColor(role)}`}>
                {getRoleLabel(role)}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-900/20 hover:text-red-400 cursor-pointer transition-colors disabled:opacity-60"
        >
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <i className={`${signingOut ? 'ri-loader-4-line animate-spin' : 'ri-logout-box-line'} text-sm`}></i>
          </div>
          <span className="text-sm">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );
}
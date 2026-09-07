'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { signOut, getRoleLabel, getRoleColor } from '@/lib/auth';
import type { UserRole } from '@/lib/auth';

export default function TopBar({ title }: { title?: string }) {
  const { profile, company } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } catch {
      setSigningOut(false);
    }
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="h-14 bg-[#060d1c] border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center space-x-3">
        {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
        {company && (
          <span className="text-sm text-gray-500 hidden md:block">
            {company.name}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer relative">
            <i className="ri-notification-3-line text-lg"></i>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-2 cursor-pointer hover:bg-white/5 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-tight">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 leading-tight">{profile?.email || ''}</p>
            </div>
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-gray-500 text-sm"></i>
            </div>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#080f20] rounded-xl shadow-2xl border border-white/10 z-20 overflow-hidden">
                <div className="p-4 border-b border-white/8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">{initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{profile?.full_name}</p>
                      <p className="text-xs text-gray-500">{profile?.email}</p>
                      {profile?.role && (
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(profile.role as UserRole)}`}>
                          {getRoleLabel(profile.role as UserRole)}
                        </span>
                      )}
                    </div>
                  </div>
                  {company && (
                    <div className="mt-3 p-2 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="text-sm font-medium text-white">{company.name}</p>
                      <span className="text-xs text-cyan-400 capitalize">{company.subscription_plan} plan</span>
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <button
                    onClick={() => { setShowMenu(false); router.push('/settings'); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-left"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-user-settings-line text-gray-500 text-sm"></i>
                    </div>
                    <span className="text-sm text-gray-300">Account Settings</span>
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); router.push('/users'); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-left"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-team-line text-gray-500 text-sm"></i>
                    </div>
                    <span className="text-sm text-gray-300">Manage Users</span>
                  </button>
                </div>

                <div className="p-2 border-t border-white/8">
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 cursor-pointer text-left disabled:opacity-60"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={`${signingOut ? 'ri-loader-4-line animate-spin' : 'ri-logout-box-line'} text-red-500 text-sm`}></i>
                    </div>
                    <span className="text-sm text-red-600 font-medium">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
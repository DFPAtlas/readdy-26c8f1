'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import type { UserRole } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const DEV_BYPASS = false;

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { session, profile, loading } = useAuth();
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (DEV_BYPASS) return;
    if (loading) return;
    if (!session) {
      router.push('/login');
      return;
    }
    if (allowedRoles && profile && !allowedRoles.includes(profile.role as UserRole)) {
      setAccessDenied(true);
    }
  }, [session, profile, loading, router, allowedRoles]);

  if (DEV_BYPASS) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030912]">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <i className="ri-node-tree text-white text-lg"></i>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#030912] animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <i className="ri-loader-4-line animate-spin text-cyan-500 text-xl"></i>
            <span>Loading Synqoro...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030912]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-shield-cross-line text-red-400 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">You don't have permission to view this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 cursor-pointer whitespace-nowrap"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
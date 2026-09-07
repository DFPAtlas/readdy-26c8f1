'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/auth';

const ROLE_ROUTES: Record<string, string> = {
  platform_owner: '/super-admin',
  super_admin: '/super-admin',
  engineer: '/work-orders/engineer',
  client_user: '/client-dashboard',
  viewer: '/client-dashboard',
  company_admin: '/client-dashboard',
  fm_manager: '/client-dashboard',
  site_manager: '/client-dashboard',
  finance_user: '/client-dashboard',
};

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await signIn(email, password);
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        const role = profile?.role as UserRole;
        const dest = ROLE_ROUTES[role] || '/dashboard';
        onClose();
        router.push(dest);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setForgotSent(true);
    } catch {
      setError('Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#080f20] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-violet-600/5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        <div className="relative p-8">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white cursor-pointer rounded-lg hover:bg-white/10 transition-colors">
            <i className="ri-close-line text-lg"></i>
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <i className="ri-node-tree text-white text-base"></i>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#080f20]"></div>
            </div>
            <div>
              <span className="text-white font-bold text-lg">Syn<span className="text-cyan-400">qoro</span></span>
              <div className="text-[9px] text-cyan-400/60 font-medium tracking-[0.2em] uppercase -mt-0.5">Smart Building Intelligence</div>
            </div>
          </div>

          {tab === 'login' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-gray-400 text-sm mb-6">Sign in to your workspace</p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-2">
                  <i className="ri-error-warning-line text-red-400 text-sm flex-shrink-0"></i>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="Enter your password"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer">
                      <i className={showPw ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => { setTab('forgot'); setError(''); }} className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25"
                >
                  {loading ? (
                    <><i className="ri-loader-4-line animate-spin"></i><span>Signing in...</span></>
                  ) : (
                    <><i className="ri-login-box-line"></i><span>Sign In</span></>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-white/10 text-center">
                <p className="text-gray-500 text-xs">
                  Don't have an account?{' '}
                  <a href="/register" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">Create company account</a>
                </p>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => { setTab('login'); setForgotSent(false); setError(''); }} className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm mb-4 cursor-pointer">
                <i className="ri-arrow-left-line"></i><span>Back</span>
              </button>
              <h2 className="text-2xl font-bold text-white mb-1">Reset password</h2>
              <p className="text-gray-400 text-sm mb-6">We'll send a reset link to your email</p>

              {forgotSent ? (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                  <i className="ri-mail-check-line text-emerald-400 text-3xl mb-2 block"></i>
                  <p className="text-emerald-300 font-medium">Reset email sent!</p>
                  <p className="text-emerald-400/70 text-sm mt-1">Check your inbox for the link.</p>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">{error}</div>}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl cursor-pointer whitespace-nowrap disabled:opacity-60">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
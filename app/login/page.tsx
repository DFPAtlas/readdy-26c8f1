'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getRoleDashboard } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await signIn(email, password);
      if (user) {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        const { data: profile } = await sb.from('user_profiles').select('role').eq('id', user.id).maybeSingle();
        const dest = getRoleDashboard((profile?.role || 'client_user') as import('@/lib/auth').UserRole);
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
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      setForgotSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20smart%20building%20operations%20center%20with%20glowing%20holographic%20displays%20showing%20AI%20building%20analytics%20dashboards%2C%20dark%20navy%20interior%20with%20electric%20blue%20and%20cyan%20neon%20accents%2C%20digital%20twin%20building%20visualization%20on%20large%20screens%2C%20professional%20enterprise%20technology%20environment%2C%20cinematic%20photorealistic%20render&width=800&height=1000&seq=synqoro-login-bg-v1&orientation=portrait"
          alt="Synqoro Platform"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030912]/85 to-[#060d1c]/95 flex flex-col justify-between p-12">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <i className="ri-node-tree text-white text-lg"></i>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#030912]"></div>
            </div>
            <span className="text-white text-2xl font-bold">Syn<span className="text-cyan-400">qoro</span></span>
          </div>
          <div>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              AI-Powered Building Operations Platform
            </h2>
            <p className="text-blue-200/80 text-lg mb-8">
              Synqoro connects facilities, assets, compliance, engineers, IoT systems, and AI automation into one intelligent platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'ri-node-tree', label: 'Digital Twin Buildings' },
                { icon: 'ri-sparkling-2-line', label: 'AI Intelligence Hub' },
                { icon: 'ri-shield-check-line', label: 'Compliance Automation' },
                { icon: 'ri-bar-chart-line', label: 'Real-time Analytics' },
              ].map((f) => (
                <div key={f.label} className="flex items-center space-x-2 text-blue-100/80">
                  <div className="w-7 h-7 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`${f.icon} text-cyan-400 text-sm`}></i>
                  </div>
                  <span className="text-sm">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-blue-300/50 text-sm">
            © 2026 Synqoro · Enterprise Facilities Management
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#030912]">
        <div className="w-full max-w-md">
          <div className="flex items-center space-x-3 mb-8 lg:hidden">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-xl flex items-center justify-center">
                <i className="ri-node-tree text-white text-base"></i>
              </div>
            </div>
            <span className="text-xl font-bold text-white">Syn<span className="text-cyan-400">qoro</span></span>
          </div>

          {tab === 'login' ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-gray-500">Sign in to your Synqoro workspace</p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className="ri-error-warning-line text-red-400"></i>
                  </div>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <i className="ri-mail-line text-gray-500 text-sm"></i>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <i className="ri-lock-line text-gray-500 text-sm"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-300"
                    >
                      <i className={showPassword ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-600 bg-white/5 text-cyan-500" />
                    <span className="text-sm text-gray-500">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-login-box-line"></i>
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/15">
                <p className="text-sm text-cyan-300/80 font-medium mb-1">New to Synqoro?</p>
                <p className="text-sm text-gray-500">
                  Contact your administrator or{' '}
                  <Link href="/register" className="text-cyan-400 font-semibold underline cursor-pointer">
                    create a company account
                  </Link>
                </p>
              </div>

              <div className="mt-6 flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-shield-check-line text-emerald-500"></i>
                </div>
                <span>Secured with Supabase Auth · All data is tenant-isolated</span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <button
                  onClick={() => { setTab('login'); setForgotSent(false); setError(''); }}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-300 cursor-pointer mb-4"
                >
                  <i className="ri-arrow-left-line"></i>
                  <span className="text-sm">Back to login</span>
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">Reset password</h1>
                <p className="text-gray-500">Enter your email and we'll send a reset link</p>
              </div>

              {forgotSent ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-mail-check-line text-emerald-400 text-xl"></i>
                  </div>
                  <p className="text-emerald-300 font-semibold mb-1">Reset email sent!</p>
                  <p className="text-emerald-400/70 text-sm">Check your inbox for the password reset link.</p>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 shadow-lg shadow-cyan-500/25"
                  >
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
'use client';

import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <i className="ri-building-3-line text-white text-lg"></i>
          </div>
          <div>
            <span className="text-white font-bold text-2xl tracking-tight">Syn<span className="text-cyan-400">qoro</span></span>
            <div className="text-[10px] text-cyan-400/70 font-medium tracking-widest uppercase -mt-0.5">Platform Setup</div>
          </div>
        </div>

        <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-lock-line text-amber-400 text-3xl"></i>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Setup Unavailable</h2>
          <p className="text-gray-400 mb-6">
            Platform setup cannot be performed from the public website. Administrator account creation is handled securely by your platform operator and is not accessible through the browser.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2"
          >
            <i className="ri-login-box-line"></i>
            <span>Back to Login</span>
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Synqoro Platform · Secure Access · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
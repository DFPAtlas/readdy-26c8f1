'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';

export default function HeroSection() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#030912]">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=ultra%20futuristic%20smart%20city%20aerial%20night%20view%20with%20glowing%20electric%20blue%20and%20cyan%20grid%20network%20connecting%20intelligent%20buildings%2C%20AI%20neural%20network%20nodes%20overlaid%20on%20dark%20navy%20urban%20skyline%2C%20neon%20circuit%20lines%20flowing%20between%20skyscrapers%2C%20digital%20twin%20holographic%20overlay%2C%20deep%20space%20dark%20background%20with%20soft%20purple%20accent%20glow%2C%20photorealistic%20cinematic%20render%208k&width=1440&height=900&seq=synqoro-hero-bg-v1&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030912]/50 via-[#030912]/30 to-[#030912]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030912] via-transparent to-[#030912]/70"></div>
        </div>

        <div className="absolute top-1/3 left-1/3 w-[700px] h-[700px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-violet-600/6 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/25 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-cyan-400 text-sm font-medium tracking-wide">AI-Powered Smart Building Platform · 2026</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 font-[var(--font-space-grotesk)]">
              AI-Powered
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Building Operations
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              Synqoro connects facilities, assets, compliance, engineers, IoT systems, and AI automation into one intelligent platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-16">
              <a
                href="#contact"
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap shadow-2xl shadow-cyan-500/35 text-base"
              >
                <i className="ri-calendar-check-line"></i>
                <span>Book Demo</span>
              </a>
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-2 px-8 py-4 border border-white/20 bg-white/5 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/35 transition-all cursor-pointer whitespace-nowrap text-base backdrop-blur-sm"
              >
                <i className="ri-login-box-line text-cyan-400"></i>
                <span>Login</span>
              </button>
              <a
                href="/register?plan=starter&billing=monthly"
                className="flex items-center space-x-2 px-8 py-4 border border-violet-500/40 bg-violet-500/10 text-violet-300 font-semibold rounded-2xl hover:bg-violet-500/20 hover:border-violet-400/60 transition-all cursor-pointer whitespace-nowrap text-base backdrop-blur-sm"
              >
                <i className="ri-rocket-line"></i>
                <span>Start Free Trial</span>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '500+', label: 'FM Teams' },
                { value: '2M+', label: 'Assets Managed' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '40%', label: 'Cost Reduction' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-white mb-1 font-[var(--font-space-grotesk)]">{s.value}</div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">
          <span className="text-gray-600 text-xs tracking-widest uppercase">Explore</span>
          <i className="ri-arrow-down-line text-gray-600"></i>
        </div>
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
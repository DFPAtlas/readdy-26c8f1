'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';

export default function LandingNav() {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Features', href: '#features' },
    { label: 'Digital Twin', href: '#digital-twin' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#030912]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <i className="ri-node-tree text-white text-base"></i>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#030912] animate-pulse"></div>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight font-[var(--font-space-grotesk)]">Syn<span className="text-cyan-400">qoro</span></span>
              <div className="text-[9px] text-cyan-400/60 font-medium tracking-[0.2em] uppercase -mt-0.5">Smart Building Intelligence</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowLogin(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/15 hover:border-white/35 rounded-xl transition-all cursor-pointer whitespace-nowrap bg-white/3 hover:bg-white/8"
            >
              <i className="ri-login-box-line text-sm"></i>
              <span>Login</span>
            </button>
            <a
              href="#contact"
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-cyan-500/30"
            >
              <span>Book Demo</span>
              <i className="ri-arrow-right-line text-sm"></i>
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
            >
              <i className={mobileOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'}></i>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#030912] border-t border-white/8 px-6 py-4 space-y-3">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-400 hover:text-white text-sm py-2 cursor-pointer">
                {l.label}
              </a>
            ))}
            <button onClick={() => { setShowLogin(true); setMobileOpen(false); }} className="w-full text-left text-gray-400 hover:text-white text-sm py-2 cursor-pointer">
              Login
            </button>
            <a href="/register" className="block w-full text-center py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl cursor-pointer">
              Start Free Trial
            </a>
          </div>
        )}
      </nav>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function LandingFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('idle');
    setMessage('');

    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem('website_alt') as HTMLInputElement)?.value?.trim();
    if (honeypot) {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      return;
    }

    try {
      const formData = new FormData(form);
      const res = await fetch('https://readdy.ai/api/form/d9n3nau8mbnljin59te0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
      const responseText = await res.text();
      let parsed: { code?: string; meta?: { message?: string; detail?: string }; message?: string } = {};
      try { parsed = JSON.parse(responseText); } catch {}
      const serverMsg = parsed?.meta?.message ?? parsed?.message ?? parsed?.meta?.detail ?? responseText;

      if (res.ok && parsed?.code === 'OK') {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else if (serverMsg && serverMsg.toLowerCase().includes('spam')) {
        setStatus('error');
        setMessage(serverMsg);
      } else {
        setStatus('error');
        setMessage(serverMsg || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="bg-[#020810] border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <i className="ri-node-tree text-white text-base"></i>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#020810]"></div>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Syn<span className="text-cyan-400">qoro</span></span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              AI-powered Facilities Management and Smart Building Operations platform for enterprise FM teams.
            </p>
            <div className="mb-6">
              <h4 className="text-white font-semibold text-sm mb-3">Newsletter</h4>
              <form data-readdy-form="" onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input name="website_alt" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly className="absolute opacity-0 pointer-events-none" />
                <div className="flex items-center space-x-2">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
                {message && (
                  <p className={`text-xs ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
            <div className="flex items-center space-x-3">
              {['ri-twitter-x-line', 'ri-linkedin-box-line', 'ri-github-line'].map((icon) => (
                <div key={icon} className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-cyan-500/30 transition-colors">
                  <i className={`${icon} text-gray-400 text-sm`}></i>
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Platform',
              links: [
                { label: 'Asset Management', href: '/asset-register' },
                { label: 'Work Orders', href: '/work-orders' },
                { label: 'Compliance & PPM', href: '/compliance' },
                { label: 'Digital Twin', href: '/digital-twin' },
                { label: 'Space Management', href: '/space-management' },
                { label: 'AI Intelligence', href: '/ai-dashboard' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '/' },
                { label: 'Careers', href: '/' },
                { label: 'Blog', href: '/' },
                { label: 'Press', href: '/' },
                { label: 'Partners', href: '/' },
                { label: 'Contact', href: '/#contact' },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'GDPR', href: '/gdpr' },
                { label: 'Security', href: '/security' },
                { label: 'SLA', href: '/sla' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm">© 2026 Synqoro Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <i className="ri-shield-check-line text-emerald-500"></i>
            <span>ISO 27001 Certified · GDPR Compliant · SOC 2 Type II</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center space-x-4">
          <span className="text-gray-700 text-xs">Dev Access:</span>
          <Link href="/super-admin" className="text-xs text-amber-500/60 hover:text-amber-400 transition-colors cursor-pointer">Super Admin</Link>
          <span className="text-gray-700 text-xs">·</span>
          <Link href="/client-dashboard" className="text-xs text-amber-500/60 hover:text-amber-400 transition-colors cursor-pointer">Client Dashboard</Link>

        </div>
      </div>
    </footer>
  );
}
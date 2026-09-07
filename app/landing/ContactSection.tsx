'use client';

import { useState } from 'react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', plan: 'professional' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.length > 500) {
      setError('Message must be 500 characters or less.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = new URLSearchParams({
        name: form.name,
        email: form.email,
        company: form.company,
        plan: form.plan,
        message: form.message,
      });
      const res = await fetch('https://readdy.ai/api/form/d823krt979rtuqs72g00', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-[#050d1a] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
              <i className="ri-calendar-line text-cyan-400 text-sm"></i>
              <span className="text-cyan-400 text-sm font-medium">Book a Demo</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              See Synqoro in
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">action</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              Book a personalised 30-minute demo with our FM specialists. We'll show you exactly how Synqoro can transform your facilities operations.
            </p>

            <div className="space-y-5">
              {[
                { icon: 'ri-time-line', title: '30-minute live demo', desc: 'Tailored to your specific FM challenges' },
                { icon: 'ri-user-star-line', title: 'FM specialist walkthrough', desc: 'With a certified facilities management expert' },
                { icon: 'ri-gift-line', title: 'Free 14-day trial', desc: 'Start immediately after the demo, no card needed' },
                { icon: 'ri-customer-service-line', title: 'Dedicated onboarding', desc: 'We help you set up your first site and assets' },
              ].map((item) => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-cyan-400`}></i>
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/3 border border-white/10 rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-line text-emerald-400 text-3xl"></i>
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">Demo Booked!</h3>
                <p className="text-gray-400">We'll be in touch within 24 hours to confirm your demo time.</p>
              </div>
            ) : (
              <>
                <h3 className="text-white font-bold text-xl mb-6">Request a Demo</h3>
                <form onSubmit={handleSubmit} data-readdy-form id="synqoro-demo-form" className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">{error}</div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Work Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="Acme Facilities Ltd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Interested Plan</label>
                    <input type="hidden" name="plan" value={form.plan} />
                    <div className="grid grid-cols-3 gap-2">
                      {['starter', 'professional', 'enterprise'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm({ ...form, plan: p })}
                          className={`py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${form.plan === p ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Tell us about your needs</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                      placeholder="Number of sites, assets, team size..."
                    />
                    <p className="text-gray-600 text-xs mt-1 text-right">{form.message.length}/500</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25"
                  >
                    {loading ? (
                      <><i className="ri-loader-4-line animate-spin"></i><span>Sending...</span></>
                    ) : (
                      <><i className="ri-calendar-check-line"></i><span>Book My Demo</span></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
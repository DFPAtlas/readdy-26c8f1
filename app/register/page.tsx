'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { createCheckoutSession, getCheckoutUrls } from '@/lib/subscription';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'starter';
  const selectedBilling = (searchParams.get('billing') || 'monthly') as 'monthly' | 'annual';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    industry: 'facilities_management',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const update = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const planNames: Record<string, string> = {
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  };
  const planName = planNames[selectedPlan] || 'Starter';
  const billingLabel = selectedBilling === 'annual' ? 'Annual' : 'Monthly';

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step === 1) {
      if (!form.companyName.trim()) { setError('Company name is required'); return; }
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!form.agreeTerms) { setError('Please accept the terms of service'); return; }
    setLoading(true);
    try {
      const result = await signUp(form.email, form.password, form.fullName, form.companyName, selectedPlan, selectedBilling);

      if (selectedPlan === 'enterprise') {
        router.push('/dashboard');
        return;
      }

      const origin = window.location.origin;
      const { successUrl, cancelUrl } = getCheckoutUrls(selectedPlan, selectedBilling);

      const session = await createCheckoutSession({
        planSlug: selectedPlan,
        billingCycle: selectedBilling,
        successUrl,
        cancelUrl,
        companyId: result.company?.id,
      });

      window.location.href = session.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=modern%20intelligent%20smart%20building%20exterior%20at%20dusk%20with%20glowing%20blue%20and%20cyan%20LED%20facade%20lighting%2C%20AI%20sensor%20nodes%20visible%20on%20glass%20panels%2C%20dark%20navy%20sky%20background%2C%20futuristic%20enterprise%20architecture%20with%20digital%20grid%20overlay%2C%20photorealistic%20cinematic%20quality%20render&width=800&height=1000&seq=synqoro-register-bg-v1&orientation=portrait"
          alt="Register"
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
              Start your free 14-day trial
            </h2>
            <p className="text-blue-200/80 text-lg mb-8">
              You selected the <span className="text-cyan-400 font-semibold">{planName}</span> plan ({billingLabel}). Set up your Synqoro workspace in minutes.
            </p>
            <div className="space-y-3">
              {[
                'Full access to all FM modules',
                'AI-powered fault diagnosis & scheduling',
                'Digital Twin building maps',
                'Secure multi-tenant data isolation',
                'No credit card required for trial',
              ].map((f) => (
                <div key={f} className="flex items-center space-x-3 text-blue-100/80">
                  <div className="w-5 h-5 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-cyan-400 text-xs"></i>
                  </div>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-blue-300/50 text-sm">2026 Synqoro · Enterprise Facilities Management</div>
            <Link href={`/register${selectedPlan !== 'starter' ? '' : ''}`} className="text-blue-300/60 text-sm hover:text-blue-300/90 transition-colors cursor-pointer">
              Change plan
            </Link>
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

          <div className="mb-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg mb-4">
              <i className="ri-price-tag-3-line text-cyan-400 text-sm"></i>
              <span className="text-cyan-400 text-sm font-medium">{planName} Plan · {billingLabel} Billing</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'bg-white/5 border border-white/10 text-gray-500'}`}>
                    {step > s ? <i className="ri-check-line"></i> : s}
                  </div>
                  {s < 2 && <div className={`w-12 h-0.5 mx-1 ${step > s ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-white/10'}`}></div>}
                </div>
              ))}
              <span className="ml-2 text-sm text-gray-500">{step === 1 ? 'Company Details' : 'Your Account'}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? 'Create your company' : 'Set up your account'}
            </h1>
            <p className="text-gray-500">
              {step === 1 ? 'Tell us about your organisation' : 'Create your admin login credentials'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className="ri-error-warning-line text-red-400"></i>
              </div>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="Acme Facilities Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                <div className="relative">
                  <select
                    value={form.industry}
                    onChange={(e) => update('industry', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 appearance-none pr-8"
                  >
                    <option value="facilities_management" className="bg-[#060d1c]">Facilities Management</option>
                    <option value="property_management" className="bg-[#060d1c]">Property Management</option>
                    <option value="construction" className="bg-[#060d1c]">Construction</option>
                    <option value="healthcare" className="bg-[#060d1c]">Healthcare</option>
                    <option value="education" className="bg-[#060d1c]">Education</option>
                    <option value="retail" className="bg-[#060d1c]">Retail</option>
                    <option value="hospitality" className="bg-[#060d1c]">Hospitality</option>
                    <option value="other" className="bg-[#060d1c]">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25"
              >
                <span>Continue</span>
                <i className="ri-arrow-right-line"></i>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Work Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="Repeat password"
                />
              </div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => update('agreeTerms', e.target.checked)}
                  className="mt-0.5 rounded border-gray-600 bg-white/5 text-cyan-500"
                />
                <span className="text-sm text-gray-500">
                  I agree to the{' '}
                  <span className="text-cyan-400 underline cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-cyan-400 underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Account & Start Trial</span>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030912] flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i>
          <p className="text-gray-500 mt-3">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
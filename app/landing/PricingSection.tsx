'use client';

import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 99, annual: 83 },
    desc: 'Perfect for small facilities teams',
    color: 'border-white/10',
    badge: null,
    features: [
      'Up to 10 users',
      '100 assets',
      '3 sites',
      'Asset Register',
      'Work Orders',
      'Basic Compliance',
      'Email Support',
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'border border-white/20 text-white hover:bg-white/5',
  },
  {
    name: 'Professional',
    price: { monthly: 299, annual: 249 },
    desc: 'For growing FM operations',
    color: 'border-cyan-500/50',
    badge: 'Most Popular',
    features: [
      'Up to 50 users',
      '1,000 assets',
      '20 sites',
      'Everything in Starter',
      'Digital Twin',
      'Space Management',
      'AI Insights',
      'PPM Scheduling',
      'Priority Support',
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25',
  },
  {
    name: 'Enterprise',
    price: { monthly: 799, annual: 666 },
    desc: 'Full platform for large organisations',
    color: 'border-violet-500/30',
    badge: null,
    features: [
      'Unlimited users',
      'Unlimited assets',
      'Unlimited sites',
      'Everything in Professional',
      'Multi-building Digital Twin',
      'Custom Integrations',
      'Dedicated CSM',
      'SLA Guarantee',
      'White Label Option',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'border border-violet-500/50 text-violet-300 hover:bg-violet-500/10',
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="bg-[#070f1f] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
            <i className="ri-price-tag-3-line text-emerald-400 text-sm"></i>
            <span className="text-emerald-400 text-sm font-medium">Simple Pricing</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Transparent pricing, no surprises</h2>
          <p className="text-gray-400 text-lg mb-8">14-day free trial on all plans. No credit card required.</p>

          <div className="inline-flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${!annual ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${annual ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white/3 border ${plan.color} rounded-2xl p-8 flex flex-col ${plan.badge ? 'ring-1 ring-cyan-500/30' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.desc}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end space-x-1">
                  <span className="text-5xl font-black text-white">£{annual ? plan.price.annual : plan.price.monthly}</span>
                  <span className="text-gray-400 mb-2">/mo</span>
                </div>
                {annual && <p className="text-emerald-400 text-xs mt-1">Billed annually · Save £{(plan.price.monthly - plan.price.annual) * 12}/yr</p>}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center space-x-3">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <i className="ri-check-line text-cyan-400 text-sm"></i>
                    </div>
                    <span className="text-gray-300 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.name === 'Enterprise' ? (
                <a
                  href="#contact"
                  className={`w-full py-3 rounded-xl font-semibold text-center transition-all cursor-pointer whitespace-nowrap block ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={`/register?plan=${plan.name.toLowerCase()}&billing=${annual ? 'annual' : 'monthly'}`}
                  className={`w-full py-3 rounded-xl font-semibold text-center transition-all cursor-pointer whitespace-nowrap block ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          All plans include 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
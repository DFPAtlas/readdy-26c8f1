import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030912] text-gray-300">
      <div className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00d4ff] via-[#0066ff] to-[#7c3aed] rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <i className="ri-node-tree text-white text-sm"></i>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full border-2 border-[#030912]"></div>
            </div>
            <span className="text-white font-bold text-lg">Syn<span className="text-cyan-400">qoro</span></span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors whitespace-nowrap">
            <i className="ri-arrow-left-line mr-1"></i>Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-cyan-400 text-sm font-medium mb-2">Last updated: August 1, 2026</p>
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-400 leading-relaxed">
            By accessing or using the Synqoro platform, including any associated websites, APIs, mobile applications, and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms. If you do not agree to these Terms, you may not use the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">2. Service Description</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Synqoro is an AI-powered facilities management and smart building operations platform that provides:
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3"><i className="ri-check-line text-cyan-400 mt-0.5"></i><span>Asset register and lifecycle management</span></li>
            <li className="flex items-start space-x-3"><i className="ri-check-line text-cyan-400 mt-0.5"></i><span>Work order management and engineer dispatching</span></li>
            <li className="flex items-start space-x-3"><i className="ri-check-line text-cyan-400 mt-0.5"></i><span>Compliance tracking and planned preventive maintenance (PPM)</span></li>
            <li className="flex items-start space-x-3"><i className="ri-check-line text-cyan-400 mt-0.5"></i><span>Digital twin visualisation and space management</span></li>
            <li className="flex items-start space-x-3"><i className="ri-check-line text-cyan-400 mt-0.5"></i><span>AI-powered insights, predictive maintenance, and smart scheduling</span></li>
            <li className="flex items-start space-x-3"><i className="ri-check-line text-cyan-400 mt-0.5"></i><span>Enterprise cloud dashboard for multi-site management</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">3. Account Registration</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Each user account is for a single individual. Sharing accounts between multiple users is prohibited. Enterprise clients may create accounts for their authorised personnel through the platform's user management features.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">4. Subscription & Payment</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Synqoro is offered on a subscription basis. Pricing is determined by your selected plan tier (Starter, Professional, or Enterprise), number of users, sites, and modules enabled. All fees are quoted in GBP (£) unless otherwise stated.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Subscription fees are billed monthly or annually in advance and are non-refundable except as required by applicable law. You may upgrade your plan at any time; downgrades take effect at the next billing cycle.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Late payments may result in suspension of Service access. We will provide at least 7 days' notice before any suspension for non-payment.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">5. Acceptable Use</h2>
          <p className="text-gray-400 leading-relaxed mb-4">You agree not to:</p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3"><i className="ri-forbid-line text-red-400 mt-0.5"></i><span>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations</span></li>
            <li className="flex items-start space-x-3"><i className="ri-forbid-line text-red-400 mt-0.5"></i><span>Upload malicious code, malware, or attempt to compromise the Service's security</span></li>
            <li className="flex items-start space-x-3"><i className="ri-forbid-line text-red-400 mt-0.5"></i><span>Attempt to gain unauthorised access to other users' accounts or data</span></li>
            <li className="flex items-start space-x-3"><i className="ri-forbid-line text-red-400 mt-0.5"></i><span>Resell, sublicense, or redistribute the Service without explicit written permission</span></li>
            <li className="flex items-start space-x-3"><i className="ri-forbid-line text-red-400 mt-0.5"></i><span>Reverse engineer, decompile, or extract the source code of the Service</span></li>
            <li className="flex items-start space-x-3"><i className="ri-forbid-line text-red-400 mt-0.5"></i><span>Use automated means (bots, scrapers) to access the Service without authorisation</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">6. Intellectual Property</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Synqoro and its licensors retain all rights, title, and interest in and to the Service, including all software, algorithms, AI models, documentation, trademarks, and branding. These Terms do not grant you any intellectual property rights in the Service except the limited right to use it as described herein.
          </p>
          <p className="text-gray-400 leading-relaxed">
            You retain all rights to the data you upload to Synqoro ("Customer Data"). You grant Synqoro a limited, worldwide, royalty-free licence to process Customer Data as necessary to provide and improve the Service. This licence terminates upon account closure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">7. Service Level & Availability</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Synqoro targets 99.9% uptime for cloud-hosted services. Enterprise clients with local deployments manage their own infrastructure availability. Our Service Level Agreement (SLA) provides detailed uptime commitments and service credits for qualifying outages.
          </p>
          <p className="text-gray-400 leading-relaxed">
            We reserve the right to perform scheduled maintenance with at least 48 hours' advance notice. Emergency maintenance may be performed with minimal notice where required to address critical security or stability issues.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            To the maximum extent permitted by applicable law, Synqoro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the Service.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Synqoro's total liability for any claim arising from these Terms or the Service shall not exceed the amount paid by you to Synqoro in the twelve (12) months preceding the claim. Nothing in these Terms limits liability for death or personal injury caused by negligence, or for fraud.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">9. Termination</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Either party may terminate these Terms upon 30 days' written notice. Synqoro may immediately suspend or terminate access in the event of a material breach of these Terms, illegal activity, or non-payment.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Upon termination, your right to access the Service ceases immediately. We will retain Customer Data for 30 days post-termination to allow data export. After this period, Customer Data will be securely deleted.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">10. Governing Law</h2>
          <p className="text-gray-400 leading-relaxed">
            These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of London, United Kingdom.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">11. Changes to Terms</h2>
          <p className="text-gray-400 leading-relaxed">
            We may modify these Terms from time to time. Material changes will be communicated via email and in-platform notification at least 30 days before taking effect. Continued use after changes take effect constitutes acceptance of the modified Terms.
          </p>
        </section>
      </div>

      <div className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-600 text-sm">
          © 2026 Synqoro Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
}
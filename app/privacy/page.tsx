import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Synqoro Ltd ("Synqoro", "we", "us", or "our") is committed to protecting the privacy and security of your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered facilities management and smart building operations platform.
          </p>
          <p className="text-gray-400 leading-relaxed">
            This policy applies to all users of the Synqoro platform, including enterprise clients, facility managers, engineers, building occupants, and website visitors. By using Synqoro, you consent to the data practices described in this policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">2.1 Account Information</h3>
              <p className="text-gray-400 leading-relaxed">Full name, email address, company name, job title, phone number, and authentication credentials when you register for an account.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">2.2 Platform Usage Data</h3>
              <p className="text-gray-400 leading-relaxed">Work orders, asset registers, compliance records, maintenance logs, space bookings, digital twin interactions, and AI query history generated through normal platform use.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">2.3 Building & Facilities Data</h3>
              <p className="text-gray-400 leading-relaxed">Floor plans, building schematics, IoT sensor readings, energy consumption metrics, occupancy data, and equipment performance logs uploaded or connected to the platform.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">2.4 Technical Data</h3>
              <p className="text-gray-400 leading-relaxed">IP address, browser type, device information, access times, pages viewed, and diagnostic data collected automatically through platform usage.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Data</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3">
              <i className="ri-check-line text-cyan-400 mt-0.5"></i>
              <span>To provide, maintain, and improve the Synqoro platform and its AI capabilities</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-check-line text-cyan-400 mt-0.5"></i>
              <span>To process and manage work orders, assets, compliance schedules, and space bookings</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-check-line text-cyan-400 mt-0.5"></i>
              <span>To generate AI-powered insights, predictive maintenance recommendations, and optimisation reports</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-check-line text-cyan-400 mt-0.5"></i>
              <span>To communicate platform updates, security alerts, and support-related messages</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-check-line text-cyan-400 mt-0.5"></i>
              <span>To comply with legal obligations and enforce our terms of service</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-check-line text-cyan-400 mt-0.5"></i>
              <span>To monitor system health, detect fraud, and ensure platform security</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">4. Data Storage & Retention</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Enterprise client data is stored on dedicated local Supabase instances deployed on the client's own infrastructure. Synqoro Cloud only receives aggregated operational metadata, system health metrics, licence status, and anonymised usage statistics as described in our Enterprise Architecture documentation.
          </p>
          <p className="text-gray-400 leading-relaxed">
            We retain personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law. Account data is retained while your account is active. Upon account termination, data is securely deleted within 90 days unless legal retention requirements apply.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">5. Data Sharing & Third Parties</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We do not sell your personal data. We may share data with:
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3">
              <i className="ri-arrow-right-s-line text-cyan-400 mt-0.5"></i>
              <span><strong className="text-gray-300">Cloud infrastructure providers</strong> (Supabase, Vercel) for platform hosting and database services</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-arrow-right-s-line text-cyan-400 mt-0.5"></i>
              <span><strong className="text-gray-300">Payment processors</strong> (Stripe) for subscription billing</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-arrow-right-s-line text-cyan-400 mt-0.5"></i>
              <span><strong className="text-gray-300">Email service providers</strong> for transactional and marketing communications</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-arrow-right-s-line text-cyan-400 mt-0.5"></i>
              <span><strong className="text-gray-300">Legal authorities</strong> when required by law, court order, or governmental regulation</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3">
              <i className="ri-user-line text-cyan-400 mt-0.5"></i>
              <span>Access the personal data we hold about you</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-edit-line text-cyan-400 mt-0.5"></i>
              <span>Request correction of inaccurate or incomplete data</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-delete-bin-line text-cyan-400 mt-0.5"></i>
              <span>Request deletion of your personal data</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-forbid-line text-cyan-400 mt-0.5"></i>
              <span>Object to or restrict processing of your data</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-download-line text-cyan-400 mt-0.5"></i>
              <span>Receive your data in a portable format</span>
            </li>
            <li className="flex items-start space-x-3">
              <i className="ri-close-circle-line text-cyan-400 mt-0.5"></i>
              <span>Withdraw consent at any time where processing is based on consent</span>
            </li>
          </ul>
          <p className="text-gray-400 leading-relaxed mt-4">
            To exercise these rights, contact us at <span className="text-cyan-400">privacy@synqoro.com</span>. We will respond within 30 days.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">7. Data Security</h2>
          <p className="text-gray-400 leading-relaxed">
            Synqoro implements industry-standard security measures including end-to-end encryption in transit (TLS 1.3), encryption at rest (AES-256), role-based access controls, multi-factor authentication, regular penetration testing, and SOC 2 Type II audited controls. Enterprise clients benefit from isolated local deployments with dedicated encryption keys. For full details, refer to our Security page.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">8. Cookies & Tracking</h2>
          <p className="text-gray-400 leading-relaxed">
            Synqoro uses essential cookies for platform functionality and optional analytics cookies to improve our service. We do not use advertising cookies or third-party tracking cookies. For detailed information, please see our Cookie Policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">9. International Data Transfers</h2>
          <p className="text-gray-400 leading-relaxed">
            For enterprise clients, data remains within their chosen geographic region through local deployment. For cloud-hosted services, data is processed in the EU (Frankfurt) and UK (London) regions. We ensure appropriate safeguards, including Standard Contractual Clauses, for any international data transfers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-400 leading-relaxed">
            We may update this Privacy Policy from time to time. Material changes will be communicated via email and in-platform notification at least 30 days before taking effect. Continued use of Synqoro after changes take effect constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">11. Contact Us</h2>
          <p className="text-gray-400 leading-relaxed">
            Data Protection Officer<br />
            Synqoro Ltd<br />
            71-75 Shelton Street, Covent Garden<br />
            London WC2H 9JQ, United Kingdom<br />
            <span className="text-cyan-400">privacy@synqoro.com</span>
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
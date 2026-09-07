import Link from 'next/link';

export default function GDPRPage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">GDPR Compliance</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">1. Our Commitment</h2>
          <p className="text-gray-400 leading-relaxed">
            Synqoro Ltd is fully committed to compliance with the EU General Data Protection Regulation (GDPR) and the UK Data Protection Act 2018. We have implemented comprehensive technical and organisational measures to ensure the lawful, fair, and transparent processing of personal data for all our users, including those in the European Economic Area (EEA) and the United Kingdom.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">2. Data Processing Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">Synqoro as Data Controller</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                For account registration data, billing information, and platform usage analytics. We determine the purposes and means of processing this data.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">Synqoro as Data Processor</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                For Customer Data uploaded to the platform (work orders, assets, compliance records, building data). Our enterprise clients are the Data Controllers for this information.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">3. Lawful Basis for Processing</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-file-text-line text-cyan-400"></i>
              </div>
              <div>
                <h3 className="text-white font-medium">Contractual Necessity</h3>
                <p className="text-gray-400 text-sm">Processing account data and Customer Data is necessary to perform our contractual obligations under the Terms of Service.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-shield-check-line text-cyan-400"></i>
              </div>
              <div>
                <h3 className="text-white font-medium">Legitimate Interests</h3>
                <p className="text-gray-400 text-sm">Processing for platform security, fraud prevention, and service improvement where these interests do not override individual rights.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-thumb-up-line text-cyan-400"></i>
              </div>
              <div>
                <h3 className="text-white font-medium">Consent</h3>
                <p className="text-gray-400 text-sm">For optional marketing communications and analytics cookies. Consent may be withdrawn at any time.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-scales-line text-cyan-400"></i>
              </div>
              <div>
                <h3 className="text-white font-medium">Legal Obligation</h3>
                <p className="text-gray-400 text-sm">Processing required to comply with applicable laws, tax regulations, and law enforcement requests.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">4. Data Subject Rights</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Under GDPR, data subjects have the following rights. Synqoro has implemented processes to honour all of them:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: 'ri-eye-line', title: 'Right of Access', desc: 'Obtain confirmation of whether your data is being processed and access to that data.' },
              { icon: 'ri-edit-line', title: 'Right to Rectification', desc: 'Correct inaccurate or incomplete personal data without undue delay.' },
              { icon: 'ri-delete-bin-line', title: 'Right to Erasure', desc: 'Request deletion of personal data under certain circumstances ("right to be forgotten").' },
              { icon: 'ri-pause-circle-line', title: 'Right to Restrict', desc: 'Restrict processing of your data in specific situations.' },
              { icon: 'ri-download-line', title: 'Data Portability', desc: 'Receive your data in a structured, machine-readable format and transmit it to another controller.' },
              { icon: 'ri-close-circle-line', title: 'Right to Object', desc: 'Object to processing based on legitimate interests or for direct marketing purposes.' },
            ].map((right) => (
              <div key={right.title} className="bg-white/[0.02] border border-white/10 rounded-xl p-5 flex items-start space-x-4">
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`${right.icon} text-cyan-400`}></i>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">{right.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{right.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">5. Data Protection Measures</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <i className="ri-lock-line text-emerald-400 mt-0.5"></i>
              <div>
                <h3 className="text-white font-medium text-sm">Encryption</h3>
                <p className="text-gray-400 text-sm">All data encrypted in transit (TLS 1.3) and at rest (AES-256). Enterprise deployments use dedicated encryption keys.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="ri-shield-user-line text-emerald-400 mt-0.5"></i>
              <div>
                <h3 className="text-white font-medium text-sm">Access Controls</h3>
                <p className="text-gray-400 text-sm">Role-based access control (RBAC), multi-factor authentication, and principle of least privilege enforced across all systems.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="ri-folder-shield-line text-emerald-400 mt-0.5"></i>
              <div>
                <h3 className="text-white font-medium text-sm">Data Minimisation</h3>
                <p className="text-gray-400 text-sm">We only collect and process personal data that is adequate, relevant, and limited to what is necessary for the stated purposes.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="ri-file-list-3-line text-emerald-400 mt-0.5"></i>
              <div>
                <h3 className="text-white font-medium text-sm">Data Processing Agreement</h3>
                <p className="text-gray-400 text-sm">Enterprise clients receive a comprehensive DPA that meets Article 28 GDPR requirements, included as part of the Enterprise agreement.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="ri-alert-line text-emerald-400 mt-0.5"></i>
              <div>
                <h3 className="text-white font-medium text-sm">Breach Notification</h3>
                <p className="text-gray-400 text-sm">We will notify affected data subjects and relevant supervisory authorities within 72 hours of becoming aware of a personal data breach, as required by Article 33.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">6. International Data Transfers</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            For enterprise clients with local deployments, data remains within their chosen geographic region. For cloud services, personal data is processed and stored within the EU (Frankfurt) and UK (London) regions.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Where international transfers are necessary (e.g., for global support), we implement appropriate safeguards including EU Standard Contractual Clauses (SCCs), Binding Corporate Rules, or adequacy decisions to ensure an equivalent level of protection.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">7. Data Protection Officer</h2>
          <p className="text-gray-400 leading-relaxed">
            We have appointed a Data Protection Officer (DPO) who can be contacted at:<br />
            <span className="text-cyan-400">dpo@synqoro.com</span><br /><br />
            Synqoro Ltd (Data Protection)<br />
            71-75 Shelton Street, Covent Garden<br />
            London WC2H 9JQ, United Kingdom
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">8. Supervisory Authority</h2>
          <p className="text-gray-400 leading-relaxed">
            You have the right to lodge a complaint with a supervisory authority. Our lead supervisory authority is the UK Information Commissioner's Office (ICO). EU-based users may also contact their local Data Protection Authority.
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
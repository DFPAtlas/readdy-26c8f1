import Link from 'next/link';

export default function SecurityPage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">Security</h1>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 mb-10">
          <div className="flex items-center space-x-3 mb-3">
            <i className="ri-shield-check-line text-emerald-400 text-xl"></i>
            <span className="text-emerald-400 font-semibold">Synqoro is SOC 2 Type II certified and ISO 27001 compliant.</span>
          </div>
          <p className="text-gray-400 text-sm">Our security programme is audited annually by independent third-party assessors. Enterprise customers can request our latest audit reports through their account manager.</p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">1. Infrastructure Security</h2>
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">Cloud Infrastructure</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>Hosted on Supabase and Vercel, both SOC 2 and ISO 27001 certified infrastructure providers</span></li>
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>EU (Frankfurt) and UK (London) data regions for cloud services</span></li>
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>DDoS protection and Web Application Firewall (WAF) at the edge</span></li>
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>Continuous security monitoring with automated intrusion detection</span></li>
              </ul>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">Enterprise Local Deployments</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>Fully isolated local Supabase stack on client-owned infrastructure</span></li>
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>Client-managed encryption keys — Synqoro has zero access to local data</span></li>
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>Local Supabase Studio not exposed to public internet (VPN-only access)</span></li>
                <li className="flex items-start space-x-3"><i className="ri-check-line text-emerald-400 mt-0.5"></i><span>Push-only sync model — cloud never initiates connections to local databases</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">2. Data Encryption</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: 'ri-lock-line', title: 'Encryption in Transit', desc: 'All data transmitted over public networks is encrypted using TLS 1.3 with perfect forward secrecy. HSTS enforced across all domains.' },
              { icon: 'ri-hard-drive-2-line', title: 'Encryption at Rest', desc: 'All stored data encrypted using AES-256. Database encryption, backup encryption, and encrypted file storage for all uploads.' },
              { icon: 'ri-key-2-line', title: 'Key Management', desc: 'Enterprise clients control their own encryption keys. Cloud keys managed via hardware security modules (HSM) with automatic rotation.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                  <i className={`${item.icon} text-emerald-400`}></i>
                </div>
                <h3 className="text-white font-medium text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">3. Authentication & Access Control</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3"><i className="ri-shield-user-line text-emerald-400 mt-0.5"></i><span>Multi-factor authentication (MFA) supported via TOTP and WebAuthn/FIDO2</span></li>
            <li className="flex items-start space-x-3"><i className="ri-shield-user-line text-emerald-400 mt-0.5"></i><span>Role-Based Access Control (RBAC) with granular permission sets: super_admin, platform_owner, client_admin, engineer, viewer</span></li>
            <li className="flex items-start space-x-3"><i className="ri-shield-user-line text-emerald-400 mt-0.5"></i><span>Row-Level Security (RLS) enforced at the database level for tenant data isolation</span></li>
            <li className="flex items-start space-x-3"><i className="ri-shield-user-line text-emerald-400 mt-0.5"></i><span>SAML 2.0 and OIDC single sign-on (SSO) available on Enterprise plans</span></li>
            <li className="flex items-start space-x-3"><i className="ri-shield-user-line text-emerald-400 mt-0.5"></i><span>Session management with automatic timeout after 8 hours of inactivity</span></li>
            <li className="flex items-start space-x-3"><i className="ri-shield-user-line text-emerald-400 mt-0.5"></i><span>Full audit logging of all authentication events, admin actions, and support access</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">4. Application Security</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3"><i className="ri-bug-line text-emerald-400 mt-0.5"></i><span>Quarterly penetration testing by independent CREST-certified security firms</span></li>
            <li className="flex items-start space-x-3"><i className="ri-code-line text-emerald-400 mt-0.5"></i><span>Static Application Security Testing (SAST) in CI/CD pipeline on every commit</span></li>
            <li className="flex items-start space-x-3"><i className="ri-search-line text-emerald-400 mt-0.5"></i><span>Dependency vulnerability scanning with automated patch workflows</span></li>
            <li className="flex items-start space-x-3"><i className="ri-shield-flash-line text-emerald-400 mt-0.5"></i><span>Content Security Policy (CSP), XSS protection, CSRF tokens, and secure cookie flags</span></li>
            <li className="flex items-start space-x-3"><i className="ri-git-repository-line text-emerald-400 mt-0.5"></i><span>All code changes peer-reviewed with mandatory security review for auth-critical paths</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">5. Vulnerability Disclosure</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We welcome responsible disclosure of security vulnerabilities. If you discover a security issue in Synqoro, please report it to us confidentially:
          </p>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <p className="text-gray-300">
              Email: <span className="text-cyan-400">security@synqoro.com</span><br />
              PGP Key: <span className="text-gray-500 text-sm">Available upon request</span>
            </p>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            We commit to acknowledging reports within 24 hours, providing an initial assessment within 72 hours, and keeping you informed throughout the remediation process. We do not pursue legal action against researchers who follow responsible disclosure practices.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">6. Business Continuity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium text-sm mb-2">Backup & Recovery</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Automated daily backups with point-in-time recovery (PITR). 30-day backup retention. Quarterly disaster recovery tests. RPO of 1 hour, RTO of 4 hours for cloud services.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium text-sm mb-2">High Availability</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Multi-availability-zone deployment for cloud services. Enterprise local deployments are fully operational without internet connectivity. 99.9% uptime SLA for cloud.</p>
            </div>
          </div>
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
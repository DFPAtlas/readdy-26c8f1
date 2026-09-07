import Link from 'next/link';

export default function SLAPage() {
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
        <p className="text-cyan-400 text-sm font-medium mb-2">Effective: August 1, 2026</p>
        <h1 className="text-4xl font-bold text-white mb-8">Service Level Agreement</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">1. Overview</h2>
          <p className="text-gray-400 leading-relaxed">
            This Service Level Agreement ("SLA") defines the uptime commitments, support response times, and service credits applicable to Synqoro cloud-hosted services. Enterprise clients with local deployments manage their own infrastructure SLAs; this document applies to the Synqoro Cloud Enterprise Dashboard and associated cloud services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">2. Uptime Commitment</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 pr-4 text-gray-300 font-medium">Plan Tier</th>
                  <th className="py-3 pr-4 text-gray-300 font-medium">Uptime SLA</th>
                  <th className="py-3 pr-4 text-gray-300 font-medium">Max Monthly Downtime</th>
                  <th className="py-3 text-gray-300 font-medium">Service Credit</th>
                </tr>
              </thead>
              <tbody className="text-gray-400 text-sm">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-white">Starter</td>
                  <td className="py-3 pr-4">99.5%</td>
                  <td className="py-3 pr-4">3h 39m</td>
                  <td className="py-3">5% of monthly fee per 1% below SLA</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-white">Professional</td>
                  <td className="py-3 pr-4">99.9%</td>
                  <td className="py-3 pr-4">43m 49s</td>
                  <td className="py-3">10% of monthly fee per 0.1% below SLA</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-white">Enterprise</td>
                  <td className="py-3 pr-4">99.95%</td>
                  <td className="py-3 pr-4">21m 54s</td>
                  <td className="py-3">Custom SLA with negotiated credits</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs">
            Uptime is calculated monthly excluding scheduled maintenance. Scheduled maintenance is announced at least 48 hours in advance and does not exceed 4 hours per month.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">3. Support Response Times</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 pr-4 text-gray-300 font-medium">Severity</th>
                  <th className="py-3 pr-4 text-gray-300 font-medium">Description</th>
                  <th className="py-3 pr-4 text-gray-300 font-medium">Starter</th>
                  <th className="py-3 pr-4 text-gray-300 font-medium">Professional</th>
                  <th className="py-3 text-gray-300 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-gray-400 text-sm">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-xs font-medium">Critical</span>
                  </td>
                  <td className="py-3 pr-4">Platform unavailable for all users</td>
                  <td className="py-3 pr-4">4 hours</td>
                  <td className="py-3 pr-4">1 hour</td>
                  <td className="py-3">15 minutes</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-medium">High</span>
                  </td>
                  <td className="py-3 pr-4">Major feature unavailable, no workaround</td>
                  <td className="py-3 pr-4">8 hours</td>
                  <td className="py-3 pr-4">4 hours</td>
                  <td className="py-3">1 hour</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-medium">Medium</span>
                  </td>
                  <td className="py-3 pr-4">Partial feature issue, workaround available</td>
                  <td className="py-3 pr-4">24 hours</td>
                  <td className="py-3 pr-4">12 hours</td>
                  <td className="py-3">4 hours</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-gray-500/10 border border-gray-500/30 text-gray-400 rounded-full text-xs font-medium">Low</span>
                  </td>
                  <td className="py-3 pr-4">Cosmetic issue or general enquiry</td>
                  <td className="py-3 pr-4">48 hours</td>
                  <td className="py-3 pr-4">24 hours</td>
                  <td className="py-3">8 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">4. Support Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: 'ri-mail-line', title: 'Email Support', desc: 'Available on all plans. support@synqoro.com. Mon-Fri 9am-6pm UK time for Starter; 24/7 for Professional and Enterprise.' },
              { icon: 'ri-phone-line', title: 'Phone Support', desc: 'Available on Professional and Enterprise plans. Dedicated hotline with named contacts for Enterprise clients.' },
              { icon: 'ri-slack-line', title: 'Slack Connect', desc: 'Available on Enterprise plans. Dedicated Slack channel with Synqoro engineering team for real-time collaboration.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center mb-3">
                  <i className={`${item.icon} text-cyan-400`}></i>
                </div>
                <h3 className="text-white font-medium text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">5. Service Credits</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            If Synqoro fails to meet the uptime SLA for your plan tier in a calendar month, you are eligible for service credits:
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3"><i className="ri-money-dollar-circle-line text-cyan-400 mt-0.5"></i><span>Credits are calculated as a percentage of your monthly subscription fee based on the shortfall from the SLA target</span></li>
            <li className="flex items-start space-x-3"><i className="ri-calendar-check-line text-cyan-400 mt-0.5"></i><span>Credits must be claimed within 30 days of the incident by contacting support@synqoro.com</span></li>
            <li className="flex items-start space-x-3"><i className="ri-bank-card-line text-cyan-400 mt-0.5"></i><span>Credits are applied to future invoices and cannot exceed 100% of the monthly fee</span></li>
            <li className="flex items-start space-x-3"><i className="ri-information-line text-cyan-400 mt-0.5"></i><span>Credits are your sole and exclusive remedy for SLA breaches</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">6. Exclusions</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            SLA commitments do not apply to downtime caused by:
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3"><i className="ri-close-line text-gray-500 mt-0.5"></i><span>Scheduled maintenance (announced at least 48 hours in advance)</span></li>
            <li className="flex items-start space-x-3"><i className="ri-close-line text-gray-500 mt-0.5"></i><span>Force majeure events (natural disasters, war, epidemics, major internet backbone failures)</span></li>
            <li className="flex items-start space-x-3"><i className="ri-close-line text-gray-500 mt-0.5"></i><span>Client's own infrastructure, network, or internet connectivity issues</span></li>
            <li className="flex items-start space-x-3"><i className="ri-close-line text-gray-500 mt-0.5"></i><span>Client's misuse of the platform, including exceeding rate limits or storage quotas</span></li>
            <li className="flex items-start space-x-3"><i className="ri-close-line text-gray-500 mt-0.5"></i><span>Third-party service outages (Stripe, Supabase Cloud) beyond Synqoro's reasonable control</span></li>
            <li className="flex items-start space-x-3"><i className="ri-close-line text-gray-500 mt-0.5"></i><span>Beta features or services explicitly labelled as "Beta" or "Preview"</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">7. Status & Monitoring</h2>
          <p className="text-gray-400 leading-relaxed">
            Real-time service status and incident history are publicly available at <span className="text-cyan-400">status.synqoro.com</span>. Subscribers receive automatic email notifications for incidents affecting their services. Enterprise clients can integrate our status API into their own monitoring dashboards.
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
import Link from 'next/link';

export default function CookiePage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">1. What Are Cookies</h2>
          <p className="text-gray-400 leading-relaxed">
            Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the site owners. Cookies may be "session cookies" (deleted when you close your browser) or "persistent cookies" (remain until they expire or you delete them).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">2. How Synqoro Uses Cookies</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Synqoro uses a minimal set of cookies. We do not use advertising cookies, third-party tracking cookies, or social media cookies. The cookies we use fall into these categories:
          </p>

          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">2.1 Strictly Necessary Cookies</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">These cookies are essential for the platform to function. They enable core functionality such as authentication, security, and session management. The platform cannot operate without them.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="py-2 pr-4 text-gray-300 font-medium">Cookie Name</th>
                      <th className="py-2 pr-4 text-gray-300 font-medium">Purpose</th>
                      <th className="py-2 text-gray-300 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4 font-mono text-xs">sb-access-token</td>
                      <td className="py-2 pr-4">Supabase authentication session</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4 font-mono text-xs">sb-refresh-token</td>
                      <td className="py-2 pr-4">Supabase session refresh</td>
                      <td className="py-2">Persistent</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">synqoro_prefs</td>
                      <td className="py-2 pr-4">UI preferences (theme, sidebar state)</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">2.2 Performance & Analytics Cookies</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">These help us understand how the platform is used so we can improve it. All data is anonymised and aggregated. We use self-hosted analytics — no third-party analytics providers.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="py-2 pr-4 text-gray-300 font-medium">Cookie Name</th>
                      <th className="py-2 pr-4 text-gray-300 font-medium">Purpose</th>
                      <th className="py-2 text-gray-300 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">synqoro_analytics</td>
                      <td className="py-2 pr-4">Anonymous usage metrics</td>
                      <td className="py-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">3. Third-Party Cookies</h2>
          <p className="text-gray-400 leading-relaxed">
            Synqoro does not use any third-party tracking, advertising, or social media cookies. Our payment processor (Stripe) may set functional cookies during the checkout process to prevent fraud — these are strictly necessary for payment processing and are not used for tracking.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">4. Managing Cookies</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Most web browsers allow you to control cookies through their settings. You can typically:
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3"><i className="ri-settings-3-line text-cyan-400 mt-0.5"></i><span>View and delete cookies stored on your device</span></li>
            <li className="flex items-start space-x-3"><i className="ri-forbid-line text-cyan-400 mt-0.5"></i><span>Block all or specific types of cookies</span></li>
            <li className="flex items-start space-x-3"><i className="ri-notification-3-line text-cyan-400 mt-0.5"></i><span>Set your browser to notify you when a cookie is set</span></li>
          </ul>
          <p className="text-gray-400 leading-relaxed mt-4">
            Please note that blocking strictly necessary cookies will prevent you from logging into and using the Synqoro platform. Performance cookies are optional and the platform functions fully without them.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">5. Changes to This Policy</h2>
          <p className="text-gray-400 leading-relaxed">
            We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.
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
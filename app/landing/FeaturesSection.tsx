export default function FeaturesSection() {
  const features = [
    { icon: 'ri-shield-star-line', title: 'Multi-Tenant Security', desc: 'Every client company is fully isolated. No data leakage, ever. Row-level security on every table.' },
    { icon: 'ri-smartphone-line', title: 'Engineer Mobile App', desc: 'Field engineers get a mobile-optimised view with QR scanning, job updates, and offline support.' },
    { icon: 'ri-qr-code-line', title: 'QR Asset Scanning', desc: 'Scan any asset QR code to instantly view its full profile, service history, and open jobs.' },
    { icon: 'ri-notification-3-line', title: 'Smart Alerts', desc: 'AI-powered alerts for overdue maintenance, compliance expiry, and critical asset faults.' },
    { icon: 'ri-bar-chart-2-line', title: 'Real-time Analytics', desc: 'Live dashboards with occupancy, spend, SLA performance, and building health scores.' },
    { icon: 'ri-team-line', title: 'Role-Based Access', desc: '9 user roles from Platform Owner to Viewer — each with precise permission controls.' },
    { icon: 'ri-cloud-line', title: 'Cloud-Native', desc: 'Built on Supabase with 99.9% uptime SLA, automatic backups, and global CDN delivery.' },
    { icon: 'ri-file-chart-line', title: 'Automated Reports', desc: 'Monthly compliance summaries, job history, asset reports, and financial spend — auto-generated.' },
    { icon: 'ri-plug-line', title: 'Open Integrations', desc: 'Connect to BMS, IoT sensors, Stripe billing, and third-party FM tools via API.' },
  ];

  return (
    <section id="features" className="bg-[#070f1f] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <i className="ri-star-line text-cyan-400 text-sm"></i>
            <span className="text-cyan-400 text-sm font-medium">Platform Features</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Built for enterprise FM teams</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Every Synqoro feature designed around how real facilities managers actually work.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group p-6 bg-white/3 border border-white/8 rounded-2xl hover:bg-white/5 hover:border-cyan-500/30 transition-all duration-300">
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                <i className={`${f.icon} text-cyan-400 text-xl`}></i>
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
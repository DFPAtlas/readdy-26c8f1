export default function PlatformOverview() {
  const modules = [
    {
      icon: 'ri-database-2-line',
      title: 'Asset Management',
      desc: 'Full asset register with QR codes, service history, warranties, and predictive maintenance alerts.',
      color: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/20',
      img: 'https://readdy.ai/api/search-image?query=modern%20asset%20management%20dashboard%20interface%20showing%20equipment%20list%20with%20status%20indicators%2C%20maintenance%20schedules%2C%20and%20health%20metrics%20on%20dark%20blue%20background%2C%20clean%20UI%20design%2C%20professional%20software%20screenshot%20style&width=600&height=400&seq=platform-asset-01&orientation=landscape',
    },
    {
      icon: 'ri-tools-line',
      title: 'Work Orders',
      desc: 'Reactive, planned, and emergency jobs with engineer dispatch, SLA tracking, and mobile check-in.',
      color: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
      img: 'https://readdy.ai/api/search-image?query=work%20order%20management%20system%20dashboard%20with%20kanban%20board%20showing%20job%20cards%20in%20different%20status%20columns%2C%20priority%20badges%2C%20engineer%20assignments%2C%20dark%20professional%20UI%20on%20navy%20background&width=600&height=400&seq=platform-wo-01&orientation=landscape',
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Compliance & PPM',
      desc: 'Certificate tracking, expiry alerts, planned preventive maintenance schedules, and audit trails.',
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20',
      img: 'https://readdy.ai/api/search-image?query=compliance%20management%20dashboard%20showing%20certificate%20expiry%20dates%2C%20inspection%20schedules%2C%20compliance%20score%20gauges%2C%20and%20regulatory%20status%20indicators%20on%20dark%20background%2C%20professional%20FM%20software%20UI&width=600&height=400&seq=platform-comp-01&orientation=landscape',
    },
    {
      icon: 'ri-building-3-line',
      title: 'Digital Twin',
      desc: 'Interactive 2D floor plans with live asset pins, sensor overlays, emergency routes, and job tracking.',
      color: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/20',
      img: 'https://readdy.ai/api/search-image?query=digital%20twin%20building%20floor%20plan%20visualization%20with%20colored%20room%20overlays%2C%20asset%20location%20pins%20in%20green%20amber%20and%20red%2C%20sensor%20data%20points%2C%20emergency%20exit%20markers%2C%20dark%20navy%20background%2C%20futuristic%20FM%20software%20interface&width=600&height=400&seq=platform-dt-01&orientation=landscape',
    },
    {
      icon: 'ri-map-line',
      title: 'Space Management',
      desc: 'Hot desk booking, meeting rooms, parking, and interactive floor plan booking for hybrid workplaces.',
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20',
      img: 'https://readdy.ai/api/search-image?query=space%20booking%20system%20interface%20showing%20interactive%20office%20floor%20plan%20with%20color%20coded%20desk%20availability%2C%20meeting%20room%20calendar%2C%20booking%20status%20indicators%2C%20modern%20dark%20UI%20design%20for%20workplace%20management&width=600&height=400&seq=platform-space-01&orientation=landscape',
    },
    {
      icon: 'ri-sparkling-2-line',
      title: 'AI Intelligence Hub',
      desc: 'Predictive maintenance, risk scoring, compliance gap analysis, and AI-generated FM recommendations.',
      color: 'from-pink-500 to-rose-500',
      glow: 'shadow-pink-500/20',
      img: 'https://readdy.ai/api/search-image?query=AI%20analytics%20dashboard%20with%20predictive%20maintenance%20charts%2C%20risk%20score%20gauges%2C%20machine%20learning%20insights%20panels%2C%20neural%20network%20visualization%2C%20dark%20futuristic%20interface%20with%20glowing%20data%20visualizations&width=600&height=400&seq=platform-ai-01&orientation=landscape',
    },
  ];

  return (
    <section id="platform" className="bg-[#050d1a] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
            <i className="ri-apps-line text-blue-400 text-sm"></i>
            <span className="text-blue-400 text-sm font-medium">Complete FM Platform</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-4">
            Everything your FM team needs,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">powered by AI</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Six integrated modules that replace 12 separate tools — all in one secure, tenant-isolated platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div
              key={m.title}
              className={`group relative bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl ${m.glow}`}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={m.img} alt={m.title} className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity group-hover:scale-105 duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-[#050d1a]/40 to-transparent"></div>
                <div className={`absolute top-4 left-4 w-10 h-10 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <i className={`${m.icon} text-white text-lg`}></i>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2">{m.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
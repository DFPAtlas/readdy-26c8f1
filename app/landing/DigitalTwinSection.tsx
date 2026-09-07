export default function DigitalTwinSection() {
  return (
    <section id="digital-twin" className="bg-[#050d1a] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-6">
              <i className="ri-building-3-line text-violet-400 text-sm"></i>
              <span className="text-violet-400 text-sm font-medium">Digital Twin Technology</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              See your buildings
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">come alive</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Interactive 2D floor plans with real-time asset status, live sensor overlays, emergency routes, and job tracking — all in one visual interface.
            </p>

            <div className="space-y-4">
              {[
                { icon: 'ri-map-pin-line', color: 'text-emerald-400', title: 'Live Asset Pins', desc: 'Green/amber/red status pins for every asset on the floor plan' },
                { icon: 'ri-sensor-line', color: 'text-cyan-400', title: 'Sensor Overlays', desc: 'Temperature, humidity, air quality, and occupancy data live' },
                { icon: 'ri-alarm-warning-line', color: 'text-red-400', title: 'Emergency Overlays', desc: 'Fire exits, isolation valves, first aid, and assembly points' },
                { icon: 'ri-tools-line', color: 'text-amber-400', title: 'Job Overlays', desc: 'Open work orders and engineer locations shown on the map' },
              ].map((item) => (
                <div key={item.title} className="flex items-start space-x-4 p-4 bg-white/3 border border-white/8 rounded-xl">
                  <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} ${item.color} text-lg`}></i>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{item.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/3 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://readdy.ai/api/search-image?query=interactive%20building%20digital%20twin%20floor%20plan%20with%20glowing%20colored%20room%20zones%20in%20blue%20green%20and%20amber%2C%20asset%20location%20markers%20with%20status%20indicators%2C%20sensor%20data%20overlays%20showing%20temperature%20readings%2C%20emergency%20exit%20paths%20highlighted%20in%20red%2C%20dark%20navy%20background%2C%20futuristic%20facilities%20management%20software%20interface%20with%20grid%20lines&width=700&height=500&seq=dt-section-01&orientation=landscape"
                alt="Digital Twin Floor Plan"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/60 to-transparent pointer-events-none"></div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {[
                    { color: 'bg-emerald-400', label: 'Healthy' },
                    { color: 'bg-amber-400', label: 'Warning' },
                    { color: 'bg-red-400', label: 'Fault' },
                    { color: 'bg-blue-400', label: 'Maintenance' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center space-x-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
                      <span className="text-white text-xs">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
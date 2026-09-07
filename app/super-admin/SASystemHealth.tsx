export default function SASystemHealth() {
  const metrics = [
    { label: 'API Response Time', value: '142ms', status: 'good', bar: 85 },
    { label: 'Database Load', value: '23%', status: 'good', bar: 23 },
    { label: 'Storage Used', value: '1.2 TB / 10 TB', status: 'good', bar: 12 },
    { label: 'AI Token Usage', value: '2.4M / 10M', status: 'good', bar: 24 },
    { label: 'Active Sessions', value: '847', status: 'good', bar: 70 },
    { label: 'Error Rate', value: '0.02%', status: 'good', bar: 2 },
  ];

  const services = [
    { name: 'Supabase Auth', status: 'operational' },
    { name: 'Database (PostgreSQL)', status: 'operational' },
    { name: 'Edge Functions', status: 'operational' },
    { name: 'File Storage', status: 'operational' },
    { name: 'AI Engine', status: 'operational' },
    { name: 'Email Service', status: 'degraded' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white/3 border border-white/8 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{m.label}</span>
              <span className="text-white font-semibold text-sm">{m.value}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${m.bar > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                style={{ width: `${m.bar}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/3 border border-white/8 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Service Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {services.map((s) => (
            <div key={s.name} className="flex items-center space-x-3 p-3 bg-white/3 rounded-xl">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.status === 'operational' ? 'bg-emerald-400' : s.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'}`}></span>
              <div>
                <p className="text-white text-sm font-medium">{s.name}</p>
                <p className={`text-xs capitalize ${s.status === 'operational' ? 'text-emerald-400' : s.status === 'degraded' ? 'text-amber-400' : 'text-red-400'}`}>{s.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
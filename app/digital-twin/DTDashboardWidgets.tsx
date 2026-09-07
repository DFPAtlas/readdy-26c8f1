'use client';

interface Building {
  id: number;
  name: string;
  health_score: number;
  status: string;
}

interface AssetPoint {
  status: string;
}

interface DTEvent {
  severity: string;
  status: string;
}

interface Props {
  buildings: Building[];
  assetPoints: AssetPoint[];
  events: DTEvent[];
}

export default function DTDashboardWidgets({ buildings, assetPoints, events }: Props) {
  const avgHealth = buildings.length
    ? Math.round(buildings.reduce((s, b) => s + (b.health_score || 0), 0) / buildings.length)
    : 0;
  const faults = assetPoints.filter(a => a.status === 'fault').length;
  const warnings = assetPoints.filter(a => a.status === 'warning').length;
  const offline = assetPoints.filter(a => a.status === 'offline').length;
  const openEvents = events.filter(e => e.status === 'open').length;
  const highEvents = events.filter(e => e.severity === 'high' && e.status === 'open').length;

  const healthColor = avgHealth >= 85 ? 'text-green-600' : avgHealth >= 70 ? 'text-amber-600' : 'text-red-600';
  const healthBg = avgHealth >= 85 ? 'from-green-50 to-green-100 border-green-200' : avgHealth >= 70 ? 'from-amber-50 to-amber-100 border-amber-200' : 'from-red-50 to-red-100 border-red-200';

  const widgets = [
    { label: 'Building Health Score', value: `${avgHealth}%`, sub: `${buildings.length} buildings monitored`, icon: 'ri-heart-pulse-line', color: healthColor, bg: healthBg },
    { label: 'Active Faults', value: faults, sub: `${warnings} warnings`, icon: 'ri-error-warning-line', color: 'text-red-600', bg: 'from-red-50 to-red-100 border-red-200' },
    { label: 'Live Incidents', value: openEvents, sub: `${highEvents} high severity`, icon: 'ri-alarm-warning-line', color: 'text-amber-600', bg: 'from-amber-50 to-amber-100 border-amber-200' },
    { label: 'Assets Monitored', value: assetPoints.length, sub: `${offline} offline`, icon: 'ri-cpu-line', color: 'text-blue-600', bg: 'from-blue-50 to-blue-100 border-blue-200' },
    { label: 'Buildings Online', value: buildings.filter(b => b.status === 'active').length, sub: `of ${buildings.length} total`, icon: 'ri-building-2-line', color: 'text-indigo-600', bg: 'from-indigo-50 to-indigo-100 border-indigo-200' },
    { label: 'Asset Warnings', value: warnings, sub: 'Require attention', icon: 'ri-alert-line', color: 'text-orange-600', bg: 'from-orange-50 to-orange-100 border-orange-200' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {widgets.map((w, i) => (
        <div key={i} className={`bg-gradient-to-br ${w.bg} border rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm">
              <i className={`${w.icon} ${w.color} text-lg`}></i>
            </div>
          </div>
          <div className={`text-2xl font-bold ${w.color}`}>{w.value}</div>
          <div className="text-xs font-medium text-gray-700 mt-0.5">{w.label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{w.sub}</div>
        </div>
      ))}
    </div>
  );
}
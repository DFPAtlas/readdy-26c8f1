'use client';

const DEMO_PREDICTIONS = [
  { asset: 'HVAC Unit A-201', risk: 'High', reason: '12 years old, 4 faults this year', action: 'Schedule replacement', color: 'bg-red-100 text-red-700 border-red-200' },
  { asset: 'Main Boiler System', risk: 'High', reason: '15 years old, pressure issues', action: 'Major overhaul needed', color: 'bg-red-100 text-red-700 border-red-200' },
  { asset: 'Lift B', risk: 'Medium', reason: '3 faults in 6 months', action: 'Increase inspection frequency', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { asset: 'Emergency Generator', risk: 'Medium', reason: 'Overdue monthly test', action: 'Run test immediately', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { asset: 'Fire Alarm Panel', risk: 'Low', reason: 'Zone 4 fault resolved', action: 'Monitor closely', color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

export default function AIPredictiveWidget({ assets }: { assets: any[] }) {
  const highRisk = assets.filter(a => a.status === 'critical' || a.status === 'Critical').length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <i className="ri-cpu-line text-purple-600 text-sm"></i>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Predicted Failures</p>
            <p className="text-xs text-gray-400">AI analysis of asset health</p>
          </div>
        </div>
        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">{highRisk || DEMO_PREDICTIONS.filter(p => p.risk === 'High').length} high risk</span>
      </div>
      <div className="space-y-2">
        {DEMO_PREDICTIONS.map((p, i) => (
          <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl border ${p.color}`}>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{p.asset}</p>
              <p className="text-xs opacity-80 mt-0.5">{p.reason}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold">{p.risk}</p>
              <p className="text-xs opacity-70">{p.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
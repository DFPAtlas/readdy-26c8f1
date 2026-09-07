'use client';

export default function AIRiskWidget({ ctx }: { ctx: any }) {
  const overdueCompliance = ctx.compliance.filter((c: any) => c.status === 'overdue' || c.status === 'failed').length;
  const emergencyJobs = ctx.workOrders.filter((w: any) => w.priority === 'emergency' && !['completed','cancelled'].includes(w.status)).length;
  const criticalAssets = ctx.assets.filter((a: any) => a.status === 'critical' || a.status === 'Critical').length;
  const overdueJobs = ctx.workOrders.filter((w: any) => w.due_date && new Date(w.due_date) < new Date() && !['completed','cancelled'].includes(w.status)).length;
  const riskScore = Math.min(100, (overdueCompliance * 15) + (emergencyJobs * 20) + (criticalAssets * 10) + (overdueJobs * 5));
  const riskLevel = riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW';
  const riskColor = riskScore >= 60 ? 'text-red-600' : riskScore >= 30 ? 'text-amber-600' : 'text-green-600';
  const ringColor = riskScore >= 60 ? 'stroke-red-500' : riskScore >= 30 ? 'stroke-amber-500' : 'stroke-green-500';
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <i className="ri-sparkling-line text-white text-sm"></i>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">AI Risk Score</p>
          <p className="text-xs text-gray-400">Real-time platform health</p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle cx="50" cy="50" r="40" fill="none" className={ringColor} strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${riskColor}`}>{riskScore}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>
        <div className="flex-1">
          <p className={`text-lg font-bold ${riskColor} mb-2`}>{riskLevel} RISK</p>
          <div className="space-y-1.5">
            {[
              { label: 'Overdue compliance', value: overdueCompliance, weight: 15 },
              { label: 'Emergency jobs', value: emergencyJobs, weight: 20 },
              { label: 'Critical assets', value: criticalAssets, weight: 10 },
              { label: 'Overdue jobs', value: overdueJobs, weight: 5 },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{f.label}</span>
                <span className={`font-semibold ${f.value > 0 ? 'text-red-600' : 'text-green-600'}`}>{f.value} (+{f.value * f.weight}pts)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
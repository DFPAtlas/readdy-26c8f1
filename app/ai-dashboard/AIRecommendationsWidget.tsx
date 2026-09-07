'use client';

export default function AIRecommendationsWidget({ ctx }: { ctx: any }) {
  const overdueJobs = ctx.workOrders.filter((w: any) => w.due_date && new Date(w.due_date) < new Date() && !['completed','cancelled'].includes(w.status)).length;
  const emergencyJobs = ctx.workOrders.filter((w: any) => w.priority === 'emergency' && !['completed','cancelled'].includes(w.status)).length;
  const overdueCompliance = ctx.compliance.filter((c: any) => c.status === 'overdue' || c.status === 'failed').length;
  const overduePPM = ctx.ppmSchedules.filter((p: any) => p.status === 'overdue').length;

  const recommendations = [
    ...(emergencyJobs > 0 ? [{ priority: 'CRITICAL', text: `${emergencyJobs} emergency job${emergencyJobs > 1 ? 's' : ''} open — assign engineers immediately`, icon: 'ri-fire-line', color: 'bg-red-50 border-red-200 text-red-700' }] : []),
    ...(overdueCompliance > 0 ? [{ priority: 'HIGH', text: `${overdueCompliance} compliance item${overdueCompliance > 1 ? 's' : ''} overdue — legal risk`, icon: 'ri-shield-check-line', color: 'bg-red-50 border-red-200 text-red-700' }] : []),
    ...(overdueJobs > 0 ? [{ priority: 'HIGH', text: `${overdueJobs} work order${overdueJobs > 1 ? 's' : ''} past due date — review SLAs`, icon: 'ri-alarm-warning-line', color: 'bg-orange-50 border-orange-200 text-orange-700' }] : []),
    ...(overduePPM > 0 ? [{ priority: 'MEDIUM', text: `${overduePPM} PPM task${overduePPM > 1 ? 's' : ''} overdue — schedule immediately`, icon: 'ri-settings-line', color: 'bg-amber-50 border-amber-200 text-amber-700' }] : []),
    { priority: 'INFO', text: 'Review asset service history for assets over 10 years old', icon: 'ri-cpu-line', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { priority: 'INFO', text: 'Consider condition-based monitoring for critical HVAC systems', icon: 'ri-temp-cold-line', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  ].slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <i className="ri-lightbulb-line text-green-600 text-sm"></i>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">AI Recommendations</p>
          <p className="text-xs text-gray-400">Smart action items</p>
        </div>
      </div>
      <div className="space-y-2">
        {recommendations.map((r, i) => (
          <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${r.color}`}>
            <i className={`${r.icon} text-sm mt-0.5 flex-shrink-0`}></i>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold mr-1.5">{r.priority}</span>
              <span className="text-xs">{r.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
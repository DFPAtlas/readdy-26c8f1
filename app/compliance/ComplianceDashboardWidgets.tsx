'use client';

export default function ComplianceDashboardWidgets({ records, ppmSchedules }: { records: any[]; ppmSchedules: any[] }) {
  const total = records.length;
  const compliant = records.filter(r => r.status === 'compliant').length;
  const dueSoon = records.filter(r => r.status === 'due_soon').length;
  const overdue = records.filter(r => r.status === 'overdue').length;
  const failed = records.filter(r => r.status === 'failed').length;
  const complianceScore = total > 0 ? Math.round((compliant / total) * 100) : 0;

  const ppmTotal = ppmSchedules.length;
  const ppmOverdue = ppmSchedules.filter(p => p.status === 'overdue').length;
  const ppmActive = ppmSchedules.filter(p => p.status === 'active').length;
  const ppmRate = ppmTotal > 0 ? Math.round(((ppmTotal - ppmOverdue) / ppmTotal) * 100) : 0;

  const upcomingInspections = records.filter(r => {
    if (!r.next_inspection_date) return false;
    const days = Math.ceil((new Date(r.next_inspection_date).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 30;
  }).length;

  const widgets = [
    {
      label: 'Site Compliance Score',
      value: `${complianceScore}%`,
      sub: `${compliant} of ${total} items compliant`,
      icon: 'ri-award-line',
      bg: complianceScore >= 80 ? 'bg-green-500' : complianceScore >= 60 ? 'bg-amber-500' : 'bg-red-500',
      bar: complianceScore,
      barColor: complianceScore >= 80 ? 'bg-green-500' : complianceScore >= 60 ? 'bg-amber-500' : 'bg-red-500',
    },
    {
      label: 'Overdue Compliance',
      value: overdue + failed,
      sub: `${overdue} overdue, ${failed} failed`,
      icon: 'ri-alarm-warning-line',
      bg: overdue + failed > 0 ? 'bg-red-500' : 'bg-green-500',
      urgent: overdue + failed > 0,
    },
    {
      label: 'Due Soon',
      value: dueSoon,
      sub: 'Expiring within 30 days',
      icon: 'ri-time-line',
      bg: dueSoon > 0 ? 'bg-amber-500' : 'bg-green-500',
    },
    {
      label: 'Upcoming Inspections',
      value: upcomingInspections,
      sub: 'Scheduled next 30 days',
      icon: 'ri-calendar-check-line',
      bg: 'bg-blue-500',
    },
    {
      label: 'PPM Completion Rate',
      value: `${ppmRate}%`,
      sub: `${ppmActive} active schedules`,
      icon: 'ri-settings-line',
      bg: ppmRate >= 80 ? 'bg-green-500' : 'bg-amber-500',
      bar: ppmRate,
      barColor: ppmRate >= 80 ? 'bg-green-500' : 'bg-amber-500',
    },
    {
      label: 'PPM Overdue',
      value: ppmOverdue,
      sub: 'Missed maintenance tasks',
      icon: 'ri-error-warning-line',
      bg: ppmOverdue > 0 ? 'bg-red-500' : 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4 mb-6">
      {widgets.map(w => (
        <div key={w.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className={`w-9 h-9 ${w.bg} rounded-lg flex items-center justify-center mb-3`}>
            <i className={`${w.icon} text-white text-sm`}></i>
          </div>
          <div className={`text-2xl font-bold mb-0.5 ${w.urgent ? 'text-red-600' : 'text-gray-900'}`}>{w.value}</div>
          <div className="text-xs text-gray-500 mb-2">{w.label}</div>
          {w.bar !== undefined && (
            <div className="bg-gray-100 rounded-full h-1.5">
              <div className={`${w.barColor} h-1.5 rounded-full transition-all`} style={{ width: `${w.bar}%` }}></div>
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">{w.sub}</div>
        </div>
      ))}
    </div>
  );
}
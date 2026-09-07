'use client';

export default function WOStatsBar({ orders }: { orders: any[] }) {
  const total = orders.length;
  const newCount = orders.filter(o => o.status === 'new').length;
  const inProgress = orders.filter(o => o.status === 'in_progress').length;
  const awaitingParts = orders.filter(o => o.status === 'awaiting_parts').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const emergency = orders.filter(o => o.priority === 'emergency').length;
  const overdue = orders.filter(o => {
    if (!o.due_date || o.status === 'completed' || o.status === 'cancelled') return false;
    return new Date(o.due_date) < new Date();
  }).length;

  const stats = [
    { label: 'Total Jobs', value: total, icon: 'ri-file-list-3-line', color: 'text-gray-700', bg: 'bg-gray-100' },
    { label: 'New', value: newCount, icon: 'ri-add-circle-line', color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'In Progress', value: inProgress, icon: 'ri-play-circle-line', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Awaiting Parts', value: awaitingParts, icon: 'ri-time-line', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Completed', value: completed, icon: 'ri-checkbox-circle-line', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Emergency', value: emergency, icon: 'ri-alarm-warning-line', color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Overdue', value: overdue, icon: 'ri-error-warning-line', color: 'text-red-700', bg: 'bg-red-100' },
  ];

  return (
    <div className="grid grid-cols-7 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
              <i className={`${s.icon} ${s.color} text-sm`}></i>
            </div>
          </div>
          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
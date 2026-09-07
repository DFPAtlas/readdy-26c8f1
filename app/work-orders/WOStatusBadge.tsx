'use client';

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  new: { label: 'New', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: 'ri-add-circle-line' },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'ri-user-line' },
  in_progress: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: 'ri-play-circle-line' },
  awaiting_parts: { label: 'Awaiting Parts', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: 'ri-time-line' },
  on_hold: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'ri-pause-circle-line' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', icon: 'ri-checkbox-circle-line' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: 'ri-close-circle-line' },
};

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  low: { label: 'Low', color: 'text-gray-500', dot: 'bg-gray-400' },
  medium: { label: 'Medium', color: 'text-blue-600', dot: 'bg-blue-500' },
  high: { label: 'High', color: 'text-orange-600', dot: 'bg-orange-500' },
  emergency: { label: 'Emergency', color: 'text-red-600', dot: 'bg-red-500' },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  reactive: { label: 'Reactive', color: 'bg-red-50 text-red-600 border-red-200' },
  planned: { label: 'Planned', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  inspection: { label: 'Inspection', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  emergency: { label: 'Emergency', color: 'bg-red-100 text-red-700 border-red-300' },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig['new'];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      <i className={`${cfg.icon} text-xs`}></i>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const cfg = priorityConfig[priority] || priorityConfig['medium'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const cfg = typeConfig[type] || typeConfig['reactive'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}
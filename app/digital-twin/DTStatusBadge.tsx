'use client';

interface Props {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  healthy:     { label: 'Healthy',     color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  warning:     { label: 'Warning',     color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  fault:       { label: 'Fault',       color: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
  maintenance: { label: 'Maintenance', color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  offline:     { label: 'Offline',     color: 'bg-gray-100 text-gray-600',     dot: 'bg-gray-400' },
  active:      { label: 'Active',      color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  open:        { label: 'Open',        color: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
  resolved:    { label: 'Resolved',    color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  high:        { label: 'High',        color: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
  medium:      { label: 'Medium',      color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  low:         { label: 'Low',         color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
};

export default function DTStatusBadge({ status, size = 'sm' }: Props) {
  const cfg = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${cfg.color} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}
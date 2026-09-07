'use client';

const statusConfig = {
  available: { label: 'Available', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  booked: { label: 'Booked', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  reserved: { label: 'Reserved', className: 'bg-purple-100 text-purple-700 border border-purple-200' },
  out_of_service: { label: 'Out of Service', className: 'bg-red-100 text-red-700 border border-red-200' },
  cleaning: { label: 'Cleaning', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  confirmed: { label: 'Confirmed', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  checked_in: { label: 'Checked In', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-600 border border-gray-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border border-red-200' },
  no_show: { label: 'No Show', className: 'bg-orange-100 text-orange-700 border border-orange-200' },
};

export default function SpaceStatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
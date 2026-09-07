'use client';

import Link from 'next/link';

interface WorkOrderSummary {
  id: number;
  job_id: string;
  title: string;
  priority: string;
  status: string;
  assigned_engineer: string;
  due_date: string;
  type: string;
}

interface CDWorkOrdersSectionProps {
  workOrders: WorkOrderSummary[];
  loading: boolean;
}

const priorityColors: Record<string, string> = {
  emergency: 'bg-red-500/20 text-red-300 border border-red-500/20',
  high: 'bg-orange-500/20 text-orange-300 border border-orange-500/20',
  medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/20',
  low: 'bg-gray-500/20 text-gray-400 border border-gray-500/20',
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300 border border-blue-500/20',
  assigned: 'bg-violet-500/20 text-violet-300 border border-violet-500/20',
  in_progress: 'bg-amber-500/20 text-amber-300 border border-amber-500/20',
  overdue: 'bg-red-500/20 text-red-300 border border-red-500/20',
  completed: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20',
  on_hold: 'bg-gray-500/20 text-gray-400 border border-gray-500/20',
};

const statusLabel: Record<string, string> = {
  new: 'New', assigned: 'Assigned', in_progress: 'In Progress',
  overdue: 'Overdue', completed: 'Completed', on_hold: 'On Hold',
  awaiting_parts: 'Awaiting Parts', cancelled: 'Cancelled',
};

export default function CDWorkOrdersSection({ workOrders, loading }: CDWorkOrdersSectionProps) {
  const counts = {
    new: workOrders.filter((w) => w.status === 'new').length,
    assigned: workOrders.filter((w) => w.status === 'assigned').length,
    in_progress: workOrders.filter((w) => w.status === 'in_progress').length,
    overdue: workOrders.filter((w) => w.status === 'overdue').length,
    completed: workOrders.filter((w) => w.status === 'completed').length,
  };

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <i className="ri-tools-line text-amber-400"></i>
            </div>
            <div>
              <h2 className="font-semibold text-white">Work Orders</h2>
              <p className="text-xs text-gray-500">Live job status overview</p>
            </div>
          </div>
          <Link href="/work-orders" className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer whitespace-nowrap">View all →</Link>
        </div>

        <div className="grid grid-cols-5 gap-3 mt-4">
          {[
            { key: 'new', label: 'New', accent: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            { key: 'assigned', label: 'Assigned', accent: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
            { key: 'in_progress', label: 'In Progress', accent: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            { key: 'overdue', label: 'Overdue', accent: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            { key: 'completed', label: 'Completed', accent: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          ].map((s) => (
            <div key={s.key} className={`border rounded-xl p-3 text-center ${s.bg}`}>
              <div className={`text-xl font-bold ${s.accent}`}>
                {loading ? '—' : counts[s.key as keyof typeof counts]}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse flex items-center space-x-3">
              <div className="h-4 bg-white/10 rounded w-16"></div>
              <div className="h-4 bg-white/10 rounded flex-1"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
          ))
        ) : workOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No work orders found</div>
        ) : (
          workOrders.slice(0, 6).map((wo) => (
            <div key={wo.id} className="px-5 py-3 flex items-center space-x-3 hover:bg-white/3 transition-colors">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${priorityColors[wo.priority] || 'bg-gray-500/20 text-gray-400'}`}>
                {wo.priority}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{wo.title}</p>
                <p className="text-xs text-gray-500">{wo.job_id} · {wo.assigned_engineer || 'Unassigned'}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[wo.status] || 'bg-gray-500/20 text-gray-400'}`}>
                {statusLabel[wo.status] || wo.status}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap hidden lg:block">
                {wo.due_date ? new Date(wo.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
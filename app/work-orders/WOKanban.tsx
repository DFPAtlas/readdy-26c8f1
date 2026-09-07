'use client';

import Link from 'next/link';
import { StatusBadge, PriorityBadge } from './WOStatusBadge';

const COLUMNS = [
  { key: 'new', label: 'New', color: 'border-gray-300 bg-gray-50' },
  { key: 'assigned', label: 'Assigned', color: 'border-blue-300 bg-blue-50' },
  { key: 'in_progress', label: 'In Progress', color: 'border-indigo-300 bg-indigo-50' },
  { key: 'awaiting_parts', label: 'Awaiting Parts', color: 'border-orange-300 bg-orange-50' },
  { key: 'on_hold', label: 'On Hold', color: 'border-yellow-300 bg-yellow-50' },
  { key: 'completed', label: 'Completed', color: 'border-green-300 bg-green-50' },
];

const priorityDot: Record<string, string> = {
  low: 'bg-gray-400', medium: 'bg-blue-500', high: 'bg-orange-500', emergency: 'bg-red-500',
};

export default function WOKanban({ orders, onStatusChange }: { orders: any[]; onStatusChange: (id: number, status: string) => void }) {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = orders.filter(o => o.status === col.key);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(col => (
        <div key={col.key} className="flex-shrink-0 w-72">
          <div className={`rounded-xl border-2 ${col.color} p-3`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
              <span className="bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full border">
                {grouped[col.key]?.length || 0}
              </span>
            </div>
            <div className="space-y-2 min-h-16">
              {(grouped[col.key] || []).map(order => (
                <div key={order.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-gray-400">{order.job_id}</span>
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${priorityDot[order.priority] || 'bg-gray-400'}`}></span>
                  </div>
                  <Link href={`/work-orders/${order.id}`}>
                    <p className="text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 mb-2">{order.title}</p>
                  </Link>
                  <div className="flex items-center gap-1 mb-2 flex-wrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{order.type}</span>
                  </div>
                  {order.assigned_engineer && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{order.assigned_engineer[0]}</span>
                      </div>
                      <span className="text-xs text-gray-500">{order.assigned_engineer}</span>
                    </div>
                  )}
                  {order.due_date && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <i className="ri-calendar-line"></i>
                      <span>{new Date(order.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-gray-100 flex gap-1 flex-wrap">
                    {col.key !== 'completed' && col.key !== 'cancelled' && (
                      <button
                        onClick={() => onStatusChange(order.id, col.key === 'new' ? 'assigned' : col.key === 'assigned' ? 'in_progress' : col.key === 'in_progress' ? 'completed' : 'completed')}
                        className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                      >
                        {col.key === 'new' ? 'Assign →' : col.key === 'assigned' ? 'Start →' : 'Complete →'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
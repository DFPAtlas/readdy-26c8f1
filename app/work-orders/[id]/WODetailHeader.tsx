'use client';

import Link from 'next/link';
import { StatusBadge, PriorityBadge, TypeBadge } from '../WOStatusBadge';

const STATUSES = ['new', 'assigned', 'in_progress', 'awaiting_parts', 'on_hold', 'completed', 'cancelled'];

export default function WODetailHeader({ order, onStatusChange }: { order: any; onStatusChange: (s: string) => void }) {
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/work-orders" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <i className="ri-arrow-left-line"></i>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{order.job_id}</span>
              <TypeBadge type={order.type} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PriorityBadge priority={order.priority} />
          <StatusBadge status={order.status} />
        </div>
      </div>

      {order.description && (
        <p className="text-gray-600 text-sm mb-4 pl-11">{order.description}</p>
      )}

      <div className="pl-11 grid grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Assigned Engineer</p>
          {order.assigned_engineer ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">{order.assigned_engineer[0]}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{order.assigned_engineer}</span>
            </div>
          ) : <span className="text-sm text-gray-400 italic">Unassigned</span>}
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Due Date</p>
          <p className="text-sm font-medium text-gray-700">{formatDate(order.due_date)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Client</p>
          <p className="text-sm font-medium text-gray-700">{order.client_name || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Labour Hours</p>
          <p className="text-sm font-medium text-gray-700">{order.labour_hours || 0}h</p>
        </div>
      </div>

      <div className="pl-11 border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-400 mb-2">Update Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => onStatusChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors capitalize whitespace-nowrap ${order.status === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
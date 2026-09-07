'use client';

import Link from 'next/link';
import { StatusBadge, PriorityBadge, TypeBadge } from './WOStatusBadge';

export default function WOTable({ orders, onDelete }: { orders: any[]; onDelete: (id: number) => void }) {
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const isOverdue = (due: string, status: string) => {
    if (!due || status === 'completed' || status === 'cancelled') return false;
    return new Date(due) < new Date();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Job ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Engineer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                  <i className="ri-file-list-3-line text-3xl block mb-2"></i>
                  No work orders found
                </td>
              </tr>
            ) : orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{order.job_id}</span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <Link href={`/work-orders/${order.id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-1">
                    {order.title}
                  </Link>
                  {order.description && (
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{order.description}</p>
                  )}
                </td>
                <td className="px-4 py-3"><TypeBadge type={order.type} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={order.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3">
                  {order.assigned_engineer ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">{order.assigned_engineer[0]}</span>
                      </div>
                      <span className="text-sm text-gray-700 whitespace-nowrap">{order.assigned_engineer}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm whitespace-nowrap ${isOverdue(order.due_date, order.status) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {isOverdue(order.due_date, order.status) && <i className="ri-alarm-warning-line mr-1"></i>}
                    {formatDate(order.due_date)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{order.client_name || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/work-orders/${order.id}`} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors">
                      <i className="ri-eye-line text-sm"></i>
                    </Link>
                    <button onClick={() => onDelete(order.id)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors">
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
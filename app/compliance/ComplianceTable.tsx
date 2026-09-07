'use client';

import { ComplianceStatusBadge, CategoryBadge, getDaysUntilExpiry } from './ComplianceStatusBadge';

export default function ComplianceTable({ records, onView }: { records: any[]; onView: (r: any) => void }) {
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const getDaysLabel = (expiry: string, status: string) => {
    const days = getDaysUntilExpiry(expiry);
    if (days < 0) return <span className="text-red-600 font-semibold text-xs">{Math.abs(days)}d overdue</span>;
    if (days <= 30) return <span className="text-amber-600 font-semibold text-xs">{days}d left</span>;
    return <span className="text-gray-400 text-xs">{days}d left</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Inspection</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Next Inspection</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contractor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  <i className="ri-shield-check-line text-3xl block mb-2"></i>
                  No compliance records found
                </td>
              </tr>
            ) : records.map(r => (
              <tr key={r.id} className={`hover:bg-gray-50/50 transition-colors ${r.status === 'overdue' || r.status === 'failed' ? 'bg-red-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-800 max-w-xs">{r.title}</p>
                  {r.notes && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{r.notes}</p>}
                </td>
                <td className="px-4 py-3"><CategoryBadge category={r.category} /></td>
                <td className="px-4 py-3"><ComplianceStatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(r.inspection_date)}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-gray-600 whitespace-nowrap">{formatDate(r.expiry_date)}</p>
                    {r.expiry_date && getDaysLabel(r.expiry_date, r.status)}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(r.next_inspection_date)}</td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{r.contractor_name || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => onView(r)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors">
                    <i className="ri-eye-line text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
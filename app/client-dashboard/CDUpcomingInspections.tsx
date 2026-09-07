'use client';

import Link from 'next/link';

interface Inspection {
  id: number;
  title: string;
  category: string;
  due_date: string;
  site_name?: string;
  assigned_to?: string;
  status: string;
}

interface CDUpcomingInspectionsProps {
  inspections: Inspection[];
  loading: boolean;
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function urgencyStyle(days: number) {
  if (days < 0) return 'text-red-400 bg-red-500/10 border border-red-500/20';
  if (days <= 7) return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
  if (days <= 30) return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
  return 'text-blue-400 bg-blue-500/10 border border-blue-500/20';
}

export default function CDUpcomingInspections({ inspections, loading }: CDUpcomingInspectionsProps) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
            <i className="ri-calendar-check-line text-indigo-400"></i>
          </div>
          <div>
            <h2 className="font-semibold text-white">Upcoming Inspections</h2>
            <p className="text-xs text-gray-500">Next 90 days</p>
          </div>
        </div>
        <Link href="/compliance" className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer whitespace-nowrap">View all →</Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : inspections.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">No upcoming inspections</div>
      ) : (
        <div className="space-y-2">
          {inspections.slice(0, 6).map((insp) => {
            const days = daysUntil(insp.due_date);
            const uc = urgencyStyle(days);
            return (
              <div key={insp.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${uc}`}>
                  <span className="text-xs font-bold">{days < 0 ? `${Math.abs(days)}d` : `${days}d`}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{insp.title}</p>
                  <p className="text-xs text-gray-500">{insp.category}{insp.site_name ? ` · ${insp.site_name}` : ''}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-gray-300">
                    {new Date(insp.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                  {insp.assigned_to && <p className="text-xs text-gray-500">{insp.assigned_to}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}